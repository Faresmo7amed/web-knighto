import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Highlight } from '@/components/search/Highlight'
import { Icon } from '@/components/ui/Icon'
import { searchContent } from '@/lib/search/search'
import { groupLabels, groupOrder } from '@/lib/search/types'
import styles from './search.module.css'

export const metadata: Metadata = { title: 'Search' }

type SearchParams = Promise<{ q?: string | string[] }>

// Reads ?q=, runs the search and shows every group. Child of the Suspense boundary below.
async function Results({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams
    const raw = Array.isArray(params.q) ? params.q[0] : params.q
    const q = (raw ?? '').trim().slice(0, 100)
    const response = q ? await searchContent(q, { limit: 50 }) : null
    const total = response ? Object.values(response.counts).reduce((sum, count) => sum + count, 0) : 0

    return (
        <>
            <form action="/search" role="search" className={styles.form}>
                <input name="q" type="search" dir="auto" className={styles.input} defaultValue={q} placeholder="Search pages, topics and text" aria-label="Search the site" maxLength={100} />
                <button type="submit" className={styles.submit}>
                    <Icon name="search" size={18} /> Search
                </button>
            </form>

            {!response && <p className={styles.note}>Type a word to search page titles, topics, headings and the text inside articles.</p>}
            {response && total === 0 && (
                <div className={styles.empty}>
                    <b dir="auto">No results for &ldquo;{q}&rdquo;</b>
                    <span>Try fewer or different words, or browse a section from the menu.</span>
                </div>
            )}
            {response && total > 0 && (
                <>
                    <p className={styles.note} role="status">
                        {total} {total === 1 ? 'result' : 'results'} for <strong dir="auto">&ldquo;{q}&rdquo;</strong>
                    </p>
                    {groupOrder.map((group) => {
                        const items = response.results.filter((result) => result.group === group)
                        if (items.length === 0) return null
                        return (
                            <section key={group} className={styles.group} aria-labelledby={`group-${group}`}>
                                <h2 id={`group-${group}`} className={styles.groupTitle}>
                                    {groupLabels[group]} <span>{response.counts[group]}</span>
                                </h2>
                                <ul className={styles.list}>
                                    {items.map((result) => (
                                        <li key={result.id}>
                                            <Link href={result.href} className={styles.card}>
                                                <span className={styles.cardTitle} dir="auto">
                                                    <Highlight segments={result.title} />
                                                </span>
                                                {result.snippet && (
                                                    <span className={styles.snippet} dir="auto">
                                                        <Highlight segments={result.snippet} />
                                                    </span>
                                                )}
                                                {result.path && <span className={styles.path}>{result.path}</span>}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )
                    })}
                </>
            )}
        </>
    )
}

// Parent. It does not await anything, so the page frame shows instantly.
export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
    return (
        <PageLayout>
            <div className={styles.wrap}>
                <h1 className={styles.title}>Search</h1>
                <Suspense fallback={<p className={styles.note}>Searching…</p>}>
                    <Results searchParams={searchParams} />
                </Suspense>
            </div>
        </PageLayout>
    )
}