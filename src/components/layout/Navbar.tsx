'use client'

import Link from 'next/link'
import { NavLink } from './NavLink'
import { useEffect, useRef, useState } from 'react'
import { siteConfig } from '@/config/site'
import { openSearch } from '@/lib/search-events'
import { Icon } from '@/components/ui/Icon'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { LanguageToggle } from '@/components/locale/LanguageToggle'
import styles from './Navbar.module.css'

export function Navbar() {
    const [moreOpen, setMoreOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const moreRef = useRef<HTMLDivElement>(null)

    // Closes both menus. Called when any menu link is clicked.
    function closeMenus() {
        setMoreOpen(false)
        setMobileOpen(false)
    }

    // Outside click and Esc close the menus
    useEffect(() => {
        function onPointerDown(e: PointerEvent) {
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false)
        }
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setMoreOpen(false)
                setMobileOpen(false)
            }
        }
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [])

    // Ctrl/Cmd + K opens search from anywhere
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                openSearch()
            }
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [])

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo} onClick={closeMenus}>
                <div className={styles.logoContainer}>
                    <img src="/helmet.png" alt="Logo image" />
                    {siteConfig.name}
                </div>
                </Link>

                <nav aria-label="Sections" className={styles.links}>
                    {siteConfig.navLinks.map((link) => (
                        <NavLink key={link.href} href={link.href} className={styles.link}>
                            {link.label}
                        </NavLink>
                    ))}
                    <div className={styles.menuWrap} ref={moreRef}>
                        <button type="button" className={styles.link} aria-haspopup="menu" aria-expanded={moreOpen} onClick={() => setMoreOpen((open) => !open)}>
                            More <Icon name="chevronDown" size={16} />
                        </button>
                        {moreOpen && (
                            <div className={styles.popover} role="menu">
                                {siteConfig.moreLinks.map((link) => (
                                    <Link key={link.href} href={link.href} role="menuitem" className={styles.menuItem} onClick={closeMenus}>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                <span className={styles.spacer} />

                <button type="button" className={styles.search} onClick={openSearch} aria-label="Search, Ctrl K">
                    <span className={styles.searchLabel}>
                        <Icon name="search" /> Search
                    </span>
                    <kbd className={styles.kbd}>Ctrl K</kbd>
                </button>

                <div className={styles.socials}>
                    {siteConfig.socialLinks.map((social) => (
                        <a key={social.id} href={social.href} className="icon-btn" aria-label={social.label}>
                            <Icon name={social.icon} />
                        </a>
                    ))}
                </div>

                <div className={styles.mobileOnly}>
                    <button type="button" className="icon-btn" onClick={openSearch} aria-label="Search">
                        <Icon name="search" />
                    </button>
                </div>

                <ThemeToggle />
                <LanguageToggle />

                <div className={styles.mobileOnly}>
                    <button type="button" className="icon-btn" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={() => setMobileOpen((open) => !open)}>
                        <Icon name={mobileOpen ? 'close' : 'menu'} />
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div id="mobile-menu" className={styles.mobilePanel}>
                    <nav aria-label="Mobile sections" className={styles.mobileLinks}>
                        {[...siteConfig.navLinks, ...siteConfig.moreLinks].map((link) => (
                            <NavLink key={link.href} href={link.href} className={styles.menuItem} onClick={closeMenus}>
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                    <div className={styles.mobileSocials}>
                        {siteConfig.socialLinks.map((social) => (
                            <a key={social.id} href={social.href} className="icon-btn" aria-label={social.label}>
                                <Icon name={social.icon} />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )
}
