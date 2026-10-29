'use client'

import { useState, type KeyboardEvent } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { Heading } from '@/lib/headings'
import { scrollPageTo } from '@/lib/scroll'
import { useStoredString } from '@/lib/use-stored-string'
import { ProgressMeter, TocList } from './OnThisPage'
import styles from './RightSidebar.module.css'

type RightSidebarProps = {
    headings: Heading[]
    activeId: string
    progress: number
    minutes: number
}

// "On this page" for desktop (1100px and wider). Pinned = a column; unpinned = a thin strip that
// opens as an overlay on hover or keyboard focus, like the left sidebar.
export function RightSidebar({ headings, activeId, progress, minutes }: RightSidebarProps) {
    const [pinnedRaw, setPinnedRaw] = useStoredString('toc-pinned', 'true')
    const pinned = pinnedRaw === 'true'
    const [dismissed, setDismissed] = useState(false)
    const [copied, setCopied] = useState(false)

    // Pins the panel open, or collapses it to the strip.
    function togglePin() {
        setPinnedRaw(pinned ? 'false' : 'true')
    }

    // Esc closes the hover overlay and takes focus out of it.
    function onKeyDown(event: KeyboardEvent) {
        if (event.key !== 'Escape' || pinned) return
        setDismissed(true)
        ;(document.activeElement as HTMLElement | null)?.blur()
    }

    // Copies the page URL and shows "Copied" for a moment.
    async function copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
        } catch {}
    }

    return (
        <aside
            className={styles.aside}
            aria-label="On this page"
            data-pinned={pinned}
            data-dismissed={dismissed}
            onKeyDown={onKeyDown}
            onPointerLeave={() => setDismissed(false)}
            onFocus={() => setDismissed(false)}
        >
            <div className={styles.strip}>
                <button type="button" className={styles.iconBtn} onClick={togglePin} aria-label="Pin On this page open" title="Pin open">
                    <Icon name="chevronLeft" size={16} />
                </button>
                <span className={styles.stripTitle}>On this page</span>
            </div>

            <div className={styles.panel}>
                <div className={styles.heading}>
                    <span>On this page</span>
                    <button type="button" className={styles.iconBtn} onClick={togglePin} aria-pressed={pinned} aria-label={pinned ? 'Unpin On this page' : 'Pin On this page open'} title={pinned ? 'Unpin' : 'Pin open'}>
                        <Icon name="pin" size={16} />
                    </button>
                </div>
                <div className={styles.toc}>
                    <TocList headings={headings} activeId={activeId} />
                </div>
                <ProgressMeter progress={progress} minutes={minutes} />
                <div className={styles.actions}>
                    <button type="button" className={styles.action} onClick={() => scrollPageTo(0)}>
                        <Icon name="arrowUp" size={16} /> Back to top
                    </button>
                    <button type="button" className={styles.action} onClick={copyLink}>
                        <Icon name={copied ? 'check' : 'copy'} size={16} /> {copied ? 'Copied' : 'Copy link'}
                    </button>
                    <button type="button" className={styles.action} onClick={() => window.print()}>
                        <Icon name="printer" size={16} /> Print
                    </button>
                </div>
            </div>
        </aside>
    )
}