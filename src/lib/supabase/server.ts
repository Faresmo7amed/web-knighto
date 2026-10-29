import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabasePublicEnv } from './env'

// Creates a cookie-backed client for Server Components, Route Handlers, and Server Actions.
export async function createClient() {
    const cookieStore = await cookies()
    const { url, key } = getSupabasePublicEnv()

    return createServerClient(url, key, {
        cookies: {
            getAll() {
                return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                } catch {
                    // Server Components cannot set cookies. proxy.ts refreshes auth cookies for page requests.
                }
            },
        },
    })
}
