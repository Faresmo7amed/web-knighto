import Link from 'next/link'
import { AuthShell } from '../AuthShell'
import { PasswordForm } from '@/components/dashboard/PasswordForm'
import { createClient } from '@/lib/supabase/server'
import styles from '../../dashboard.module.css'
import { connection } from 'next/server'

// Shows the new-password form only when the reset link created a session; otherwise says the link expired.
export default async function ResetPage() {
    await connection()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return (
        <AuthShell>
            {user ? (
                <>
                    <div>
                        <h1>New password</h1>
                        <p className={styles.muted}>Pick something you do not use anywhere else.</p>
                    </div>
                    <PasswordForm redirectAfter />
                </>
            ) : (
                <>
                    <div>
                        <h1>Link expired</h1>
                        <p className={styles.muted}>This reset link was already used or has expired.</p>
                    </div>
                    <Link href="/dashboard/login/forgot" className={styles.link}>Request a new link</Link>
                </>
            )}
        </AuthShell>
    )
}