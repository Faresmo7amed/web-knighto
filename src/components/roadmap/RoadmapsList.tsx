"use client"

import { useState } from "react"
import { categories, type RoadmapSummary } from "@/data/sample-roadmaps"
import { RoadmapCard } from "./RoadmapCard"
import styles from "./Roadmaps.module.css"

export function RoadmapsList({ items }: { items: RoadmapSummary[] }) {
    const [active, setActive] = useState("All")
    const shown = active === "All" ? items : items.filter((item) => item.category === active)

    return (
        <>
            <div role="tablist" aria-label="Categories" className={styles.tabs}>
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        role="tab"
                        aria-selected={category === active}
                        className={category === active ? `${styles.tab} ${styles.tabOn}` : styles.tab}
                        onClick={() => setActive(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div role="tabpanel" className={styles.grid}>
                {shown.map((item) => <RoadmapCard key={item.slug} item={item} />)}
            </div>
            {shown.length === 0 ? <p className={styles.empty}>No roadmaps in this category yet.</p> : null}
        </>
    )
}