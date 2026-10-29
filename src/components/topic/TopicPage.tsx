import Link from "next/link"
import type { TreeNode, TreeSection } from "@/data/sample-tree"
import { collectLeaves, pageHref } from "@/lib/section-landing"
import { getTopicMeta } from "@/lib/topic"
import { Icon } from "@/components/ui/Icon"
import { FollowMe } from "@/components/section/FollowMe"
import { TopicChildCard } from "./TopicChildCard"
import styles from "./TopicPage.module.css"

export function TopicPage({ section, node }: { section: TreeSection; node: TreeNode }) {
    const children = node.children ?? []
    const meta = getTopicMeta(node)
    const first = collectLeaves(section, children, [node.slug], [node.title])[0]
    const banner = (node as { banner?: string }).banner

    return (
        <article className={styles.wrap}>
            <nav aria-label="Breadcrumb" className={styles.crumbs}>
                <Link href={pageHref(section, [])} className={styles.crumbLink}>{section.title}</Link>
                <Icon name="chevron-right" />
                <span className={styles.crumbCurrent}>{node.title}</span>
            </nav>

            <div
                className={styles.banner}
                role="img"
                aria-label="Banner"
                style={banner ? { backgroundImage: `url(${banner})` } : undefined}
            />
            {node.icon ? <div className={styles.icon}><Icon name={node.icon} /></div> : null}

            <h1 className={styles.title}>{`Introduction to ${node.title}`}</h1>
            <p className={styles.lead}>
                {(node as { description?: string }).description ?? `What ${node.title} is, and how this topic is organised.`}
            </p>
            <div className={styles.meta}>
                <span className={styles.tags}>
                    {meta.tags.map((tag) => <span key={tag} className={styles.chip}>{tag}</span>)}
                </span>
                <span>Updated {meta.updated}</span>
                <span>{meta.minutes} min read</span>
            </div>
            {first ? (
                <Link href={first.href} className={styles.primary}>
                    Start reading
                    <Icon name="arrow-right" />
                </Link>
            ) : null}

            <div className={styles.body}>
                <h2 id="overview" className={styles.h2}>Overview</h2>
                <p>This topic starts from the basics and builds up. Each page ends with a link to the next one, so you can read straight through or jump to what you need.</p>
                <h2 id="learn" className={styles.h2}>What you will learn</h2>
                <ul className={styles.list}>
                    {children.slice(0, 4).map((c) => <li key={c.slug}>{`Understand ${c.title.toLowerCase()}`}</li>)}
                </ul>
                <h2 id="pages" className={styles.h2Last}>In this topic</h2>
            </div>

            <div className={styles.grid}>
                {children.map((c) => (
                    <TopicChildCard
                        key={c.slug}
                        title={c.title}
                        href={pageHref(section, [node.slug, c.slug])}
                        description={(c as { description?: string }).description ?? (c.children ?? []).slice(0, 3).map((x) => x.title).join(" · ")}
                    />
                ))}
            </div>

            <FollowMe />
        </article>
    )
}