import Link from "next/link"
import { Icon } from "@/components/ui/Icon"
import { StaticShell } from "@/components/static/StaticShell"
import styles from "@/components/static/StatusPage.module.css"

const SHORTCUTS = [
    { title: "Home", note: "Start from the front page", href: "/" },
    { title: "Roadmaps", note: "Step-by-step learning paths", href: "/roadmaps" },
    { title: "Frontend", note: "HTML, CSS, JavaScript and React", href: "/frontend" },
    { title: "Search", note: "Find a page by its title or text", href: "/search" },
]

export default function NotFound() {
    return (
        <StaticShell>
            <div className={styles.wrap}>
                <div className={styles.eyebrow}>Error 404</div>
                <h1 className={styles.title}>This page could not be found</h1>
                <p className={styles.lead}>The link may be old, or the page may have moved. Search for what you were after, or pick one of the places below.</p>
                <form action="/search" role="search" className={styles.searchRow}>
                    <div className={styles.searchBox}>
                        <Icon name="search" />
                        <input name="q" type="search" aria-label="Search the site" placeholder="Search pages and topics" className={styles.searchInput} />
                    </div>
                    <Link href="/" className={`${styles.btn} ${styles.btnPrimary}`}>Back to home</Link>
                </form>
                <div className={styles.shortcuts}>
                    {SHORTCUTS.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.shortcut}>
                            <span className={styles.shortcutText}>
                                <span className={styles.shortcutTitle}>{item.title}</span>
                                <span className={styles.shortcutNote}>{item.note}</span>
                            </span>
                            <span className={styles.shortcutArrow}><Icon name="chevron-right" /></span>
                        </Link>
                    ))}
                </div>
            </div>
        </StaticShell>
    )
}