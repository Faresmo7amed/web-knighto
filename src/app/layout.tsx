import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { fontVariables } from '@/styles/fonts'
import { themeScript } from '@/styles/theme-script'
import { directionScript } from '@/styles/direction-script'
import { siteConfig } from '@/config/site'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { SearchPalette } from '@/components/search/SearchPalette'
import { CookieNotice } from "@/components/layout/CookieNotice"
import { LocaleProvider } from '@/components/locale/LocaleProvider'
import { Suspense } from 'react'
import { ThemeOverrides } from '@/components/theme/ThemeOverrides'
import '@/styles/a11y.css'

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        // suppressHydrationWarning: the inline script sets data-theme before React loads
        <html lang={siteConfig.defaultLocale} dir="ltr" className={fontVariables} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
                <script dangerouslySetInnerHTML={{ __html: directionScript }} />
            </head>
            <body suppressHydrationWarning>
                <Suspense fallback={null}><ThemeOverrides /></Suspense>
                <ThemeProvider>
                    <LocaleProvider>
                        <a href="#main-content" className="skip-link">
                            Skip to content
                        </a>
                        <Navbar />
                        <SearchPalette />
                        {children}
                        <CookieNotice />
                    </LocaleProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
