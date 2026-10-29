import { notFound } from 'next/navigation'
import { requireOwnerPage } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { ArticleEditor } from '@/components/dashboard/ArticleEditor'
import { MAX_DEPTH, descendantIds, heightOf, levelOf, pathLabel, slugPath } from '@/lib/dashboard/tree'
import { PAGE_COLUMNS, type ArticlePayload, type PageRow } from '@/lib/dashboard/types'

export const instant = false

export default async function EditArticle({ params }: { params: Promise<{ id: string }> }) {
    await requireOwnerPage()
    const { id } = await params
    const db = createAdminClient()
    const [pageResult, articleResult, tagResult, rowsResult] = await Promise.all([
        db.from('pages').select('*').eq('id', id).is('deleted_at', null).maybeSingle(),
        db.from('articles').select('markdown,package_tabs_enabled').eq('page_id', id).maybeSingle(),
        db.from('page_tags').select('tags(name)').eq('page_id', id),
        db.from('pages').select(PAGE_COLUMNS).is('deleted_at', null),
    ])
    const page = pageResult.data
    if (!page || page.kind === 'section') notFound()
    const rows = (rowsResult.data ?? []) as PageRow[]
    const blocked = new Set([id, ...descendantIds(rows, id)])
    const height = heightOf(rows, id)
    const parents = rows
        .filter((row) => !blocked.has(row.id))
        .map((row) => ({ id: row.id, label: pathLabel(rows, row.id), disabled: levelOf(rows, row.id) + height > MAX_DEPTH }))
        .sort((a, b) => a.label.localeCompare(b.label))
    const tags = (tagResult.data ?? []).flatMap((row) => { const tag = row.tags as unknown as { name: string } | { name: string }[] | null; return Array.isArray(tag) ? tag.map((t) => t.name) : tag ? [tag.name] : [] })

    const initial: ArticlePayload = {
        title: page.title, slug: page.slug, description: page.description ?? '', kind: page.kind,
        icon: page.icon ?? '', banner_url: page.banner_url ?? '', parent_id: page.parent_id, visibility: page.visibility,
        scheduled_at: page.scheduled_at, seo_title: page.seo_title ?? '', seo_description: page.seo_description ?? '',
        direction: page.direction, locale: page.locale, tags: tags.join(', '),
        package_tabs: articleResult.data?.package_tabs_enabled ?? true, markdown: articleResult.data?.markdown ?? '',
    }
    return <ArticleEditor id={id} initial={initial} parents={parents} publicPath={'/' + slugPath(rows, id).join('/')} />
}