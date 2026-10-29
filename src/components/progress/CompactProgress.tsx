"use client"

import { ProgressBar } from "@/components/ui/ProgressBar"
import { shiftDate, percentOf } from "@/lib/progress-keys"
import { useProgress, useToday } from "@/lib/progress"
import type { SectionHrefs } from "@/lib/progress-data"
import styles from "./Progress.module.css"

export function CompactProgress({ sections }: { sections: SectionHrefs[] }) {
    const { pages } = useProgress()
    const today = useToday()
    const counts: Record<string, number> = {}
    for (const day of Object.values(pages)) counts[day] = (counts[day] ?? 0) + 1
    const days = Array.from({ length: 40 }, (_, i) => (today ? counts[shiftDate(today, i - 39)] ?? 0 : 0))

    return (
        <div className={styles.compact}>
            <div className={styles.compactLeft}>
                <span className={styles.muted}>Pages read, by day</span>
                <div className={styles.compactGrid} aria-hidden="true">
                    {days.map((count, i) => <div key={i} className={`${styles.cell} ${styles[`l${Math.min(count, 4)}`]}`} />)}
                </div>
                <span className={styles.note}>Saved only in this browser. No account needed.</span>
            </div>
            <div className={styles.compactRight}>
                {sections.slice(0, 3).map((section) => {
                    const pct = percentOf(section.hrefs.filter((href) => pages[href]).length, section.hrefs.length)
                    return (
                        <div key={section.slug} className={styles.compactRow}>
                            <div className={styles.compactLabel}><span>{section.title}</span><span className={styles.muted}>{pct}%</span></div>
                            <ProgressBar value={pct} label={`${section.title} progress`} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}