'use server'

import { searchContent } from './search'
import type { SearchResponse } from './types'

// Lets the palette call searchContent from the browser. Palette results: 5 per group.
export async function searchAction(query: string): Promise<SearchResponse> {
    return searchContent(String(query).slice(0, 100), { limit: 5 })
}