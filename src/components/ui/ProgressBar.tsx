import styles from "./ProgressBar.module.css"

type Props = { value: number; label: string; thick?: boolean }

// Thin bar for a 0 to 100 value. Use it for roadmap, section and overall progress.
export function ProgressBar({ value, label, thick }: Props) {
    const safe = Math.max(0, Math.min(100, Math.round(value)))
    return (
        <div className={thick ? `${styles.bar} ${styles.thick}` : styles.bar} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={safe}>
            <div className={styles.fill} style={{ width: `${safe}%` }} />
        </div>
    )
}