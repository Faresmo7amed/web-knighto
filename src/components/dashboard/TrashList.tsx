'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deletePageForever, deleteRoadmapForever, emptyTrash, restorePage, restoreRoadmap } from '@/app/dashboard/trash/actions'
import { useToast } from './Toast'
import d from './dash.module.css'

export type TrashItem = { id: string; type: 'page' | 'roadmap'; title: string; where: string; deletedAt: string; children: number; daysLeft: number }

// Lists trashed pages and roadmaps with restore, delete forever and empty trash.
export function TrashList({ items }: { items: TrashItem[] }) {
    const router = useRouter()
    const toast = useToast()
    const [, start] = useTransition()
    const [query, setQuery] = useState('')

    function run(task: () => Promise<{ ok: boolean; error?: string }>, done: string) {
        start(async () => {
            const result = await task()
            if (!result.ok) toast(result.error ?? 'Something went wrong.', 'error')
            else { toast(done); router.refresh() }
        })
    }
    const list = items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))

    return (
        <div className={d.content}>
            <div className={d.pageHead}>
                <div><h1>Trash</h1><p className={d.sub}>Deleted items stay here for 30 days, then are removed for good. Restored pages return as drafts.</p></div>
                <button type="button" className={d.btnDanger} disabled={!items.length} onClick={() => { if (window.confirm(`Delete all ${items.length} items forever? This cannot be undone.`)) run(emptyTrash, 'Trash emptied') }}>Empty trash</button>
            </div>
            <div className={d.toolbar}><input className={`${d.input} ${d.search}`} placeholder="Search deleted items" aria-label="Search trash" value={query} onChange={(event) => setQuery(event.target.value)} /><span className={d.hint}>{items.length} items</span></div>
            {list.length === 0 ? <div className={d.empty}><b>Trash is empty</b><span>Deleted items appear here for 30 days.</span></div> : (
                <div className={d.tableWrap}>
                    <table className={d.table}>
                        <thead><tr><th>Item</th><th>Type</th><th>Was located in</th><th>Deleted</th><th>Removed in</th><th /></tr></thead>
                        <tbody>
                            {list.map((item) => (
                                <tr key={item.type + item.id}>
                                    <td><b>{item.title}</b>{item.children ? <div className={d.hint}>Includes {item.children} child page{item.children > 1 ? 's' : ''}</div> : null}</td>
                                    <td>{item.type}</td><td className={d.hint}>{item.where}</td>
                                    <td>{new Date(item.deletedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</td>
                                    <td><span className={`${d.badge} ${item.daysLeft <= 3 ? d.bWarn : d.bNeutral}`}>{item.daysLeft} days</span></td>
                                    <td><div className={d.actions}>
                                        <button type="button" className={`${d.btn} ${d.btnSm}`} onClick={() => run(() => (item.type === 'page' ? restorePage(item.id) : restoreRoadmap(item.id)), 'Restored as a draft')}>Restore</button>
                                        <button type="button" className={`${d.btnDanger} ${d.btnSm}`} onClick={() => { if (window.confirm(`Delete "${item.title}" forever?`)) run(() => (item.type === 'page' ? deletePageForever(item.id) : deleteRoadmapForever(item.id)), 'Deleted forever') }}>Delete forever</button>
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}