import type { TreeSection } from "@/data/sample-tree"
import { getHighlights, pageHref } from "@/lib/section-landing"
import { LandingCard } from "./LandingCard"
import { LandingList } from "./LandingList"
import { FollowMe } from "./FollowMe"
import styles from "./SectionLanding.module.css"

export function SectionLanding({ section }: { section: TreeSection }) {
    const { popular, latest } = getHighlights(section)

    return (
        <article className={styles.wrap}>
            <nav aria-label="Breadcrumb" className={styles.crumbs}>
                <span className={styles.crumbCurrent}>{section.title}</span>
            </nav>
            <h1 className={styles.title}>{section.title}</h1>
            <p className={styles.lead}>{section.description ?? `Everything in ${section.title}, in reading order.`}</p>

            <h2 id="topics" className={styles.h2}>Topics</h2>
            <div className={styles.grid}>
                {section.children.map((node) => (
                    <LandingCard
                        key={node.slug}
                        title={node.title}
                        icon={node.icon}
                        description={node.description ?? (node.children ?? []).slice(0, 3).map((c) => c.title).join(" · ")}
                        href={pageHref(section, [node.slug])}
                    />
                ))}
            </div>

            <div className={styles.twoCol}>
                <LandingList id="latest" title="Latest" items={latest} />
                <LandingList id="popular" title="Popular" items={popular} />
            </div>

            <FollowMe />
        </article>
    )
}