import styles from './Markdown.module.css'

// ASCII file tree in a labelled box. Use for ```tree blocks.
export function FileTree({ code }: { code: string }) {
    return (
        <div className={styles.tree}>
            <div className={styles.treeLabel}>File tree</div>
            <pre className={styles.treePre}>{code}</pre>
        </div>
    )
}