'use server'

import { revalidatePath } from 'next/cache'
import { allPages, fail, guard } from '@/lib/dashboard/db'
import { deletePagesForever } from '@/lib/dashboard/purge'
import { descendantIds } from '@/lib/dashboard/tree'

// Restores a page and the pages trashed with it, as drafts. If its old parent is still in the Trash it goes to the top level.
export async function restorePage(id: string) {
    return guard(async ({ db }) => {
        const rows = await allPages(db)
        const node = rows.find((row) => row.id === id)
        if (!node?.deleted_at) return fail('Item not found in the Trash.')
        const same = [id, ...descendantIds(rows, id).filter((child) => rows.find((row) => row.id === child)?.deleted_at === node.deleted_at)]
        const parent = rows.find((row) => row.id === node.parent_id)
        const { error } = await db.from('pages').update({ deleted_at: null, visibility: 'draft', published_at: null }).in('id', same)
        if (error) throw error
        if (parent?.deleted_at) await db.from('pages').update({ parent_id: null }).eq('id', id)
        revalidatePath('/dashboard', 'layout')
        return { ok: true }
    })
}

// Permanently deletes a trashed page and everything under it.
export async function deletePageForever(id: string) {
    return guard(async ({ db }) => {
        await deletePagesForever(db, [id])
        revalidatePath('/dashboard/trash')
        return { ok: true }
    })
}

// Restores a trashed roadmap as a draft.
export async function restoreRoadmap(id: string) {
    return guard(async ({ db }) => {
        const { error } = await db.from('roadmaps').update({ deleted_at: null, status: 'draft' }).eq('id', id)
        if (error) throw error
        revalidatePath('/dashboard/trash')
        return { ok: true }
    })
}

// Permanently deletes a trashed roadmap (its steps are removed with it).
export async function deleteRoadmapForever(id: string) {
    return guard(async ({ db }) => {
        const { error } = await db.from('roadmaps').delete().eq('id', id)
        if (error) throw error
        revalidatePath('/dashboard/trash')
        return { ok: true }
    })
}

// Permanently deletes everything in the Trash.
export async function emptyTrash() {
    return guard(async ({ db }) => {
        const rows = await allPages(db)
        const roots = rows.filter((row) => row.deleted_at && !rows.find((parent) => parent.id === row.parent_id)?.deleted_at).map((row) => row.id)
        if (roots.length) await deletePagesForever(db, roots)
        const { error } = await db.from('roadmaps').delete().not('deleted_at', 'is', null)
        if (error) throw error
        revalidatePath('/dashboard/trash')
        return { ok: true }
    })
}