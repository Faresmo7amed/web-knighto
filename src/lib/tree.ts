import type { TreeNode, TreeSection } from '@/data/sample-tree'

// The nested sidebar never goes deeper than this
export const MAX_LEVELS = 4

// Walks the tree along URL segments and returns the matched nodes, level 1 first.
// It stops at the first unknown segment, so a shorter result than the input means "not found".
export function getTrail(section: TreeSection, slugs: string[]): TreeNode[] {
    const trail: TreeNode[] = []
    let level: TreeNode[] = section.children
    for (const slug of slugs.slice(0, MAX_LEVELS)) {
        const node = level.find((item) => item.slug === slug)
        if (!node) break
        trail.push(node)
        level = node.children ?? []
    }
    return trail
}

// Builds the URL for a node from its section and the nodes above it. Use for sidebar links.
export function nodeHref(sectionSlug: string, trail: TreeNode[]): string {
    return ['', sectionSlug, ...trail.map((node) => node.slug)].join('/')
}

// "/frontend/javascript/functions" becomes ["javascript", "functions"] (drops the section).
export function slugsFromPathname(pathname: string): string[] {
    return pathname.split('/').filter(Boolean).slice(1)
}

// Returns the items and title shown at one drill-down level. `path` = slugs already entered.
export function getLevel(section: TreeSection, path: string[]) {
    const trail = getTrail(section, path)
    const last = trail[trail.length - 1]
    return {
        title: last?.title ?? section.title,
        items: last ? (last.children ?? []) : section.children,
        trail,
    }
}

// Every page path in a section as a list of slugs, including the section root (empty list).
// Used by generateStaticParams so Next.js knows all valid URLs ahead of time.
export function getAllSlugPaths(section: TreeSection): string[][] {
    const paths: string[][] = [[]]
    function walk(nodes: TreeNode[], prefix: string[], level: number) {
        if (level > MAX_LEVELS) return
        for (const node of nodes) {
            const path = [...prefix, node.slug]
            paths.push(path)
            if (node.children) walk(node.children, path, level + 1)
        }
    }
    walk(section.children, [], 1)
    return paths
}

export type PageLink = { title: string; href: string }

// Every page of a section in sidebar order (a page, then its children). Previous/Next follow this order.
export function flattenSection(section: TreeSection): PageLink[] {
    const pages: PageLink[] = []
    function walk(nodes: TreeNode[], prefix: string, level: number) {
        if (level > MAX_LEVELS) return
        for (const node of nodes) {
            const href = `${prefix}/${node.slug}`
            pages.push({ title: node.title, href })
            if (node.children) walk(node.children, href, level + 1)
        }
    }
    walk(section.children, `/${section.slug}`, 1)
    return pages
}

// The page before and after the current one. The section root has no previous page.
export function getPrevNext(section: TreeSection, slugs: string[]): { prev?: PageLink; next?: PageLink } {
    const pages = flattenSection(section)
    if (slugs.length === 0) return { next: pages[0] }
    const href = ['', section.slug, ...slugs].join('/')
    const index = pages.findIndex((page) => page.href === href)
    return { prev: pages[index - 1], next: pages[index + 1] }
}