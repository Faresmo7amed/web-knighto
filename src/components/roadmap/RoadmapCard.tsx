"use client"

import Link from "next/link"
import { Icon } from "@/components/ui/Icon"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { countDone, percentOf } from "@/lib/progress-keys"
import { useProgress } from "@/lib/progress"
import type { RoadmapSummary } from "@/data/sample-roadmaps"
import styles from "./Roadmaps.module.css"

export function RoadmapCard({ item }: { item: RoadmapSummary }) {
    const { nodes } = useProgress()
    const pct = percentOf(countDone(nodes, item.slug, item.ids), item.ids.length)

    return (
        <Link href={`/roadmaps/${item.slug}`} className={styles.card}>
            <span className={styles.cardIcon}><Icon name={item.icon} /></span>
            <span className={styles.cardTitle}>{item.title}</span>
            <span className={styles.cardText}>{item.description}</span>
            <span className={styles.cardMeta}>
                <span>{item.ids.length} topics</span>
                <span>{pct}% complete</span>
            </span>
            <ProgressBar value={pct} label={`${item.title} progress`} />
        </Link>
    )
}