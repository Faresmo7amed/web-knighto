"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import { siteConfig } from "@/config/site"
import styles from "./CookieNotice.module.css"

const KEY = "cookie-notice"
const EVENT = "cookie-notice-change"

// Listens for the stored choice changing, in this tab and in other tabs
function subscribe(callback: () => void) {
    window.addEventListener("storage", callback)
    window.addEventListener(EVENT, callback)
    return () => {
        window.removeEventListener("storage", callback)
        window.removeEventListener(EVENT, callback)
    }
}

// Reads the stored choice in the browser. true means the notice was already dismissed.
function getSnapshot() {
    try {
        return localStorage.getItem(KEY) === "1"
    } catch {
        return true
    }
}

// On the server we assume dismissed, so returning visitors never see the notice flash
function getServerSnapshot() {
    return true
}

export function CookieNotice() {
    const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    // Saves the choice and tells the other listeners. Use it from the "Got it" button.
    function dismiss() {
        try {
            localStorage.setItem(KEY, "1")
        } catch {
            // Storage blocked: the notice returns on the next visit
        }
        window.dispatchEvent(new Event(EVENT))
    }

    if (!siteConfig.cookieNotice || dismissed) return null

    return (
        <div role="region" aria-label="Storage notice" className={styles.notice}>
            <p className={styles.text}>
                This site saves your reading progress and settings in your browser. It uses no tracking cookies.{" "}
                <Link href="/privacy">Privacy policy</Link>
            </p>
            <button type="button" className={styles.ok} onClick={dismiss}>Got it</button>
        </div>
    )
}