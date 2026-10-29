'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { fail, guard } from '@/lib/dashboard/db'

const COLUMNS = ['name', 'owner_name', 'description', 'default_locale']
const LEGAL = ['about', 'terms', 'privacy', 'copyright', 'contact']
const TOKEN = /^[a-z0-9-]{2,40}$/
const COLOR = /^#[0-9a-fA-F]{3,8}$/

// Saves site settings: real columns go in `columns`, everything else is merged into the `extra` JSON.
export async function saveSite(columns: Record<string, string>, extra: Record<string, unknown>) {
    return guard(async ({ db }) => {
        if ('name' in columns && !columns.name.trim()) return fail('The site name cannot be empty.')
        const cols = Object.fromEntries(Object.entries(columns).filter(([key]) => COLUMNS.includes(key)))
        const { data } = await db.from('site_settings').select('extra').eq('id', true).maybeSingle()
        const { error } = await db.from('site_settings').upsert({ id: true, ...cols, extra: { ...(data?.extra ?? {}), ...extra } }, { onConflict: 'id' })
        if (error) throw error
        revalidatePath('/', 'layout')
        return { ok: true }
    })
}

// Resets every reader's saved progress by bumping a version number. The public site must compare it (Step 12c).
export async function clearProgress() {
    return guard(async ({ db }) => {
        const { data } = await db.from('site_settings').select('extra').eq('id', true).maybeSingle()
        const extra = (data?.extra ?? {}) as Record<string, unknown>
        const { error } = await db.from('site_settings').upsert({ id: true, extra: { ...extra, progress_version: (Number(extra.progress_version) || 0) + 1 } }, { onConflict: 'id' })
        if (error) throw error
        return { ok: true }
    })
}

// Saves the title and Markdown of one legal page.
export async function saveLegal(kind: string, title: string, markdown: string) {
    return guard(async ({ db }) => {
        if (!LEGAL.includes(kind)) return fail('Unknown page.')
        const { error } = await db.from('legal_pages').update({ title: title.trim() || kind, markdown, updated_at: new Date().toISOString() }).eq('kind', kind)
        if (error) throw error
        revalidatePath('/', 'layout')
        return { ok: true }
    })
}

// Replaces the theme and syntax color overrides. Keys are "theme:light", "theme:dark", "syntax:light", "syntax:dark".
export async function saveAppearance(sets: Record<string, { name: string; value: string }[]>) {
    return guard(async ({ db }) => {
        for (const [key, rows] of Object.entries(sets)) {
            const [kind, theme] = key.split(':')
            if (!['theme', 'syntax'].includes(kind) || !['light', 'dark'].includes(theme)) return fail('Invalid section.')
            const unique = new Map<string, string>()
            for (const row of rows) {
                const name = row.name.trim().replace(/^--/, '')
                if (!TOKEN.test(name)) return fail(`"${row.name}" is not a valid token name (letters, numbers and hyphens).`)
                if (!COLOR.test(row.value)) return fail(`"${row.value}" is not a hex color like #2f6fcb.`)
                unique.set(name, row.value)
            }
            const table = kind === 'theme' ? 'theme_tokens' : 'syntax_colors'
            const removed = await db.from(table).delete().eq('theme', theme)
            if (removed.error) throw removed.error
            if (unique.size) {
                const added = await db.from(table).insert([...unique].map(([token, value]) => ({ theme, token, value })))
                if (added.error) throw added.error
            }
        }
        updateTag('theme')
        return { ok: true }
    })
}