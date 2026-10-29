import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { connection } from 'next/server'

// Returns the signed-in owner or throws. Also throws if 2FA is enrolled but not yet verified in this session.
export async function requireOwner() {
    await connection()
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    const ownerEmail = process.env.SITE_OWNER_EMAIL?.toLowerCase()

    if (error || !user || !ownerEmail || user.email?.toLowerCase() !== ownerEmail) {
        throw new Error('Unauthorized')
    }
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aal?.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') throw new Error('Unauthorized')
    return user
}

// Redirects unauthenticated or non-owner visitors away from dashboard pages.
export async function requireOwnerPage() {
    try {
        return await requireOwner()
    } catch {
        redirect('/dashboard/login')
    }
}