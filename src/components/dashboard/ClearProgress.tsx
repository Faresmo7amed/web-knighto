'use client'

import { clearProgress } from '@/app/dashboard/site/actions'
import { useToast } from './Toast'
import d from './dash.module.css'

// Danger-zone button: resets every reader's saved progress after a confirmation.
export function ClearProgress() {
    const toast = useToast()
    return (
        <div className={d.card} style={{ maxWidth: '44rem', borderColor: 'var(--danger)' }}>
            <h2 style={{ color: 'var(--danger)' }}>Danger zone</h2>
            <span className={d.hint}>Resets the saved progress version, so every reader starts again.</span>
            <div><button type="button" className={d.btnDanger} onClick={async () => { if (!window.confirm('Reset reading progress for every reader?')) return; const r = await clearProgress(); toast(r.ok ? 'Progress reset' : r.error ?? 'Failed', r.ok ? 'ok' : 'error') }}>Clear progress</button></div>
        </div>
    )
}