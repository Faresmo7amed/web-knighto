import type { CheatGroup } from "@/data/sample-cheatsheet"
import styles from "./CheatSheet.module.css"

export function CheatGroupCard({ group }: { group: CheatGroup }) {
    return (
        <section id={group.id} className={styles.card}>
            <h2 className={styles.cardHead}>{group.title}</h2>
            <div className={styles.scroll}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th>Does</th>
                            <th>Returns</th>
                        </tr>
                    </thead>
                    <tbody>
                        {group.rows.map((row) => (
                            <tr key={row.method}>
                                <td className={styles.nowrap}><code className={styles.inline}>{row.method}</code></td>
                                <td>
                                    {row.does}
                                    {row.mutates ? <span className={styles.badge}>mutates</span> : null}
                                </td>
                                <td className={`${styles.nowrap} ${styles.returns}`}>{row.returns}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}