'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { TreeSection } from '@/data/sample-tree'
import { Icon } from '@/components/ui/Icon'
import { MAX_LEVELS, getLevel, getTrail, nodeHref, slugsFromPathname } from '@/lib/tree'
import styles from './MobileNav.module.css'

type MobileDrawerProps = {
    section: TreeSection
    onClose: () => void
}

// Slide-in drawer that shows ONE level of the tree at a time.
// A row's link opens that page; its arrow button goes one level deeper; Back goes up.
export function MobileDrawer({ section, onClose }: MobileDrawerProps) {
    const pathname = usePathname()
    const openedAt = useRef(pathname)
    const panelRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLDivElement>(null)
    const firstRun = useRef(true)

    // Start at the level that contains the current page
    const [path, setPath] = useState<string[]>(() =>
        getTrail(section, slugsFromPathname(pathname))
            .slice(0, -1)
            .map((node) => node.slug),
    )
    // Which way the last move went. CSS uses it to slide the list in from the right side.
    const [direction, setDirection] = useState<'forward' | 'back'>('forward')

    // Goes one level deeper into an item. Use from a row's arrow button.
    function drillInto(slug: string) {
        setDirection('forward')
        setPath((current) => [...current, slug])
    }

    // Goes one level up. Use from the Back button.
    function goBack() {
        setDirection('back')
        setPath((current) => current.slice(0, -1))
    }

    // Focus trap, Esc, scroll lock, and closing when the screen becomes desktop-wide
    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        panelRef.current?.focus()

        const wide = window.matchMedia('(min-width: 900px)')
        function onWide(event: MediaQueryListEvent) {
            if (event.matches) onClose()
        }
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose()
                return
            }
            if (event.key !== 'Tab' || !panelRef.current) return
            // Keep Tab inside the drawer
            const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
            if (focusable.length === 0) return
            const first = focusable[0]
            const last = focusable[focusable.length - 1]
            const active = document.activeElement
            if (event.shiftKey && (active === first || active === panelRef.current)) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && active === last) {
                event.preventDefault()
                first.focus()
            }
        }

        window.addEventListener('keydown', onKeyDown, true)
        wide.addEventListener('change', onWide)
        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', onKeyDown, true)
            wide.removeEventListener('change', onWide)
        }
    }, [onClose])

    // Browser Back/Forward while the drawer is open: close it
    useEffect(() => {
        if (pathname !== openedAt.current) onClose()
    }, [pathname, onClose])

    // After changing level, move focus to the new level title so keyboard and screen reader users keep their place
    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false
            return
        }
        titleRef.current?.focus()
    }, [path])

    const { title, items, trail } = getLevel(section, path)
    const baseHref = nodeHref(section.slug, trail)
    const depth = path.length

    return (
        <div className={styles.root}>
            <div className={styles.backdrop} onClick={onClose} />
            <div ref={panelRef} className={styles.panel} role="dialog" aria-modal="true" aria-label={`${section.title} pages`} tabIndex={-1}>
                <div className={styles.head}>
                    {depth > 0 ? (
                        <button type="button" className={styles.back} onClick={goBack}>
                            <Icon name="chevronLeft" /> Back
                        </button>
                    ) : (
                        <span className={styles.headTitle}>Pages</span>
                    )}
                    <button type="button" className="icon-btn" onClick={onClose} aria-label="Close pages">
                        <Icon name="close" />
                    </button>
                </div>

                <div ref={titleRef} className={styles.levelTitle} tabIndex={-1}>
                    {title}
                </div>
                {/* key = current level, so the list re-mounts and plays the slide animation */}
                <ul key={path.join('/')} className={styles.list} data-direction={direction}>
                    {items.map((item) => {
                        const href = `${baseHref}/${item.slug}`
                        const current = pathname === href
                        const parentOfCurrent = pathname.startsWith(href + '/')
                        // Items on level 4 cannot go deeper
                        const canDrill = Boolean(item.children?.length) && depth < MAX_LEVELS - 1

                        return (
                            <li key={item.slug} className={styles.row}>
                                <Link href={href} className={styles.rowLink} aria-current={current ? 'page' : undefined} data-state={parentOfCurrent ? 'expanded' : undefined} onClick={onClose}>
                                    <span className={styles.label}>
                                        {depth === 0 && item.icon && <Icon name={item.icon} />}
                                        <span className={styles.text}>{item.title}</span>
                                    </span>
                                    {item.badge && <span className={styles.badge}>{item.badge}</span>}
                                </Link>
                                {canDrill && (
                                    <button type="button" className={styles.drill} aria-label={`Open ${item.title} sub-pages`} onClick={() => drillInto(item.slug)}>
                                        <Icon name="chevronRight" size={16} />
                                    </button>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}