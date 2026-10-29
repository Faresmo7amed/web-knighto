import type { Metadata } from "next"
import { getSectionProgressData } from "@/lib/progress-data"
import { StaticShell } from "@/components/static/StaticShell"
import { ProgressPage } from "@/components/progress/ProgressPage"

export const metadata: Metadata = { title: "Progress" }

export default function ProgressRoute() {
    return (
        <StaticShell>
            <ProgressPage sections={getSectionProgressData()} />
        </StaticShell>
    )
}