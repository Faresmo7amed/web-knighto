import { Icon } from "@/components/ui/Icon"
import styles from "./Roadmap.module.css"

const ITEMS = [
    { label: "Main topic", swatch: styles.swMain },
    { label: "Subtopic", swatch: styles.swSub },
    { label: "Optional", swatch: styles.swOptional },
    { label: "Alternative", swatch: styles.swAlt },
    { label: "Recommended", swatch: styles.swRec },
]

export function Legend() {
    return (
        <div className={styles.legend}>
            {ITEMS.map((item) => (
                <span key={item.label} className={styles.legendItem}>
                    <span className={`${styles.sw} ${item.swatch}`} />
                    {item.label}
                </span>
            ))}
            <span className={styles.legendItem}><span className={styles.legendDone}><Icon name="circle-check" /></span>Completed</span>
            <span className={styles.legendItem}><Icon name="lock" />Locked</span>
        </div>
    )
}