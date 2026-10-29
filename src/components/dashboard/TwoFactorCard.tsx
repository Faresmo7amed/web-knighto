'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from '@/app/dashboard/dashboard.module.css'

type Enrollment = { factorId: string; qr: string; secret: string }

// Turns authenticator-app 2FA on or off. Setup shows a QR code, then asks for one code to confirm.
export function TwoFactorCard({ factorId }: { factorId: string | null }) {
    const router = useRouter()
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    // Starts setup. Removes an abandoned, unverified attempt first so Supabase accepts a new one.
    async function start() {
        setBusy(true)
        setError('')
        const supabase = createClient()
        const { data: list } = await supabase.auth.mfa.listFactors()
        for (const factor of list?.all ?? []) {
            if (factor.status === 'unverified') await supabase.auth.mfa.unenroll({ factorId: factor.id })
        }
        const { data, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
        setBusy(false)
        if (enrollError || !data) return setError(enrollError?.message ?? 'Could not start setup.')
        setEnrollment({ factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret })
    }

    // Confirms the first code from the app, which finishes setup.
    async function confirmSetup() {
        if (!enrollment) return
        setBusy(true)
        setError('')
        const { error: verifyError } = await createClient().auth.mfa.challengeAndVerify({ factorId: enrollment.factorId, code: code.replace(/\s/g, '') })
        setBusy(false)
        if (verifyError) return setError('That code is not correct. Try the newest one.')
        setEnrollment(null)
        setCode('')
        router.refresh()
    }

    // Removes 2FA after a browser confirmation.
    async function turnOff() {
        if (!factorId || !window.confirm('Turn off two-step verification? The dashboard will be protected by your password only.')) return
        setBusy(true)
        const { error: unenrollError } = await createClient().auth.mfa.unenroll({ factorId })
        setBusy(false)
        if (unenrollError) return setError(unenrollError.message)
        router.refresh()
    }

    return (
        <section className={styles.panel}>
            <div className={styles.rowBetween}>
                <h2>Two-step verification</h2>
                <span className={styles.badge}>{factorId ? 'Enabled' : 'Off'}</span>
            </div>
            <p className={styles.muted}>Codes come from an authenticator app. You are asked for one every time you sign in.</p>
            {enrollment ? (
                <div className={styles.authForm}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={enrollment.qr} alt="QR code to scan with your authenticator app" width={220} height={220} style={{ background: '#fff', padding: 16, borderRadius: 12, alignSelf: 'flex-start' }} />
                    <p className={styles.hint}>Cannot scan? Enter this key instead: <code>{enrollment.secret}</code></p>
                    <div className={styles.field}>
                        <label htmlFor="setup-code">6-digit code</label>
                        <input id="setup-code" inputMode="numeric" autoComplete="one-time-code" maxLength={7} value={code} onChange={(event) => setCode(event.target.value)} />
                    </div>
                    <div className={styles.actions}>
                        <button type="button" className={styles.primaryButton} onClick={confirmSetup} disabled={busy || code.replace(/\s/g, '').length < 6}>Confirm</button>
                        <button type="button" className={styles.secondaryButton} onClick={() => setEnrollment(null)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div className={styles.actions}>
                    <button type="button" className={styles.secondaryButton} onClick={start} disabled={busy}>{factorId ? 'Set up a new device' : 'Set up'}</button>
                    {factorId ? <button type="button" className={styles.secondaryButton} onClick={turnOff} disabled={busy}>Turn off</button> : null}
                </div>
            )}
            {error ? <p role="alert" className={styles.error}>{error}</p> : null}
        </section>
    )
}