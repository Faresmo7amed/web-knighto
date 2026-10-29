'use client'

import { siteConfig } from '@/config/site'
import { useLocale } from './LocaleProvider'

// Switches the document direction. It appears only when more than one locale is configured.
export function LanguageToggle() {
    const { locale, setLocale } = useLocale()
    if (siteConfig.locales.length < 2) return null

    const next = siteConfig.locales.find((item) => item.code !== locale.code) ?? locale
    return (
        <button
            type="button"
            className="locale-toggle"
            onClick={() => setLocale(next.code)}
            aria-label={`Switch language to ${next.label}`}
        >
            {next.label}
        </button>
    )
}
