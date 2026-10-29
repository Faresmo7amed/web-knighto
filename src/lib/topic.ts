import type { TreeNode, TreeSection } from "@/data/sample-tree"
import { countPages } from "@/lib/section-landing"

// Walks the section tree along a slug path and returns the matching node, or undefined.
export function findNode(section: TreeSection, slugs: string[]): TreeNode | undefined {
    let nodes: TreeNode[] = section.children
    let found: TreeNode | undefined
    for (const slug of slugs) {
        found = nodes.find((n) => n.slug === slug)
        if (!found) return undefined
        nodes = found.children ?? []
    }
    return found
}

// True when the page is a topic main page: one level under the section, with children. Use it in the route.
export function isTopicPage(slugs: string[], node: TreeNode): boolean {
    return slugs.length === 1 && (node.children?.length ?? 0) > 0
}

// MOCK until Step 12c: tags, date and reading time. Fixed values, no Date.now().
export function getTopicMeta(node: TreeNode) {
    return {
        tags: [node.title.toLowerCase(), "basics"],
        updated: "Oct 8, 2026",
        minutes: Math.max(3, countPages(node) * 2),
    }
}