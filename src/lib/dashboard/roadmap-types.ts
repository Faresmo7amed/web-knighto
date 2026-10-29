export type ResourceData = { title: string; href: string; resource_type: 'docs' | 'article' | 'video' }
export type NodeKind = 'main' | 'sub' | 'optional' | 'alternative' | 'recommended'
export type NodeData = { id: string; parent_id: string | null; title: string; description: string; markdown: string; kind: NodeKind; is_locked: boolean; sort_order: number; resources: ResourceData[] }
export type RoadmapData = { id: string; slug: string; title: string; description: string; category: string; status: 'draft' | 'published' | 'archived'; featured: boolean }
export type NodeInput = Pick<NodeData, 'title' | 'description' | 'markdown' | 'kind' | 'is_locked' | 'resources'> & { parent_id: string | null }