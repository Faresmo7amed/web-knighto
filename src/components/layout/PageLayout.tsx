import type { ReactNode } from 'react'
import styles from './PageLayout.module.css'

type PageLayoutProps = {
    left?: ReactNode // nested page-tree columns (Step 3)
    right?: ReactNode // "On this page" panel (Step 4)
    children: ReactNode // center content
}

// Three slots: left sidebar(s), center content, right sidebar. Use on every page that has a sidebar.
export function PageLayout({ left, right, children }: PageLayoutProps) {
    return (
        <div className={`page-shell ${styles.body}`}>
            {left && (
                <aside aria-label="Pages" className={styles.left}>
                    {left}
                </aside>
            )}
            <main id="main-content" className={styles.main}>
                {children}
            </main>
            {right && (
                <aside aria-label="On this page" className={styles.right}>
                    {right}
                </aside>
            )}
        </div>
    )
}