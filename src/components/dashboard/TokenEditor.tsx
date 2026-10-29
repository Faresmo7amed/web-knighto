'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveAppearance } from '@/app/dashboard/site/actions'
import { useToast } from './Toast'
import d from './dash.module.css'

type Item = { name: string; value: string }
const SECTIONS = [
    { key: 'theme:light', title: 'Light theme colors' }, { key: 'theme:dark', title: 'Dark theme colors' },
    { key: 'syntax:light', title: 'Syntax colors, light' }, { key: 'syntax:dark', title: 'Syntax colors, dark' },
]
const SUGGEST = ['accent', 'accent-hover', 'accent-soft', 'bg', 'bg-subtle', 'surface', 'text', 'text-muted', 'border']

// Edits CSS variable overrides. A row "accent = #2f6fcb" becomes --accent: #2f6fcb on the whole site.
export function TokenEditor({ initial }: { initial: Record<string, Item[]> }) {
    const router = useRouter()
    const toast = useToast()
    const [pending, start] = useTransition()
    const [sets, setSets] = useState(initial)
    const patch = (key: string, index: number, change: Partial<Item>) => setSets((all) => ({ ...all, [key]: all[key].map((row, i) => (i === index ? { ...row, ...change } : row)) }))
    const validColor = (value: string) => (/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000')

    return (
        <div className={d.content}>
            <div className={d.pageHead}>
                <div><h1>Appearance</h1><p className={d.sub}>Colors for the whole site. Only the variables you add here are overridden, everything else keeps the value from tokens.css. For syntax colors use the variable names you find in src/styles/syntax.css.</p></div>
                <button type="button" className={d.btnPrimary} disabled={pending} onClick={() => start(async () => { const r = await saveAppearance(sets); if (r.ok) { toast('Saved. The site updates on the next load.'); router.refresh() } else toast(r.error ?? 'Could not save.', 'error') })}>Save changes</button>
            </div>
            <datalist id="token-names">{SUGGEST.map((name) => <option key={name} value={name} />)}</datalist>
            {SECTIONS.map((section) => (
                <section key={section.key} className={d.card}>
                    <h2>{section.title}</h2>
                    {sets[section.key].map((row, index) => (
                        <div key={index} className={d.colorRow}>
                            <input className={d.input} list="token-names" aria-label="Variable name" placeholder="accent" value={row.name} onChange={(e) => patch(section.key, index, { name: e.target.value })} />
                            <input type="color" aria-label="Pick a color" value={validColor(row.value)} onChange={(e) => patch(section.key, index, { value: e.target.value })} />
                            <input className={d.input} aria-label="Hex value" value={row.value} onChange={(e) => patch(section.key, index, { value: e.target.value })} />
                            <button type="button" className={d.mini} aria-label="Remove" onClick={() => setSets((all) => ({ ...all, [section.key]: all[section.key].filter((_, i) => i !== index) }))}>✕</button>
                        </div>
                    ))}
                    <div><button type="button" className={`${d.btn} ${d.btnSm}`} onClick={() => setSets((all) => ({ ...all, [section.key]: [...all[section.key], { name: '', value: '#2f6fcb' }] }))}>Add color</button></div>
                </section>
            ))}
            <p className={d.hint}>Check contrast yourself: text on its background should be at least 4.5 to 1 (WCAG AA).</p>
        </div>
    )
}