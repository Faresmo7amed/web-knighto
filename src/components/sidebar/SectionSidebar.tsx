import { Suspense } from 'react'
import type { TreeSection } from '@/data/sample-tree'
import { NestedSidebar } from './NestedSidebar'
import { SidebarColumn } from './SidebarColumn'
import styles from './NestedSidebar.module.css'

// Column 1 without any highlight. Shown for a moment while the URL is read.
function SidebarFallback({ section }: { section: TreeSection }) {
    return (
        <div className={styles.sidebar} data-count={1} data-pinned={true}>
            <div className={styles.columns}>
                <SidebarColumn level={1} title={section.title} items={section.children} parentHref={`/${section.slug}`} currentHere={false} fromEnd={0} />
            </div>
        </div>
    )
}

// Wraps the sidebar in Suspense. Use this in layouts instead of NestedSidebar directly.
export function SectionSidebar({ section }: { section: TreeSection }) {
    return (
        <Suspense fallback={<SidebarFallback section={section} />}>
            <NestedSidebar section={section} />
        </Suspense>
    )
}