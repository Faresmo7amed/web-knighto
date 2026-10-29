'use client'

import { Icon } from '@/components/ui/Icon'
import { scrollPageTo } from '@/lib/scroll'
import styles from './ArticleShell.module.css'

// Floating button, bottom right. Goes to the bottom while you are near the top, and to the top once you are past the middle.
export function ScrollButton({ nearBottom }: { nearBottom: boolean }) {
    const label = nearBottom ? 'Scroll to top' : 'Scroll to bottom'

    return (
        <button type="button" className={styles.scrollBtn} onClick={() => scrollPageTo(nearBottom ? 0 : document.documentElement.scrollHeight)} aria-label={label} title={label}>
            <Icon name={nearBottom ? 'arrowUp' : 'arrowDown'} size={20} />
        </button>
    )
}