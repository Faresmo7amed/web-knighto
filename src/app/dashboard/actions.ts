'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLockState, recordAttempt } from '@/lib/login-guard'
import { checkPassword } from '@/lib/password'

export type LoginState = { error?: string; detail?: string }
export type FormState = { error?: string; ok?: boolean }

// Keeps redirects inside the dashboard.
function safeNext(next: string) {
    return next.startsWith('/dashboard') ? next : '/dashboard'
}

// Signs in the owner with lockout. Sends the owner to the 2FA step when a code is required.
export async function signIn(_: LoginState, formData: FormData): Promise<LoginState> {
    const email = String(formData.get('email') ?? '').trim().toLowerCase()
    const password = String(formData.get('password') ?? '')
    const next = safeNext(String(formData.get('next') ?? '/dashboard'))
    if (!email || !password) return { error: 'Enter both your email address and password.' }

    const lock = await getLockState(email)
    if (lock.locked) return { error: 'Sign-in is locked.', detail: `Too many attempts. Try again in ${lock.minutesLeft} minutes.` }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    const isOwner = data.user?.email?.toLowerCase() === process.env.SITE_OWNER_EMAIL?.toLowerCase()
    if (error || !isOwner) {
        if (!error) await supabase.auth.signOut()
        await recordAttempt(email, false)
        const left = lock.attemptsLeft - 1
        return {
            error: 'Email or password is incorrect.',
            detail: left > 0 ? `${left} attempts left before sign-in is locked for 15 minutes.` : 'Sign-in is now locked for 15 minutes.',
        }
    }
    await recordAttempt(email, true)

    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aal?.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
        redirect(`/dashboard/login/verify?next=${encodeURIComponent(next)}`)
    }
    redirect(next)
}

// Checks the 6-digit authenticator code and upgrades the session. Used on the 2FA step.
export async function verifyCode(_: FormState, formData: FormData): Promise<FormState> {
    const code = String(formData.get('code') ?? '').replace(/\s/g, '')
    const next = safeNext(String(formData.get('next') ?? '/dashboard'))
    if (!/^\d{6}$/.test(code)) return { error: 'Enter the 6-digit code.' }

    const supabase = await createClient()
    const { data: factors } = await supabase.auth.mfa.listFactors()
    const factor = factors?.totp[0]
    if (!factor) return { error: 'No authenticator is set up for this account.' }

    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code })
    if (error) return { error: 'That code is not correct or has expired.' }
    redirect(next)
}

// Ends the active dashboard session.
export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/dashboard/login')
}

// Emails a reset link to the owner. Always answers "ok" so it never reveals which emails exist.
export async function requestReset(_: FormState, formData: FormData): Promise<FormState> {
    const email = String(formData.get('email') ?? '').trim().toLowerCase()
    const origin = (await headers()).get('origin') ?? ''
    if (email && email === process.env.SITE_OWNER_EMAIL?.toLowerCase()) {
        const supabase = await createClient()
        await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/dashboard/login/reset` })
    }
    return { ok: true }
}

// Sets a new password for the signed-in session. Used by the reset page and by Security.
export async function updatePassword(_: FormState, formData: FormData): Promise<FormState> {
    const password = String(formData.get('password') ?? '')
    const confirm = String(formData.get('confirm') ?? '')
    const check = checkPassword(password)
    if (!check.length || !check.mix) return { error: 'Use at least 12 characters with letters and numbers.' }
    if (password !== confirm) return { error: 'Passwords do not match.' }

    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) return { error: error.message }
    if (formData.get('redirect') === '1') redirect('/dashboard')
    return { ok: true }
}

// Signs out every other browser or device, and keeps this one. Used on Security.
export async function signOutOthers() {
    const supabase = await createClient()
    await supabase.auth.signOut({ scope: 'others' })
    redirect('/dashboard/security?done=sessions')
}