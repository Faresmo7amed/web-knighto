'use client'

import { useCallback, useSyncExternalStore } from 'react'

// Everyone who reads a stored value gets told when any stored value changes
const listeners = new Set<() => void>()

// Registers a listener (also reacts to changes from other tabs). Used by useSyncExternalStore.
function subscribe(listener: () => void) {
    listeners.add(listener)
    window.addEventListener('storage', listener)
    return () => {
        listeners.delete(listener)
        window.removeEventListener('storage', listener)
    }
}

// Reads a string saved in localStorage and lets you change it. Use for small UI choices (pinned, collapsed...).
// The server and the first client render use `fallback`, so there is no hydration mismatch.
export function useStoredString(key: string, fallback: string): [string, (value: string) => void] {
    const value = useSyncExternalStore(
        subscribe,
        () => {
            try {
                return localStorage.getItem(key) ?? fallback
            } catch {
                return fallback
            }
        },
        () => fallback,
    )

    // Saves a new value and tells every reader. Use from event handlers.
    const setValue = useCallback(
        (next: string) => {
            try {
                localStorage.setItem(key, next)
            } catch {}
            listeners.forEach((listener) => listener())
        },
        [key],
    )

    return [value, setValue]
}