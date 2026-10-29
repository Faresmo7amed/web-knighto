import { normalizeWithMap } from './normalize'
import type { Segment } from './types'

// Splits text into plain and highlighted pieces for the given (already normalized) terms.
// With snippetLength, returns a window around the first match, with "…" at cut ends.
export function highlight(text: string, terms: string[], snippetLength?: number): Segment[] {
    const { norm, map } = normalizeWithMap(text)

    const ranges: [number, number][] = []
    for (const term of terms) {
        if (!term) continue
        let at = norm.indexOf(term)
        while (at !== -1) {
            ranges.push([map[at], map[at + term.length - 1] + 1])
            at = norm.indexOf(term, at + term.length)
        }
    }
    ranges.sort((a, b) => a[0] - b[0])

    // Merge overlapping ranges
    const merged: [number, number][] = []
    for (const range of ranges) {
        const last = merged[merged.length - 1]
        if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1])
        else merged.push([range[0], range[1]])
    }

    let from = 0
    let to = text.length
    if (snippetLength && text.length > snippetLength) {
        from = Math.max(0, (merged[0]?.[0] ?? 0) - 40)
        to = Math.min(text.length, from + snippetLength)
        from = Math.max(0, to - snippetLength)
    }

    const out: Segment[] = []
    if (from > 0) out.push({ text: '…', hit: false })
    let cursor = from
    for (const [start, end] of merged) {
        if (end <= from || start >= to) continue
        const a = Math.max(start, from)
        const b = Math.min(end, to)
        if (a > cursor) out.push({ text: text.slice(cursor, a), hit: false })
        out.push({ text: text.slice(a, b), hit: true })
        cursor = b
    }
    if (cursor < to) out.push({ text: text.slice(cursor, to), hit: false })
    if (to < text.length) out.push({ text: '…', hit: false })
    return out
}