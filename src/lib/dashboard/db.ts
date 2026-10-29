import 'server-only'
import { requireOwner } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { PAGE_COLUMNS, type PageRow, type Result } from './types'

export type Db = ReturnType<typeof createAdminClient>

// Turns anything thrown into a short message for the toast.
function message(error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return 'Your session expired. Sign in again.'
    if (error && typeof error === 'object' && 'message' in error) return String((error as { message: unknown }).message)
    return 'Something went wrong.'
}

// Wraps every dashboard action: checks the owner, gives the admin client, and turns errors into { ok: false }.
export async function guard(task: (ctx: { db: Db; user: Awaited<ReturnType<typeof requireOwner>> }) => Promise<Result>): Promise<Result> {
    try {
        const user = await requireOwner()
        return await task({ db: createAdminClient(), user })
    } catch (error) {
        return { ok: false, error: message(error) }
    }
}

export const fail = (error: string): Result => ({ ok: false, error })

// Reads every page row, including trashed ones. Filter `deleted_at` yourself.
export async function allPages(db: Db): Promise<PageRow[]> {
    const { data, error } = await db.from('pages').select(PAGE_COLUMNS)
    if (error) throw error
    return (data ?? []) as PageRow[]
}