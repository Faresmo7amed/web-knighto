'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { TreeSection } from '@/data/sample-tree'
import { Icon } from '@/components/ui/Icon'
import { MobileDrawer } from './MobileDrawer'
import styles from './MobileNav.module.css'

// Sticky "Pages" bar under the nav bar (hidden at 900px and wider) that opens the pages drawer.
export function MobileSectionNav({ section }: { section: TreeSection }) {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const wasOpen = useRef(false)

    // Closes the drawer. Stable identity, so the drawer's effects do not re-run on every render.
    const close = useCallback(() => setOpen(false), [])

    // After the drawer has really closed, put keyboard focus back on the button that opened it
    useEffect(() => {
        if (wasOpen.current && !open) triggerRef.current?.focus()
        wasOpen.current = open
    }, [open])

    return (
        <>
            <div className={styles.bar}>
                <button ref={triggerRef} type="button" className={styles.trigger} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
                    <Icon name="menu" /> {section.title} pages
                </button>
            </div>
            {open && (
                <Suspense fallback={null}>
                    <MobileDrawer section={section} onClose={close} />
                </Suspense>
            )}
        </>
    )
}