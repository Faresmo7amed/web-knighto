import type { Segment } from '@/lib/search/types'
import styles from './Highlight.module.css'

// Draws text with the matched parts marked. Works in server and client components.
export function Highlight({ segments }: { segments: Segment[] }) {
    return (
        <>
            {segments.map((segment, index) =>
                segment.hit ? (
                    <mark key={index} className={styles.mark}>
                        {segment.text}
                    </mark>
                ) : (
                    <span key={index}>{segment.text}</span>
                ),
            )}
        </>
    )
}