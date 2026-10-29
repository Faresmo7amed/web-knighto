'use client'

import { useEffect, type RefObject } from 'react'

// What every modal panel needs: lock page scroll, focus the panel, Esc closes, Tab stays inside.
export function useDialog(panelRef: RefObject<HTMLElement | null>, onClose: () => void) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        panelRef.current?.focus()

        function onKeyDown(event: KeyboardEvent) {
            const panel = panelRef.current
            if (event.key === 'Escape') {
                onClose()
                return
            }
            if (event.key !== 'Tab' || !panel) return
            const focusable = panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
            if (focusable.length === 0) return
            const first = focusable[0]
            const last = focusable[focusable.length - 1]
            const active = document.activeElement
            if (event.shiftKey && (active === first || active === panel)) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && active === last) {
                event.preventDefault()
                first.focus()
            }
        }

        window.addEventListener('keydown', onKeyDown, true)
        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', onKeyDown, true)
        }
    }, [panelRef, onClose])
}