import Link from "next/link"
import styles from "./SectionLanding.module.css"

type Item = { title: string; href: string; trail: string[]; meta: string }

export function LandingList({ id, title, items }: { id: string; title: string; items: Item[] }) {
    return (
        <section className={styles.list}>
            <h2 id={id} className={styles.h2List}>{title}</h2>
            <div className={styles.listItems}>
                {items.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.row}>
                        <span className={styles.rowText}>
                            <span className={styles.rowTitle}>{item.title}</span>
                            <span className={styles.rowTrail}>{item.trail.join(" › ")}</span>
                        </span>
                        <span className={styles.rowMeta}>{item.meta}</span>
                    </Link>
                ))}
            </div>
        </section>
    )
}