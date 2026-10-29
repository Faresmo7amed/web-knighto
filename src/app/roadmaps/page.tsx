import type { Metadata } from "next"
import { getRoadmapSummaries } from "@/data/sample-roadmaps"
import { StaticShell } from "@/components/static/StaticShell"
import { RoadmapsList } from "@/components/roadmap/RoadmapsList"
import styles from "@/components/roadmap/Roadmaps.module.css"

export const metadata: Metadata = { title: "Roadmaps" }

export default function RoadmapsRoute() {
    return (
        <StaticShell>
            <div className={styles.wrap}>
                <div className={styles.head}>
                    <h1 className={styles.title}>Roadmaps</h1>
                    <p className={styles.lead}>Step-by-step paths through a subject. Each step opens its own study notes and resources, and you can mark it done as you go.</p>
                </div>
                <RoadmapsList items={getRoadmapSummaries()} />
            </div>
        </StaticShell>
    )
}