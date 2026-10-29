import { sampleContent, sampleHeadings } from '@/data/sample-search'
import { sampleTree, type TreeNode, type TreeSection } from '@/data/sample-tree'
import { highlight } from './highlight'
import { normalizeWithMap } from './normalize'
import { emptyResponse, groupOrder, type SearchGroup, type SearchResponse, type SearchResult } from './types'

type Entry = { id: string; group: SearchGroup; text: string; title: string; path: string; href: string }

// Builds the searchable list once: pages and topics from the tree, plus the mock headings and text.
function buildEntries(): Entry[] {
    const entries: Entry[] = []

    // A node with children is a topic; a node without is a page.
    function walk(nodes: TreeNode[], section: TreeSection, ancestors: string[], prefix: string) {
        for (const node of nodes) {
            const href = `${prefix}/${node.slug}`
            entries.push({ id: href, group: node.children?.length ? 'topics' : 'pages', text: node.title, title: node.title, path: [section.title, ...ancestors].join(' › '), href })
            if (node.children) walk(node.children, section, [...ancestors, node.title], href)
        }
    }

    for (const section of sampleTree) {
        entries.push({ id: `/${section.slug}`, group: 'topics', text: section.title, title: section.title, path: '', href: `/${section.slug}` })
        walk(section.children, section, [], `/${section.slug}`)
    }
    sampleHeadings.forEach((item) => entries.push({ id: item.href, group: 'headings', text: item.text, title: item.text, path: item.path, href: item.href }))
    sampleContent.forEach((item, index) => entries.push({ id: `content-${index}`, group: 'content', text: item.text, title: item.title, path: item.path, href: item.href }))
    return entries
}

const entries = buildEntries()

// Searches pages, topics, headings and text. Every word of the query must match (order does not matter).
// Returns at most `limit` results per group, plus the real match counts. This is the one function the UI calls.
export async function searchContent(query: string, options: { limit?: number } = {}): Promise<SearchResponse> {
    const limit = options.limit ?? 5
    const trimmed = query.trim()
    const terms = normalizeWithMap(trimmed).norm.split(/\s+/).filter(Boolean).slice(0, 6)
    const response = emptyResponse(trimmed)
    if (terms.length === 0) return response

    const buckets: Record<SearchGroup, { entry: Entry; score: number }[]> = { pages: [], topics: [], headings: [], content: [] }
    for (const entry of entries) {
        const { norm } = normalizeWithMap(entry.text)
        if (!terms.every((term) => norm.includes(term))) continue
        // Titles that start with the first word rank first
        buckets[entry.group].push({ entry, score: entry.group !== 'content' && norm.startsWith(terms[0]) ? 0 : 1 })
    }

    for (const group of groupOrder) {
        const sorted = buckets[group].sort((a, b) => a.score - b.score || a.entry.text.length - b.entry.text.length)
        response.counts[group] = sorted.length
        for (const { entry } of sorted.slice(0, limit)) {
            const result: SearchResult = {
                id: entry.id,
                group,
                title: group === 'content' ? [{ text: entry.title, hit: false }] : highlight(entry.title, terms),
                path: entry.path,
                href: entry.href,
                snippet: group === 'content' ? highlight(entry.text, terms, 140) : undefined,
            }
            response.results.push(result)
        }
    }
    return response
}