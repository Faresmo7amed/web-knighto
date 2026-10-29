'use client'

import { openSearch } from '@/lib/search-events'
import styles from './Home.module.css'

// "or press Ctrl K to search". The key hint is also a button, so touch visitors can open search too.
export function HeroSearchHint() {
    return (
        <button type="button" className={styles.hint} onClick={openSearch} style={{ background: 'none', border: 0, minHeight: 'var(--touch-min)', cursor: 'pointer', font: 'inherit', fontSize: '0.875rem' }}>
            or press <kbd>Ctrl K</kbd> to search
        </button>
    )
}