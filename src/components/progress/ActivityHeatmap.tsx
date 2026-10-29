"use client"

import { useState } from "react"
import { useToday } from "@/lib/progress"
import { formatDate, parseDate, shiftDate } from "@/lib/progress-keys"
import styles from "./Progress.module.css"

type Props = { pages: Record<string, string>; weeks?: number }

// Maps a page count to one of five colour levels (0 to 4)
function level(count: number): number {
    return Math.min(count, 4)
}

export function ActivityHeatmap({ pages, weeks = 30 }: Props) {
    const today = useToday()
    const [hover, setHover] = useState<number | null>(null)

    if (!today) return <div className={styles.heatSkeleton} aria-hidden="true" />

    const counts: Record<string, number> = {}
    for (const day of Object.values(pages)) counts[day] = (counts[day] ?? 0) + 1

    const lastDay = parseDate(today).getDay()
    const total = (weeks - 1) * 7 + lastDay + 1
    const start = shiftDate(today, -(total - 1))
    const cells = Array.from({ length: total }, (_, i) => {
        const date = shiftDate(start, i)
        return { date, count: counts[date] ?? 0, col: Math.floor(i / 7) }
    })
    const read = Object.keys(pages).length
    const active = hover === null ? null : cells[hover]
    const left = active ? Math.min(94, Math.max(6, ((active.col + 0.5) / weeks) * 100)) : 0

    return (
        <div>
            <div className={styles.heatWrap}>
                <div className={styles.heat} style={{ "--weeks": weeks } as React.CSSProperties} role="img" aria-label={`Reading activity: ${read} pages read in the last ${weeks} weeks`}>
                    {cells.map((cell, i) => (
                        <div
                            key={cell.date}
                            aria-hidden="true"
                            className={`${styles.cell} ${styles[`l${level(cell.count)}`]} ${cell.date === today ? styles.today : ""}`}
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(null)}
                        />
                    ))}
                </div>
                {active ? (
                    <div role="tooltip" className={styles.tip} style={{ insetInlineStart: `${left}%` }}>
                        <b>{active.count} {active.count === 1 ? "page" : "pages"} read</b> · {formatDate(active.date)}
                    </div>
                ) : null}
            </div>
            <div className={styles.legend}>
                Less
                {[0, 1, 2, 3, 4].map((n) => <span key={n} className={`${styles.swatch} ${styles[`l${n}`]}`} />)}
                More
            </div>
        </div>
    )
}