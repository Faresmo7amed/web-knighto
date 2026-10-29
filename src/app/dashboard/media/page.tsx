import { requireOwnerPage } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { MediaLibrary } from '@/components/dashboard/MediaLibrary'
import type { MediaRow } from '@/lib/dashboard/types'
import d from '@/components/dashboard/dash.module.css'

export const instant = false

export default async function MediaScreen() {
    await requireOwnerPage()
    const { data, error } = await createAdminClient().from('media').select('*').is('deleted_at', null).order('created_at', { ascending: false })
    if (error) return <div className={d.content}><div className={d.panelErr}>Could not load media: {error.message}</div></div>
    return <MediaLibrary items={(data ?? []) as MediaRow[]} />
}