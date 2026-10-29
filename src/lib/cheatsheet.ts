// True when the last slug marks a cheat sheet page. Use it in the route before the article fallback.
export function isCheatSheet(slugs: string[]): boolean {
    const last = slugs[slugs.length - 1] ?? ""
    return last.endsWith("cheat-sheet")
}