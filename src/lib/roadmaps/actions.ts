'use server'

import { revalidatePath } from 'next/cache'
import { fail, guard } from '@/lib/dashboard/db'
import { slugify, uniqueSlug } from '@/lib/dashboard/slug'
import type { NodeInput, NodeKind } from '@/lib/dashboard/roadmap-types'

const MAX_FEATURED = 3

// Creates an empty draft roadmap. Use from the Roadmaps list.
export async function createRoadmap(title: string, category: string) {
    return guard(async ({ db }) => {
        const name = title.trim()
        if (!name) return fail('Enter a title.')
        const { data: existing } = await db.from('roadmaps').select('slug')
        const slug = uniqueSlug(slugify(name), (existing ?? []).map((row) => row.slug as string))
        const { data, error } = await db.from('roadmaps').insert({ title: name, slug, category: category.trim() || 'General' }).select('id').single()
        if (error) throw error
        revalidatePath('/dashboard/roadmaps')
        return { ok: true, id: data.id as string }
    })
}

// Saves roadmap settings. At most 3 roadmaps can be featured on Home.
export async function saveRoadmap(id: string, v: { title: string; slug: string; description: string; category: string; status: string; featured: boolean }) {
    return guard(async ({ db }) => {
        if (!v.title.trim()) return fail('The title cannot be empty.')
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.slug)) return fail('The URL name may only use lowercase letters, numbers and hyphens.')
        if (v.featured) {
            const { count } = await db.from('roadmaps').select('*', { count: 'exact', head: true }).eq('featured', true).is('deleted_at', null).neq('id', id)
            if ((count ?? 0) >= MAX_FEATURED) return fail('Three roadmaps are already featured. Turn one off first.')
        }
        const { error } = await db.from('roadmaps').update({ title: v.title.trim(), slug: v.slug, description: v.description, category: v.category.trim() || 'General', status: v.status, featured: v.featured }).eq('id', id)
        if (error) throw error
        revalidatePath('/dashboard/roadmaps')
        return { ok: true }
    })
}

// Turns "featured on Home" on or off from the list.
export async function setFeatured(id: string, on: boolean) {
    return guard(async ({ db }) => {
        if (on) {
            const { count } = await db.from('roadmaps').select('*', { count: 'exact', head: true }).eq('featured', true).is('deleted_at', null)
            if ((count ?? 0) >= MAX_FEATURED) return fail('Three roadmaps are already featured. Turn one off first.')
        }
        const { error } = await db.from('roadmaps').update({ featured: on }).eq('id', id)
        if (error) throw error
        revalidatePath('/dashboard/roadmaps')
        return { ok: true }
    })
}

// Moves a roadmap to the Trash (restore it there).
export async function trashRoadmap(id: string) {
    return guard(async ({ db }) => {
        const { error } = await db.from('roadmaps').update({ deleted_at: new Date().toISOString(), featured: false }).eq('id', id)
        if (error) throw error
        revalidatePath('/dashboard', 'layout')
        return { ok: true }
    })
}

// Adds a main topic (parentId null) or a step under a main topic, at the end of its list.
export async function addNode(roadmapId: string, kind: NodeKind, title: string, parentId: string | null) {
    return guard(async ({ db }) => {
        const name = title.trim()
        if (!name) return fail('Enter a title.')
        const finalKind: NodeKind = parentId ? (kind === 'main' ? 'sub' : kind) : 'main'
        const { data: all } = await db.from('roadmap_nodes').select('slug,parent_id,sort_order').eq('roadmap_id', roadmapId)
        const slug = uniqueSlug(slugify(name), (all ?? []).map((row) => row.slug as string))
        const siblings = (all ?? []).filter((row) => (row.parent_id ?? null) === parentId)
        const sort = Math.max(-1, ...siblings.map((row) => row.sort_order as number)) + 1
        const { data, error } = await db.from('roadmap_nodes').insert({ roadmap_id: roadmapId, parent_id: parentId, slug, title: name, kind: finalKind, sort_order: sort }).select('id').single()
        if (error) throw error
        revalidatePath(`/dashboard/roadmaps/${roadmapId}`)
        return { ok: true, id: data.id as string }
    })
}

