'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { buildTree, MAX_DEPTH, type PageNode } from '@/lib/dashboard/tree'
import type { PageRow } from '@/lib/dashboard/types'
import { createPage, movePage, renamePage, setPageIcon, setVisibility, trashPage } from '@/app/dashboard/pages/actions'
import { useToast } from './Toast'
import d from './dash.module.css'

const ICONS = ['code', 'layers', 'js', 'react', 'ts', 'server']
type Hint = { id: string; pos: 'before' | 'after' | 'inside' } | null
type Outcome = { ok: boolean; error?: string }

// Drag-and-drop tree of all pages: add, rename, move, reorder, icon, visibility, trash. Depth is limited to 4.
export function PagesTree({ rows }: { rows: PageRow[] }) {
    const router = useRouter()
    const toast = useToast()
    const [, start] = useTransition()
    const [open, setOpen] = useState<Set<string>>(() => new Set(rows.filter((row) => !row.parent_id).map((row) => row.id)))
    const [filter, setFilter] = useState('')
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [editing, setEditing] = useState<string | null>(null)
    const [adding, setAdding] = useState<string | null>(null) // a parent id, or 'root'
    const [dragId, setDragId] = useState<string | null>(null)
    const [hint, setHint] = useState<Hint>(null)

    const tree = useMemo(() => buildTree(rows), [rows])
    const q = filter.trim().toLowerCase()
    const shown = useMemo(() => {
        if (!q) return null
        const ids = new Set<string>()
        const walk = (node: PageNode): boolean => {
            const hit = node.title.toLowerCase().includes(q) || node.slug.includes(q)
            const kids = node.children.map(walk).some(Boolean)
            if (hit || kids) ids.add(node.id)
            return hit || kids
        }
        tree.forEach(walk)
        return ids
    }, [tree, q])
    const flat = useMemo(() => {
        const out: { node: PageNode; level: number }[] = []
        const walk = (nodes: PageNode[], level: number) => {
            for (const node of nodes) {
                if (shown && !shown.has(node.id)) continue
                out.push({ node, level })
                if (node.children.length && (shown || open.has(node.id))) walk(node.children, level + 1)
            }
        }
        walk(tree, 1)
        return out
    }, [tree, open, shown])

    // Runs a server action, shows the result as a toast, then reloads the data.
    function run(task: () => Promise<Outcome>, done?: string) {
        start(async () => {
            const result = await task()
            if (!result.ok) toast(result.error ?? 'Something went wrong.', 'error')
            else { if (done) toast(done); router.refresh() }
        })
    }
    const kids = (parent: string | null) => rows.filter((row) => row.parent_id === parent).sort((a, b) => a.sort_order - b.sort_order)
    const toggle = (id: string) => setOpen((set) => { const next = new Set(set); if (next.has(id)) next.delete(id); else next.add(id); return next })
    const pick = (id: string) => setSelected((set) => { const next = new Set(set); if (next.has(id)) next.delete(id); else next.add(id); return next })

    // Finds the drop position from the pointer height inside the row: top quarter = before, bottom quarter = after, middle = inside.
    function over(event: React.DragEvent<HTMLDivElement>, node: PageNode, level: number) {
        if (!dragId || dragId === node.id) return
        event.preventDefault()
        const box = event.currentTarget.getBoundingClientRect()
        const ratio = (event.clientY - box.top) / box.height
        const pos = ratio < 0.25 ? 'before' : ratio > 0.75 ? 'after' : level >= MAX_DEPTH ? 'after' : 'inside'
        setHint({ id: node.id, pos })
    }

    // Applies the drop through movePage. Siblings are counted without the dragged page.
    function drop(node: PageNode) {
        if (!dragId || !hint || dragId === node.id) return
        let parent: string | null
        let index: number
        if (hint.pos === 'inside') { parent = node.id; index = 9999; setOpen((set) => new Set(set).add(node.id)) }
        else {
            parent = node.parent_id
            const list = kids(parent).filter((row) => row.id !== dragId)
            const at = list.findIndex((row) => row.id === node.id)
            index = hint.pos === 'before' ? at : at + 1
        }
        const id = dragId
        setDragId(null); setHint(null)
        run(() => movePage(id, parent, index), 'Moved')
    }

    // Moves a page one place up (-1) or down (+1) among its siblings. Keyboard-friendly alternative to dragging.
    function nudge(node: PageNode, delta: number) {
        const list = kids(node.parent_id)
        const at = list.findIndex((row) => row.id === node.id)
        run(() => movePage(node.id, node.parent_id, at + delta))
    }

    function remove(ids: string[]) {
        if (!window.confirm(`Move ${ids.length} page${ids.length > 1 ? 's' : ''} and everything under ${ids.length > 1 ? 'them' : 'it'} to the Trash?`)) return
        setSelected(new Set())
        run(() => trashPage(ids), 'Moved to Trash')
    }

    function addForm(parent: string | null, key: string) {
        return (
            <form className={d.inlineForm} onSubmit={(event) => {
                event.preventDefault()
                const title = String(new FormData(event.currentTarget).get('title') ?? '')
                setAdding(null)
                if (parent) setOpen((set) => new Set(set).add(parent))
                run(() => createPage(parent, title), 'Page created')
            }}>
                <input name="title" className={d.input} placeholder={parent ? 'Page title' : 'Section title'} aria-label="Title" autoFocus required />
                <button className={d.btnPrimary} type="submit">Add</button>
                <button className={d.btn} type="button" onClick={() => setAdding(null)} data-key={key}>Cancel</button>
            </form>
        )
    }

    return (
        <div className={d.content}>
            <div className={d.pageHead}>
                <div><h1>Pages</h1><p className={d.sub}>The sidebar tree of the site. Drag a row to reorder it or move it under another page. Up to {MAX_DEPTH} levels deep.</p></div>
                <div className={d.actions}>
                    <button className={d.btn} type="button" onClick={() => setOpen(open.size ? new Set() : new Set(rows.map((row) => row.id)))}>{open.size ? 'Collapse all' : 'Expand all'}</button>
                    <button className={d.btnPrimary} type="button" onClick={() => setAdding('root')}>New section</button>
                </div>
            </div>
            <div className={d.toolbar}><input className={`${d.input} ${d.search}`} placeholder="Filter pages" aria-label="Filter pages" value={filter} onChange={(event) => setFilter(event.target.value)} /></div>
            {selected.size ? (
                <div className={d.bulkBar} role="status">
                    <b>{selected.size} selected</b><span className={d.grow} />
                    <button className={`${d.btn} ${d.btnSm}`} type="button" onClick={() => run(() => setVisibility([...selected], 'published'), 'Published')}>Publish</button>
                    <button className={`${d.btn} ${d.btnSm}`} type="button" onClick={() => run(() => setVisibility([...selected], 'draft'), 'Set to draft')}>Make draft</button>
                    <button className={`${d.btnDanger} ${d.btnSm}`} type="button" onClick={() => remove([...selected])}>Move to Trash</button>
                </div>
            ) : null}
            <div className={d.treeBox}>
                <div className={d.treeHead}><span /><span>Title</span><span>Status</span><span>URL name</span><span>Level</span><span /></div>
                {adding === 'root' ? addForm(null, 'root') : null}
                {flat.length === 0 ? <div className={d.empty}><b>{rows.length ? 'No pages match' : 'No pages yet'}</b><span>{rows.length ? 'Try another search.' : 'Create the first section to start your sidebar tree.'}</span></div> : null}
                {flat.map(({ node, level }) => (
                    <div key={node.id}>
                        <div
                            className={`${d.row} ${selected.has(node.id) ? d.rowSel : ''} ${dragId === node.id ? d.rowDrag : ''} ${hint?.id === node.id ? (hint.pos === 'before' ? d.dropBefore : hint.pos === 'after' ? d.dropAfter : d.dropInside) : ''}`}
                            draggable={editing !== node.id}
                            onDragStart={() => setDragId(node.id)}
                            onDragEnd={() => { setDragId(null); setHint(null) }}
                            onDragOver={(event) => over(event, node, level)}
                            onDrop={(event) => { event.preventDefault(); drop(node) }}
                        >
                            <input type="checkbox" aria-label={`Select ${node.title}`} checked={selected.has(node.id)} onChange={() => pick(node.id)} style={{ width: 18, height: 18, accentColor: 'var(--accent)' }} />
                            {editing === node.id ? (
                                <form className={d.titleCell} style={{ paddingInlineStart: `${(level - 1) * 1.5}rem` }} onSubmit={(event) => {
                                    event.preventDefault()
                                    const form = new FormData(event.currentTarget)
                                    const title = String(form.get('title') ?? '')
                                    const icon = String(form.get('icon') ?? '')
                                    setEditing(null)
                                    run(async () => {
                                        const named = await renamePage(node.id, title)
                                        if (!named.ok || level !== 1) return named
                                        return setPageIcon(node.id, icon || null)
                                    }, 'Saved')
                                }}>
                                    <input name="title" className={d.input} defaultValue={node.title} aria-label="Title" autoFocus style={{ minHeight: 36 }} onKeyDown={(event) => { if (event.key === 'Escape') setEditing(null) }} />
                                    {level === 1 ? <select name="icon" className={d.select} defaultValue={node.icon ?? ''} aria-label="Icon" style={{ minHeight: 36, maxWidth: '8rem' }}><option value="">No icon</option>{ICONS.map((icon) => <option key={icon}>{icon}</option>)}</select> : null}
                                    <button className={`${d.btnPrimary} ${d.btnSm}`} type="submit">Save</button>
                                </form>
                            ) : (
                                <div className={d.titleCell} style={{ paddingInlineStart: `${(level - 1) * 1.5}rem` }}>
                                    <span className={d.handle} aria-hidden="true">⋮⋮</span>
                                    {node.children.length ? <button type="button" className={d.chev} onClick={() => toggle(node.id)} aria-expanded={open.has(node.id) || Boolean(shown)} aria-label={`Toggle ${node.title}`}>{open.has(node.id) || shown ? '▾' : '▸'}</button> : <span style={{ width: 28 }} />}
                                    <b title={node.title}>{node.title}</b>
                                </div>
                            )}
                            <select className={`${d.select} ${d.hideSm}`} style={{ minHeight: 36 }} aria-label={`Status of ${node.title}`} value={node.visibility === 'scheduled' ? 'draft' : node.visibility} onChange={(event) => run(() => setVisibility([node.id], event.target.value as 'draft'), 'Status changed')}>
                                <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
                            </select>
                            <span className={`${d.mono} ${d.hideSm}`}>{node.slug}</span>
                            <span className={`${d.hint} ${d.hideSm}`}>{level} of {MAX_DEPTH}</span>
                            <div className={d.rowActions}>
                                <button type="button" className={d.mini} aria-label={`Add child to ${node.title}`} title={level >= MAX_DEPTH ? 'Maximum depth reached' : 'Add child page'} disabled={level >= MAX_DEPTH} onClick={() => setAdding(node.id)}>+</button>
                                <button type="button" className={d.mini} aria-label={`Rename ${node.title}`} onClick={() => setEditing(node.id)}>Edit</button>
                                <button type="button" className={d.mini} aria-label={`Move ${node.title} up`} onClick={() => nudge(node, -1)}>↑</button>
                                <button type="button" className={d.mini} aria-label={`Move ${node.title} down`} onClick={() => nudge(node, 1)}>↓</button>
                                <button type="button" className={d.mini} aria-label={`Move ${node.title} to Trash`} onClick={() => remove([node.id])}>✕</button>
                            </div>
                        </div>
                        {adding === node.id ? addForm(node.id, node.id) : null}
                    </div>
                ))}
            </div>
            <p className={d.hint}>Drop on the top or bottom edge of a row to place it before or after. Drop in the middle to make it a child. Level-4 pages cannot have children.</p>
        </div>
    )
}