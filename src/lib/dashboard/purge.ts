import 'server-only'
import type { Db } from './db'
import { descendantIds } from './tree'

// Permanently deletes pages and everything under them. Deepest rows go first because parent_id is "on delete restrict".
export async function deletePagesForever(db: Db, rootIds: string[]) {
    const { data, error } = await db.from('pages').select('id,parent_id')
    if (error) throw error
    const rows = (data ?? []) as { id: string; parent_id: string | null }[]
    const ids = new Set<string>()
    for (const root of rootIds) {
        ids.add(root)
        descendantIds(rows, root).forEach((id) => ids.add(id))
    }
    const depthOf = (id: string): number => {
        const parent = rows.find((row) => row.id === id)?.parent_id
        return parent ? 1 + depthOf(parent) : 0
    }
    const byDepth = new Map<number, string[]>()
    ids.forEach((id) => byDepth.set(depthOf(id), [...(byDepth.get(depthOf(id)) ?? []), id]))
    for (const depth of [...byDepth.keys()].sort((a, b) => b - a)) {
        const { error: deleteError } = await db.from('pages').delete().in('id', byDepth.get(depth) ?? [])
        if (deleteError) throw deleteError
    }
}