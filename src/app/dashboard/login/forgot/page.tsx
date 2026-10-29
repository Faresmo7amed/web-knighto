import { AuthShell } from '../AuthShell'
import { ForgotForm } from './ForgotForm'
import styles from '../../dashboard.module.css'

export default function ForgotPage() {
    return (
        <AuthShell>
            <div>
                <h1>Reset password</h1>
                <p className={styles.muted}>Enter your email and a reset link will be sent.</p>
            </div>
            <ForgotForm />
        </AuthShell>
    )
}