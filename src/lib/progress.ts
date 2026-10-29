import { useMemo, useSyncExternalStore } from "react"
import { localDate, type ProgressData } from "./progress-keys"

const KEY = "progress-v1"
const EVENT = "progress-change"
const EMPTY: ProgressData = { pages: {}, nodes: {} }

// Listens for progress changes in this tab and in other tabs
function subscribe(callback: () => void) {
    window.addEventListener("storage", callback)
    window.addEventListener(EVENT, callback)
    return () => {
        window.removeEventListener("storage", callback)
        window.removeEventListener(EVENT, callback)
    }
}

// Reads the raw saved text. A string is a stable snapshot for useSyncExternalStore.
function readRaw(): string {
    try {
        return localStorage.getItem(KEY) ?? ""
    } catch {
        return ""
    }
}

// Parses the saved text, falling back to empty data if it is missing or broken.
function parse(raw: string): ProgressData {
    if (!raw) return EMPTY
    try {
        const data = JSON.parse(raw)
        return { pages: data.pages ?? {}, nodes: data.nodes ?? {} }
    } catch {
        return EMPTY
    }
}

// Saves the data and tells every listener. Used by the three actions below.
function write(data: ProgressData) {
    try {
        localStorage.setItem(KEY, JSON.stringify(data))
    } catch {
        // Storage blocked: progress is not kept
    }
    window.dispatchEvent(new Event(EVENT))
}

// Returns the saved progress. Use it in any client component that shows read pages or done steps.
export function useProgress(): ProgressData {
    const raw = useSyncExternalStore(subscribe, readRaw, () => "")
    return useMemo(() => parse(raw), [raw])
}

// Today as YYYY-MM-DD, or null during server render. Use it instead of new Date() while rendering.
export function useToday(): string | null {
    return useSyncExternalStore(
        () => () => {},
        () => localDate(new Date()),
        () => null
    )
}

// Records a page as read, once, with today's date. Call it from the scroll tracker.
export function markPageRead(href: string) {
    const data = parse(readRaw())
    if (data.pages[href]) return
    write({ ...data, pages: { ...data.pages, [href]: localDate(new Date()) } })
}

// Marks a roadmap step done or not done. Use it from the "Mark as done" switch.
export function setNodeDone(key: string, done: boolean) {
    const data = parse(readRaw())
    const nodes = { ...data.nodes }
    if (done) nodes[key] = localDate(new Date())
    else delete nodes[key]
    write({ ...data, nodes })
}

// Deletes all saved progress. Use it from the Progress page reset button.
export function resetProgress() {
    try {
        localStorage.removeItem(KEY)
    } catch {
        // Nothing to clear
    }
    window.dispatchEvent(new Event(EVENT))
}