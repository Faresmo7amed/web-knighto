import { AuthShell } from '../AuthShell'
import { VerifyForm } from './VerifyForm'
import styles from '../../dashboard.module.css'

export const instant = false

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
    const { next } = await searchParams
    return (
        <AuthShell>
            <div>
                <h1>Two-step verification</h1>
                <p className={styles.muted}>Enter the 6-digit code from your authenticator app.</p>
            </div>
            <VerifyForm next={next ?? '/dashboard'} />
        </AuthShell>
    )
}