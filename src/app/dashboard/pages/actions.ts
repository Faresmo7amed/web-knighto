'use server'

import { revalidatePath } from 'next/cache'
import { allPages, fail, guard } from '@/lib/dashboard/db'
import { slugify, uniqueSlug } from '@/lib/dashboard/slug'
import { MAX_DEPTH, descendantIds, levelOf, validateMove } from '@/lib/dashboard/tree'

// Creates a page under a parent (null = a new top-level section) with a unique URL name. Use from the tree and from New article.
export async function createPage(parentId: string | null, title: string, kind: 'article' | 'topic' | 'cheatsheet' = 'article') {
    return guard(async ({ db }) => {
        const name = title.trim()
        if (!name) return fail('Enter a title.')
        const rows = await allPages(db)
        const live = rows.filter((row) => !row.deleted_at)
        if (parentId && !live.some((row) => row.id === parentId)) return fail('The parent page was not found.')
        if (levelOf(live, parentId) >= MAX_DEPTH) return fail('Pages can only go four levels deep.')
        const siblings = rows.filter((row) => row.parent_id === parentId)
        const slug = uniqueSlug(slugify(name), siblings.map((row) => row.slug))
        const sort = Math.max(-1, ...siblings.filter((row) => !row.deleted_at).map((row) => row.sort_order)) + 1
        const finalKind = parentId ? kind : 'section'
        const { data, error } = await db.from('pages').insert({ parent_id: parentId, title: name, slug, kind: finalKind, sort_order: sort }).select('id').single()
        if (error) throw error
        if (finalKind !== 'section') {
            const created = await db.from('articles').insert({ page_id: data.id })
            if (created.error) throw created.error
        }
        revalidatePath('/dashboard/pages')
        return { ok: true, id: data.id as string }
    })
}

// Changes a page title. The URL name stays the same, so links do not break.
export async function renamePage(id: string, title: string) {
    return guard(async ({ db }) => {
        if (!title.trim()) return fail('The title cannot be empty.')
        const { error } = await db.from('pages').update({ title: title.trim() }).eq('id', id)
        if (error) throw error
        return { ok: true }
    })
}

// Sets or clears the sidebar icon of a top-level item.
export async function setPageIcon(id: string, icon: string | null) {
    return guard(async ({ db }) => {
        const { error } = await db.from('pages').update({ icon }).eq('id', id)
        if (error) throw error
        return { ok: true }
    })
}

// Sets draft, published or archived for one or many pages. Publishing stamps published_at the first time.
export async function setVisibility(ids: string[], status: 'draft' | 'published' | 'archived') {
    return guard(async ({ db }) => {
        const { error } = await db.from('pages').update({ visibility: status, scheduled_at: null }).in('id', ids)
        if (error) throw error
        if (status === 'published') await db.from('pages').update({ published_at: new Date().toISOString() }).in('id', ids).is('published_at', null)
        revalidatePath('/dashboard', 'layout')
        return { ok: true }
    })
}

// Moves a page under a new parent (null = top level) at a position among its new siblings, then renumbers them.
export async function movePage(id: string, parentId: string | null, index: number) {
    return guard(async ({ db }) => {
        const live = (await allPages(db)).filter((row) => !row.deleted_at)
        const moving = live.find((row) => row.id === id)
        if (!moving) return fail('Page not found.')
        const problem = validateMove(live, id, parentId)
        if (problem) return fail(problem)
        const siblings = live.filter((row) => row.parent_id === parentId && row.id !== id).sort((a, b) => a.sort_order - b.sort_order)
        if (siblings.some((row) => row.slug === moving.slug)) return fail('A page with the same URL name already exists there.')
        siblings.splice(Math.max(0, Math.min(index, siblings.length)), 0, moving)
        for (const [position, row] of siblings.entries()) {
            if (row.id === id) {
                const { error } = await db.from('pages').update({ parent_id: parentId, sort_order: position }).eq('id', id)
                if (error) throw error
            } else if (row.sort_order !== position) {
                const { error } = await db.from('pages').update({ sort_order: position }).eq('id', row.id)
                if (error) throw error
            }
        }
        revalidatePath('/dashboard/pages')
        return { ok: true }
    })
}

// Moves pages (and everything under them) to the Trash. Restore them from the Trash screen.
export async function trashPage(ids: string[]) {
    return guard(async ({ db }) => {
        const live = (await allPages(db)).filter((row) => !row.deleted_at)
        const all = new Set<string>()
        ids.forEach((id) => { all.add(id); descendantIds(live, id).forEach((child) => all.add(child)) })
        const { error } = await db.from('pages').update({ deleted_at: new Date().toISOString() }).in('id', [...all])
        if (error) throw error
        revalidatePath('/dashboard', 'layout')
        return { ok: true }
    })
}