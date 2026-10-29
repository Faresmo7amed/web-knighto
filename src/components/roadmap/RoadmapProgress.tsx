"use client"

import { ProgressBar } from "@/components/ui/ProgressBar"
import { countDone, percentOf } from "@/lib/progress-keys"
import { useProgress } from "@/lib/progress"
import styles from "./Roadmap.module.css"

export function RoadmapProgress({ slug, ids }: { slug: string; ids: string[] }) {
    const { nodes } = useProgress()
    const done = countDone(nodes, slug, ids)
    const pct = percentOf(done, ids.length)

    return (
        <div className={styles.progress}>
            <div className={styles.progressRow}>
                <span className={styles.progressLabel}>Overall progress</span>
                <span className={styles.progressText}>{done} of {ids.length} steps · {pct}%</span>
            </div>
            <ProgressBar value={pct} thick label="Overall progress" />
        </div>
    )
}