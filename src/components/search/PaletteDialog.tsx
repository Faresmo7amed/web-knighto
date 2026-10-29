'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Icon } from '@/components/ui/Icon'
import { searchAction } from '@/lib/search/actions'
import { emptyResponse, groupLabels, groupOrder, type SearchResponse, type SearchResult } from '@/lib/search/types'
import { useStoredString } from '@/lib/use-stored-string'
import { Highlight } from './Highlight'
import styles from './Search.module.css'

const MAX_RECENT = 5

// The command palette: input, grouped results, recent searches, and every state in between.
export function PaletteDialog({ onClose }: { onClose: () => void }) {
    const router = useRouter()
    const panelRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState('')
    const [response, setResponse] = useState<SearchResponse | null>(null)
    const [active, setActive] = useState(0)
    const [recentRaw, setRecentRaw] = useStoredString('recent-searches', '[]')

    const recent = useMemo<string[]>(() => {
        try {
            const list = JSON.parse(recentRaw)
            return Array.isArray(list) ? list.filter((item): item is string => typeof item === 'string') : []
        } catch {
            return []
        }
    }, [recentRaw])

    const trimmed = query.trim()
    const results = trimmed ? (response?.results ?? []) : []
    const loading = trimmed !== '' && response?.query !== trimmed
    const activeIndex = Math.min(active, Math.max(results.length - 1, 0))

    // Fetch results 150ms after typing stops. Older answers are ignored.
    useEffect(() => {
        if (!trimmed) return
        let cancelled = false
        const timer = setTimeout(async () => {
            try {
                const next = await searchAction(trimmed)
                if (!cancelled) setResponse(next)
            } catch {
                if (!cancelled) setResponse(emptyResponse(trimmed, true))
            }
        }, 150)
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [trimmed])

    // Open: lock page scroll, focus the input, remember where focus was. Close: give focus back.
    useEffect(() => {
        const previousFocus = document.activeElement as HTMLElement | null
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        inputRef.current?.focus()

        function onKeyDown(event: globalThis.KeyboardEvent) {
            const panel = panelRef.current
            if (event.key === 'Escape') {
                onClose()
                return
            }
            if (event.key !== 'Tab' || !panel) return
            // Keep Tab inside the dialog. Result links are reached with the arrow keys instead.
            const focusable = panel.querySelectorAll<HTMLElement>('input, a[href]:not([tabindex="-1"]), button:not([disabled])')
            if (focusable.length === 0) return
            const first = focusable[0]
            const last = focusable[focusable.length - 1]
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }
        window.addEventListener('keydown', onKeyDown, true)
        return () => {
            window.removeEventListener('keydown', onKeyDown, true)
            document.body.style.overflow = previousOverflow
            previousFocus?.focus?.()
        }
    }, [onClose])

    // Keep the highlighted result visible while moving with the arrow keys
    useEffect(() => {
        document.getElementById(`search-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
    }, [activeIndex, response])

    // Saves a query at the top of the recent list (no duplicates, max 5). Use when a result is opened.
    function saveRecent() {
        if (!trimmed) return
        setRecentRaw(JSON.stringify([trimmed, ...recent.filter((item) => item !== trimmed)].slice(0, MAX_RECENT)))
    }

    // Opens a result from the keyboard.
    function openResult(result: SearchResult) {
        saveRecent()
        onClose()
        router.push(result.href)
    }

    // Arrow keys move, Enter opens the highlighted result (or the full results page when there is none).
    function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'ArrowDown' && results.length) {
            event.preventDefault()
            setActive((activeIndex + 1) % results.length)
        } else if (event.key === 'ArrowUp' && results.length) {
            event.preventDefault()
            setActive((activeIndex - 1 + results.length) % results.length)
        } else if (event.key === 'Enter' && trimmed) {
            event.preventDefault()
            if (results[activeIndex] && !loading) openResult(results[activeIndex])
            else {
                saveRecent()
                onClose()
                router.push(`/search?q=${encodeURIComponent(trimmed)}`)
            }
        }
    }

    return (
        <div className={styles.root}>
            <div className={styles.backdrop} onClick={onClose} />
            <div ref={panelRef} className={styles.panel} role="dialog" aria-modal="true" aria-label="Search">
                <div className={styles.inputRow}>
                    <Icon name="search" size={20} />
                    <input
                        ref={inputRef}
                        className={styles.input}
                        dir="auto"
                        type="text"
                        role="combobox"
                        aria-expanded={results.length > 0}
                        aria-controls="search-list"
                        aria-autocomplete="list"
                        aria-activedescendant={results.length ? `search-option-${activeIndex}` : undefined}
                        aria-label="Search the site"
                        placeholder="Search pages, topics and text"
                        autoComplete="off"
                        spellCheck={false}
                        maxLength={100}
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value)
                            setActive(0)
                        }}
                        onKeyDown={onInputKeyDown}
                    />
                    <button type="button" className={styles.esc} onClick={onClose} aria-label="Close search">
                        <kbd>Esc</kbd>
                    </button>
                </div>

                <div className={styles.body} id="search-list" role="listbox" aria-label="Search results" aria-busy={loading}>
                    {!trimmed && (
                        <div className={styles.state}>
                            {recent.length > 0 ? (
                                <>
                                    <div className={styles.groupHead}>
                                        <span>Recent searches</span>
                                        <button type="button" className={styles.clear} onClick={() => setRecentRaw('[]')}>
                                            Clear
                                        </button>
                                    </div>
                                    {recent.map((item) => (
                                        <button key={item} type="button" className={styles.recent} dir="auto" onClick={() => setQuery(item)}>
                                            <Icon name="search" size={16} />
                                            <span>{item}</span>
                                        </button>
                                    ))}
                                </>
                            ) : (
                                <p className={styles.hint}>Type to search page titles, topics, headings and the text inside articles.</p>
                            )}
                        </div>
                    )}

                    {trimmed && !response && (
                        <div className={styles.skeleton} aria-hidden="true">
                            {[70, 90, 60, 80].map((width, index) => (
                                <div key={index} className={styles.skRow}>
                                    <div className={styles.skLine} style={{ width: `${width}%` }} />
                                    <div className={styles.skLine} style={{ width: '40%' }} />
                                </div>
                            ))}
                        </div>
                    )}

                    {trimmed && response && !loading && response.error && <p className={styles.hint}>Search failed. Check your connection and try again.</p>}
                    {trimmed && response && !loading && !response.error && results.length === 0 && (
                        <p className={styles.hint}>
                            No results for <strong dir="auto">&ldquo;{trimmed}&rdquo;</strong>. Try fewer or different words.
                        </p>
                    )}

                    {trimmed && results.length > 0 && (
                        <div className={styles.results} data-loading={loading || undefined}>
                            {groupOrder.map((group) => {
                                const items = results.filter((result) => result.group === group)
                                if (items.length === 0) return null
                                return (
                                    <div key={group} role="group" aria-label={groupLabels[group]}>
                                        <div className={styles.groupHead}>
                                            <span>{groupLabels[group]}</span>
                                            {response && response.counts[group] > items.length && <span>{response.counts[group]} total</span>}
                                        </div>
                                        {items.map((result) => {
                                            const index = results.indexOf(result)
                                            return (
                                                <Link
                                                    key={result.id}
                                                    id={`search-option-${index}`}
                                                    href={result.href}
                                                    role="option"
                                                    tabIndex={-1}
                                                    aria-selected={index === activeIndex}
                                                    className={styles.option}
                                                    data-active={index === activeIndex || undefined}
                                                    onMouseMove={() => setActive(index)}
                                                    onClick={() => {
                                                        saveRecent()
                                                        onClose()
                                                    }}
                                                >
                                                    <span className={styles.optTitle} dir="auto">
                                                        <Highlight segments={result.title} />
                                                    </span>
                                                    {result.snippet && (
                                                        <span className={styles.optSnippet} dir="auto">
                                                            <Highlight segments={result.snippet} />
                                                        </span>
                                                    )}
                                                    {result.path && <span className={styles.optPath}>{result.path}</span>}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <span className={styles.keys}>
                        <kbd>↑</kbd>
                        <kbd>↓</kbd> move <kbd>↵</kbd> open
                    </span>
                    {trimmed && (
                        <Link href={`/search?q=${encodeURIComponent(trimmed)}`} className={styles.all} onClick={onClose}>
                            All results <Icon name="arrowRight" size={16} />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}