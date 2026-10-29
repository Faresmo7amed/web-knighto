import Link from "next/link"
import { Icon } from "@/components/ui/Icon"
import type { LeanNode } from "@/data/sample-roadmaps"
import styles from "./Roadmap.module.css"

type Props = { node: LeanNode; href: string; done: boolean; selected: boolean }

export function StepNode({ node, href, done, selected }: Props) {
    const classes = [styles.node, styles[node.kind], done && styles.done, node.locked && styles.locked, selected && styles.selected]
    const icon = done ? "circle-check" : node.locked ? "lock" : node.kind === "rec" ? "star" : null

    return (
        <Link href={href} scroll={false} className={classes.filter(Boolean).join(" ")} aria-current={selected ? "page" : undefined}>
            {icon ? <span className={styles.nodeIcon}><Icon name={icon} /></span> : null}
            <span className={styles.nodeText}>{node.title}</span>
            {done ? <span className={styles.srOnly}>, completed</span> : null}
        </Link>
    )
}