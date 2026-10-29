'use client'

import { createBrowserClient } from '@supabase/ssr'
import { getSupabasePublicEnv } from './env'

// Creates the browser client for client components that need the current session.
export function createClient() {
    const { url, key } = getSupabasePublicEnv()
    return createBrowserClient(url, key)
}
