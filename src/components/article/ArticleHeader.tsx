import Link from 'next/link'
import { siteConfig } from '@/config/site'
import type { TreeNode, TreeSection } from '@/data/sample-tree'
import { Icon } from '@/components/ui/Icon'
import { sampleMeta } from '@/lib/content'
import { nodeHref } from '@/lib/tree'
import styles from './ArticleContent.module.css'

type ArticleHeaderProps = {
    section: TreeSection
    trail: TreeNode[]
    minutes: number
}

// Breadcrumb (same path as the sidebar), title, subtitle and the meta row.
export function ArticleHeader({ section, trail, minutes }: ArticleHeaderProps) {
    const crumbs = [
        { label: section.title, href: `/${section.slug}` },
        ...trail.map((node, index) => ({ label: node.title, href: nodeHref(section.slug, trail.slice(0, index + 1)) })),
    ]
    const title = crumbs[crumbs.length - 1].label

    return (
        <header className={styles.header}>
            <nav aria-label="Breadcrumb">
                <ol className={styles.crumbs}>
                    {crumbs.map((crumb, index) =>
                        index < crumbs.length - 1 ? (
                            <li key={crumb.href}>
                                <Link href={crumb.href} className={styles.crumbLink}>
                                    {crumb.label}
                                </Link>
                                <Icon name="chevronRight" size={16} />
                            </li>
                        ) : (
                            <li key={crumb.href} aria-current="page" className={styles.crumbCurrent}>
                                {crumb.label}
                            </li>
                        ),
                    )}
                </ol>
            </nav>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{sampleMeta.subtitle}</p>
            <div className={styles.meta}>
                <span>By {siteConfig.ownerName}</span>
                <span>Published {sampleMeta.published}</span>
                <span>Updated {sampleMeta.updated}</span>
                <span>{minutes} min read</span>
                <span className={styles.tags}>
                    {sampleMeta.tags.map((tag) => (
                        <span key={tag} className={styles.chip}>
                            {tag}
                        </span>
                    ))}
                </span>
            </div>
        </header>
    )
}