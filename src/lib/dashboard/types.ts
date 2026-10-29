export type PageRow = {
    id: string
    parent_id: string | null
    kind: 'section' | 'topic' | 'article' | 'cheatsheet'
    title: string
    slug: string
    icon: string | null
    visibility: 'draft' | 'scheduled' | 'published' | 'archived'
    sort_order: number
    updated_at: string
    deleted_at: string | null
}
export const PAGE_COLUMNS = 'id,parent_id,kind,title,slug,icon,visibility,sort_order,updated_at,deleted_at'

export type MediaRow = { id: string; object_key: string; public_url: string; alt_text: string; mime_type: string; byte_size: number; created_at: string }
export type VersionRow = { id: string; created_at: string; title: string }

export type ArticlePayload = {
    title: string
    slug: string
    description: string
    kind: 'article' | 'topic' | 'cheatsheet'
    icon: string
    banner_url: string
    parent_id: string | null
    visibility: 'draft' | 'scheduled' | 'published' | 'archived'
    scheduled_at: string | null
    seo_title: string
    seo_description: string
    direction: 'auto' | 'ltr' | 'rtl'
    locale: 'en' | 'ar'
    tags: string
    package_tabs: boolean
    markdown: string
}

// One loose result shape for every dashboard action.
export type Result = { ok: boolean; error?: string; id?: string; slug?: string; savedAt?: string; markdown?: string; title?: string; versions?: VersionRow[]; usage?: string[]; media?: MediaRow ; report?: { table: string; total: number; fresh: number; existing: number }[]}