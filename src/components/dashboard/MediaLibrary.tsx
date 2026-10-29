'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteMedia, getMediaUsage, updateMediaAlt } from '@/app/dashboard/media/actions'
import { uploadImage } from '@/lib/dashboard/upload'
import type { MediaRow } from '@/lib/dashboard/types'
import { useToast } from './Toast'
import d from './dash.module.css'

const size = (bytes: number) => (bytes > 1_048_576 ? `${(bytes / 1_048_576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`)
const nameOf = (key: string) => key.split('/').pop() ?? key

// Child of MediaLibrary: alt text, link, usage and delete for one file. Re-created per file through `key`.
function MediaDetail({ item, onChanged }: { item: MediaRow; onChanged: () => void }) {
    const toast = useToast()
    const [alt, setAlt] = useState(item.alt_text)
    const [usage, setUsage] = useState<string[] | null>(null)
    const [, start] = useTransition()

    useEffect(() => {
        let alive = true
        getMediaUsage(item.id).then((result) => { if (alive) setUsage(result.usage ?? []) })
        return () => { alive = false }
    }, [item.id])

    return (
        <aside className={d.sideBox} aria-label="File details">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={d.thumb} style={{ height: '9rem', borderRadius: 'var(--radius-md)' }} src={item.public_url} alt={item.alt_text} />
            <div><b>{nameOf(item.object_key)}</b><div className={d.hint}>{size(item.byte_size)} · {item.mime_type} · Added {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</div></div>
            <div className={d.field}><label className={d.label} htmlFor="alt">Alt text</label><input id="alt" className={d.input} value={alt} onChange={(event) => setAlt(event.target.value)} /><span className={d.hint}>Describe the image for screen readers.</span></div>
            <button type="button" className={d.btnPrimary} disabled={alt === item.alt_text} onClick={() => start(async () => { const result = await updateMediaAlt(item.id, alt); if (result.ok) { toast('Alt text saved'); onChanged() } else toast(result.error ?? 'Could not save.', 'error') })}>Save alt text</button>
            <div className={d.field}><span className={d.label}>Link</span><div className={d.actions}><span className={d.mono} style={{ flex: 1 }}>{item.public_url}</span><button type="button" className={`${d.btn} ${d.btnSm}`} onClick={() => { void navigator.clipboard.writeText(item.public_url); toast('Link copied') }}>Copy</button></div></div>
            <div><span className={d.label}>{usage === null ? 'Checking usage…' : usage.length ? `Used in ${usage.length} page${usage.length > 1 ? 's' : ''}` : 'Not used anywhere'}</span>{usage?.map((title) => <div key={title} className={d.hint}>{title}</div>)}</div>
            {usage?.length ? <span className={d.hint}>Deleting this file leaves those pages without the image.</span> : null}
            <button type="button" className={d.btnDanger} onClick={() => { if (window.confirm('Delete this file forever?')) start(async () => { const result = await deleteMedia(item.id); if (result.ok) { toast('File deleted'); onChanged() } else toast(result.error ?? 'Could not delete.', 'error') }) }}>Delete</button>
        </aside>
    )
}

// Media grid with drag-and-drop upload (progress), search and a details panel.
export function MediaLibrary({ items }: { items: MediaRow[] }) {
    const router = useRouter()
    const toast = useToast()
    const [query, setQuery] = useState('')
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [over, setOver] = useState(false)
    const [uploads, setUploads] = useState<{ name: string; percent: number }[]>([])

    async function upload(files: File[]) {
        for (const file of files) {
            setUploads((list) => [...list, { name: file.name, percent: 0 }])
            const result = await uploadImage(file, (percent) => setUploads((list) => list.map((row) => (row.name === file.name ? { ...row, percent } : row))))
            setUploads((list) => list.filter((row) => row.name !== file.name))
            if (!result.ok) toast(`${file.name}: ${result.error}`, 'error')
        }
        router.refresh()
    }
    const list = items.filter((item) => (nameOf(item.object_key) + ' ' + item.alt_text).toLowerCase().includes(query.toLowerCase()))
    const selected = items.find((item) => item.id === selectedId)

    return (
        <div className={d.content}>
            <div className={d.pageHead}><div><h1>Media</h1><p className={d.sub}>Images used across the site. {items.length} files.</p></div></div>
            <label className={`${d.dropZone} ${over ? d.dropOver : ''}`} onDragOver={(event) => { event.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={(event) => { event.preventDefault(); setOver(false); void upload([...event.dataTransfer.files]) }}>
                <b>Drop images here, or choose them</b><span className={d.hint}>JPG, PNG, WebP, GIF or AVIF, up to 10 MB each</span>
                <input type="file" accept="image/*" multiple hidden onChange={(event) => { void upload([...(event.target.files ?? [])]); event.target.value = '' }} />
                <span className={d.btn}>Choose files</span>
            </label>
            {uploads.map((row) => <div key={row.name} className={d.uploadRow}><b>{row.name}</b><div className={d.progress}><div style={{ width: `${row.percent}%` }} /></div></div>)}
            <div className={d.toolbar}><input className={`${d.input} ${d.search}`} placeholder="Search files or alt text" aria-label="Search media" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
            <div className={d.mediaLayout}>
                {list.length === 0 ? <div className={d.empty}><b>{items.length ? 'No files match' : 'No files yet'}</b><span>{items.length ? 'Try another search.' : 'Upload your first image above.'}</span></div> : (
                    <div className={d.mediaGrid}>
                        {list.map((item) => (
                            <button key={item.id} type="button" className={`${d.mediaCard} ${selectedId === item.id ? d.mediaCardOn : ''}`} onClick={() => setSelectedId(item.id)} aria-pressed={selectedId === item.id}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img className={d.thumb} src={item.public_url} alt={item.alt_text} loading="lazy" />
                                <span className={d.mediaMeta}><b>{nameOf(item.object_key)}</b>{size(item.byte_size)}{!item.alt_text ? <span className={`${d.badge} ${d.bWarn}`} style={{ alignSelf: 'flex-start', marginTop: 4 }}>No alt text</span> : null}</span>
                            </button>
                        ))}
                    </div>
                )}
                {selected ? <MediaDetail key={selected.id} item={selected} onChanged={() => { setSelectedId(null); router.refresh() }} /> : <div className={d.sideBox}><span className={d.hint}>Select a file to edit its alt text, copy its link or delete it.</span></div>}
            </div>
        </div>
    )
}