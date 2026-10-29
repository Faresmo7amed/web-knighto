import Link from "next/link"
import type { Metadata } from "next"
import { siteConfig } from "@/config/site"
import { Icon } from "@/components/ui/Icon"
import { StaticShell } from "@/components/static/StaticShell"
import styles from "@/components/static/Static.module.css"

export const metadata: Metadata = { title: "About" }

export default function AboutRoute() {
    return (
        <StaticShell>
            <div className={styles.pageSolo}>
                <article className={styles.articleSolo}>
                    <nav aria-label="Breadcrumb" className={styles.crumbs}>
                        <Link href="/">Home</Link>
                        <Icon name="chevron-right" />
                        <span className={styles.crumbCurrent}>About</span>
                    </nav>
                    <h1 className={styles.title}>About</h1>

                    <div className={styles.profile}>
                        <span className={styles.avatar} aria-hidden="true">{siteConfig.ownerInitials}</span>
                        <div className={styles.profileText}>
                            <span className={styles.ownerName}>{siteConfig.ownerName}</span>
                            <span className={styles.ownerRole}>{siteConfig.ownerRole}</span>
                            <div className={styles.profileIcons}>
                                {siteConfig.socialLinks.map((link) => (
                                    <a key={link.label} href={link.href} className="icon-btn" aria-label={link.label}>
                                        <Icon name={link.icon} />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <Link href="/contact" className={styles.btn}>Contact me</Link>
                    </div>

                    <div className={styles.body}>
                        <h2 className={`${styles.h2} ${styles.h2First}`}>About this site</h2>
                        <p>This is a personal place to publish what I learn: articles, notes, cheat sheets and roadmaps. Everything is written to be read slowly and kept for reference.</p>
                        <p>There are no accounts and no tracking beyond what is needed to show your reading progress, which stays in your browser.</p>
                        <h2 className={styles.h2}>About me</h2>
                        <p style={{ color: "var(--text-muted)" }}>{siteConfig.aboutMe}</p>
                        <h2 className={styles.h2}>What you will find here</h2>
                        <ul>
                            <li>Articles and explanations, organised by topic</li>
                            <li>Cheat sheets for quick reference</li>
                            <li>Roadmaps with study notes for every step</li>
                            <li>A progress page that remembers what you have read</li>
                        </ul>
                        <div className={`${styles.callout} ${styles.calloutInfo}`}>
                            <span className={styles.calloutIcon}><Icon name="lightbulb" /></span>
                            <div>
                                <b>Found a mistake?</b>
                                Tell me through the contact page and I will fix it.
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </StaticShell>
    )
}