"use client"

import { useEffect, useState } from "react"
import styles from "./Static.module.css"

type Item = { id: string; title: string }

export function LegalToc({ items }: { items: Item[] }) {
    const [active, setActive] = useState(items[0]?.id ?? "")

    // Highlights the section that is near the top of the screen while the visitor scrolls
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActive(entry.target.id)
                }
            },
            { rootMargin: "-96px 0px -60% 0px" }
        )
        for (const item of items) {
            const el = document.getElementById(item.id)
            if (el) observer.observe(el)
        }
        return () => observer.disconnect()
    }, [items])

    return (
        <aside aria-label="On this page" className={styles.toc}>
            <div className={styles.tocHead}>On this page</div>
            {items.map((item) => (
                <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={item.id === active ? `${styles.tocLink} ${styles.tocOn}` : styles.tocLink}
                    aria-current={item.id === active ? "location" : undefined}
                >
                    {item.title}
                </a>
            ))}
        </aside>
    )
}