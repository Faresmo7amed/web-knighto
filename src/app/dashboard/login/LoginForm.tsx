'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { signIn, type LoginState } from '../actions'
import styles from '../dashboard.module.css'

const initialState: LoginState = {}

// Email and password form with a show/hide toggle, lockout message and forgot-password link.
export function LoginForm({ next, redirected }: { next: string; redirected: boolean }) {
    const [state, action, pending] = useActionState(signIn, initialState)
    const [show, setShow] = useState(false)
    return (
        <form action={action} className={styles.authForm}>
            <input type="hidden" name="next" value={next} />
            {redirected && !state.error ? <p className={styles.notice}>Please sign in to continue.</p> : null}
            {state.error ? (
                <div role="alert" className={styles.alert}>
                    <b>{state.error}</b>
                    {state.detail ? <span>{state.detail}</span> : null}
                </div>
            ) : null}
            <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="username" required />
            </div>
            <div className={styles.field}>
                <div className={styles.rowBetween}>
                    <label htmlFor="password">Password</label>
                    <Link href="/dashboard/login/forgot" className={styles.link}>Forgot password?</Link>
                </div>
                <div className={styles.passwordRow}>
                    <input id="password" name="password" type={show ? 'text' : 'password'} autoComplete="current-password" required />
                    <button type="button" className={styles.toggle} onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? 'Hide' : 'Show'}</button>
                </div>
            </div>
            <button type="submit" className={styles.primaryButton} disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
            <p className={styles.hint}>Sign-in is rate limited. Every attempt is recorded in your login history.</p>
        </form>
    )
}