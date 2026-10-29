import styles from './ArticleShell.module.css'

// Thin bar fixed under the nav bar. Fills as the article is read.
export function ReadingProgressBar({ progress }: { progress: number }) {
    return (
        <div className={styles.bar} role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <div className={styles.barFill} style={{ width: `${progress}%` }} />
        </div>
    )
}