// The nav bar only announces "open search". Step 7 (search palette) will listen for it.
export const SEARCH_OPEN_EVENT = 'search:open'

// Asks the search palette to open. Use from any button or shortcut.
export function openSearch() {
    window.dispatchEvent(new Event(SEARCH_OPEN_EVENT))
}