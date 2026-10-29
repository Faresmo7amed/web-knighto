'use client'

import { useState } from 'react'
import { importBackup } from '@/app/dashboard/backups/actions'
import type { Result } from '@/lib/dashboard/types'
import { useToast } from './Toast'
import d from './dash.module.css'

// Export links plus import with a dry-run preview. Nothing is written until you click Apply.
export function BackupsPanel() {
    const toast = useToast()
    const [file, setFile] = useState<File | null>(null)
    const [mode, setMode] = useState<'add' | 'overwrite'>('add')
    const [sure, setSure] = useState(false)
    const [busy, setBusy] = useState(false)
    const [report, setReport] = useState<Result['report']>()
    const [applied, setApplied] = useState(false)

    async function run(action: 'dry' | 'apply') {
        if (!file) return
        if (action === 'apply' && !window.confirm('Apply this import now?')) return
        setBusy(true)
        const form = new FormData()
        form.set('file', file); form.set('action', action); form.set('mode', mode); form.set('confirm', sure ? 'yes' : '')
        const result = await importBackup(form)
        setBusy(false)
        if (!result.ok) return toast(result.error ?? 'Import failed.', 'error')
        setReport(result.report)
        setApplied(action === 'apply')
        toast(action === 'apply' ? 'Import finished' : 'Preview ready. Nothing was changed.')
    }

    return (
        <div className={d.split}>
            <section className={d.card}>
                <h2>Export</h2>
                <p className={d.hint}>Download a copy of pages, articles, roadmaps, settings and media records. Image files stay in R2 (see Step 21b for backing them up).</p>
                <div className={d.actions}>
                    <a className={d.btnPrimary} href="/api/backups/export" download>Download JSON</a>
                    <a className={d.btn} href="/api/backups/export?format=zip" download>Download Markdown ZIP</a>
                </div>
                <p className={d.hint}>Download one every month and keep it outside the cloud, for example on an external drive.</p>
            </section>
            <section className={d.card}>
                <h2>Import</h2>
                <div className={d.field}><label className={d.label} htmlFor="imp">Backup file (site-export.json)</label><input id="imp" type="file" accept=".json,application/json" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setReport(undefined); setApplied(false) }} /></div>
                <div className={d.field}><label className={d.label} htmlFor="mode">Mode</label>
                    <select id="mode" className={d.select} value={mode} onChange={(e) => setMode(e.target.value as 'add')}><option value="add">Add missing items only (safe)</option><option value="overwrite">Overwrite items that already exist</option></select></div>
                {mode === 'overwrite' ? <label className={d.switchRow}>I understand existing items will be replaced<input type="checkbox" checked={sure} onChange={(e) => setSure(e.target.checked)} /></label> : null}
                <div className={d.actions}>
                    <button type="button" className={d.btn} disabled={!file || busy} onClick={() => run('dry')}>Preview (dry run)</button>
                    <button type="button" className={d.btnPrimary} disabled={!file || busy || !report || applied || (mode === 'overwrite' && !sure)} onClick={() => run('apply')}>Apply import</button>
                </div>
                {report ? (
                    <div className={d.tableWrap}><table className={d.table}><thead><tr><th>Table</th><th>In file</th><th>New</th><th>Already there</th></tr></thead>
                        <tbody>{report.map((row) => <tr key={row.table}><td>{row.table}</td><td>{row.total}</td><td>{row.fresh}</td><td>{row.existing}</td></tr>)}</tbody></table></div>
                ) : null}
                {applied ? <p className={d.notice}>Done. Check Pages and Articles.</p> : null}
            </section>
        </div>
    )
}