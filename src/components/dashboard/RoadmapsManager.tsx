'use client'

import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createRoadmap, setFeatured, trashRoadmap } from '@/app/dashboard/roadmaps/actions'
import { useToast } from './Toast'
import d from './dash.module.css'

export type RoadmapRow = { id: string; slug: string; title: string; category: string; status: string; featured: boolean; steps: number; updated_at: string }

// List of roadmaps: search, create, feature on Home, trash.
export function RoadmapsManager({ rows }: { rows: RoadmapRow[] }) {
    const router = useRouter()
    const toast = useToast()
    const [pending, start] = useTransition()
    const [query, setQuery] = useState('')
    const [creating, setCreating] = useState(false)
    const list = useMemo(() => rows.filter((row) => row.title.toLowerCase().includes(query.toLowerCase())), [rows, query])
    const featured = rows.filter((row) => row.featured).length

    function run(task: () => Promise<{ ok: boolean; error?: string; id?: string }>, done: string, open?: boolean) {
        start(async () => {
            const result = await task()
            if (!result.ok) return toast(result.error ?? 'Something went wrong.', 'error')
            toast(done)
            if (open && result.id) router.push(`/dashboard/roadmaps/${result.id}`)
            else router.refresh()
        })
    }

    return (
        <div className={d.content}>
            <div className={d.pageHead}>
                <div><h1>Roadmaps</h1><p className={d.sub}>Step-by-step learning paths. Up to 3 can be featured on Home ({featured} of 3 used).</p></div>
                <button type="button" className={d.btnPrimary} onClick={() => setCreating(!creating)}>New roadmap</button>
            </div>
            {creating ? (
                <form className={`${d.card} ${d.toolbar}`} onSubmit={(event) => { event.preventDefault(); const f = new FormData(event.currentTarget); run(() => createRoadmap(String(f.get('title')), String(f.get('category'))), 'Roadmap created', true) }}>
                    <input name="title" className={`${d.input} ${d.search}`} placeholder="Title" aria-label="Title" required autoFocus />
                    <input name="category" className={d.input} style={{ maxWidth: '12rem' }} placeholder="Category" aria-label="Category" defaultValue="Frontend" />
                    <button className={d.btnPrimary} type="submit" disabled={pending}>Create and edit</button>
                </form>
            ) : null}
            <div className={d.toolbar}><input className={`${d.input} ${d.search}`} placeholder="Search roadmaps" aria-label="Search roadmaps" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
            {list.length === 0 ? <div className={d.empty}><b>{rows.length ? 'No roadmaps match' : 'No roadmaps yet'}</b><span>{rows.length ? 'Try another search.' : 'Create your first roadmap.'}</span></div> : (
                <div className={d.tableWrap}>
                    <table className={d.table}>
                        <thead><tr><th>Roadmap</th><th>Category</th><th>Steps</th><th>Featured</th><th>Status</th><th>Updated</th><th /></tr></thead>
                        <tbody>
                            {list.map((row) => (
                                <tr key={row.id}>
                                    <td><Link href={`/dashboard/roadmaps/${row.id}`}>{row.title}</Link><div className={d.hint}>/roadmaps/{row.slug}</div></td>
                                    <td>{row.category}</td><td>{row.steps}</td>
                                    <td><input type="checkbox" style={{ width: 20, height: 20, accentColor: 'var(--accent)' }} aria-label={`Feature ${row.title} on Home`} checked={row.featured} onChange={(event) => run(() => setFeatured(row.id, event.target.checked), 'Saved')} /></td>
                                    <td><span className={`${d.badge} ${row.status === 'published' ? d.bOk : d.bWarn}`}>{row.status}</span></td>
                                    <td>{new Date(row.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</td>
                                    <td><button type="button" className={`${d.btnDanger} ${d.btnSm}`} onClick={() => { if (window.confirm(`Move "${row.title}" to the Trash?`)) run(() => trashRoadmap(row.id), 'Moved to Trash') }}>Trash</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}