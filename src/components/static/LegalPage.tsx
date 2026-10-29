import Link from "next/link"
import { siteConfig } from "@/config/site"
import type { LegalDoc } from "@/data/legal"
import { Icon } from "@/components/ui/Icon"
import { LegalToc } from "./LegalToc"
import styles from "./Static.module.css"

export function LegalPage({ doc }: { doc: LegalDoc }) {
    return (
        <div className={styles.page}>
            <article className={styles.article}>
                <nav aria-label="Breadcrumb" className={styles.crumbs}>
                    <Link href="/">Home</Link>
                    <Icon name="chevron-right" />
                    <span className={styles.crumbCurrent}>{doc.title}</span>
                </nav>
                <h1 className={`${styles.title} ${styles.titleTight}`}>{doc.title}</h1>
                <p className={styles.updated}>Last updated: {siteConfig.legalUpdated}</p>
                <p className={styles.lead}>{doc.lead}</p>

                <div className={styles.body}>
                    {doc.sections.map((section, i) => (
                        <section key={section.id} id={section.id} className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <span>{`${i + 1}. ${section.title}`}</span>
                                <a className={styles.anchor} href={`#${section.id}`} aria-label="Link to this heading">#</a>
                            </h2>
                            {section.paragraphs.map((text) => <p key={text}>{text}</p>)}
                        </section>
                    ))}
                </div>

                {siteConfig.legalDraft ? (
                    <div className={`${styles.callout} ${styles.calloutDraft}`}>
                        <span className={styles.calloutIcon}><Icon name="triangle-alert" /></span>
                        <div>
                            <b>Draft text</b>
                            This text is a draft and has not been reviewed by a lawyer. Review and edit it before launch. Set legalDraft to false in src/config/site.ts to hide this notice.
                        </div>
                    </div>
                ) : null}
            </article>
            <LegalToc items={doc.sections.map(({ id, title }) => ({ id, title }))} />
        </div>
    )
}