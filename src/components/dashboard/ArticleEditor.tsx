'use client'

import Link from 'next/link'
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { getVersion, listVersions, saveArticle } from '@/app/dashboard/articles/actions'
import { trashPage } from '@/app/dashboard/pages/actions'
import { uploadImage } from '@/lib/dashboard/upload'
import type { ArticlePayload, VersionRow } from '@/lib/dashboard/types'
import { useToast } from './Toast'
import d from './dash.module.css'

// Preview sanitizer: the default schema plus `dir`, so per-block direction shows in the preview.
const schema = { ...defaultSchema, attributes: { ...defaultSchema.attributes, div: [...(defaultSchema.attributes?.div ?? []), 'dir'], p: [...(defaultSchema.attributes?.p ?? []), 'dir'] } }
const LANGS = ['javascript', 'typescript', 'jsx', 'tsx', 'html', 'css', 'json', 'yaml', 'bash', 'powershell', 'python', 'c', 'cpp', 'csharp', 'java', 'go', 'rust', 'php', 'sql', 'dockerfile', 'markdown', 'text']
const ICONS = ['code', 'layers', 'js', 'react', 'ts', 'server']
const TABLE = '| Column | Column |\n| --- | --- |\n| Cell | Cell |\n'

// Callout syntax in one place. Change this if your renderer expects another syntax (check content/sample.md).
const callout = (type: string, text: string) => `:::${type}\n${text}\n:::\n`

const SLASH = [
    { key: 'h2', label: 'Heading 2', text: '## ' }, { key: 'h3', label: 'Heading 3', text: '### ' },
    { key: 'list', label: 'Bulleted list', text: '- ' }, { key: 'quote', label: 'Quote', text: '> ' },
    { key: 'code', label: 'Code block', text: '```js\n\n```\n' }, { key: 'table', label: 'Table', text: TABLE },
    { key: 'tip', label: 'Tip callout', text: callout('tip', 'Text') }, { key: 'note', label: 'Note callout', text: callout('note', 'Text') },
    { key: 'warning', label: 'Warning callout', text: callout('warning', 'Text') }, { key: 'rtl', label: 'Right-to-left block', text: '<div dir="rtl">\n\n\n\n</div>\n' },
]

type Tab = 'settings' | 'outline' | 'history'
type View = 'split' | 'editor' | 'preview'

