'use server'

import { revalidatePath } from 'next/cache'
import { allPages, fail, guard } from '@/lib/dashboard/db'
import { slugify } from '@/lib/dashboard/slug'
import { validateMove } from '@/lib/dashboard/tree'
import type { ArticlePayload, VersionRow } from '@/lib/dashboard/types'

const MAX_VERSIONS = 50
const AUTO_VERSION_MS = 10 * 60_000

// Saves page settings, markdown, tags and (when due) a version. `mode` decides if a version is always made.
// auto = autosave (a version at most every 10 minutes), manual = Save button, publish = Publish button.
export async function saveArticle(id: string, p: ArticlePayload, mode: 'auto' | 'manual' | 'publish') {
    return guard(async ({ db, user }) => {
        const title = p.title.trim()
        if (!title) return fail('The title cannot be empty.')
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) return fail('The URL name may only use lowercase letters, numbers and hyphens.')
        if (p.visibility === 'scheduled' && !p.scheduled_at) return fail('Choose a date and time for the scheduled publish.')

        const rows = await allPages(db)
        const live = rows.filter((row) => !row.deleted_at)
        const current = rows.find((row) => row.id === id)
        if (!current) return fail('Page not found.')
        const parentChanged = current.parent_id !== p.parent_id
        if (parentChanged) {
            const problem = validateMove(live, id, p.parent_id)
            if (problem) return fail(problem)
        }
        const siblings = rows.filter((row) => row.parent_id === p.parent_id && row.id !== id)
        if (siblings.some((row) => row.slug === p.slug)) return fail('Another page here already uses this URL name.')

        const update: Record<string, unknown> = {
            title, slug: p.slug, description: p.description || null, kind: p.kind,
            icon: p.kind === 'topic' ? p.icon || null : null,
            banner_url: p.kind === 'topic' ? p.banner_url || null : null,
            visibility: p.visibility, scheduled_at: p.visibility === 'scheduled' ? p.scheduled_at : null,
            seo_title: p.seo_title || null, seo_description: p.seo_description || null, direction: p.direction, locale: p.locale,
        }
        if (parentChanged) {
            update.parent_id = p.parent_id
            update.sort_order = Math.max(-1, ...siblings.filter((row) => !row.deleted_at).map((row) => row.sort_order)) + 1
        }
        if (p.visibility === 'published') {
            const { data } = await db.from('pages').select('published_at').eq('id', id).single()
            if (!data?.published_at) update.published_at = new Date().toISOString()
        }
        const pageResult = await db.from('pages').update(update).eq('id', id)
        if (pageResult.error) throw pageResult.error

        const words = p.markdown.trim().split(/\s+/).filter(Boolean).length
        const articleResult = await db.from('articles').upsert({ page_id: id, markdown: p.markdown, reading_minutes: Math.max(1, Math.ceil(words / 200)), package_tabs_enabled: p.package_tabs, updated_at: new Date().toISOString() }, { onConflict: 'page_id' })
        if (articleResult.error) throw articleResult.error

        // Tags: unique by slug
        const bySlug = new Map<string, string>()
        p.tags.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 20).forEach((tag) => bySlug.set(slugify(tag), tag))
        await db.from('page_tags').delete().eq('page_id', id)
        if (bySlug.size) {
            const { data: tags, error } = await db.from('tags').upsert([...bySlug].map(([slug, name]) => ({ slug, name })), { onConflict: 'slug' }).select('id')
            if (error) throw error
            const linked = await db.from('page_tags').insert((tags ?? []).map((tag) => ({ page_id: id, tag_id: tag.id })))
            if (linked.error) throw linked.error
        }

        // Versions
        const { data: last } = await db.from('article_versions').select('created_at,markdown').eq('page_id', id).order('created_at', { ascending: false }).limit(1)
        const latest = last?.[0]
        const changed = !latest || latest.markdown !== p.markdown
        const age = latest ? Date.now() - new Date(latest.created_at).getTime() : Infinity
        if (mode === 'auto' ? changed && age > AUTO_VERSION_MS : changed) {
            await db.from('article_versions').insert({ page_id: id, markdown: p.markdown, title, created_by: user.id })
            const { data: old } = await db.from('article_versions').select('id').eq('page_id', id).order('created_at', { ascending: false }).range(MAX_VERSIONS, MAX_VERSIONS + 200)
            if (old?.length) await db.from('article_versions').delete().in('id', old.map((row) => row.id))
        }
        revalidatePath('/dashboard/articles')
        return { ok: true, savedAt: new Date().toISOString(), slug: p.slug }
    })
}

// Lists the saved versions of a page, newest first. Used by the History tab.
export async function listVersions(pageId: string) {
    return guard(async ({ db }) => {
        const { data, error } = await db.from('article_versions').select('id,created_at,title').eq('page_id', pageId).order('created_at', { ascending: false }).limit(MAX_VERSIONS)
        if (error) throw error
        return { ok: true, versions: (data ?? []) as VersionRow[] }
    })
}

// Reads one version so the editor can restore it.
export async function getVersion(versionId: string) {
    return guard(async ({ db }) => {
        const { data, error } = await db.from('article_versions').select('markdown,title').eq('id', versionId).single()
        if (error) throw error
        return { ok: true, markdown: data.markdown as string, title: data.title as string }
    })
}