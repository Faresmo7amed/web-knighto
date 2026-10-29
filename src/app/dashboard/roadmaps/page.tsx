import { requireOwnerPage } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { RoadmapsManager, type RoadmapRow } from '@/components/dashboard/RoadmapsManager'
import d from '@/components/dashboard/dash.module.css'

export const instant = false

export default async function RoadmapsScreen() {
    await requireOwnerPage()
    const db = createAdminClient()
    const [roadmaps, nodes] = await Promise.all([
        db.from('roadmaps').select('id,slug,title,category,status,featured,updated_at').is('deleted_at', null).order('updated_at', { ascending: false }),
        db.from('roadmap_nodes').select('roadmap_id').is('deleted_at', null),
    ])
    if (roadmaps.error) return <div className={d.content}><div className={d.panelErr}>Could not load roadmaps: {roadmaps.error.message}</div></div>
    const counts = new Map<string, number>()
    ;(nodes.data ?? []).forEach((row) => counts.set(row.roadmap_id, (counts.get(row.roadmap_id) ?? 0) + 1))
    return <RoadmapsManager rows={(roadmaps.data ?? []).map((row) => ({ ...row, steps: counts.get(row.id) ?? 0 })) as RoadmapRow[]} />
}