'use client'

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
    theme: Theme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

// Listeners that want to know when the theme changes
const listeners = new Set<() => void>()

// Registers a listener and returns an unsubscribe function. Used by useSyncExternalStore.
function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

// Reads the current theme from <html>. Use on the client for the live value.
function getSnapshot(): Theme {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

// Value used while rendering on the server. The inline script fixes the real value before paint.
function getServerSnapshot(): Theme {
    return 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    // <html data-theme> is the single source of truth; React just reads it
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    // Sets the theme on <html>, saves it, and notifies readers. Use for any explicit choice.
    const setTheme = useCallback((next: Theme) => {
        document.documentElement.setAttribute('data-theme', next)
        try {
            localStorage.setItem('theme', next)
        } catch {}
        listeners.forEach((listener) => listener())
    }, [])

    // Flips light/dark. Use for the one-click switch.
    const toggleTheme = useCallback(() => {
        setTheme(getSnapshot() === 'dark' ? 'light' : 'dark')
    }, [setTheme])

    return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

// Reads the theme from any child component. Use inside <ThemeProvider> only.
export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
    return ctx
}