import 'server-only'
import JSZip from 'jszip'
import { createAdminClient } from '@/lib/supabase/admin'

const tables = [
    'pages', 'articles', 'tags', 'page_tags', 'roadmaps', 'roadmap_nodes', 'node_resources',
    'media', 'nav_links', 'social_links', 'site_settings', 'theme_tokens', 'syntax_colors',
    'package_managers', 'legal_pages',
] as const

export type SiteExport = {
    version: 1
    createdAt: string
    tables: Record<string, unknown[]>
}

// Reads exportable content with the server-only admin client for an owner-authorized backup.
export async function exportSiteData(): Promise<SiteExport> {
    const supabase = createAdminClient()
    const pairs = await Promise.all(tables.map(async (table) => {
        const { data, error } = await supabase.from(table).select('*')
        if (error) throw error
        return [table, data ?? []] as const
    }))
    return { version: 1, createdAt: new Date().toISOString(), tables: Object.fromEntries(pairs) }
}

// Converts articles and legal pages to portable Markdown files with minimal frontmatter.
export async function exportMarkdownZip(data: SiteExport) {
    const zip = new JSZip()
    const pages = new Map((data.tables.pages as Array<{ id: string; slug: string; title: string }>).map((page) => [page.id, page]))
    const articles = data.tables.articles as Array<{ page_id: string; markdown: string }>
    const legalPages = data.tables.legal_pages as Array<{ kind: string; title: string; markdown: string }>

    for (const article of articles) {
        const page = pages.get(article.page_id)
        if (!page) continue
        zip.file(`articles/${page.slug}.md`, `---\ntitle: ${JSON.stringify(page.title)}\nslug: ${page.slug}\n---\n\n${article.markdown}`)
    }
    for (const page of legalPages) zip.file(`legal/${page.kind}.md`, `---\ntitle: ${JSON.stringify(page.title)}\n---\n\n${page.markdown}`)
    zip.file('site-export.json', JSON.stringify(data, null, 2))
    return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' })
}
