export type ProgressData = { pages: Record<string, string>; nodes: Record<string, string> }

// Builds the storage key of a roadmap step. Use it everywhere a step is read or written.
export function nodeKey(slug: string, id: string): string {
    return `${slug}/${id}`
}

// Formats a Date as YYYY-MM-DD in the visitor's own time zone. Use it to stamp reading days.
export function localDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${date.getFullYear()}-${month}-${day}`
}

// Turns a YYYY-MM-DD string into a Date at noon, so daylight-saving shifts never change the day.
export function parseDate(value: string): Date {
    const [y, m, d] = value.split("-").map(Number)
    return new Date(y, m - 1, d, 12)
}

// Moves a YYYY-MM-DD string by a number of days. Use it to walk the heatmap grid.
export function shiftDate(value: string, days: number): string {
    const date = parseDate(value)
    date.setDate(date.getDate() + days)
    return localDate(date)
}

// Short English label for tooltips, always Western digits, e.g. "Tue, Sep 8".
export function formatDate(value: string): string {
    return parseDate(value).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

// Counts how many of a roadmap's steps are marked done.
export function countDone(nodes: Record<string, string>, slug: string, ids: string[]): number {
    return ids.filter((id) => nodes[nodeKey(slug, id)]).length
}

// Whole-number percentage that is safe when total is 0.
export function percentOf(done: number, total: number): number {
    return total === 0 ? 0 : Math.round((done / total) * 100)
}