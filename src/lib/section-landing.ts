import type { TreeNode, TreeSection } from "@/data/sample-tree"

export type Leaf = {
    title: string
    href: string
    trail: string[]
}

// Builds a URL like /frontend/javascript/objects from a section and slug path
export function pageHref(section: TreeSection, slugs: string[]): string {
    return "/" + [section.slug, ...slugs].join("/")
}

// Counts every descendant page under a node. Use it for the "N pages" label on cards.
export function countPages(node: TreeNode): number {
    const kids = node.children ?? []
    return kids.reduce((sum, child) => sum + 1 + countPages(child), 0)
}

// Flattens a section into its readable end pages (nodes with no children). Use it for Popular/Latest.
export function collectLeaves(
    section: TreeSection,
    nodes: TreeNode[] = section.children,
    slugs: string[] = [],
    titles: string[] = []
): Leaf[] {
    return nodes.flatMap((node) => {
        const nextSlugs = [...slugs, node.slug]
        const nextTitles = [...titles, node.title]
        if (!node.children?.length) {
            return [{ title: node.title, href: pageHref(section, nextSlugs), trail: titles }]
        }
        return collectLeaves(section, node.children, nextSlugs, nextTitles)
    })
}

const MOCK_DATES = ["Oct 8", "Oct 6", "Oct 3", "Sep 28", "Sep 21", "Sep 15"]
const READ_TIMES = ["6 min read", "9 min read", "7 min read", "5 min read", "8 min read"]

// MOCK until Step 12c: first leaves are "popular", last leaves are "latest". Fixed values, no Date.now().
export function getHighlights(section: TreeSection) {
    const leaves = collectLeaves(section)
    const popular = leaves.slice(0, 5).map((leaf, i) => ({ ...leaf, meta: READ_TIMES[i % READ_TIMES.length] }))
    const latest = leaves.slice(-5).reverse().map((leaf, i) => ({ ...leaf, meta: MOCK_DATES[i % MOCK_DATES.length] }))
    return { popular, latest }
}