'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Result } from '@/lib/dashboard/types'
import { useToast } from './Toast'
import d from './dash.module.css'

export type Col = { key: string; label: string; type: 'text' | 'select' | 'switch'; options?: string[]; placeholder?: string }
export type Row = { id?: string } & Record<string, string | boolean | undefined>

// Editable table: add, reorder, remove and save rows. Used for links and package managers.
export function ListEditor({ title, subtitle, cols, initial, blank, save }: { title: string; subtitle: string; cols: Col[]; initial: Row[]; blank: Row; save: (rows: Row[]) => Promise<Result> }) {
    const router = useRouter()
    const toast = useToast()
    const [pending, start] = useTransition()
    const [rows, setRows] = useState<Row[]>(initial)
    const change = (index: number, key: string, value: string | boolean) => setRows((list) => list.map((row, i) => (i === index ? { ...row, [key]: value } : row)))
    const move = (index: number, delta: number) => setRows((list) => {
        const next = [...list]
        const to = index + delta
        if (to < 0 || to >= next.length) return list
        ;[next[index], next[to]] = [next[to], next[index]]
        return next
    })

    return (
        <div className={d.content}>
            <div className={d.pageHead}>
                <div><h1>{title}</h1><p className={d.sub}>{subtitle}</p></div>
                <div className={d.actions}>
                    <button type="button" className={d.btn} onClick={() => setRows([...rows, { ...blank }])}>Add row</button>
                    <button type="button" className={d.btnPrimary} disabled={pending} onClick={() => start(async () => { const result = await save(rows); if (result.ok) { toast('Saved'); router.refresh() } else toast(result.error ?? 'Could not save.', 'error') })}>Save changes</button>
                </div>
            </div>
            {rows.length === 0 ? <div className={d.empty}><b>Nothing here yet</b><span>Add a row to begin.</span></div> : (
                <div className={d.tableWrap}>
                    <table className={`${d.table} ${d.listTable}`}>
                        <thead><tr>{cols.map((col) => <th key={col.key}>{col.label}</th>)}<th /></tr></thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={row.id ?? `new-${index}`}>
                                    {cols.map((col) => (
                                        <td key={col.key}>
                                            {col.type === 'switch' ? <input type="checkbox" aria-label={col.label} checked={row[col.key] !== false} onChange={(e) => change(index, col.key, e.target.checked)} />
                                                : col.type === 'select' ? <select className={d.select} aria-label={col.label} value={String(row[col.key] ?? '')} onChange={(e) => change(index, col.key, e.target.value)}>{col.options?.map((o) => <option key={o}>{o}</option>)}</select>
                                                    : <input className={d.input} aria-label={col.label} placeholder={col.placeholder} value={String(row[col.key] ?? '')} onChange={(e) => change(index, col.key, e.target.value)} />}
                                        </td>
                                    ))}
                                    <td><div className={d.rowActions}>
                                        <button type="button" className={d.mini} aria-label="Move up" onClick={() => move(index, -1)}>↑</button>
                                        <button type="button" className={d.mini} aria-label="Move down" onClick={() => move(index, 1)}>↓</button>
                                        <button type="button" className={d.mini} aria-label="Remove" onClick={() => setRows(rows.filter((_, i) => i !== index))}>✕</button>
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