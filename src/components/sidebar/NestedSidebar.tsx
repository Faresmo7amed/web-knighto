'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import type { TreeNode, TreeSection } from '@/data/sample-tree'
import { Icon } from '@/components/ui/Icon'
import { useStoredString } from '@/lib/use-stored-string'
import { MAX_LEVELS, getTrail, nodeHref, slugsFromPathname } from '@/lib/tree'
import { SidebarColumn } from './SidebarColumn'
import styles from './NestedSidebar.module.css'

type Column = { title: string; items: TreeNode[]; parentHref: string }

// Opens one column per level on the current path (max 4). The URL decides which columns exist.
// Two saved choices on top of that: pinned (wide) or rail + hover overlay, and which columns are thin strips.
export function NestedSidebar({ section }: { section: TreeSection }) {
    const pathname = usePathname()
    const trail = getTrail(section, slugsFromPathname(pathname))

    const [pinnedRaw, setPinnedRaw] = useStoredString('sidebar-pinned', 'true')
    const pinned = pinnedRaw === 'true'

    const [collapsedRaw, setCollapsedRaw] = useStoredString('sidebar-collapsed', '{}')
    const collapsed = useMemo<Record<number, boolean>>(() => {
        try {
            return JSON.parse(collapsedRaw)
        } catch {
            return {}
        }
    }, [collapsedRaw])
    
        // True after Esc, until the pointer leaves or focus comes back. Keeps the overlay closed while the mouse is still over it.
    const [dismissed, setDismissed] = useState(false)

    // Esc closes the hover overlay and drops keyboard focus out of the sidebar. Use on the sidebar's key events.
    function onKeyDown(event: React.KeyboardEvent) {
        if (event.key !== 'Escape' || pinned) return
        setDismissed(true)
        ;(document.activeElement as HTMLElement | null)?.blur()
    }

    // Pins the sidebar open, or collapses it to the rail. Use from the pin button and the rail button.
    function togglePin() {
        setPinnedRaw(pinned ? 'false' : 'true')
    }

    // Opens or closes one column by its level (1 to 4). Use from a column's header button.
    function toggleColumn(level: number) {
        setCollapsedRaw(JSON.stringify({ ...collapsed, [level]: !collapsed[level] }))
    }

    // Column 1 is the section itself; each node on the path that has children adds one more
    const columns: Column[] = [{ title: section.title, items: section.children, parentHref: `/${section.slug}` }]
    trail.forEach((node, index) => {
        if (node.children?.length) {
            columns.push({ title: node.title, items: node.children, parentHref: nodeHref(section.slug, trail.slice(0, index + 1)) })
        }
    })
    const visible = columns.slice(0, MAX_LEVELS)

    return (
        <div
            className={styles.sidebar}
            data-count={visible.length}
            data-pinned={pinned}
            data-dismissed={dismissed}
            onKeyDown={onKeyDown}
            onPointerLeave={() => setDismissed(false)}
            onFocus={() => setDismissed(false)}
        >
            {/* Thin rail: always there when unpinned, and swapped in by CSS when pinned columns do not fit */}
            <nav className={styles.rail} aria-label={`${section.title} topics`}>
                <button type="button" className={`${styles.railLink} ${styles.railPin}`} onClick={togglePin} aria-label="Pin sidebar open" title="Pin sidebar open">
                    <Icon name="chevronRight" size={16} />
                </button>
                {section.children.map((item) => (
                    <Link
                        key={item.slug}
                        href={`/${section.slug}/${item.slug}`}
                        className={styles.railLink}
                        data-active={item.slug === trail[0]?.slug ? 'true' : undefined}
                        aria-label={item.title}
                        title={item.title}
                    >
                        {item.icon ? <Icon name={item.icon} /> : item.title.charAt(0)}
                    </Link>
                ))}
            </nav>

            {/* Unpinned: this block floats over the content while the rail is hovered or focused */}
            <div className={styles.columns}>
                {visible.map((column, index) => (
                    <SidebarColumn
                        key={`${index}-${column.parentHref}`}
                        level={index + 1}
                        title={column.title}
                        items={column.items}
                        parentHref={column.parentHref}
                        activeSlug={trail[index]?.slug}
                        currentHere={index === trail.length - 1}
                        fromEnd={visible.length - 1 - index}
                        collapsed={Boolean(collapsed[index + 1])}
                        onToggle={() => toggleColumn(index + 1)}
                        pinned={index === 0 ? pinned : undefined}
                        onTogglePin={index === 0 ? togglePin : undefined}
                    />
                ))}
            </div>
        </div>
    )
}