// Converts an ISO date to the value format of <input type="datetime-local">.
function toLocalInput(iso: string | null) {
    if (!iso) return ''
    const date = new Date(iso)
    return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

// The full article editor: markdown with toolbar, slash menu, live preview, autosave, versions and page settings.
export function ArticleEditor({ id, initial, parents, publicPath }: { id: string; initial: ArticlePayload; parents: { id: string; label: string; disabled: boolean }[]; publicPath: string }) {
    const router = useRouter()
    const toast = useToast()
    const ta = useRef<HTMLTextAreaElement>(null)
    const fileInput = useRef<HTMLInputElement>(null)
    const [f, setF] = useState<ArticlePayload>(initial)
    const [savedJson, setSavedJson] = useState(() => JSON.stringify(initial))
    const [failedJson, setFailedJson] = useState('')
    const [busy, setBusy] = useState(false)
    const [savedAt, setSavedAt] = useState('')
    const [view, setView] = useState<View>('split')
    const [tab, setTab] = useState<Tab>('settings')
    const [versions, setVersions] = useState<VersionRow[] | null>(null)
    const [slash, setSlash] = useState<{ from: number; query: string } | null>(null)
    const [slashIndex, setSlashIndex] = useState(0)
    const [codeOpen, setCodeOpen] = useState(false)
    const [code, setCode] = useState({ lang: 'javascript', file: '', lines: '' })
    const [uploading, setUploading] = useState(false)

    const json = JSON.stringify(f)
    const dirty = json !== savedJson
    const set = <K extends keyof ArticlePayload>(key: K, value: ArticlePayload[K]) => setF((prev) => ({ ...prev, [key]: value }))

    // Saves one snapshot. Used by autosave, the Save button and Publish.
    const save = useCallback(async (mode: 'auto' | 'manual' | 'publish', payload: ArticlePayload) => {
        setBusy(true)
        const snapshot = JSON.stringify(payload)
        const result = await saveArticle(id, payload, mode)
        setBusy(false)
        if (!result.ok) { setFailedJson(snapshot); if (mode !== 'auto') toast(result.error ?? 'Could not save.', 'error'); return false }
        setSavedJson(snapshot)
        setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        if (mode !== 'auto') toast(mode === 'publish' ? 'Published' : 'Saved')
        return true
    }, [id, toast])

    // Autosave two seconds after the last change. A failed snapshot is not retried until something changes.
    useEffect(() => {
        if (!dirty || busy || json === failedJson) return
        const timer = setTimeout(() => { void save('auto', JSON.parse(json)) }, 2000)
        return () => clearTimeout(timer)
    }, [json, dirty, busy, failedJson, save])

    // Warns before leaving with unsaved changes.
    useEffect(() => {
        if (!dirty) return
        const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
        window.addEventListener('beforeunload', warn)
        return () => window.removeEventListener('beforeunload', warn)
    }, [dirty])

    // Runs a text edit on the textarea and puts the selection back afterwards.
    function edit(fn: (value: string, start: number, end: number) => { text: string; from: number; to: number }) {
        const el = ta.current
        if (!el) return
        const result = fn(el.value, el.selectionStart, el.selectionEnd)
        set('markdown', result.text)
        requestAnimationFrame(() => { el.focus(); el.setSelectionRange(result.from, result.to) })
    }
    const wrap = (before: string, after: string, placeholder: string) => edit((v, s, e) => {
        const selected = v.slice(s, e) || placeholder
        return { text: v.slice(0, s) + before + selected + after + v.slice(e), from: s + before.length, to: s + before.length + selected.length }
    })
    const prefix = (mark: string) => edit((v, s, e) => {
        const start = v.lastIndexOf('\n', s - 1) + 1
        const block = v.slice(start, e).split('\n').map((line) => mark + line).join('\n')
        return { text: v.slice(0, start) + block + v.slice(e), from: s + mark.length, to: start + block.length }
    })
    const block = (text: string) => edit((v, s, e) => {
        const lead = s > 0 && v[s - 1] !== '\n' ? '\n\n' : ''
        const at = s + lead.length + text.length
        return { text: v.slice(0, s) + lead + text + v.slice(e), from: at, to: at }
    })
    const around = (make: (selected: string) => string) => edit((v, s, e) => {
        const text = make(v.slice(s, e) || 'Text')
        return { text: v.slice(0, s) + text + v.slice(e), from: s + text.length, to: s + text.length }
    })

    // Slash menu: detect "/word" at the start of the current line.
    function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const value = event.target.value
        set('markdown', value)
        const pos = event.target.selectionStart
        const lineStart = value.lastIndexOf('\n', pos - 1) + 1
        const match = /^\/(\w*)$/.exec(value.slice(lineStart, pos))
        setSlash(match ? { from: lineStart, query: match[1] } : null)
        setSlashIndex(0)
    }
    const slashItems = useMemo(() => SLASH.filter((item) => !slash || item.key.startsWith(slash.query.toLowerCase()) || item.label.toLowerCase().includes(slash.query.toLowerCase())), [slash])
    function applySlash(item: (typeof SLASH)[number]) {
        const el = ta.current
        if (!slash || !el) return
        const end = el.selectionStart
        const text = f.markdown.slice(0, slash.from) + item.text + f.markdown.slice(end)
        set('markdown', text)
        setSlash(null)
        requestAnimationFrame(() => { el.focus(); el.setSelectionRange(slash.from + item.text.length, slash.from + item.text.length) })
    }
    function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); void save('manual', f); return }
        if (!slash || !slashItems.length) return
        if (event.key === 'ArrowDown') { event.preventDefault(); setSlashIndex((slashIndex + 1) % slashItems.length) }
        else if (event.key === 'ArrowUp') { event.preventDefault(); setSlashIndex((slashIndex - 1 + slashItems.length) % slashItems.length) }
        else if (event.key === 'Enter') { event.preventDefault(); applySlash(slashItems[slashIndex]) }
        else if (event.key === 'Escape') setSlash(null)
    }

    // Uploads dropped, pasted or picked images and inserts them as markdown images.
    async function addImages(files: File[]) {
        const images = files.filter((file) => file.type.startsWith('image/'))
        if (!images.length) return
        setUploading(true)
        for (const file of images) {
            const result = await uploadImage(file)
            if (!result.ok || !result.media) { toast(result.error ?? 'Upload failed.', 'error'); continue }
            block(`![${file.name.replace(/\.[^.]+$/, '')}](${result.media.public_url})\n`)
        }
        setUploading(false)
    }
    async function uploadBanner(file: File | undefined) {
        if (!file) return
        const result = await uploadImage(file)
        if (result.ok && result.media) set('banner_url', result.media.public_url)
        else toast(result.error ?? 'Upload failed.', 'error')
    }

    function insertCode() {
        const meta = [code.file ? `title="${code.file}"` : '', code.lines ? `{${code.lines}}` : ''].filter(Boolean).join(' ')
        edit((v, s, e) => {
            const selected = v.slice(s, e) || '// code'
            const text = '```' + code.lang + (meta ? ' ' + meta : '') + '\n' + selected + '\n```\n'
            return { text: v.slice(0, s) + text + v.slice(e), from: s + text.length, to: s + text.length }
        })
        setCodeOpen(false)
    }

    // Outline of headings, rebuilt from a deferred copy so typing stays fast on long articles.
    const deferred = useDeferredValue(f.markdown)
    const outline = useMemo(() => {
        const out: { level: number; text: string; line: number }[] = []
        let fenced = false
        deferred.split('\n').forEach((line, index) => {
            if (line.startsWith('```')) fenced = !fenced
            if (fenced) return
            const match = /^(#{1,4})\s+(.+)/.exec(line)
            if (match) out.push({ level: match[1].length, text: match[2], line: index })
        })
        return out
    }, [deferred])
    function gotoLine(line: number) {
        const el = ta.current
        if (!el) return
        const position = el.value.split('\n').slice(0, line).join('\n').length + (line > 0 ? 1 : 0)
        el.focus()
        el.setSelectionRange(position, position)
        el.scrollTop = Math.max(0, line * (parseFloat(getComputedStyle(el).lineHeight) || 22) - 80)
    }
    const words = useMemo(() => deferred.trim().split(/\s+/).filter(Boolean).length, [deferred])

    async function openTab(next: Tab) {
        setTab(next)
        if (next === 'history') {
            const result = await listVersions(id)
            if (result.ok) setVersions(result.versions ?? [])
        }
    }
    async function restore(versionId: string) {
        if (!window.confirm('Restore this version? Your current text is saved as a version first.')) return
        if (dirty && !(await save('manual', f))) return
        const result = await getVersion(versionId)
        if (!result.ok) return toast(result.error ?? 'Could not load the version.', 'error')
        setF((prev) => ({ ...prev, markdown: result.markdown ?? '', title: result.title ?? prev.title }))
        toast('Version restored. It will be saved automatically.')
    }
    async function publish() {
        const next = { ...f, visibility: 'published' as const }
        setF(next)
        await save('publish', next)
    }
    async function unpublish() {
        const next = { ...f, visibility: 'draft' as const }
        setF(next)
        await save('manual', next)
    }
    async function trash() {
        if (!window.confirm('Move this article to the Trash?')) return
        const result = await trashPage([id])
        if (!result.ok) return toast(result.error ?? 'Could not move to Trash.', 'error')
        setSavedJson(json)
        router.push('/dashboard/articles')
    }

    const status = busy ? 'Saving…' : dirty ? (json === failedJson ? 'Could not save' : 'Unsaved changes') : savedAt ? `Saved at ${savedAt}` : 'All changes saved'
    const previewDir = f.direction === 'auto' ? undefined : f.direction

    return (
        <div className={d.content}>
            <div className={d.editorTop}>
                <input className={`${d.input} ${d.titleInput}`} aria-label="Title" value={f.title} onChange={(event) => set('title', event.target.value)} />
                <div className={d.actions}>
                    <span className={`${d.badge} ${f.visibility === 'published' ? d.bOk : d.bWarn}`}>{f.visibility}</span>
                    <span className={d.status} role="status">{status}</span>
                    <div className={d.tabs} role="group" aria-label="View">
                        {(['split', 'editor', 'preview'] as View[]).map((item) => <button key={item} type="button" className={`${d.tab} ${view === item ? d.tabOn : ''}`} onClick={() => setView(item)}>{item === 'preview' ? 'Preview as visitor' : item[0].toUpperCase() + item.slice(1)}</button>)}
                    </div>
                    <button type="button" className={d.btn} disabled={busy || !dirty} onClick={() => save('manual', f)}>Save</button>
                    {f.visibility === 'published' ? <button type="button" className={d.btn} onClick={unpublish}>Unpublish</button> : null}
                    <button type="button" className={d.btnPrimary} disabled={busy} onClick={publish}>{f.visibility === 'published' ? 'Update' : 'Publish'}</button>
                </div>
            </div>
            <div className={d.editorGrid}>
                <div className={d.editorBox}>
                    {view !== 'preview' ? (
                        <div className={d.tbBar} role="toolbar" aria-label="Formatting">
                            <button type="button" className={d.tb} onClick={() => prefix('## ')} title="Heading 2">H2</button>
                            <button type="button" className={d.tb} onClick={() => prefix('### ')} title="Heading 3">H3</button>
                            <button type="button" className={d.tb} onClick={() => wrap('**', '**', 'bold')} title="Bold"><b>B</b></button>
                            <button type="button" className={d.tb} onClick={() => wrap('*', '*', 'italic')} title="Italic"><i>I</i></button>
                            <button type="button" className={d.tb} onClick={() => wrap('`', '`', 'code')} title="Inline code">{'</>'}</button>
                            <button type="button" className={d.tb} onClick={() => wrap('[', '](https://)', 'link text')} title="Link">Link</button>
                            <button type="button" className={d.tb} onClick={() => prefix('- ')} title="List">List</button>
                            <button type="button" className={d.tb} onClick={() => prefix('> ')} title="Quote">Quote</button>
                            <button type="button" className={d.tb} onClick={() => block(TABLE)} title="Table">Table</button>
                            <button type="button" className={d.tb} onClick={() => fileInput.current?.click()} title="Image">{uploading ? 'Uploading…' : 'Image'}</button>
                            <button type="button" className={d.tb} onClick={() => setCodeOpen(!codeOpen)} aria-expanded={codeOpen} title="Code block options">Code block</button>
                            <select className={d.tb} aria-label="Insert callout" value="" onChange={(event) => { if (event.target.value) around((text) => callout(event.target.value, text)) }}>
                                <option value="">Callout</option>{['note', 'tip', 'warning', 'danger', 'info'].map((type) => <option key={type}>{type}</option>)}
                            </select>
                            <button type="button" className={d.tb} onClick={() => around((text) => `<div dir="rtl">\n\n${text}\n\n</div>\n`)} title="Right-to-left block">RTL</button>
                            <button type="button" className={d.tb} onClick={() => around((text) => `<div dir="ltr">\n\n${text}\n\n</div>\n`)} title="Left-to-right block">LTR</button>
                            <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(event) => { void addImages([...(event.target.files ?? [])]); event.target.value = '' }} />
                        </div>
                    ) : null}
                    {codeOpen && view !== 'preview' ? (
                        <div className={d.codePanel}>
                            <div className={d.field}><label className={d.label} htmlFor="c-lang">Language</label><select id="c-lang" className={d.select} value={code.lang} onChange={(event) => setCode({ ...code, lang: event.target.value })}>{LANGS.map((lang) => <option key={lang}>{lang}</option>)}</select></div>
                            <div className={d.field}><label className={d.label} htmlFor="c-file">File name</label><input id="c-file" className={d.input} value={code.file} placeholder="app.js" onChange={(event) => setCode({ ...code, file: event.target.value })} /></div>
                            <div className={d.field}><label className={d.label} htmlFor="c-lines">Highlight lines</label><input id="c-lines" className={d.input} value={code.lines} placeholder="1,3-5" onChange={(event) => setCode({ ...code, lines: event.target.value })} /></div>
                            <button type="button" className={d.btnPrimary} onClick={insertCode}>Insert</button>
                        </div>
                    ) : null}
                    <div className={`${d.panes} ${view !== 'split' ? d.panesOne : ''}`}>
                        {view !== 'preview' ? (
                            <div className={`${d.pane} ${d.relative}`}>
                                <div className={d.paneLabel}>MARKDOWN</div>
                                {slash && slashItems.length ? (
                                    <div className={d.slash} role="listbox" aria-label="Insert block">
                                        {slashItems.map((item, index) => <button key={item.key} type="button" role="option" aria-selected={index === slashIndex} className={index === slashIndex ? d.slashOn : ''} onMouseDown={(event) => { event.preventDefault(); applySlash(item) }}>{item.label}</button>)}
                                    </div>
                                ) : null}
                                <textarea
                                    ref={ta} className={d.mdArea} dir="auto" spellCheck aria-label="Markdown" value={f.markdown}
                                    onChange={onChange} onKeyDown={onKeyDown}
                                    onPaste={(event) => { if (event.clipboardData.files.length) { event.preventDefault(); void addImages([...event.clipboardData.files]) } }}
                                    onDrop={(event) => { if (event.dataTransfer.files.length) { event.preventDefault(); void addImages([...event.dataTransfer.files]) } }}
                                    onDragOver={(event) => event.preventDefault()}
                                />
                            </div>
                        ) : null}
                        {view !== 'editor' ? (
                            <div className={d.pane}>
                                <div className={d.paneLabel}>{view === 'preview' ? 'AS A VISITOR WOULD SEE IT (SIMPLIFIED)' : 'LIVE PREVIEW'}</div>
                                <div className={d.preview} dir={previewDir}>
                                    <h1 style={{ marginTop: 0 }}>{f.title}</h1>
                                    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}>{deferred}</Markdown>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className={d.footBar}><span>{words} words · {Math.max(1, Math.ceil(words / 200))} min read</span><span>Markdown · Autosave on · Ctrl S saves</span></div>
                </div>

                <aside className={d.side} aria-label="Article tools">
                    <div className={d.tabs} role="tablist">
                        {(['settings', 'outline', 'history'] as Tab[]).map((item) => <button key={item} role="tab" aria-selected={tab === item} type="button" className={`${d.tab} ${tab === item ? d.tabOn : ''}`} onClick={() => void openTab(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}
                    </div>
                    {tab === 'outline' ? (
                        <div className={`${d.sideBox} ${d.outlineScroll}`}>
                            {outline.length ? outline.map((item) => <button key={item.line} type="button" className={d.outlineItem} style={{ paddingInlineStart: `${item.level * 0.5}rem` }} onClick={() => gotoLine(item.line)}>{item.text}</button>) : <span className={d.hint}>Headings appear here as you write them.</span>}
                        </div>
                    ) : null}
                    {tab === 'history' ? (
                        <div className={d.sideBox}>
                            <b>Version history</b>
                            {versions === null ? <span className={d.hint}>Loading…</span> : versions.length === 0 ? <span className={d.hint}>No versions yet. One is saved when you click Save or Publish.</span> : versions.map((version) => (
                                <div key={version.id} className={d.versionRow}><span>{new Date(version.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span><button type="button" className={`${d.btn} ${d.btnSm}`} onClick={() => void restore(version.id)}>Restore</button></div>
                            ))}
                        </div>
                    ) : null}
                    {tab === 'settings' ? (
                        <>
                            <div className={d.sideBox}>
                                <div className={d.field}><label className={d.label} htmlFor="slug">URL name</label><input id="slug" className={d.input} value={f.slug} onChange={(event) => set('slug', event.target.value.toLowerCase())} />{!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(f.slug) ? <span className={d.errorText}>Lowercase letters, numbers and hyphens only.</span> : null}</div>
                                <div className={d.field}><label className={d.label} htmlFor="type">Type</label><select id="type" className={d.select} value={f.kind} onChange={(event) => set('kind', event.target.value as ArticlePayload['kind'])}><option value="article">Article</option><option value="topic">Topic main page</option><option value="cheatsheet">Cheat sheet</option></select></div>
                                <div className={d.field}><label className={d.label} htmlFor="parent">Parent page</label><select id="parent" className={d.select} value={f.parent_id ?? ''} onChange={(event) => set('parent_id', event.target.value || null)}><option value="">Top level</option>{parents.map((parent) => <option key={parent.id} value={parent.id} disabled={parent.disabled}>{parent.label}</option>)}</select></div>
                                {f.kind === 'topic' ? (
                                    <>
                                        <div className={d.field}><label className={d.label} htmlFor="icon">Icon</label><select id="icon" className={d.select} value={f.icon} onChange={(event) => set('icon', event.target.value)}><option value="">None</option>{ICONS.map((icon) => <option key={icon}>{icon}</option>)}</select></div>
                                        <div className={d.field}><span className={d.label}>Banner</span><div className={d.bannerPreview} style={f.banner_url ? { backgroundImage: `url(${f.banner_url})` } : undefined} role="img" aria-label="Banner preview" /><input className={d.input} value={f.banner_url} placeholder="https://…" aria-label="Banner address" onChange={(event) => set('banner_url', event.target.value)} /><input type="file" accept="image/*" aria-label="Upload banner" onChange={(event) => void uploadBanner(event.target.files?.[0])} /><span className={d.hint}>A gradient is used when no image is set.</span></div>
                                    </>
                                ) : null}
                                <div className={d.field}><label className={d.label} htmlFor="desc">Description</label><textarea id="desc" className={d.textarea} rows={3} maxLength={160} value={f.description} onChange={(event) => set('description', event.target.value)} /><span className={d.hint}>{f.description.length} / 160</span></div>
                                <div className={d.field}><label className={d.label} htmlFor="tags">Tags</label><input id="tags" className={d.input} value={f.tags} placeholder="javascript, scope" onChange={(event) => set('tags', event.target.value)} /><span className={d.hint}>Separate with commas.</span></div>
                            </div>
                            <div className={d.sideBox}>
                                <div className={d.field}><label className={d.label} htmlFor="status">Status</label><select id="status" className={d.select} value={f.visibility} onChange={(event) => set('visibility', event.target.value as ArticlePayload['visibility'])}><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option><option value="archived">Archived</option></select></div>
                                {f.visibility === 'scheduled' ? <div className={d.field}><label className={d.label} htmlFor="when">Publish on</label><input id="when" type="datetime-local" className={d.input} value={toLocalInput(f.scheduled_at)} onChange={(event) => set('scheduled_at', event.target.value ? new Date(event.target.value).toISOString() : null)} /></div> : null}
                                <div className={d.field}><label className={d.label} htmlFor="dir">Page direction</label><select id="dir" className={d.select} value={f.direction} onChange={(event) => set('direction', event.target.value as ArticlePayload['direction'])}><option value="auto">Auto</option><option value="ltr">Left to right</option><option value="rtl">Right to left</option></select></div>
                                <div className={d.field}><label className={d.label} htmlFor="locale">Language</label><select id="locale" className={d.select} value={f.locale} onChange={(event) => set('locale', event.target.value as 'en' | 'ar')}><option value="en">English</option><option value="ar">Arabic</option></select></div>
                                <label className={d.switchRow}>Package manager tabs<input type="checkbox" checked={f.package_tabs} onChange={(event) => set('package_tabs', event.target.checked)} /></label>
                            </div>
                            <div className={d.sideBox}>
                                <b>Search engines</b>
                                <div className={d.field}><label className={d.label} htmlFor="seot">SEO title</label><input id="seot" className={d.input} value={f.seo_title} onChange={(event) => set('seo_title', event.target.value)} /></div>
                                <div className={d.field}><label className={d.label} htmlFor="seod">SEO description</label><textarea id="seod" className={d.textarea} rows={3} value={f.seo_description} onChange={(event) => set('seo_description', event.target.value)} /></div>
                            </div>
                            <div className={d.sideBox}>
                                {f.visibility === 'published' ? <Link href={publicPath} target="_blank" className={d.btn}>View on site ↗</Link> : null}
                                <button type="button" className={d.btnDanger} onClick={trash}>Move to Trash</button>
                            </div>
                        </>
                    ) : null}
                </aside>
            </div>
        </div>
    )
}