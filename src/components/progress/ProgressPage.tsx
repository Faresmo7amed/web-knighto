"use client"

import { useState } from "react"
import { resetProgress, useProgress } from "@/lib/progress"
import type { SectionHrefs } from "@/lib/progress-data"
import { ActivityHeatmap } from "./ActivityHeatmap"
import { SectionCard } from "./SectionCard"
import styles from "./Progress.module.css"

export function ProgressPage({ sections }: { sections: SectionHrefs[] }) {
    const { pages } = useProgress()
    const [confirming, setConfirming] = useState(false)

    // Deletes all progress after the visitor confirms
    function confirmReset() {
        resetProgress()
        setConfirming(false)
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.head}>
                <div className={styles.headText}>
                    <h1 className={styles.title}>Your progress</h1>
                    <p className={styles.lead}>Pages you have read, remembered in this browser only. No account is needed.</p>
                </div>
                {confirming ? (
                    <div className={styles.confirm} role="alertdialog" aria-label="Confirm reset">
                        <span>Delete all progress?</span>
                        <button type="button" className={styles.btn} onClick={() => setConfirming(false)}>Cancel</button>
                        <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={confirmReset}>Yes, reset</button>
                    </div>
                ) : (
                    <button type="button" className={`${styles.btn} ${styles.btnDangerText}`} onClick={() => setConfirming(true)}>Reset progress</button>
                )}
            </div>

            <section className={styles.panel}>
                <div className={styles.panelHead}>
                    <h2 className={styles.h2}>Reading activity</h2>
                    <span className={styles.muted}>Last 30 weeks</span>
                </div>
                <ActivityHeatmap pages={pages} />
            </section>

            <div className={styles.sectionsHead}>
                <h2 className={styles.h2}>By section</h2>
                <span className={styles.key}>
                    <span className={styles.keyItem}><span className={`${styles.swatch} ${styles.squareOn}`} />Read</span>
                    <span className={styles.keyItem}><span className={`${styles.swatch} ${styles.l0}`} />Not read</span>
                </span>
            </div>
            <div className={styles.cards}>
                {sections.map((section) => <SectionCard key={section.slug} section={section} pages={pages} />)}
            </div>
        </div>
    )
}