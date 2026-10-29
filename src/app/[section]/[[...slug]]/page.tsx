import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ArticleFooter } from '@/components/article/ArticleFooter'
import { ArticleHeader } from '@/components/article/ArticleHeader'
import { ArticleShell } from '@/components/article/ArticleShell'
import { getSection, sampleTree } from '@/data/sample-tree'
import { getSampleMarkdown } from '@/lib/content'
import { getAllSlugPaths, getPrevNext, getTrail } from '@/lib/tree'
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer'
import { extractHeadings } from '@/lib/markdown'
import { readingMinutes } from '@/lib/headings'
import { SectionLanding } from "@/components/section/SectionLanding"
import { TopicPage } from "@/components/topic/TopicPage"
import { findNode, isTopicPage } from "@/lib/topic"
import { CheatSheetPage } from "@/components/cheatsheet/CheatSheetPage"
import { isCheatSheet } from "@/lib/cheatsheet"
import { ReadTracker } from "@/components/progress/ReadTracker"

type PageParams = Promise<{ section: string; slug?: string[] }>

// Lists every page URL in the tree, so Next.js can prerender them. Step 12c will read these from Supabase.
export function generateStaticParams() {
    return sampleTree.flatMap((section) => getAllSlugPaths(section).map((slug) => ({ section: section.slug, slug })))
}

const lineWidths = [96, 88, 92, 60, 94, 80]

// Grey placeholder lines shown while the page loads.
function SkeletonLines() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: '40rem', marginTop: 'var(--space-2)' }}>
            {lineWidths.map((width, index) => (
                <div key={index} style={{ height: '0.875rem', width: `${width}%`, borderRadius: '6px', background: 'var(--bg-subtle)' }} />
            ))}
        </div>
    )
}



// Reads the URL, finds the page in the tree and builds the article. Child of the Suspense boundary below.
async function PageContent({ params }: { params: PageParams }) {
    const { section: sectionSlug, slug = [] } = await params
    const section = getSection(sectionSlug)
    if (!section) notFound()

    // Page URL used by the read tracker
    const href = '/' + [section.slug, ...slug].join('/')

    if (slug.length === 0) {
        return <SectionLanding section={section} />
    }

    if (isCheatSheet(slug)) {
        const trail = slug.map((segment, i) => findNode(section, slug.slice(0, i + 1))?.title ?? segment)
        return (
            <>
                <CheatSheetPage section={section} trail={trail} />
                <ReadTracker href={href} />
            </>
        )
    }

    const node = findNode(section, slug)
    if (node && isTopicPage(slug, node)) {
        return <TopicPage section={section} node={node} />
    }

    // Every segment must exist in the tree, otherwise 404
    const trail = getTrail(section, slug)
    if (trail.length !== slug.length) notFound()

    // Every page shows content/sample.md for now
    const markdown = await getSampleMarkdown()
    const headings = extractHeadings(markdown)
    const minutes = readingMinutes(markdown)
    const { prev, next } = getPrevNext(section, slug)
    
    

    return (
        <>
            <ArticleShell headings={headings} minutes={minutes}>
                <ArticleHeader section={section} trail={trail} minutes={minutes} />
                <MarkdownRenderer markdown={markdown} />
                <ArticleFooter prev={prev} next={next} />
            </ArticleShell>
            <ReadTracker href={href} />
        </>
    )
}

// Parent. It does not await anything, so Next.js can show the fallback instantly.
export default function SectionPage({ params }: { params: PageParams }) {
    return (
        <Suspense fallback={<SkeletonLines />}>
            <PageContent params={params} />
        </Suspense>
    )
}