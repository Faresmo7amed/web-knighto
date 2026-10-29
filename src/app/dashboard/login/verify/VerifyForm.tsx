'use client'

import { useActionState, useRef, useState, type KeyboardEvent } from 'react'
import { signOut, verifyCode, type FormState } from '../../actions'
import styles from '../../dashboard.module.css'

const initialState: FormState = {}

// Six code boxes that accept typing and pasting, with auto-advance.
export function VerifyForm({ next }: { next: string }) {
    const [state, action, pending] = useActionState(verifyCode, initialState)
    const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
    const refs = useRef<(HTMLInputElement | null)[]>([])
    const code = digits.join('')

    // Writes one digit, or a pasted code, then moves focus to the next empty box.
    function change(index: number, value: string) {
        const clean = value.replace(/\D/g, '')
        const nextDigits = [...digits]
        if (clean.length <= 1) nextDigits[index] = clean
        else clean.slice(0, 6 - index).split('').forEach((digit, offset) => { nextDigits[index + offset] = digit })
        setDigits(nextDigits)
        if (clean) refs.current[Math.min(index + clean.length, 5)]?.focus()
    }

    // Backspace on an empty box jumps to the previous one.
    function keyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Backspace' && !digits[index] && index > 0) refs.current[index - 1]?.focus()
    }

    return (
        <>
            <form action={action} className={styles.authForm}>
                <input type="hidden" name="next" value={next} />
                <input type="hidden" name="code" value={code} />
                <div role="group" aria-label="6-digit code" className={styles.codeRow}>
                    {digits.map((digit, index) => (
                        <input
                            key={index}
                            ref={(element) => { refs.current[index] = element }}
                            className={styles.codeBox}
                            value={digit}
                            inputMode="numeric"
                            autoComplete={index === 0 ? 'one-time-code' : 'off'}
                            aria-label={`Digit ${index + 1}`}
                            onChange={(event) => change(index, event.target.value)}
                            onKeyDown={(event) => keyDown(index, event)}
                            autoFocus={index === 0}
                        />
                    ))}
                </div>
                {state.error ? <p role="alert" className={styles.error}>{state.error}</p> : null}
                <button type="submit" className={styles.primaryButton} disabled={pending || code.length < 6}>{pending ? 'Verifying…' : 'Verify'}</button>
            </form>
            <form action={signOut}>
                <button type="submit" className={styles.plain}>Cancel and sign out</button>
            </form>
        </>
    )
}