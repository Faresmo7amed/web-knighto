'use client'

import { useEffect, useState, type RefObject } from 'react'
import type { Heading } from '@/lib/headings'

const SPY_OFFSET = 110 // a heading counts as "current" once it is this far from the top of the screen
const NAV_PX = 64 // nav bar height

export type ScrollState = { progress: number; activeId: string; nearBottom: boolean }

// Tracks reading progress (0-100), the heading being read, and whether the visitor is past the page middle.
// Heading positions are measured once (and on resize), so scrolling only does cheap number checks.
export function useArticleScroll(articleRef: RefObject<HTMLElement | null>, headings: Heading[]): ScrollState {
    const [state, setState] = useState<ScrollState>({ progress: 0, activeId: headings[0]?.id ?? '', nearBottom: false })

    useEffect(() => {
        const article = articleRef.current
        if (!article) return
        let tops: number[] = []
        let start = 0
        let end = 0
        let frame = 0

        // Reads where the article and each heading are on the page. Runs on load and when sizes change.
        function measure() {
            const y = window.scrollY
            const rect = article!.getBoundingClientRect()
            const top = rect.top + y
            start = top - NAV_PX
            end = top + rect.height - window.innerHeight
            tops = headings.map((heading) => {
                const el = document.getElementById(heading.id)
                return el ? el.getBoundingClientRect().top + y : Infinity
            })
        }

        // Turns the current scroll position into progress, active heading and direction. Runs once per frame.
        function update() {
            frame = 0
            const y = window.scrollY
            const span = end - start
            const progress = span > 0 ? Math.round(Math.min(1, Math.max(0, (y - start) / span)) * 100) : y >= start ? 100 : 0
            const max = document.documentElement.scrollHeight - window.innerHeight

            let activeId = headings[0]?.id ?? ''
            for (let i = 0; i < tops.length; i++) {
                if (tops[i] <= y + SPY_OFFSET) activeId = headings[i].id
                else break
            }
            // At the very bottom the last heading may never reach the offset, so select it
            if (headings.length && max > 0 && y >= max - 2) activeId = headings[headings.length - 1].id

            const nearBottom = max > 0 && y > max / 2
            setState((prev) => (prev.progress === progress && prev.activeId === activeId && prev.nearBottom === nearBottom ? prev : { progress, activeId, nearBottom }))
        }

        // Queues one update for the next frame, however many scroll events arrive.
        function schedule() {
            if (!frame) frame = requestAnimationFrame(update)
        }

        function remeasure() {
            measure()
            schedule()
        }

        measure()
        schedule()
        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('resize', remeasure)
        const observer = new ResizeObserver(remeasure)
        observer.observe(article)
        return () => {
            window.removeEventListener('scroll', schedule)
            window.removeEventListener('resize', remeasure)
            observer.disconnect()
            cancelAnimationFrame(frame)
        }
    }, [articleRef, headings])

    return state
}