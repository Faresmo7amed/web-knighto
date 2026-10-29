'use client'

import { useCallback, useEffect, useState } from 'react'
import { SEARCH_OPEN_EVENT } from '@/lib/search-events'
import { PaletteDialog } from './PaletteDialog'

// Listens for the "open search" event (nav button and Ctrl/Cmd+K) and shows the palette.
// The dialog only exists while open, so its state resets every time.
export function SearchPalette() {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        function onOpen() {
            setOpen(true)
        }
        window.addEventListener(SEARCH_OPEN_EVENT, onOpen)
        return () => window.removeEventListener(SEARCH_OPEN_EVENT, onOpen)
    }, [])

    // Closes the palette. Stable identity, so the dialog's effects do not re-run.
    const close = useCallback(() => setOpen(false), [])

    return open ? <PaletteDialog onClose={close} /> : null
}