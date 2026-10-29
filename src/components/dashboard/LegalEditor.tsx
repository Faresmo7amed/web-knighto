'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveLegal } from '@/app/dashboard/site/actions'
import { useToast } from './Toast'
import d from './dash.module.css'

export type LegalRow = { kind: string; title: string; markdown: string }

// Edits the text of About, Terms, Privacy, Copyright and Contact, one page at a time.
export function LegalEditor({ pages }: { pages: LegalRow[] }) {
    const router = useRouter()
    const toast = useToast()
    const [pending, start] = useTransition()
    const [kind, setKind] = useState(pages[0]?.kind ?? 'about')
    const [drafts, setDrafts] = useState<Record<string, LegalRow>>(() => Object.fromEntries(pages.map((p) => [p.kind, p])))
    const current = drafts[kind]
    if (!current) return <div className={d.empty}><b>No legal pages found</b><span>Run supabase/final.sql first.</span></div>
    const set = (patch: Partial<LegalRow>) => setDrafts((all) => ({ ...all, [kind]: { ...current, ...patch } }))

    return (
        <section className={d.card} style={{ maxWidth: '60rem' }}>
            <h2>Fixed pages</h2>
            <p className={d.hint}>Terms, Privacy and Copyright must be real, reviewed text before you launch. Have a qualified person check them.</p>
            <div className={d.tabs} role="tablist">{pages.map((p) => <button key={p.kind} role="tab" aria-selected={kind === p.kind} type="button" className={`${d.tab} ${kind === p.kind ? d.tabOn : ''}`} onClick={() => setKind(p.kind)}>{p.kind[0].toUpperCase() + p.kind.slice(1)}</button>)}</div>
            <div className={d.field}><label className={d.label} htmlFor="l-title">Title</label><input id="l-title" className={d.input} value={current.title} onChange={(e) => set({ title: e.target.value })} /></div>
            <div className={d.field}><label className={d.label} htmlFor="l-md">Text (Markdown)</label><textarea id="l-md" className={d.textarea} dir="auto" style={{ minHeight: '20rem', fontFamily: 'var(--font-mono)' }} value={current.markdown} onChange={(e) => set({ markdown: e.target.value })} /></div>
            <div><button type="button" className={d.btnPrimary} disabled={pending} onClick={() => start(async () => { const r = await saveLegal(kind, current.title, current.markdown); if (r.ok) { toast('Saved'); router.refresh() } else toast(r.error ?? 'Could not save.', 'error') })}>Save this page</button></div>
        </section>
    )
}