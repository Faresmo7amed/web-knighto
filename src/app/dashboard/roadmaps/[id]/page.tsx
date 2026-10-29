import { notFound } from 'next/navigation'
import { requireOwnerPage } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { RoadmapEditor } from '@/components/dashboard/RoadmapEditor'
import type { NodeData, RoadmapData } from '@/lib/dashboard/roadmap-types'

export const instant = false

export default async function EditRoadmap({ params }: { params: Promise<{ id: string }> }) {
    await requireOwnerPage()
    const { id } = await params
    const db = createAdminClient()
    const [roadmap, nodes, resources] = await Promise.all([
        db.from('roadmaps').select('id,slug,title,description,category,status,featured').eq('id', id).is('deleted_at', null).maybeSingle(),
        db.from('roadmap_nodes').select('id,parent_id,title,description,markdown,kind,is_locked,sort_order').eq('roadmap_id', id).is('deleted_at', null),
        db.from('node_resources').select('node_id,title,href,resource_type,sort_order').order('sort_order'),
    ])
    if (!roadmap.data) notFound()
    const ids = new Set((nodes.data ?? []).map((n) => n.id))
    const data: NodeData[] = (nodes.data ?? []).map((n) => ({
        ...n,
        resources: (resources.data ?? []).filter((r) => r.node_id === n.id && ids.has(r.node_id)).map((r) => ({ title: r.title, href: r.href, resource_type: r.resource_type })),
    })) as NodeData[]
    return <RoadmapEditor roadmap={roadmap.data as RoadmapData} nodes={data} />
}