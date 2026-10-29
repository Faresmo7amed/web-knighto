'use client'

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import { defaultManagerId } from '@/data/package-managers'
import { useStoredString } from '@/lib/use-stored-string'
import styles from './Code.module.css'

type Tab = { id: string; label: string; copyText: string; content: ReactNode }

// Tab bar + copy button + the body of the chosen manager. Every body is rendered by the server; this only picks one.
export function PackageTabsFrame({ tabs }: { tabs: Tab[] }) {
    const [saved, setSaved] = useStoredString('package-manager', defaultManagerId)
    const [copied, setCopied] = useState(false)
    const refs = useRef<Record<string, HTMLButtonElement | null>>({})

    // Fall back to the first tab if the saved manager no longer exists
    const active = tabs.find((tab) => tab.id === saved) ?? tabs[0]

    // Arrow keys, Home and End move between tabs and select them.
    function onKeyDown(event: KeyboardEvent) {
        const index = tabs.findIndex((tab) => tab.id === active.id)
        let next = index
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
        else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
        else if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = tabs.length - 1
        else return
        event.preventDefault()
        setSaved(tabs[next].id)
        refs.current[tabs[next].id]?.focus()
    }

    // Copies the command of the visible tab and shows "Copied" for a moment.
    async function copy() {
        try {
            await navigator.clipboard.writeText(active.copyText)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
        } catch {}
    }

    return (
        <div className={styles.block}>
            <div className={styles.head} style={{ paddingInlineStart: '0.5rem' }}>
                <div className={styles.tabs} role="tablist" aria-label="Package manager" onKeyDown={onKeyDown}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            ref={(el) => {
                                refs.current[tab.id] = el
                            }}
                            type="button"
                            role="tab"
                            id={`pm-tab-${tab.id}`}
                            aria-selected={tab.id === active.id}
                            aria-controls="pm-panel"
                            tabIndex={tab.id === active.id ? 0 : -1}
                            className={styles.tab}
                            onClick={() => setSaved(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <button type="button" className={styles.copy} data-copied={copied || undefined} onClick={copy} aria-label="Copy command">
                    <Icon name={copied ? 'check' : 'copy'} size={16} />
                    {copied && <span aria-hidden="true">Copied</span>}
                </button>
                <span className={styles.sr} role="status">
                    {copied ? 'Copied to clipboard' : ''}
                </span>
            </div>
            <div id="pm-panel" role="tabpanel" aria-labelledby={`pm-tab-${active.id}`} className={styles.viewport}>
                <div className={styles.scroll}>
                    <pre className={styles.pre} tabIndex={0}>
                        <code className={styles.code}>{active.content}</code>
                    </pre>
                </div>
            </div>
        </div>
    )
}