import { requireOwnerPage } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { ArticlesTable } from '@/components/dashboard/ArticlesTable'
import { PAGE_COLUMNS, type PageRow } from '@/lib/dashboard/types'
import d from '@/components/dashboard/dash.module.css'

export const instant = false

export default async function ArticlesScreen() {
    await requireOwnerPage()
    const { data, error } = await createAdminClient().from('pages').select(PAGE_COLUMNS).is('deleted_at', null)
    if (error) return <div className={d.content}><div className={d.panelErr}>Could not load articles: {error.message}</div></div>
    return <ArticlesTable rows={(data ?? []) as PageRow[]} />
}