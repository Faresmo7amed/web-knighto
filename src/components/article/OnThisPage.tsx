import type { MouseEventHandler } from 'react'
import type { Heading } from '@/lib/headings'
import styles from './OnThisPage.module.css'

type TocListProps = {
    headings: Heading[]
    activeId: string
    onNavigate?: MouseEventHandler<HTMLAnchorElement>
    roomy?: boolean // 44px rows, for touch
}

// The list of headings with the current one highlighted. Use in the sidebar and the bottom sheet.
export function TocList({ headings, activeId, onNavigate, roomy = false }: TocListProps) {
    return (
        <nav aria-label="Table of contents">
            <ul className={styles.toc}>
                {headings.map((heading) => (
                    <li key={heading.id}>
                        <a
                            href={`#${heading.id}`}
                            className={styles.link}
                            data-level={heading.level}
                            data-roomy={roomy || undefined}
                            aria-current={heading.id === activeId ? 'location' : undefined}
                            onClick={onNavigate}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

// "4 min left", or "Finished" at the end. Use next to the progress bar.
export function timeLeftLabel(progress: number, minutes: number): string {
    const left = Math.ceil(minutes * (1 - progress / 100))
    return progress >= 100 || left <= 0 ? 'Finished' : `${left} min left`
}

// Thin progress bar with the percentage and the time left. The top-of-page bar is the accessible one, so this is hidden from screen readers.
export function ProgressMeter({ progress, minutes }: { progress: number; minutes: number }) {
    return (
        <div className={styles.meter}>
            <div className={styles.track} aria-hidden="true">
                <div className={styles.fill} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.meterText}>
                <span>{progress}%</span>
                <span>{timeLeftLabel(progress, minutes)}</span>
            </div>
        </div>
    )
}