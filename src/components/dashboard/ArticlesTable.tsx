'use client'

import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createPage, setVisibility, trashPage } from '@/app/dashboard/pages/actions'
import { MAX_DEPTH, levelOf, pathLabel } from '@/lib/dashboard/tree'
import type { PageRow } from '@/lib/dashboard/types'
import { useToast } from './Toast'
import d from './dash.module.css'

type Tab = 'all' | 'published' | 'draft' | 'scheduled'
type Sort = 'updated' | 'title'

// Searchable list of every article-like page with tabs, sorting, bulk actions and a New article form.
export function ArticlesTable({ rows }: { rows: PageRow[] }) {
    const router = useRouter()
    const toast = useToast()
    const [pending, start] = useTransition()
    const [tab, setTab] = useState<Tab>('all')
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState<Sort>('updated')
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [creating, setCreating] = useState(false)

    const items = useMemo(() => rows.filter((row) => row.kind !== 'section'), [rows])
    const parents = useMemo(() => rows.filter((row) => levelOf(rows, row.id) < MAX_DEPTH).map((row) => ({ id: row.id, label: pathLabel(rows, row.id) })).sort((a, b) => a.label.localeCompare(b.label)), [rows])
    const count = (status: Tab) => (status === 'all' ? items.length : items.filter((row) => row.visibility === status).length)
    const list = useMemo(() => items
        .filter((row) => (tab === 'all' || row.visibility === tab) && row.title.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => (sort === 'title' ? a.title.localeCompare(b.title) : b.updated_at.localeCompare(a.updated_at))), [items, tab, query, sort])

    function run(task: () => Promise<{ ok: boolean; error?: string }>, done: string) {
        start(async () => {
            const result = await task()
            if (!result.ok) toast(result.error ?? 'Something went wrong.', 'error')
            else { toast(done); setSelected(new Set()); router.refresh() }
        })
    }
    const toggle = (id: string) => setSelected((set) => { const next = new Set(set); if (next.has(id)) next.delete(id); else next.add(id); return next })
    const badge = (status: string) => (status === 'published' ? d.bOk : status === 'draft' ? d.bWarn : d.bNeutral)

    return (
        <div className={d.content}>
            <div className={d.pageHead}>
                <div><h1>Articles</h1><p className={d.sub}>Every page with content, newest edits first.</p></div>
                <button type="button" className={d.btnPrimary} onClick={() => setCreating(!creating)}>New article</button>
            </div>
            {creating ? (
                <form className={`${d.card} ${d.toolbar}`} onSubmit={(event) => {
                    event.preventDefault()
                    const form = new FormData(event.currentTarget)
                    start(async () => {
                        const result = await createPage(String(form.get('parent')) || null, String(form.get('title') ?? ''), String(form.get('kind')) as 'article')
                        if (result.ok && result.id) router.push(`/dashboard/articles/${result.id}`)
                        else toast(result.error ?? 'Could not create the article.', 'error')
                    })
                }}>
                    <input name="title" className={`${d.input} ${d.search}`} placeholder="Title" aria-label="Title" required autoFocus />
                    <select name="parent" className={d.select} style={{ maxWidth: '18rem' }} aria-label="Parent page" required defaultValue=""><option value="" disabled>Choose a parent…</option>{parents.map((parent) => <option key={parent.id} value={parent.id}>{parent.label}</option>)}</select>
                    <select name="kind" className={d.select} style={{ maxWidth: '12rem' }} aria-label="Type"><option value="article">Article</option><option value="topic">Topic main page</option><option value="cheatsheet">Cheat sheet</option></select>
                    <button className={d.btnPrimary} type="submit" disabled={pending}>Create and edit</button>
                </form>
            ) : null}
            <div className={d.tabs} role="tablist">{(['all', 'published', 'draft', 'scheduled'] as Tab[]).map((item) => <button key={item} role="tab" aria-selected={tab === item} type="button" className={`${d.tab} ${tab === item ? d.tabOn : ''}`} onClick={() => setTab(item)}>{item[0].toUpperCase() + item.slice(1)} {count(item)}</button>)}</div>
            <div className={d.toolbar}>
                <input className={`${d.input} ${d.search}`} placeholder="Search by title" aria-label="Search articles" value={query} onChange={(event) => setQuery(event.target.value)} />
                <select className={d.select} style={{ maxWidth: '12rem' }} aria-label="Sort" value={sort} onChange={(event) => setSort(event.target.value as Sort)}><option value="updated">Sort: Updated</option><option value="title">Sort: Title</option></select>
            </div>
            {selected.size ? (
                <div className={d.bulkBar} role="status"><b>{selected.size} selected</b><span className={d.grow} />
                    <button type="button" className={`${d.btn} ${d.btnSm}`} onClick={() => run(() => setVisibility([...selected], 'published'), 'Published')}>Publish</button>
                    <button type="button" className={`${d.btn} ${d.btnSm}`} onClick={() => run(() => setVisibility([...selected], 'draft'), 'Set to draft')}>Make draft</button>
                    <button type="button" className={`${d.btnDanger} ${d.btnSm}`} onClick={() => { if (window.confirm(`Move ${selected.size} article(s) to the Trash?`)) run(() => trashPage([...selected]), 'Moved to Trash') }}>Move to Trash</button>
                </div>
            ) : null}
            {list.length === 0 ? <div className={d.empty}><b>{items.length ? 'No articles match' : 'No articles yet'}</b><span>{items.length ? 'Try another search or tab.' : 'Create your first article.'}</span></div> : (
                <div className={d.tableWrap}>
                    <table className={d.table}>
                        <thead><tr><th style={{ width: 40 }}><input type="checkbox" aria-label="Select all" checked={selected.size === list.length} onChange={(event) => setSelected(event.target.checked ? new Set(list.map((row) => row.id)) : new Set())} /></th><th>Title</th><th>Location</th><th>Type</th><th>Status</th><th>Updated</th></tr></thead>
                        <tbody>
                            {list.map((row) => (
                                <tr key={row.id} className={selected.has(row.id) ? d.rowSel : ''}>
                                    <td><input type="checkbox" aria-label={`Select ${row.title}`} checked={selected.has(row.id)} onChange={() => toggle(row.id)} /></td>
                                    <td><Link href={`/dashboard/articles/${row.id}`}>{row.title}</Link></td>
                                    <td className={d.hint}>{pathLabel(rows, row.parent_id)}</td>
                                    <td>{row.kind}</td>
                                    <td><span className={`${d.badge} ${badge(row.visibility)}`}>{row.visibility}</span></td>
                                    <td>{new Date(row.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}