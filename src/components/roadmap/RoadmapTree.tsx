"use client"

import { nodeKey } from "@/lib/progress-keys"
import { useProgress } from "@/lib/progress"
import type { LeanGroup, LeanNode } from "@/data/sample-roadmaps"
import { StepNode } from "./StepNode"
import styles from "./Roadmap.module.css"

type Props = { slug: string; groups: LeanGroup[]; selectedId?: string }

export function RoadmapTree({ slug, groups, selectedId }: Props) {
    const { nodes } = useProgress()

    // Renders one node as a link to its deep URL, or nothing for an empty slot
    function renderNode(node?: LeanNode) {
        if (!node) return null
        return <StepNode node={node} href={`/roadmaps/${slug}/${node.id}`} done={Boolean(nodes[nodeKey(slug, node.id)])} selected={node.id === selectedId} />
    }

    return (
        <div className={styles.tree}>
            <div className={styles.spine} aria-hidden="true" />
            {groups.map((group) => (
                <section key={group.label} aria-label={group.label}>
                    <div className={styles.labelRow}><span className={styles.label}>{group.label}</span></div>
                    <div className={styles.mainRow}>{renderNode(group.main)}</div>
                    {group.rows.map((row, i) => (
                        <div key={i}>
                            {row.choose ? <div className={styles.chooseRow}><span className={styles.choose}>Choose one</span></div> : null}
                            <div className={styles.row}>
                                <div className={`${styles.side} ${styles.sideStart}`}>
                                    {row.left ? <>{renderNode(row.left)}<span className={styles.cn} /></> : null}
                                </div>
                                <div className={`${styles.side} ${styles.sideEnd}`}>
                                    {row.right ? <><span className={styles.cn} />{renderNode(row.right)}</> : null}
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            ))}
        </div>
    )
}