'use client'

import { useActionState, useState } from 'react'
import { updatePassword, type FormState } from '@/app/dashboard/actions'
import { checkPassword, passwordStrength } from '@/lib/password'
import styles from '@/app/dashboard/dashboard.module.css'

const initialState: FormState = {}

// New-password form with live rules, a strength bar and a match check.
export function PasswordForm({ redirectAfter = false }: { redirectAfter?: boolean }) {
    const [state, action, pending] = useActionState(updatePassword, initialState)
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [show, setShow] = useState(false)
    const check = checkPassword(password)
    const strength = passwordStrength(password)
    const mismatch = confirm.length > 0 && confirm !== password
    const valid = check.length && check.mix && password === confirm

    return (
        <form action={action} className={styles.authForm}>
            {redirectAfter ? <input type="hidden" name="redirect" value="1" /> : null}
            <div className={styles.field}>
                <label htmlFor="password">New password</label>
                <div className={styles.passwordRow}>
                    <input id="password" name="password" type={show ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                    <button type="button" className={styles.toggle} onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? 'Hide' : 'Show'}</button>
                </div>
                <div className={styles.strength} aria-hidden="true">
                    {[0, 1, 2, 3].map((index) => <span key={index} className={index < strength ? styles.strengthOn : undefined} />)}
                </div>
            </div>
            <ul className={styles.checklist}>
                <li className={check.length ? styles.ok : undefined}>{check.length ? '✓' : '○'} At least 12 characters</li>
                <li className={check.mix ? styles.ok : undefined}>{check.mix ? '✓' : '○'} Letters and numbers</li>
            </ul>
            <div className={styles.field}>
                <label htmlFor="confirm">Confirm password</label>
                <input id="confirm" name="confirm" type={show ? 'text' : 'password'} autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} aria-invalid={mismatch} required />
                {mismatch ? <span className={styles.error}>Passwords do not match.</span> : null}
            </div>
            {state.error ? <p role="alert" className={styles.error}>{state.error}</p> : null}
            {state.ok ? <p role="status" className={styles.notice}>Password updated.</p> : null}
            <button type="submit" className={styles.primaryButton} disabled={pending || !valid}>{pending ? 'Saving…' : 'Update password'}</button>
        </form>
    )
}