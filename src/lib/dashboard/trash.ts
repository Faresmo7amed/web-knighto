// src/lib/dashboard/trash.ts
import { createAdminClient } from '@/lib/supabase/admin'
import type { TrashItem } from '@/components/dashboard/TrashList'
import { deletePagesForever } from '@/lib/dashboard/purge'
import { descendantIds, pathLabel } from '@/lib/dashboard/tree'
import { PAGE_COLUMNS, type PageRow } from '@/lib/dashboard/types'

const RETENTION_DAYS = 30
const DAY_MS = 86_400_000

// Must be called after `await connection()` so Date.now() runs per request
export async function loadTrashItems(): Promise<TrashItem[]> {
    const now = Date.now()
    const cutoff = now - RETENTION_DAYS * DAY_MS
    const db = createAdminClient()

    const [pagesResult, roadmapsResult] = await Promise.all([
        db.from('pages').select(PAGE_COLUMNS),
        db.from('roadmaps').select('id,title,category,deleted_at').not('deleted_at', 'is', null),
    ])

    let rows = (pagesResult.data ?? []) as PageRow[]
    const roadmaps = roadmapsResult.data ?? []

    // Items older than 30 days are removed for good
    const expiredIds = rows
        .filter((row) => row.deleted_at && new Date(row.deleted_at).getTime() < cutoff)
        .map((row) => row.id)
    const expiredRoadmapIds = roadmaps
        .filter((row) => new Date(row.deleted_at).getTime() < cutoff)
        .map((row) => row.id)

    if (expiredIds.length) {
        await deletePagesForever(db, expiredIds)
        rows = rows.filter((row) => !expiredIds.includes(row.id))
    }
    if (expiredRoadmapIds.length) {
        await db.from('roadmaps').delete().in('id', expiredRoadmapIds)
    }

    const trashed = rows.filter((row) => row.deleted_at)
    const daysLeft = (iso: string) =>
        Math.max(0, Math.ceil((new Date(iso).getTime() + RETENTION_DAYS * DAY_MS - now) / DAY_MS))

    // Show only the top item of a deleted subtree, not every child
    const pageItems: TrashItem[] = trashed
        .filter((row) => !trashed.find((p) => p.id === row.parent_id && p.deleted_at === row.deleted_at))
        .map((row) => ({
            id: row.id,
            type: 'page',
            title: row.title,
            deletedAt: row.deleted_at as string,
            daysLeft: daysLeft(row.deleted_at as string),
            where: pathLabel(rows, row.parent_id) || 'Top level',
            children: descendantIds(trashed, row.id)
                .filter((child) => trashed.find((item) => item.id === child)?.deleted_at === row.deleted_at)
                .length,
        }))

    const roadmapItems: TrashItem[] = roadmaps
        .filter((row) => !expiredRoadmapIds.includes(row.id))
        .map((row) => ({
            id: row.id,
            type: 'roadmap',
            title: row.title,
            where: 'Roadmaps',
            deletedAt: row.deleted_at,
            daysLeft: daysLeft(row.deleted_at),
            children: 0,
        }))

    return [...pageItems, ...roadmapItems].sort((a, b) => b.deletedAt.localeCompare(a.deletedAt))
}