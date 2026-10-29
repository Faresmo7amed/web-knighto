'use client'

import Link from 'next/link'
import type { SyntheticEvent } from 'react'
import type { TreeNode } from '@/data/sample-tree'
import { Icon } from '@/components/ui/Icon'
import styles from './NestedSidebar.module.css'

type SidebarColumnProps = {
    level: number // 1 to 4. Only level 1 shows icons
    title: string
    items: TreeNode[]
    parentHref: string // item URL = parentHref + "/" + slug
    activeSlug?: string // the item of this column that is on the current path
    currentHere: boolean // true when the current page itself is in this column
    fromEnd: number // 0 = newest column. CSS uses it to hide older ones
    collapsed?: boolean // true = shown as a thin strip
    onToggle?: () => void // opens or closes this column. No button when missing
    pinned?: boolean // only passed to column 1. Shows the pin button
    onTogglePin?: () => void
}

// Adds a native tooltip only when the title is really cut off by the ellipsis.
// Use on hover and focus of a sidebar item.
function syncTitle(event: SyntheticEvent<HTMLAnchorElement>) {
    const link = event.currentTarget
    const text = link.querySelector<HTMLElement>('[data-text]')
    if (text && text.scrollWidth > text.clientWidth) link.title = text.textContent ?? ''
    else link.removeAttribute('title')
}

export function SidebarColumn({ level, title, items, parentHref, activeSlug, currentHere, fromEnd, collapsed = false, onToggle, pinned, onTogglePin }: SidebarColumnProps) {
    // Closed: a thin strip with an expand button and the title written vertically
    if (collapsed) {
        return (
            <div className={styles.strip} role="group" aria-label={title} data-from-end={fromEnd}>
                <button type="button" className={styles.colBtn} onClick={onToggle} aria-expanded={false} aria-label={`Expand ${title}`}>
                    <Icon name="chevronRight" size={16} />
                </button>
                <span className={styles.stripTitle}>{title}</span>
            </div>
        )
    }

    return (
        <div className={styles.col} role="group" aria-label={title} data-from-end={fromEnd}>
                        <div className={styles.heading}>
                <span>{title}</span>
                <span className={styles.headingActions}>
                    {onTogglePin && (
                        <button
                            type="button"
                            className={styles.colBtn}
                            onClick={onTogglePin}
                            aria-pressed={pinned}
                            aria-label={pinned ? 'Unpin sidebar (collapse to rail)' : 'Pin sidebar open'}
                            title={pinned ? 'Unpin sidebar' : 'Pin sidebar open'}
                        >
                            <Icon name="pin" size={16} />
                        </button>
                    )}
                    {onToggle && (
                        <button type="button" className={styles.colBtn} onClick={onToggle} aria-expanded={true} aria-label={`Collapse ${title}`}>
                            <Icon name="chevronLeft" size={16} />
                        </button>
                    )}
                </span>
            </div>
            <ul className={styles.list}>
                {items.map((item) => {
                    const active = item.slug === activeSlug
                    const current = active && currentHere
                    const hasChildren = Boolean(item.children?.length)

                    return (
                        <li key={item.slug}>
                            <Link
                                href={`${parentHref}/${item.slug}`}
                                className={styles.item}
                                aria-current={current ? 'page' : undefined}
                                data-state={active && !current ? 'expanded' : undefined}
                                onPointerEnter={syncTitle}
                                onFocus={syncTitle}
                            >
                                <span className={styles.label}>
                                    {level === 1 && item.icon && <Icon name={item.icon} />}
                                    <span className={styles.text} data-text>
                                        {item.title}
                                    </span>
                                </span>
                                {(item.badge || hasChildren) && (
                                    <span className={styles.trailing}>
                                        {item.badge && <span className={styles.badge}>{item.badge}</span>}
                                        {hasChildren && (
                                            <span className={styles.chevron}>
                                                <Icon name="chevronRight" size={16} />
                                            </span>
                                        )}
                                    </span>
                                )}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}