'use client'

import { Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { Heading } from '@/lib/headings'
import { ReadingProgressBar } from './ReadingProgressBar'
import { RightSidebar } from './RightSidebar'
import { ScrollButton } from './ScrollButton'
import { TocSheet } from './TocSheet'
import { useArticleScroll } from './use-article-scroll'
import styles from './ArticleShell.module.css'

type ArticleShellProps = {
    headings: Heading[]
    minutes: number
    children: ReactNode // the article itself, rendered on the server
}

// Owns the scroll state and shares it with the progress bar, the sidebar, the sheet and the scroll button.
export function ArticleShell({ headings, minutes, children }: ArticleShellProps) {
    const articleRef = useRef<HTMLElement>(null)
    const { progress, activeId, nearBottom } = useArticleScroll(articleRef, headings)
    const [sheetOpen, setSheetOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const wasOpen = useRef(false)

    // Closes the bottom sheet. Stable identity, so the sheet's effects do not re-run.
    const closeSheet = useCallback(() => setSheetOpen(false), [])

    // After the sheet has really closed, put focus back on the button that opened it
    useEffect(() => {
        if (wasOpen.current && !sheetOpen) buttonRef.current?.focus()
        wasOpen.current = sheetOpen
    }, [sheetOpen])

    const hasHeadings = headings.length > 0

    return (
        <>
            <ReadingProgressBar progress={progress} />
            <div className={styles.wrap}>
                <article ref={articleRef} className={styles.article}>
                    <div className={styles.inner}>{children}</div>
                </article>
                {hasHeadings && <RightSidebar headings={headings} activeId={activeId} progress={progress} minutes={minutes} />}
            </div>

            {hasHeadings && (
                <button ref={buttonRef} type="button" className={styles.fab} onClick={() => setSheetOpen(true)} aria-haspopup="dialog" aria-expanded={sheetOpen}>
                    <Icon name="list" size={18} /> On this page
                </button>
            )}
            {sheetOpen && (
                <Suspense fallback={null}>
                    <TocSheet headings={headings} activeId={activeId} progress={progress} minutes={minutes} onClose={closeSheet} />
                </Suspense>
            )}
            <ScrollButton nearBottom={nearBottom} />
        </>
    )
}