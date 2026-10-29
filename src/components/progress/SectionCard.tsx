import { ProgressBar } from "@/components/ui/ProgressBar"
import { percentOf } from "@/lib/progress-keys"
import type { SectionHrefs } from "@/lib/progress-data"
import styles from "./Progress.module.css"

export function SectionCard({ section, pages }: { section: SectionHrefs; pages: Record<string, string> }) {
    const read = section.hrefs.filter((href) => pages[href]).length
    const pct = percentOf(read, section.hrefs.length)

    return (
        <section className={styles.card}>
            <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>{section.title}</h3>
                <span className={pct === 0 ? styles.pctZero : styles.pct}>{pct}%</span>
            </div>
            <ProgressBar value={pct} label={`${section.title} progress`} />
            <div className={styles.squares} aria-hidden="true">
                {section.hrefs.map((href) => <div key={href} className={pages[href] ? `${styles.square} ${styles.squareOn}` : styles.square} />)}
            </div>
            <span className={styles.count}>{read} of {section.hrefs.length} pages read</span>
        </section>
    )
}