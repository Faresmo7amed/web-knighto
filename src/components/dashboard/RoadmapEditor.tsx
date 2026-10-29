'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addNode, deleteNode, moveNode, saveNode, saveRoadmap } from '@/app/dashboard/roadmaps/actions'
import type { NodeData, NodeKind, RoadmapData } from '@/lib/dashboard/roadmap-types'
import type { Result } from '@/lib/dashboard/types'
import { useToast } from './Toast'
import d from './dash.module.css'

const bySort = (a: NodeData, b: NodeData) => a.sort_order - b.sort_order || a.title.localeCompare(b.title)
const KINDS: NodeKind[] = ['sub', 'optional', 'alternative', 'recommended']

// Child of RoadmapEditor: edit one step (text, type, parent, lock, resources).
function NodeForm({ node, mains, onSaved }: { node: NodeData; mains: NodeData[]; onSaved: (message: string) => void }) {
    const toast = useToast()
    const [pending, start] = useTransition()
    const [v, setV] = useState({ title: node.title, description: node.description, markdown: node.markdown, kind: node.kind, is_locked: node.is_locked, parent_id: node.parent_id, resources: node.resources })
    const setResource = (index: number, patch: Partial<NodeData['resources'][number]>) => setV((p) => ({ ...p, resources: p.resources.map((r, i) => (i === index ? { ...r, ...patch } : r)) }))

    return (
        <aside className={d.sideBox} aria-label="Step details">
            <b>Edit step</b>
            <div className={d.field}><label className={d.label} htmlFor="n-title">Title</label><input id="n-title" className={d.input} value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} /></div>
            <div className={d.field}><label className={d.label} htmlFor="n-kind">Type</label>
                <select id="n-kind" className={d.select} value={v.kind} onChange={(e) => setV({ ...v, kind: e.target.value as NodeKind })}>
                    <option value="main">Main topic</option>{KINDS.map((k) => <option key={k} value={k}>{k === 'sub' ? 'Subtopic' : k[0].toUpperCase() + k.slice(1)}</option>)}
                </select></div>
            {v.kind !== 'main' ? <div className={d.field}><label className={d.label} htmlFor="n-parent">Main topic</label>
                <select id="n-parent" className={d.select} value={v.parent_id ?? ''} onChange={(e) => setV({ ...v, parent_id: e.target.value || null })}><option value="">Choose…</option>{mains.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}</select></div> : null}
            <div className={d.field}><label className={d.label} htmlFor="n-desc">Short description</label><textarea id="n-desc" className={d.textarea} rows={2} value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} /></div>
            <div className={d.field}><label className={d.label} htmlFor="n-md">Study notes (Markdown)</label><textarea id="n-md" className={d.textarea} style={{ fontFamily: 'var(--font-mono)', minHeight: '10rem' }} dir="auto" value={v.markdown} onChange={(e) => setV({ ...v, markdown: e.target.value })} /></div>
            <label className={d.switchRow}>Locked / optional look<input type="checkbox" checked={v.is_locked} onChange={(e) => setV({ ...v, is_locked: e.target.checked })} /></label>
            <div className={d.field}><span className={d.label}>Resources</span>
                {v.resources.map((r, i) => (
                    <div key={i} className={d.field} style={{ padding: '0.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                        <select className={d.select} aria-label="Resource type" value={r.resource_type} onChange={(e) => setResource(i, { resource_type: e.target.value as 'docs' })}><option value="docs">Docs</option><option value="article">Article</option><option value="video">Video</option></select>
                        <input className={d.input} aria-label="Resource title" placeholder="Title" value={r.title} onChange={(e) => setResource(i, { title: e.target.value })} />
                        <input className={d.input} aria-label="Resource address" placeholder="https://…" value={r.href} onChange={(e) => setResource(i, { href: e.target.value })} />
                        <button type="button" className={`${d.btn} ${d.btnSm}`} onClick={() => setV({ ...v, resources: v.resources.filter((_, n) => n !== i) })}>Remove</button>
                    </div>
                ))}
                <button type="button" className={`${d.btn} ${d.btnSm}`} onClick={() => setV({ ...v, resources: [...v.resources, { title: '', href: 'https://', resource_type: 'docs' }] })}>Add resource</button>
            </div>
            <button type="button" className={d.btnPrimary} disabled={pending} onClick={() => start(async () => { const r = await saveNode(node.id, v); if (r.ok) onSaved('Step saved'); else toast(r.error ?? 'Could not save.', 'error') })}>Save step</button>
        </aside>
    )
}

