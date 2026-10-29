import { requireOwnerPage } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { ExtraForm, type Field } from '@/components/dashboard/ExtraForm'
import { pathLabel } from '@/lib/dashboard/tree'
import { PAGE_COLUMNS, type PageRow } from '@/lib/dashboard/types'

export const instant = false

export default async function SearchScreen() {
    await requireOwnerPage()
    const db = createAdminClient()
    const [{ data: site }, { data: pages }] = await Promise.all([db.from('site_settings').select('extra').eq('id', true).maybeSingle(), db.from('pages').select(PAGE_COLUMNS).is('deleted_at', null)])
    const rows = (pages ?? []) as PageRow[]
    const options = rows.filter((row) => row.kind !== 'section').map((row) => ({ value: row.id, label: pathLabel(rows, row.id) })).sort((a, b) => a.label.localeCompare(b.label))
    const fields: Field[] = [
        { key: 'search_headings', label: 'Search headings', type: 'switch' }, { key: 'search_content', label: 'Search article text', type: 'switch' },
        { key: 'search_code', label: 'Search code blocks', type: 'switch', hint: 'Off by default, code can add noise.' }, { key: 'search_tags', label: 'Search tags', type: 'switch' },
        { key: 'search_snippets', label: 'Show snippets', type: 'switch' }, { key: 'search_highlight', label: 'Highlight matches', type: 'switch' },
        { key: 'search_per_page', label: 'Results per page', type: 'number' }, { key: 'search_min_chars', label: 'Minimum characters', type: 'number' },
        { key: 'search_excluded', label: 'Hidden from search', type: 'pages', options, hint: 'The Postgres index updates by itself when you save a page, so there is no reindex button.' },
    ]
    const values = { search_headings: true, search_content: true, search_code: false, search_tags: true, search_snippets: true, search_highlight: true, search_per_page: 10, search_min_chars: 2, search_excluded: [], ...(site?.extra ?? {}) }
    return <ExtraForm title="Search" subtitle="What readers can find and how results look." fields={fields} values={values} />
}