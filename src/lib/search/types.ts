export type Segment = { text: string; hit: boolean }
export type SearchGroup = 'pages' | 'topics' | 'headings' | 'content'

export const groupOrder: SearchGroup[] = ['pages', 'topics', 'headings', 'content']
export const groupLabels: Record<SearchGroup, string> = { pages: 'Pages', topics: 'Topics', headings: 'Headings', content: 'Content matches' }

export type SearchResult = {
    id: string
    group: SearchGroup
    title: Segment[]
    path: string // breadcrumb, e.g. "Frontend › JavaScript › Functions"
    href: string
    snippet?: Segment[] // content matches only
}

export type SearchResponse = {
    query: string
    results: SearchResult[] // already ordered by group
    counts: Record<SearchGroup, number> // total matches per group, before the limit
    error?: boolean
}

// A response with nothing in it. Use for empty queries and failures.
export function emptyResponse(query: string, error = false): SearchResponse {
    return { query, results: [], counts: { pages: 0, topics: 0, headings: 0, content: 0 }, error }
}