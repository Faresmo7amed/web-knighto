import 'server-only'
import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

const MAX_ATTEMPTS = 5
const LOCK_MINUTES = 15

export type LockState = { locked: boolean; minutesLeft: number; attemptsLeft: number }

// Counts failed sign-ins for an email in the last 15 minutes, stopping at its last success. Call before checking the password.
export async function getLockState(email: string): Promise<LockState> {
    const since = new Date(Date.now() - LOCK_MINUTES * 60_000).toISOString()
    const { data } = await createAdminClient()
        .from('login_attempts')
        .select('succeeded, created_at')
        .eq('email', email)
        .gte('created_at', since)
        .order('created_at', { ascending: false })

    let failures = 0
    let lastFailure = 0
    for (const row of data ?? []) {
        if (row.succeeded) break
        failures += 1
        if (!lastFailure) lastFailure = new Date(row.created_at).getTime()
    }
    const locked = failures >= MAX_ATTEMPTS
    const minutesLeft = locked ? Math.max(1, Math.ceil((lastFailure + LOCK_MINUTES * 60_000 - Date.now()) / 60_000)) : 0
    return { locked, minutesLeft, attemptsLeft: Math.max(0, MAX_ATTEMPTS - failures) }
}

// Saves one sign-in attempt with the caller's IP. Call after every password check.
export async function recordAttempt(email: string, succeeded: boolean) {
    const requestHeaders = await headers()
    const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
    await createAdminClient().from('login_attempts').insert({ email, ip, succeeded })
}