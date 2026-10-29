import { sampleTree } from "@/data/sample-tree"
import { collectLeaves } from "@/lib/section-landing"

export type SectionHrefs = { slug: string; title: string; hrefs: string[] }

// Lists every readable page URL per section. Pass it to the progress components as props.
export function getSectionProgressData(): SectionHrefs[] {
    return sampleTree.map((section) => ({
        slug: section.slug,
        title: section.title,
        hrefs: collectLeaves(section).map((leaf) => leaf.href),
    }))
}