// Child of RoadmapEditor: title, URL name, category, status and the Home feature switch.
function SettingsForm({ roadmap, onSaved }: { roadmap: RoadmapData; onSaved: () => void }) {
    const toast = useToast()
    const [pending, start] = useTransition()
    const [v, setV] = useState(roadmap)
    return (
        <div className={d.sideBox} style={{ maxWidth: '32rem' }}>
            <div className={d.field}><label className={d.label} htmlFor="r-title">Title</label><input id="r-title" className={d.input} value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} /></div>
            <div className={d.field}><label className={d.label} htmlFor="r-slug">URL name</label><input id="r-slug" className={d.input} value={v.slug} onChange={(e) => setV({ ...v, slug: e.target.value.toLowerCase() })} /></div>
            <div className={d.field}><label className={d.label} htmlFor="r-cat">Category</label><input id="r-cat" className={d.input} value={v.category} onChange={(e) => setV({ ...v, category: e.target.value })} /></div>
            <div className={d.field}><label className={d.label} htmlFor="r-desc">Description</label><textarea id="r-desc" className={d.textarea} rows={3} value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} /></div>
            <div className={d.field}><label className={d.label} htmlFor="r-status">Status</label><select id="r-status" className={d.select} value={v.status} onChange={(e) => setV({ ...v, status: e.target.value as RoadmapData['status'] })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div>
            <label className={d.switchRow}>Feature on Home<input type="checkbox" checked={v.featured} onChange={(e) => setV({ ...v, featured: e.target.checked })} /></label>
            <button type="button" className={d.btnPrimary} disabled={pending} onClick={() => start(async () => { const r = await saveRoadmap(roadmap.id, v); if (r.ok) { toast('Saved'); onSaved() } else toast(r.error ?? 'Could not save.', 'error') })}>Save settings</button>
        </div>
    )
}

// Visual step editor: main topics with steps under them, reorder, add, delete, and a details panel.
export function RoadmapEditor({ roadmap, nodes }: { roadmap: RoadmapData; nodes: NodeData[] }) {
    const router = useRouter()
    const toast = useToast()
    const [, start] = useTransition()
    const [tab, setTab] = useState<'steps' | 'settings'>('steps')
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const mains = nodes.filter((n) => !n.parent_id).sort(bySort)
    const kids = (id: string) => nodes.filter((n) => n.parent_id === id).sort(bySort)
    const selected = nodes.find((n) => n.id === selectedId)

    function run(task: () => Promise<Result>, done?: string, after?: (r: Result) => void) {
        start(async () => {
            const result = await task()
            if (!result.ok) return toast(result.error ?? 'Something went wrong.', 'error')
            if (done) toast(done)
            after?.(result)
            router.refresh()
        })
    }
    function add(parentId: string | null) {
        const title = window.prompt(parentId ? 'Step title' : 'Main topic title')
        if (title?.trim()) run(() => addNode(roadmap.id, parentId ? 'sub' : 'main', title, parentId), 'Added', (r) => setSelectedId(r.id ?? null))
    }
    function remove(node: NodeData) {
        const extra = node.kind === 'main' ? ` and its ${kids(node.id).length} steps` : ''
        if (window.confirm(`Delete "${node.title}"${extra} forever?`)) run(() => deleteNode(node.id), 'Deleted', () => setSelectedId(null))
    }
    function row(node: NodeData, child: boolean) {
        return (
            <div key={node.id} className={`${d.stepRow} ${child ? d.stepChild : d.stepMain} ${selectedId === node.id ? d.stepOn : ''}`}>
                <button type="button" className={d.stepTitle} onClick={() => setSelectedId(node.id)} aria-pressed={selectedId === node.id}>{node.title}</button>
                {node.kind !== 'main' && node.kind !== 'sub' ? <span className={`${d.badge} ${d.bNeutral}`}>{node.kind}</span> : null}
                <button type="button" className={d.mini} aria-label={`Move ${node.title} up`} onClick={() => run(() => moveNode(node.id, -1))}>↑</button>
                <button type="button" className={d.mini} aria-label={`Move ${node.title} down`} onClick={() => run(() => moveNode(node.id, 1))}>↓</button>
                <button type="button" className={d.mini} aria-label={`Delete ${node.title}`} onClick={() => remove(node)}>✕</button>
            </div>
        )
    }

    return (
        <div className={d.content}>
            <div className={d.pageHead}>
                <div><h1>{roadmap.title}</h1><p className={d.sub}><span className={`${d.badge} ${roadmap.status === 'published' ? d.bOk : d.bWarn}`}>{roadmap.status}</span> · {nodes.length} steps · changes are saved when you click Save</p></div>
            </div>
            <div className={d.tabs} role="tablist">{(['steps', 'settings'] as const).map((t) => <button key={t} role="tab" aria-selected={tab === t} type="button" className={`${d.tab} ${tab === t ? d.tabOn : ''}`} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}</div>
            {tab === 'settings' ? <SettingsForm roadmap={roadmap} onSaved={() => router.refresh()} /> : (
                <div className={d.rmLayout}>
                    <div className={d.side}>
                        <div className={d.actions}><button type="button" className={d.btn} onClick={() => add(null)}>Add main topic</button></div>
                        {mains.length === 0 ? <div className={d.empty}><b>No steps yet</b><span>Add a main topic, then add steps under it.</span></div> : (
                            <div className={d.stepList}>
                                {mains.map((main) => (
                                    <div key={main.id}>
                                        {row(main, false)}
                                        {kids(main.id).map((child) => row(child, true))}
                                        <div className={`${d.stepRow} ${d.stepChild}`}><button type="button" className={`${d.btn} ${d.btnSm}`} onClick={() => add(main.id)}>Add step</button></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {selected ? <NodeForm key={selected.id} node={selected} mains={mains.filter((m) => m.id !== selected.id)} onSaved={(message) => { toast(message); router.refresh() }} /> : <div className={d.sideBox}><span className={d.hint}>Select a step to edit its notes, type and resources.</span></div>}
                </div>
            )}
        </div>
    )
}