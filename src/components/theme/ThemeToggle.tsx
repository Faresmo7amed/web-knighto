'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
    const { toggleTheme } = useTheme()

    // Both icons are rendered; CSS shows the right one, so server and client HTML always match.
    return (
        <button type="button" className="icon-btn" onClick={toggleTheme} aria-label="Switch theme">
            <svg className="theme-icon theme-icon-moon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
            </svg>
            <svg className="theme-icon theme-icon-sun" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
            </svg>
        </button>
    )
}