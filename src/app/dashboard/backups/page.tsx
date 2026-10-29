import { requireOwnerPage } from '@/lib/auth'
import { BackupsPanel } from '@/components/dashboard/BackupsPanel'
import d from '@/components/dashboard/dash.module.css'

export const instant = false

export default async function BackupsScreen() {
    await requireOwnerPage()
    return (
        <div className={d.content}>
            <div className={d.pageHead}><div><h1>Backups</h1><p className={d.sub}>Export your content, or restore it from a file. A weekly full-database backup also runs on GitHub (Step 21b).</p></div></div>
            <BackupsPanel />
        </div>
    )
}