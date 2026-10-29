'use client'

import { useActionState } from 'react'
import { requestReset, type FormState } from '../../actions'
import styles from '../../dashboard.module.css'

const initialState: FormState = {}

// Asks for the owner email and shows the same confirmation whatever was typed.
export function ForgotForm() {
    const [state, action, pending] = useActionState(requestReset, initialState)
    return (
        <form action={action} className={styles.authForm}>
            <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="username" required />
            </div>
            <button type="submit" className={styles.primaryButton} disabled={pending}>{pending ? 'Sending…' : 'Send reset link'}</button>
            {state.ok ? <p role="status" className={styles.notice}>If an account exists for that email, a link is on its way. It works once and expires soon.</p> : null}
        </form>
    )
}