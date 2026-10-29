import type { Metadata } from "next"
import { legalDocs } from "@/data/legal"
import { StaticShell } from "@/components/static/StaticShell"
import { LegalPage } from "@/components/static/LegalPage"

export const metadata: Metadata = { title: legalDocs.terms.title }

export default function TermsRoute() {
    return (
        <StaticShell>
            <LegalPage doc={legalDocs.terms} />
        </StaticShell>
    )
}