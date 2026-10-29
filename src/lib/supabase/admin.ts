import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from './env'

// Creates the privileged server-only client. Never import this from client code.
export function createAdminClient() {
    const { url } = getSupabasePublicEnv()
    return createSupabaseClient(url, getSupabaseServiceRoleKey(), {
        auth: { autoRefreshToken: false, persistSession: false },
    })
}
