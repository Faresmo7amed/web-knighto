import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { Icon } from '@/components/ui/Icon'
import type { PageLink } from '@/lib/tree'
import styles from './ArticleContent.module.css'

type ArticleFooterProps = {
    prev?: PageLink
    next?: PageLink
}

// Previous / Next cards (titles of the neighbouring pages) and the quiet "Follow me" line.
export function ArticleFooter({ prev, next }: ArticleFooterProps) {
    return (
        <footer className={styles.footer}>
            {(prev || next) && (
                <nav aria-label="Previous and next page" className={styles.prevNext}>
                    {prev && (
                        <Link href={prev.href} className={styles.pnCard}>
                            <span className={styles.pnLabel}>
                                <Icon name="arrowLeft" /> Previous
                            </span>
                            <span className={styles.pnTitle}>{prev.title}</span>
                        </Link>
                    )}
                    {next && (
                        <Link href={next.href} className={`${styles.pnCard} ${styles.pnNext}`}>
                            <span className={styles.pnLabel}>
                                Next <Icon name="arrowRight" />
                            </span>
                            <span className={styles.pnTitle}>{next.title}</span>
                        </Link>
                    )}
                </nav>
            )}
            <div className={styles.follow}>
                Follow me
                {siteConfig.socialLinks.map((social) => (
                    <a key={social.id} href={social.href} className="icon-btn" aria-label={social.label}>
                        <Icon name={social.icon} />
                    </a>
                ))}
            </div>
        </footer>
    )
}