"use client"

import { useState, type FormEvent } from "react"
import { Icon } from "@/components/ui/Icon"
import styles from "./Contact.module.css"

type Errors = { name?: string; email?: string; message?: string }

const MAX = 2000
const SUBJECTS = ["Question about an article", "Report a mistake", "Other"]
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Checks the three required fields and returns one error text per invalid field. Use it on submit.
function validate(values: { name: string; email: string; message: string }): Errors {
    const errors: Errors = {}
    if (!values.name) errors.name = "Enter your name."
    if (!EMAIL_PATTERN.test(values.email)) errors.email = "Enter a full email address, like name@example.com."
    if (!values.message) errors.message = "Write a message before sending."
    return errors
}

// Shows one field error with an icon. Use it under any invalid input.
function FieldError({ id, text }: { id: string; text?: string }) {
    if (!text) return null
    return (
        <span id={id} className={styles.error}>
            <Icon name="circle-alert" />
            {text}
        </span>
    )
}

export function ContactForm() {
    const [sent, setSent] = useState(false)
    const [errors, setErrors] = useState<Errors>({})
    const [message, setMessage] = useState("")
    const [sentName, setSentName] = useState("")
    const errorCount = Object.keys(errors).length

    // Validates the form and shows the success card when everything is valid
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const name = String(data.get("name") ?? "").trim()
        const email = String(data.get("email") ?? "").trim()
        const found = validate({ name, email, message: message.trim() })
        setErrors(found)
        if (Object.keys(found).length > 0) return
        // NOT WIRED YET: nothing is sent. A later step posts the message to a server route.
        setSentName(name)
        setSent(true)
    }

    // Returns to an empty form after a message. Use it from "Send another".
    function reset() {
        setMessage("")
        setErrors({})
        setSent(false)
    }

    if (sent) {
        return (
            <div className={styles.sent} role="status">
                <span className={styles.sentIcon}><Icon name="circle-check" /></span>
                <b className={styles.sentTitle}>Message sent</b>
                <span className={styles.sentText}>{`Thanks, ${sentName}. I will reply to the email address you gave.`}</span>
                <button type="button" className={styles.secondary} onClick={reset}>Send another</button>
            </div>
        )
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {errorCount > 0 ? (
                <div role="alert" className={styles.alert}>
                    <span className={styles.alertIcon}><Icon name="circle-alert" /></span>
                    <div>
                        <b>{errorCount === 1 ? "1 field needs attention" : `${errorCount} fields need attention`}</b>
                        <div className={styles.alertText}>Fix the highlighted fields and send again.</div>
                    </div>
                </div>
            ) : null}

            <div className={styles.field}>
                <label className={styles.label} htmlFor="c-name">Name</label>
                <input id="c-name" name="name" autoComplete="name" className={errors.name ? `${styles.input} ${styles.inputError}` : styles.input} aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? "c-name-error" : undefined} />
                <FieldError id="c-name-error" text={errors.name} />
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="c-email">Email</label>
                <input id="c-email" name="email" type="email" autoComplete="email" className={errors.email ? `${styles.input} ${styles.inputError}` : styles.input} aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? "c-email-error" : undefined} />
                <FieldError id="c-email-error" text={errors.email} />
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="c-subject">Subject</label>
                <select id="c-subject" name="subject" className={styles.input}>
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="c-message">Message</label>
                <textarea id="c-message" name="message" rows={6} maxLength={MAX} placeholder="Write your message" value={message} onChange={(e) => setMessage(e.target.value)} className={errors.message ? `${styles.input} ${styles.textarea} ${styles.inputError}` : `${styles.input} ${styles.textarea}`} aria-invalid={errors.message ? true : undefined} aria-describedby={errors.message ? "c-message-error" : undefined} />
                <div className={styles.row}>
                    <FieldError id="c-message-error" text={errors.message} />
                    <span className={styles.count}>{message.length} / {MAX}</span>
                </div>
            </div>

            <div className={styles.actions}>
                <button type="submit" className={styles.submit}>Send message</button>
                <span className={styles.hint}>Replies usually come by email.</span>
            </div>
        </form>
    )
}