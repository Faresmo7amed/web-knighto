"use client"

import { Icon } from "@/components/ui/Icon"
import styles from "./CheatSheet.module.css"

// Opens the browser print dialog. Use it on cheat sheets so the page prints cleanly.
export function PrintButton() {
    return (
        <button type="button" className={styles.printBtn} onClick={() => window.print()} aria-label="Print this page">
            <Icon name="printer" />
            Print
        </button>
    )
}