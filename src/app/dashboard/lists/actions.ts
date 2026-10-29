'use server'

import { revalidatePath } from 'next/cache'
import { guard, type Db } from '@/lib/dashboard/db'
import type { Row } from '@/components/dashboard/ListEditor'

const s = (value: unknown) => String(value ?? '').trim()

// Makes the table match the rows: removes missing ones, updates rows with an id, inserts the rest. Validation runs before any write.
async function replaceRows(db: Db, table: string, rows: Row[], shape: (row: Row, order: number) => Record<string, unknown>) {
    const payloads = rows.map((row, index) => shape(row, index))
    const { data, error } = await db.from(table).select('id')
    if (error) throw error
    const keep = new Set(rows.map((row) => row.id).filter(Boolean))
    const drop = (data ?? []).map((row) => row.id as string).filter((id) => !keep.has(id))
    if (drop.length) {
        const removed = await db.from(table).delete().in('id', drop)
        if (removed.error) throw removed.error
    }
    for (const [index, row] of rows.entries()) {
        const result = row.id ? await db.from(table).update(payloads[index]).eq('id', row.id) : await db.from(table).insert(payloads[index])
        if (result.error) throw result.error
    }
}

const goodAddress = (href: string) => /^(https?:\/\/|mailto:|\/)/.test(href)

// Saves the social links (icon, address, where shown).
export async function saveSocial(rows: Row[]) {
    return guard(async ({ db }) => {
        await replaceRows(db, 'social_links', rows, (row, order) => {
            if (!goodAddress(s(row.href))) throw new Error(`"${s(row.label) || 'A link'}" needs a full address starting with https://`)
            return { label: s(row.label) || 'Link', href: s(row.href), icon: s(row.icon) || 'link', sort_order: order, is_visible: row.is_visible !== false }
        })
        revalidatePath('/', 'layout')
        return { ok: true }
    })
}

// Saves the top bar and footer links.
export async function saveNav(rows: Row[]) {
    return guard(async ({ db }) => {
        await replaceRows(db, 'nav_links', rows, (row, order) => {
            if (!s(row.label)) throw new Error('Every menu item needs a label.')
            if (!goodAddress(s(row.href))) throw new Error(`"${s(row.label)}" needs an address starting with / or https://`)
            return { label: s(row.label), href: s(row.href), placement: ['main', 'more', 'footer'].includes(s(row.placement)) ? s(row.placement) : 'main', sort_order: order, is_visible: row.is_visible !== false }
        })
        revalidatePath('/', 'layout')
        return { ok: true }
    })
}

// Saves the package manager tabs (npm, pnpm, yarn, bun and any you add).
export async function savePackageManagers(rows: Row[]) {
    return guard(async ({ db }) => {
        await replaceRows(db, 'package_managers', rows, (row, order) => {
            if (!/^[a-z0-9-]+$/.test(s(row.id_key))) throw new Error('The key may only use lowercase letters, numbers and hyphens.')
            if (!s(row.label) || !s(row.install_command) || !s(row.run_command)) throw new Error('Each manager needs a label and both command patterns.')
            return { id_key: s(row.id_key), label: s(row.label), install_command: s(row.install_command), run_command: s(row.run_command), sort_order: order, is_enabled: row.is_enabled !== false }
        })
        revalidatePath('/', 'layout')
        return { ok: true }
    })
}