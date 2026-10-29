"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { Icon } from "@/components/ui/Icon"
import { useProgress, setNodeDone } from "@/lib/progress"
import styles from "./RoadmapPanel.module.css"

type Props = { closeHref: string; title: string; description: string; path: string; nodeKey: string; children: ReactNode }

export function PanelFrame({ closeHref, title, description, path, nodeKey, children }: Props) {
    const router = useRouter()
    const { nodes } = useProgress()
    const [copied, setCopied] = useState(false)
    const done = Boolean(nodes[nodeKey])

    // Closes the panel when Esc is pressed, unless another dialog (like search) is open
    useEffect(() => {
        function onKey(event: KeyboardEvent) {
            if (event.key !== "Escape" || document.querySelector("[role='dialog']")) return
            router.push(closeHref, { scroll: false })
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [router, closeHref])

    // Copies the full deep link of this step. Use it from the copy button.
    async function copyLink() {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}${path}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Clipboard blocked: the visitor can copy from the address bar
        }
    }

    return (
        <>
            <Link href={closeHref} scroll={false} className={styles.backdrop} tabIndex={-1} aria-hidden="true" />
            <aside aria-label="Step details" className={styles.panel}>
                <div className={styles.topRow}>
                    <span className={styles.eyebrow}>SELECTED STEP</span>
                    <span className={styles.topActions}>
                        <kbd className={styles.kbd}>Esc</kbd>
                        <Link href={closeHref} scroll={false} className="icon-btn" aria-label="Close panel"><Icon name="x" /></Link>
                    </span>
                </div>
                <div className={styles.titleBlock}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.pathRow}>
                        <code className={styles.path}>{path}</code>
                        <button type="button" className="icon-btn" onClick={copyLink} aria-label={copied ? "Link copied" : "Copy link"}>
                            <Icon name={copied ? "check" : "copy"} />
                        </button>
                    </div>
                </div>
                <div className={styles.doneRow}>
                    <span className={styles.doneLabel}>Mark as done</span>
                    <button type="button" role="switch" aria-checked={done} aria-label="Mark as done" className={done ? `${styles.switch} ${styles.switchOn}` : styles.switch} onClick={() => setNodeDone(nodeKey, !done)}>
                        <span className={styles.knob} />
                    </button>
                </div>
                {children}
            </aside>
        </>
    )
}