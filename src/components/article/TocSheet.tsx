'use client'

import { useEffect, useRef } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { Heading } from '@/lib/headings'
import { useDialog } from '@/lib/use-dialog'
import { ProgressMeter, TocList } from './OnThisPage'
import styles from './ArticleShell.module.css'

type TocSheetProps = {
    headings: Heading[]
    activeId: string
    progress: number
    minutes: number
    onClose: () => void
}

// Bottom sheet with "On this page" for tablet and mobile. Tapping a heading scrolls to it and closes the sheet.
export function TocSheet({ headings, activeId, progress, minutes, onClose }: TocSheetProps) {
    const panelRef = useRef<HTMLDivElement>(null)
    useDialog(panelRef, onClose)

    // Close if the window becomes wide enough for the sidebar
    useEffect(() => {
        const wide = window.matchMedia('(min-width: 1100px)')
        function onWide(event: MediaQueryListEvent) {
            if (event.matches) onClose()
        }
        wide.addEventListener('change', onWide)
        return () => wide.removeEventListener('change', onWide)
    }, [onClose])

    return (
        <div className={styles.sheetRoot}>
            <div className={styles.sheetBackdrop} onClick={onClose} />
            <div ref={panelRef} className={styles.sheet} role="dialog" aria-modal="true" aria-label="On this page" tabIndex={-1}>
                <div className={styles.handle} />
                <div className={styles.sheetHead}>
                    <span className={styles.sheetTitle}>On this page</span>
                    <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
                        <Icon name="close" />
                    </button>
                </div>
                <div className={styles.sheetToc}>
                    <TocList headings={headings} activeId={activeId} onNavigate={onClose} roomy />
                </div>
                <ProgressMeter progress={progress} minutes={minutes} />
            </div>
        </div>
    )
}