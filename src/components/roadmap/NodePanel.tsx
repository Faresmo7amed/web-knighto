import Link from "next/link"
import { Icon } from "@/components/ui/Icon"
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer"
import { getNeighbors, type Roadmap, type RoadmapNode } from "@/data/sample-roadmaps"
import { nodeKey } from "@/lib/progress-keys"
import { PanelFrame } from "./PanelFrame"
import styles from "./RoadmapPanel.module.css"

const TYPE_ICON = { docs: "file-text", article: "file-text", video: "circle-play" } as const
const TYPE_LABEL = { docs: "Docs", article: "Article", video: "Video" } as const

export function NodePanel({ roadmap, node }: { roadmap: Roadmap; node: RoadmapNode }) {
    const { prev, next } = getNeighbors(roadmap, node.id)
    const base = `/roadmaps/${roadmap.slug}`

    return (
        <PanelFrame key={node.id} closeHref={base} title={node.title} description={node.description} path={`${base}/${node.id}`} nodeKey={nodeKey(roadmap.slug, node.id)}>
            <section className={styles.section}>
                <h3 className={styles.h3}>Study notes</h3>
                <MarkdownRenderer markdown={node.study} />
            </section>

            {node.resources.length > 0 ? (
                <section className={styles.section}>
                    <h3 className={styles.h3}>Resources</h3>
                    {node.resources.map((res) => (
                        <a key={res.href + res.title} href={res.href} className={styles.resource} target="_blank" rel="noopener noreferrer">
                            <span className={styles.resourceIcon}><Icon name={TYPE_ICON[res.type]} /></span>
                            <span className={styles.resourceTitle}>{res.title}</span>
                            <span className={styles.tag}>{TYPE_LABEL[res.type]}</span>
                        </a>
                    ))}
                </section>
            ) : null}

            {node.related.length > 0 ? (
                <section className={styles.section}>
                    <h3 className={styles.h3}>Related on this site</h3>
                    {node.related.map((link) => <Link key={link.href} href={link.href} className={styles.related}>{link.title}</Link>)}
                </section>
            ) : null}

            <div className={styles.pager}>
                {prev ? (
                    <Link href={`${base}/${prev.id}`} scroll={false} className={styles.pageCard}>
                        <span className={styles.pageDir}><Icon name="arrow-left" /> Previous</span>
                        <span className={styles.pageTitle}>{prev.title}</span>
                    </Link>
                ) : <span />}
                {next ? (
                    <Link href={`${base}/${next.id}`} scroll={false} className={`${styles.pageCard} ${styles.pageNext}`}>
                        <span className={styles.pageDir}>Next <Icon name="arrow-right" /></span>
                        <span className={styles.pageTitle}>{next.title}</span>
                    </Link>
                ) : <span />}
            </div>
        </PanelFrame>
    )
}