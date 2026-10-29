"use client"

import { ProgressBar } from "@/components/ui/ProgressBar"
import { percentOf } from "@/lib/progress-keys"
import { useProgress } from "@/lib/progress"
import styles from "./Progress.module.css"

export function SidebarProgress({ hrefs }: { hrefs: string[] }) {
    const { pages } = useProgress()
    const pct = percentOf(hrefs.filter((href) => pages[href]).length, hrefs.length)

    return (
        <div className={styles.sidebar}>
            <div className={styles.compactLabel}><span>Section progress</span><span className={styles.muted}>{pct}%</span></div>
            <ProgressBar value={pct} label="Section progress" />
        </div>
    )
}