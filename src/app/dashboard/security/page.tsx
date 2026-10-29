import { requireOwnerPage } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { signOutOthers } from '../actions'
import { PasswordForm } from '@/components/dashboard/PasswordForm'
import { TwoFactorCard } from '@/components/dashboard/TwoFactorCard'
import styles from '../dashboard.module.css'
import { connection } from 'next/server'

export const instant = false

// Security page: 2FA, password, other sessions and recent sign-in attempts.
export default async function SecurityPage({ searchParams }: { searchParams: Promise<{ done?: string }> }) {
    await connection()
    await requireOwnerPage()
    const { done } = await searchParams
    const supabase = await createClient()
    const [{ data: factors }, { data: attempts }] = await Promise.all([
        supabase.auth.mfa.listFactors(),
        supabase.from('login_attempts').select('id, ip, succeeded, created_at').order('created_at', { ascending: false }).limit(10),
    ])

    return (
        <div className={styles.content}>
            <p className={styles.eyebrow}>ADMIN</p>
            <h1>Security</h1>
            <p className={styles.muted}>Protect the dashboard: two-step verification, password, sessions and sign-in limits.</p>
            <div className={styles.stack}>
                <TwoFactorCard factorId={factors?.totp[0]?.id ?? null} />
                <section className={styles.panel}>
                    <h2>Password</h2>
                    <PasswordForm />
                </section>
                <section className={styles.panel}>
                    <h2>Sessions</h2>
                    <p className={styles.muted}>Signs out every other browser or device. This one stays signed in.</p>
                    {done === 'sessions' ? <p role="status" className={styles.notice}>Other sessions were signed out.</p> : null}
                    <form action={signOutOthers}><button type="submit" className={styles.secondaryButton}>Sign out all other sessions</button></form>
                </section>
                <section className={styles.panel}>
                    <h2>Sign-in protection</h2>
                    <p className={styles.muted}>After 5 failed attempts in a row, sign-in is locked for 15 minutes.</p>
                    <h3>Recent sign-in attempts</h3>
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead><tr><th>When</th><th>Result</th><th>Network</th></tr></thead>
                            <tbody>
                                {(attempts ?? []).map((attempt) => (
                                    <tr key={attempt.id}>
                                        <td>{new Date(attempt.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })} UTC</td>
                                        <td>{attempt.succeeded ? 'Success' : 'Failed'}</td>
                                        <td>{attempt.ip ? `IP ending in ${attempt.ip.split(/[.:]/).pop()}` : 'Unknown'}</td>
                                    </tr>
                                ))}
                                {!attempts?.length ? <tr><td colSpan={3}>No attempts recorded yet.</td></tr> : null}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    )
}