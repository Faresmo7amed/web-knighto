'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { useDialog } from '@/lib/use-dialog'
import styles from './ZoomImage.module.css'

type ZoomImageProps = { src: string; alt: string; caption?: string }

// Full-screen view of the image. Esc, the close button or a click outside the image closes it.
function ImageDialog({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
    const panelRef = useRef<HTMLDivElement>(null)
    useDialog(panelRef, onClose)

    return (
        <div
            ref={panelRef}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={alt || 'Image'}
            tabIndex={-1}
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            <button type="button" className={`icon-btn ${styles.close}`} onClick={onClose} aria-label="Close image">
                <Icon name="close" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className={styles.big} />
        </div>
    )
}

// Image with an optional caption. Click to zoom.
export function ZoomImage({ src, alt, caption }: ZoomImageProps) {
    const [open, setOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const wasOpen = useRef(false)

    // Closes the zoom view. Stable identity, so the dialog's effects do not re-run.
    const close = useCallback(() => setOpen(false), [])

    // After the dialog has really closed, put focus back on the image button
    useEffect(() => {
        if (wasOpen.current && !open) buttonRef.current?.focus()
        wasOpen.current = open
    }, [open])

    return (
        <figure className={styles.figure}>
            <button ref={buttonRef} type="button" className={styles.imgBtn} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`Zoom image: ${alt || caption || 'image'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} loading="lazy" className={styles.img} />
            </button>
            {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
            {open && <ImageDialog src={src} alt={alt} onClose={close} />}
        </figure>
    )
}