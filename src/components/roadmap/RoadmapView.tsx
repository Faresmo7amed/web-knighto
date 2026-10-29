import Link from "next/link"
import { Icon } from "@/components/ui/Icon"
import { flattenNodes, toTreeData, type Roadmap, type RoadmapNode } from "@/data/sample-roadmaps"
import { Legend } from "./Legend"
import { NodePanel } from "./NodePanel"
import { RoadmapProgress } from "./RoadmapProgress"
import { RoadmapTree } from "./RoadmapTree"
import styles from "./Roadmap.module.css"

export function RoadmapView({ roadmap, current }: { roadmap: Roadmap; current?: RoadmapNode }) {
    const ids = flattenNodes(roadmap).map((node) => node.id)

    return (
        <div className={styles.layout}>
            <div className={styles.main}>
                <div className={styles.head}>
                    <nav aria-label="Breadcrumb" className={styles.crumbs}>
                        <Link href="/roadmaps" className={styles.crumbLink}>Roadmaps</Link>
                        <Icon name="chevron-right" />
                        <span className={styles.crumbCurrent}>{roadmap.title}</span>
                    </nav>
                    <h1 className={styles.title}>{roadmap.title}</h1>
                    <p className={styles.lead}>{roadmap.description}</p>
                    <RoadmapProgress slug={roadmap.slug} ids={ids} />
                    <Legend />
                </div>
                <RoadmapTree slug={roadmap.slug} groups={toTreeData(roadmap)} selectedId={current?.id} />
            </div>
            {current ? <NodePanel roadmap={roadmap} node={current} /> : null}
        </div>
    )
}