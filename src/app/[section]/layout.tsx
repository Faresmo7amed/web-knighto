import { Suspense, type ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { SectionSidebar } from '@/components/sidebar/SectionSidebar'
import { MobileSectionNav } from '@/components/sidebar/MobileSectionNav'
import { getSection, sampleTree } from '@/data/sample-tree'

type SectionParams = Promise<{ section: string }>

// Lists the sections that exist, so Next.js knows them at build time.
export function generateStaticParams() {
    return sampleTree.map((section) => ({ section: section.slug }))
}

// Reads the URL, finds the section and renders the sidebar, the mobile drawer button and the page.
// Child of the Suspense boundary below.
async function SectionShell({ children, params }: { children: ReactNode; params: SectionParams }) {
    const { section: sectionSlug } = await params
    const section = getSection(sectionSlug)
    if (!section) notFound()

    return (
        <PageLayout left={<SectionSidebar section={section} />}>
            <MobileSectionNav section={section} />
            {children}
        </PageLayout>
    )
}

// Parent. It does not await anything, so the frame can show instantly.
// It stays mounted while you move between pages, so column state and scroll are kept.
export default function SectionLayout({ children, params }: { children: ReactNode; params: SectionParams }) {
    return (
        <Suspense fallback={<PageLayout>{null}</PageLayout>}>
            <SectionShell params={params}>{children}</SectionShell>
        </Suspense>
    )
}