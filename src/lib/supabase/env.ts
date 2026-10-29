// Validates the two values shared by browser and server Supabase clients.
export function getSupabasePublicEnv() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    if (!url || !key) throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.')
    return { url, key }
}

// Validates a server-only secret before privileged database work.
export function getSupabaseServiceRoleKey() {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!key) throw new Error('Supabase admin access is not configured. Set SUPABASE_SERVICE_ROLE_KEY.')
    return key
}
