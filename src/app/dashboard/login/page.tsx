import { LoginForm } from './LoginForm'
import { AuthShell } from './AuthShell'
import styles from '../dashboard.module.css'

export const instant = false

export default async function DashboardLogin({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
    const { next } = await searchParams
    return (
        <AuthShell>
            <div>
                <h1>Sign in</h1>
                <p className={styles.muted}>Dashboard access is limited to the site owner.</p>
            </div>
            <LoginForm next={next ?? '/dashboard'} redirected={Boolean(next)} />
        </AuthShell>
    )
}