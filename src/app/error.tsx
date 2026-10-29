"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Icon } from "@/components/ui/Icon"
import { StaticShell } from "@/components/static/StaticShell"
import styles from "@/components/static/StatusPage.module.css"

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const pathname = usePathname()
    const [time] = useState(() => new Date().toISOString())
    const [copied, setCopied] = useState(false)
    const details = `${error.digest ?? "no-id"} · ${time} · ${pathname}`

    // Copies the details so the visitor can paste them into a report
    async function copyDetails() {
        try {
            await navigator.clipboard.writeText(details)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Clipboard blocked: the visitor can select the text by hand
        }
    }

    return (
        <StaticShell>
            <div className={styles.wrap}>
                <div className={`${styles.eyebrow} ${styles.eyebrowDanger}`}>Error 500</div>
                <h1 className={styles.title}>Something went wrong</h1>
                <p className={styles.lead}>The page could not be loaded. This is not your fault. Try again in a moment, and tell me if it keeps happening.</p>
                <div className={styles.actions}>
                    <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={reset}>Try again</button>
                    <Link href="/" className={`${styles.btn} ${styles.btnSecondary}`}>Back to home</Link>
                    <Link href="/contact" className={`${styles.btn} ${styles.btnGhost}`}>Report a problem</Link>
                </div>
                <div className={styles.details}>
                    <div className={styles.detailsHead}>
                        <span>Details for the report</span>
                        <span className={styles.detailsHint}>Copy and include this</span>
                    </div>
                    <div className={styles.detailsRow}>
                        <span className={styles.detailsCode}>{details}</span>
                        <button type="button" className="icon-btn" onClick={copyDetails} aria-label={copied ? "Copied" : "Copy details"}>
                            <Icon name={copied ? "check" : "copy"} />
                        </button>
                    </div>
                </div>
                <div className={styles.note}>
                    <span className={styles.noteIcon}><Icon name="info" /></span>
                    <span>Your reading progress is saved in this browser, so nothing you read has been lost.</span>
                </div>
            </div>
        </StaticShell>
    )
}