// Saves one step: its text, type, parent, lock and resource links.
export async function saveNode(id: string, v: NodeInput) {
    return guard(async ({ db }) => {
        const title = v.title.trim()
        if (!title) return fail('The title cannot be empty.')
        const { data: node } = await db.from('roadmap_nodes').select('roadmap_id,parent_id,kind').eq('id', id).single()
        if (!node) return fail('Step not found.')
        const parent = v.kind === 'main' ? null : v.parent_id
        if (v.kind !== 'main') {
            if (!parent) return fail('Choose a main topic as the parent.')
            const { data: p } = await db.from('roadmap_nodes').select('parent_id,roadmap_id').eq('id', parent).single()
            if (!p || p.parent_id || p.roadmap_id !== node.roadmap_id) return fail('The parent must be a main topic of this roadmap.')
        }
        if (node.kind === 'main' && v.kind !== 'main') {
            const { count } = await db.from('roadmap_nodes').select('*', { count: 'exact', head: true }).eq('parent_id', id)
            if (count) return fail('Move or delete the steps under this topic first.')
        }
        for (const resource of v.resources) {
            if (!resource.title.trim() || !/^(https?:\/\/|\/)/.test(resource.href)) return fail('Each resource needs a title and an address starting with https:// or /.')
        }
        const update: Record<string, unknown> = { title, description: v.description, markdown: v.markdown, kind: v.kind, is_locked: v.is_locked, parent_id: parent }
        if ((node.parent_id ?? null) !== (parent ?? null)) {
            const { data: sibs } = await db.from('roadmap_nodes').select('sort_order,parent_id').eq('roadmap_id', node.roadmap_id)
            update.sort_order = Math.max(-1, ...(sibs ?? []).filter((row) => (row.parent_id ?? null) === parent).map((row) => row.sort_order as number)) + 1
        }
        const saved = await db.from('roadmap_nodes').update(update).eq('id', id)
        if (saved.error) throw saved.error
        await db.from('node_resources').delete().eq('node_id', id)
        if (v.resources.length) {
            const inserted = await db.from('node_resources').insert(v.resources.map((r, i) => ({ node_id: id, title: r.title.trim(), href: r.href, resource_type: r.resource_type, sort_order: i })))
            if (inserted.error) throw inserted.error
        }
        revalidatePath(`/dashboard/roadmaps/${node.roadmap_id}`)
        return { ok: true }
    })
}

// Moves a step one place up (-1) or down (+1) among its siblings.
export async function moveNode(id: string, delta: number) {
    return guard(async ({ db }) => {
        const { data: node } = await db.from('roadmap_nodes').select('roadmap_id,parent_id').eq('id', id).single()
        if (!node) return fail('Step not found.')
        let query = db.from('roadmap_nodes').select('id').eq('roadmap_id', node.roadmap_id).is('deleted_at', null).order('sort_order').order('title')
        query = node.parent_id ? query.eq('parent_id', node.parent_id) : query.is('parent_id', null)
        const { data: list } = await query
        const ids = (list ?? []).map((row) => row.id as string)
        const from = ids.indexOf(id)
        const to = from + delta
        if (to < 0 || to >= ids.length) return { ok: true }
        ;[ids[from], ids[to]] = [ids[to], ids[from]]
        for (const [index, nodeId] of ids.entries()) {
            const { error } = await db.from('roadmap_nodes').update({ sort_order: index }).eq('id', nodeId)
            if (error) throw error
        }
        revalidatePath(`/dashboard/roadmaps/${node.roadmap_id}`)
        return { ok: true }
    })
}

// Deletes a step for good. Deleting a main topic deletes its steps and resources too.
export async function deleteNode(id: string) {
    return guard(async ({ db }) => {
        const { error } = await db.from('roadmap_nodes').delete().eq('id', id)
        if (error) throw error
        revalidatePath('/dashboard/roadmaps', 'layout')
        return { ok: true }
    })
}