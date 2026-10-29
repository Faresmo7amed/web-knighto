'use server'

import { revalidatePath } from 'next/cache'
import { fail, guard } from '@/lib/dashboard/db'

// Import order matters: parents before children. `keys` identify a row (also used for upsert).
const TABLES: { table: string; keys: string[] }[] = [
    { table: 'pages', keys: ['id'] }, { table: 'tags', keys: ['id'] }, { table: 'articles', keys: ['page_id'] },
    { table: 'page_tags', keys: ['page_id', 'tag_id'] }, { table: 'roadmaps', keys: ['id'] }, { table: 'roadmap_nodes', keys: ['id'] },
    { table: 'node_resources', keys: ['id'] }, { table: 'media', keys: ['id'] }, { table: 'nav_links', keys: ['id'] },
    { table: 'social_links', keys: ['id'] }, { table: 'site_settings', keys: ['id'] }, { table: 'theme_tokens', keys: ['theme', 'token'] },
    { table: 'syntax_colors', keys: ['theme', 'token'] }, { table: 'package_managers', keys: ['id_key'] }, { table: 'legal_pages', keys: ['kind'] },
]
type AnyRow = Record<string, unknown>

// Reads an exported site-export.json. action "dry" only counts, "apply" writes. mode "add" never changes existing rows, "overwrite" does and needs confirm.
export async function importBackup(form: FormData) {
    return guard(async ({ db }) => {
        const file = form.get('file')
        const action = form.get('action')
        const mode = form.get('mode') === 'overwrite' ? 'overwrite' : 'add'
        if (!(file instanceof File) || !file.size) return fail('Choose a backup file.')
        if (file.size > 8 * 1024 * 1024) return fail('The file is larger than 8 MB.')
        if (action === 'apply' && mode === 'overwrite' && form.get('confirm') !== 'yes') return fail('Tick the box to confirm overwriting.')

        let parsed: { version?: number; tables?: Record<string, unknown> }
        try { parsed = JSON.parse(await file.text()) } catch { return fail('This is not a valid JSON file. For a ZIP, extract site-export.json first.') }
        if (parsed?.version !== 1 || !parsed.tables || typeof parsed.tables !== 'object') return fail('This is not a backup made by this dashboard.')

        const report: NonNullable<Awaited<ReturnType<typeof guard>>['report']> = []
        for (const { table, keys } of TABLES) {
            const raw = parsed.tables[table]
            if (raw === undefined) continue
            if (!Array.isArray(raw)) return fail(`The "${table}" data is not a list.`)
            const rows: AnyRow[] = []
            for (const item of raw) {
                if (!item || typeof item !== 'object' || keys.some((key) => item[key] === undefined || item[key] === null)) return fail(`A row in "${table}" is missing its ${keys.join(', ')}.`)
                const row = { ...(item as AnyRow) }
                delete row.search_vector // generated column, cannot be written
                rows.push(row)
            }
            const id = (row: AnyRow) => keys.map((key) => String(row[key])).join('|')
            const { data: existing, error } = await db.from(table).select(keys.join(',')).range(0, 49_999)
            if (error) throw error
            const have = new Set((existing ?? []).map((row) => id(row as unknown as AnyRow)))
            const existingCount = rows.filter((row) => have.has(id(row))).length
            report.push({ table, total: rows.length, fresh: rows.length - existingCount, existing: existingCount })

            if (action === 'apply' && rows.length) {
                if (table === 'pages') {
                    const parent = new Map(rows.map((row) => [row.id as string, row.parent_id as string | null]))
                    const depth = (rowId: string): number => { const p = parent.get(rowId); return p ? 1 + depth(p) : 0 }
                    rows.sort((a, b) => depth(a.id as string) - depth(b.id as string))
                }
                for (let from = 0; from < rows.length; from += 200) {
                    const { error: writeError } = await db.from(table).upsert(rows.slice(from, from + 200), { onConflict: keys.join(','), ignoreDuplicates: mode === 'add' })
                    if (writeError) return fail(`Stopped at "${table}": ${writeError.message}`)
                }
            }
        }
        if (action === 'apply') revalidatePath('/', 'layout')
        return { ok: true, report }
    })
}