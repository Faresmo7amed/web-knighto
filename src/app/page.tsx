import Link from 'next/link'
import { HeroSearchHint } from '@/components/home/HeroSearchHint'
import { Icon } from '@/components/ui/Icon'
import { siteConfig } from '@/config/site'
import { homeArticles, homeRoadmaps, homeSections } from '@/data/sample-home'
import styles from '@/components/home/Home.module.css'
import { CompactProgress } from '@/components/progress/CompactProgress'
import { getSectionProgressData } from '@/lib/progress-data'

// Home: hero, section cards, latest articles, featured roadmaps and a progress summary.
export default function Home() {
    return (
        <main id="main-content">
            <section className={styles.hero} aria-labelledby="hero-title">
                <div className={styles.heroInner}>
                    <div className={styles.eyebrow}>{siteConfig.name}</div>
                    <h1 id="hero-title" className={styles.heroTitle}>
                        Notes, guides and roadmaps for learning to build the web
                    </h1>
                    <p className={styles.heroText}>Articles, cheat sheets and step-by-step roadmaps, written to be read slowly and kept for reference.</p>
                    <div className={styles.actions}>
                        <Link href="/frontend" className={styles.primary}>
                            Browse topics <Icon name="arrowRight" />
                        </Link>
                        <Link href="/roadmaps" className={styles.secondary}>
                            View roadmaps
                        </Link>
                        <HeroSearchHint />
                    </div>
                    <div className={styles.socials}>
                        {siteConfig.socialLinks.map((social) => (
                            <a key={social.id} href={social.href} className="icon-btn" aria-label={social.label}>
                                <Icon name={social.icon} />
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <div className={styles.content}>
                <section aria-labelledby="sections-title">
                    <div className={styles.sectionHead}>
                        <h2 id="sections-title" className={styles.sectionTitle}>Sections</h2>
                        <Link href="/frontend">All topics</Link>
                    </div>
                    <div className={styles.grid}>
                        {homeSections.map((section) => (
                            <Link key={section.slug} href={`/${section.slug}`} className={styles.card}>
                                <span className={styles.cardIcon}>
                                    <Icon name={section.icon} />
                                </span>
                                <span className={styles.cardTitle}>{section.title}</span>
                                <span className={styles.cardText}>{section.description}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section aria-labelledby="latest-title">
                    <div className={styles.sectionHead}>
                        <h2 id="latest-title" className={styles.sectionTitle}>Latest articles</h2>
                        <Link href="/frontend">All articles</Link>
                    </div>
                    <div className={`${styles.grid} ${styles.gridWide}`}>
                        {homeArticles.map((article) => (
                            <Link key={article.href} href={article.href} className={styles.card}>
                                <span className={styles.small}>{article.path}</span>
                                <span className={styles.articleTitle}>{article.title}</span>
                                <span className={styles.excerpt}>{article.excerpt}</span>
                                <span className={`${styles.small} ${styles.faint}`}>{article.meta}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section aria-labelledby="roadmaps-title">
                    <div className={styles.sectionHead}>
                        <h2 id="roadmaps-title" className={styles.sectionTitle}>Featured roadmaps</h2>
                        <Link href="/roadmaps">All roadmaps</Link>
                    </div>
                    <div className={`${styles.grid} ${styles.gridWide}`}>
                        {homeRoadmaps.map((roadmap) => (
                            <Link key={roadmap.title} href={roadmap.href} className={styles.card}>
                                <span className={styles.tag}>ROADMAP</span>
                                <span className={styles.articleTitle}>{roadmap.title}</span>
                                <span className={styles.cardText}>{roadmap.description}</span>
                                <span className={styles.small}>{roadmap.topicCount} topics</span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section aria-labelledby="progress-title">
                    <div className={styles.sectionHead}>
                        <h2 id="progress-title" className={styles.sectionTitle}>Your progress</h2>
                        <Link href="/progress">Full progress page</Link>
                    </div>
                    <CompactProgress sections={getSectionProgressData()} />
                </section>
            </div>
        </main>
    )
}
