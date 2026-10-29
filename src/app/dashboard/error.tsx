'use client'

import d from '@/components/dashboard/dash.module.css'

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className={d.content}>
            <div className={d.empty}><b>Could not load this page</b><span>{error.message}</span><button type="button" className={d.btn} onClick={reset}>Try again</button></div>
        </div>
    )
}