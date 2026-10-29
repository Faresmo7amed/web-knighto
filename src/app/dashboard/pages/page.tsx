import { requireOwnerPage } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { PagesTree } from '@/components/dashboard/PagesTree'
import { PAGE_COLUMNS, type PageRow } from '@/lib/dashboard/types'
import d from '@/components/dashboard/dash.module.css'

export const instant = false

export default async function PagesScreen() {
    await requireOwnerPage()
    const { data, error } = await createAdminClient().from('pages').select(PAGE_COLUMNS).is('deleted_at', null)
    if (error) return <div className={d.content}><div className={d.panelErr}>Could not load pages: {error.message}</div></div>
    return <PagesTree rows={(data ?? []) as PageRow[]} />
}