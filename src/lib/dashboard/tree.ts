import type { PageRow } from './types'

export const MAX_DEPTH = 4
export type PageNode = PageRow & { children: PageNode[] }
type Linked = Pick<PageRow, 'id' | 'parent_id'>

// Turns the flat rows into a sorted tree. Use for the Pages screen.
export function buildTree(rows: PageRow[]): PageNode[] {
    const map = new Map<string, PageNode>(rows.map((row) => [row.id, { ...row, children: [] }]))
    const roots: PageNode[] = []
    for (const node of map.values()) {
        const parent = node.parent_id ? map.get(node.parent_id) : undefined
        if (parent) parent.children.push(node)
        else roots.push(node)
    }
    const sort = (list: PageNode[]) => {
        list.sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title))
        list.forEach((node) => sort(node.children))
    }
    sort(roots)
    return roots
}

// Level of a page, 1 to 4. A null id is level 0 (the root).
export function levelOf(rows: Linked[], id: string | null): number {
    const map = new Map(rows.map((row) => [row.id, row]))
    let level = 0
    let current = id
    while (current && level < 12) {
        level += 1
        current = map.get(current)?.parent_id ?? null
    }
    return level
}

// Height of the subtree under a page: 1 for a leaf.
export function heightOf(rows: Linked[], id: string): number {
    const kids = rows.filter((row) => row.parent_id === id)
    return 1 + Math.max(0, ...kids.map((kid) => heightOf(rows, kid.id)))
}

// Every descendant id of a page.
export function descendantIds(rows: Linked[], id: string): string[] {
    const out: string[] = []
    const walk = (parent: string) => rows.filter((row) => row.parent_id === parent).forEach((row) => { out.push(row.id); walk(row.id) })
    walk(id)
    return out
}

// "Frontend › JavaScript › Functions" for a page. Use for location labels.
export function pathLabel(rows: PageRow[], id: string | null): string {
    const map = new Map(rows.map((row) => [row.id, row]))
    const parts: string[] = []
    let current = id
    while (current && parts.length < 12) {
        const row = map.get(current)
        if (!row) break
        parts.unshift(row.title)
        current = row.parent_id
    }
    return parts.join(' › ')
}

// URL segments for a page, section first. Use to build the public link.
export function slugPath(rows: PageRow[], id: string): string[] {
    const map = new Map(rows.map((row) => [row.id, row]))
    const parts: string[] = []
    let current: string | null = id
    while (current && parts.length < 12) {
        const row = map.get(current)
        if (!row) break
        parts.unshift(row.slug)
        current = row.parent_id
    }
    return parts
}

// Returns an error message when moving `id` under `parentId` is not allowed, otherwise null. `rows` must be live pages.
export function validateMove(rows: PageRow[], id: string, parentId: string | null): string | null {
    if (parentId === id || (parentId && descendantIds(rows, id).includes(parentId))) return 'A page cannot be moved into itself.'
    if (levelOf(rows, parentId) + heightOf(rows, id) > MAX_DEPTH) return 'That would go deeper than 4 levels.'
    return null
}