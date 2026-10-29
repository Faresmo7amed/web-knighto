import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Swaps the one-time code from the reset email for a session, then opens the page named in `next`.
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'
    const safe = next.startsWith('/dashboard') ? next : '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) return NextResponse.redirect(`${origin}${safe}`)
    }
    return NextResponse.redirect(`${origin}/dashboard/login/reset`)
}