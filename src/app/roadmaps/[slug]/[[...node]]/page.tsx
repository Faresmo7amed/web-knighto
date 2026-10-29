import { Suspense } from "react"
import { notFound } from "next/navigation"
import { StaticShell } from "@/components/static/StaticShell"
import { RoadmapView } from "@/components/roadmap/RoadmapView"
import { findRoadmapNode, flattenNodes, getRoadmap, roadmaps } from "@/data/sample-roadmaps"

// Lists every roadmap URL and every step URL so they are built ahead of time.
export function generateStaticParams() {
    return roadmaps.flatMap((roadmap) => [
        { slug: roadmap.slug, node: [] as string[] },
        ...flattenNodes(roadmap).map((n) => ({ slug: roadmap.slug, node: [n.id] })),
    ])
}

export default function RoadmapRoute({ params }: { params: Promise<{ slug: string; node?: string[] }> }) {
    return (
        <Suspense fallback={null}>
            <RoadmapContent params={params} />
        </Suspense>
    )
}

async function RoadmapContent({ params }: { params: Promise<{ slug: string; node?: string[] }> }) {
    const { slug, node } = await params
    const roadmap = getRoadmap(slug)
    if (!roadmap) notFound()

    const id = node?.[0]
    const current = id ? findRoadmapNode(roadmap, id) : undefined
    if (id && (!current || (node?.length ?? 0) > 1)) notFound()

    return (
        <StaticShell>
            <RoadmapView roadmap={roadmap} current={current} />
        </StaticShell>
    )
}