'use client'

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from 'react'
import { siteConfig, type SiteLocale } from '@/config/site'

type LocaleContextValue = {
    locale: SiteLocale
    setLocale: (code: SiteLocale['code']) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)
const listeners = new Set<() => void>()

function findLocale(code: string | null): SiteLocale {
    return siteConfig.locales.find((locale) => locale.code === code) ?? siteConfig.locales[0]
}

function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

function getSnapshot() {
    return document.documentElement.lang
}

function getServerSnapshot() {
    return siteConfig.defaultLocale
}

// Keeps document language and direction in sync with the visitor's persisted choice.
export function LocaleProvider({ children }: { children: ReactNode }) {
    const locale = findLocale(useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot))

    const setLocale = useCallback((code: SiteLocale['code']) => {
        const next = findLocale(code)
        document.documentElement.lang = next.code
        document.documentElement.dir = next.direction
        try {
            localStorage.setItem('locale', next.code)
        } catch {}
        listeners.forEach((listener) => listener())
    }, [])

    return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
}

// Reads the active locale. Use only inside LocaleProvider.
export function useLocale() {
    const context = useContext(LocaleContext)
    if (!context) throw new Error('useLocale must be used inside LocaleProvider')
    return context
}
