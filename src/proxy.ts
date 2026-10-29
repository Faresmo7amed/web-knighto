import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Refreshes auth cookies, then sends visitors to sign-in or the 2FA step before any dashboard page renders.
export async function proxy(request: NextRequest) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    if (!url || !key) return NextResponse.next({ request })

    let response = NextResponse.next({ request })
    const supabase = createServerClient(url, key, {
        cookies: {
            getAll() {
                return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                response = NextResponse.next({ request })
                cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
            },
        },
    })

    const { data: { user } } = await supabase.auth.getUser()
    const ownerEmail = process.env.SITE_OWNER_EMAIL?.toLowerCase()
    const isOwner = Boolean(user && ownerEmail && user.email?.toLowerCase() === ownerEmail)

    let needsCode = false
    if (isOwner) {
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
        needsCode = aal?.nextLevel === 'aal2' && aal.currentLevel !== 'aal2'
    }

    const path = request.nextUrl.pathname
    const isAuthPage = path.startsWith('/dashboard/login')

    // Builds a redirect to another dashboard path, optionally remembering where the visitor was going.
    const redirectTo = (pathname: string, next?: string) => {
        const target = request.nextUrl.clone()
        target.pathname = pathname
        target.search = ''
        if (next) target.searchParams.set('next', next)
        return NextResponse.redirect(target)
    }

    if (!isAuthPage && !isOwner) return redirectTo('/dashboard/login', path)
    if (!isAuthPage && needsCode) return redirectTo('/dashboard/login/verify', path)
    if (path === '/dashboard/login' && needsCode) return redirectTo('/dashboard/login/verify')
    if (path === '/dashboard/login/verify' && !isOwner) return redirectTo('/dashboard/login')
    if ((path === '/dashboard/login' || path === '/dashboard/login/verify') && isOwner && !needsCode) return redirectTo('/dashboard')
    return response
}

export const config = { matcher: ['/dashboard/:path*'] }