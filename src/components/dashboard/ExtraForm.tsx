'use client'

import { useState, useTransition, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { saveSite } from '@/app/dashboard/site/actions'
import { useToast } from './Toast'
import d from './dash.module.css'

export type Field = { key: string; label: string; type: 'text' | 'textarea' | 'switch' | 'select' | 'number' | 'pages'; column?: boolean; options?: { value: string; label: string }[]; hint?: string }

// A settings form built from a field list. Fields with `column` are real columns, the rest are stored in the extra JSON.
export function ExtraForm({ title, subtitle, fields, values, children }: { title: string; subtitle: string; fields: Field[]; values: Record<string, unknown>; children?: ReactNode }) {
    const router = useRouter()
    const toast = useToast()
    const [pending, start] = useTransition()
    const [v, setV] = useState(values)
    const set = (key: string, value: unknown) => setV((prev) => ({ ...prev, [key]: value }))

    function submit() {
        const columns: Record<string, string> = {}
        const extra: Record<string, unknown> = {}
        for (const field of fields) {
            if (field.column) columns[field.key] = String(v[field.key] ?? '')
            else extra[field.key] = v[field.key]
        }
        start(async () => {
            const result = await saveSite(columns, extra)
            if (result.ok) { toast('Saved'); router.refresh() } else toast(result.error ?? 'Could not save.', 'error')
        })
    }

    return (
        <div className={d.content}>
            <div className={d.pageHead}><div><h1>{title}</h1><p className={d.sub}>{subtitle}</p></div><button type="button" className={d.btnPrimary} disabled={pending} onClick={submit}>Save changes</button></div>
            <div className={d.card} style={{ maxWidth: '44rem' }}>
                {fields.map((field) => {
                    const id = `f-${field.key}`
                    const value = v[field.key]
                    return (
                        <div key={field.key} className={d.field}>
                            {field.type === 'switch' ? <label className={d.switchRow}>{field.label}<input type="checkbox" checked={Boolean(value)} onChange={(e) => set(field.key, e.target.checked)} /></label> : <label className={d.label} htmlFor={id}>{field.label}</label>}
                            {field.type === 'text' ? <input id={id} className={d.input} value={String(value ?? '')} onChange={(e) => set(field.key, e.target.value)} /> : null}
                            {field.type === 'number' ? <input id={id} type="number" className={d.input} value={Number(value ?? 0)} onChange={(e) => set(field.key, Number(e.target.value))} /> : null}
                            {field.type === 'textarea' ? <textarea id={id} className={d.textarea} rows={3} value={String(value ?? '')} onChange={(e) => set(field.key, e.target.value)} /> : null}
                            {field.type === 'select' ? <select id={id} className={d.select} value={String(value ?? '')} onChange={(e) => set(field.key, e.target.value)}>{field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select> : null}
                            {field.type === 'pages' ? (
                                <div className={d.checkList} id={id}>
                                    {field.options?.map((o) => {
                                        const list = (Array.isArray(value) ? value : []) as string[]
                                        return <label key={o.value}><input type="checkbox" checked={list.includes(o.value)} onChange={(e) => set(field.key, e.target.checked ? [...list, o.value] : list.filter((x) => x !== o.value))} />{o.label}</label>
                                    })}
                                </div>
                            ) : null}
                            {field.hint ? <span className={d.hint}>{field.hint}</span> : null}
                        </div>
                    )
                })}
            </div>
            {children}
        </div>
    )
}