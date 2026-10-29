import Link from "next/link"
import type { TreeSection } from "@/data/sample-tree"
import { sampleCheatSheet as sheet } from "@/data/sample-cheatsheet"
import { Icon } from "@/components/ui/Icon"
import { FollowMe } from "@/components/section/FollowMe"
import { CheatGroupCard } from "./CheatGroupCard"
import { PrintButton } from "./PrintButton"
import styles from "./CheatSheet.module.css"

export function CheatSheetPage({ section, trail }: { section: TreeSection; trail: string[] }) {
    return (
        <article className={styles.wrap}>
            <nav aria-label="Breadcrumb" className={styles.crumbs}>
                <span>{section.title}</span>
                {trail.map((title, i) => (
                    <span key={title} className={styles.crumbItem}>
                        <Icon name="chevron-right" />
                        <span className={i === trail.length - 1 ? styles.crumbCurrent : undefined}>{title}</span>
                    </span>
                ))}
            </nav>

            <div className={styles.titleRow}>
                <h1 className={styles.title}>{sheet.title}</h1>
                <PrintButton />
            </div>
            <p className={styles.lead}>{sheet.lead}</p>
            <div className={styles.meta}>
                <span>By {sheet.author}</span>
                <span>Updated {sheet.updated}</span>
                <span>{sheet.minutes} min read</span>
                <span className={styles.tags}>
                    {sheet.tags.map((t) => <span key={t} className={styles.chip}>{t}</span>)}
                </span>
            </div>

            <div className={styles.callout}>
                <span className={styles.calloutIcon}><Icon name="lightbulb" /></span>
                <div>
                    <b>{sheet.callout.title}</b>
                    {sheet.callout.text}
                </div>
            </div>

            <div className={styles.grid}>
                {sheet.groups.map((g) => <CheatGroupCard key={g.id} group={g} />)}
            </div>

            <section id="chain" className={styles.chain}>
                <h2 className={styles.h2}>Chaining</h2>
                <div className={styles.code}>
                    <div className={styles.codeHead}>{sheet.chain.file}</div>
                    <pre className={styles.pre}>{sheet.chain.code}</pre>
                </div>
            </section>

            <nav aria-label="Previous and next" className={styles.pager}>
                <Link href={sheet.prev.href} className={styles.pageCard}>
                    <span className={styles.pageDir}><Icon name="arrow-left" /> Previous</span>
                    <span className={styles.pageTitle}>{sheet.prev.title}</span>
                </Link>
                <Link href={sheet.next.href} className={`${styles.pageCard} ${styles.pageNext}`}>
                    <span className={styles.pageDir}>Next <Icon name="arrow-right" /></span>
                    <span className={styles.pageTitle}>{sheet.next.title}</span>
                </Link>
            </nav>

            <FollowMe />
        </article>
    )
}