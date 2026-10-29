'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import styles from './Code.module.css'

type CodeFrameProps = {
    label: string // language name
    title?: string // file name
    copyText: string
    hiddenLines: number // lines hidden while collapsed. 0 = not collapsible
    previewLines: number
    digits: number // width of the line-number column
    children: ReactNode // the lines, rendered on the server
}

// The part of a code block that needs the browser: header, copy button, show more/less.
// The highlighted lines come in as children, so no highlighting code is sent to the browser.
export function CodeFrame({ label, title, copyText, hiddenLines, previewLines, digits, children }: CodeFrameProps) {
    const [copied, setCopied] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

    // Stop the "Copied" timer if the block is removed
    useEffect(() => () => clearTimeout(timer.current), [])

    // Copies the code and shows "Copied" for a moment. Use from the copy button.
    async function copy() {
        try {
            await navigator.clipboard.writeText(copyText)
            setCopied(true)
            clearTimeout(timer.current)
            timer.current = setTimeout(() => setCopied(false), 1800)
        } catch {}
    }

    const collapsed = hiddenLines > 0 && !expanded
    const vars = { '--preview-lines': previewLines, '--ln-digits': digits } as CSSProperties

    return (
        <div className={styles.block} style={vars}>
            <div className={styles.head}>
                <span className={styles.label}>
                    {title && (
                        <>
                            <span className={styles.title}>{title}</span>
                            <span aria-hidden="true">·</span>
                        </>
                    )}
                    <span>{label}</span>
                </span>
                <button type="button" className={styles.copy} data-copied={copied || undefined} onClick={copy} aria-label="Copy code">
                    <Icon name={copied ? 'check' : 'copy'} size={16} />
                    {copied && <span aria-hidden="true">Copied</span>}
                </button>
                <span className={styles.sr} role="status">
                    {copied ? 'Copied to clipboard' : ''}
                </span>
            </div>
            <div className={styles.viewport} data-collapsed={collapsed || undefined}>
                <div className={styles.scroll}>
                    <pre className={styles.pre} tabIndex={0}>
                        <code className={styles.code}>{children}</code>
                    </pre>
                </div>
            </div>
            {hiddenLines > 0 && (
                <button type="button" className={styles.more} aria-expanded={expanded} onClick={() => setExpanded((open) => !open)}>
                    <Icon name={expanded ? 'arrowUp' : 'arrowDown'} size={16} />
                    {expanded ? 'Show less' : `Show ${hiddenLines} more lines`}
                </button>
            )}
        </div>
    )
}