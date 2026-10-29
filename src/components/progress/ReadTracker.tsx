"use client"

import { useEffect } from "react"
import { markPageRead } from "@/lib/progress"

export function ReadTracker({ href }: { href: string }) {
    // Marks the page as read at 85% scroll, or when the page is too short to scroll
    useEffect(() => {
        function check() {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight
            if (scrollable <= 80 || window.scrollY / scrollable >= 0.85) {
                markPageRead(href)
                window.removeEventListener("scroll", check)
            }
        }
        const timer = setTimeout(check, 1500)
        window.addEventListener("scroll", check, { passive: true })
        return () => {
            clearTimeout(timer)
            window.removeEventListener("scroll", check)
        }
    }, [href])

    return null
}