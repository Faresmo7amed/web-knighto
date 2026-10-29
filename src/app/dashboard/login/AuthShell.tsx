import Link from 'next/link'
import type { ReactNode } from 'react'
import { siteConfig } from '@/config/site'
import styles from '../dashboard.module.css'

// Centered card layout shared by sign-in, 2FA, forgot and reset pages.
export function AuthShell({ children }: { children: ReactNode }) {
    return (
        <main className={styles.authPage}>
            <div className={styles.authBrand}>
                <span>{siteConfig.name}</span>
                <span className={styles.badge}>Dashboard</span>
            </div>
            <section className={styles.authCard}>{children}</section>
            <Link href="/" className={styles.backLink}>← Back to site</Link>
        </main>
    )
}