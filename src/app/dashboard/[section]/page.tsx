import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from '../dashboard.module.css'

export const instant = false

const sections: Record<string, { title: string; description: string; next: string }> = {
    pages: { title: 'Pages', description: 'The tree editor will manage the four-level site structure, visibility, and ordering.', next: 'Connect Supabase, then create the first page.' },
    articles: { title: 'Articles', description: 'Markdown editor, metadata, live preview, versions, and publishing controls.', next: 'Connect Supabase, then create the first article.' },
    roadmaps: { title: 'Roadmaps', description: 'Roadmap list and visual-node management will use the same protected data layer.', next: 'Connect Supabase, then create the first roadmap.' },
    media: { title: 'Media', description: 'Direct R2 uploads are ready through the protected API route.', next: 'Configure the R2 environment variables before uploading.' },
    settings: { title: 'Settings', description: 'Site settings, navigation, social links, themes, syntax, legal pages, and package managers live in the schema.', next: 'Connect Supabase, then migrate settings from src/config/site.ts.' },
    backups: { title: 'Backups', description: 'Owner-only JSON and Markdown ZIP exports are available now.', next: 'Use the export API after running the schema.' },
        navigation: { title: 'Navigation', description: 'Top bar links and layout settings (Step 20).', next: 'Built in Step 20.' },
    appearance: { title: 'Appearance', description: 'Theme tokens and syntax colors (Step 20).', next: 'Built in Step 20.' },
    'code-blocks': { title: 'Code blocks', description: 'Package manager tabs and code options (Step 20).', next: 'Built in Step 20.' },
    search: { title: 'Search', description: 'Reindex and excluded pages (Step 20).', next: 'Built in Step 20.' },
    legal: { title: 'Pages and legal', description: 'About, Terms, Privacy, Copyright, Contact (Step 20).', next: 'Built in Step 20.' },
    social: { title: 'Social links', description: 'Icons and where they appear (Step 20).', next: 'Built in Step 20.' },
    site: { title: 'Site settings', description: 'Name, languages and SEO defaults (Step 20).', next: 'Built in Step 20.' },
    users: { title: 'Users', description: 'Roles and API tokens (future).', next: 'Placeholder for later.' },
    activity: { title: 'Activity log', description: 'Sign-ins and content changes (future).', next: 'Placeholder for later.' },
}

// Gives every dashboard navigation item a non-404 landing page while its database-backed editor is connected.
export default async function DashboardSection({ params }: { params: Promise<{ section: string }> }) {
    const { section } = await params
    const content = sections[section]
    if (!content) notFound()
    return (
        <div className={styles.content}>
            <p className={styles.eyebrow}>DASHBOARD</p>
            <h1>{content.title}</h1>
            <p className={styles.muted}>{content.description}</p>
            <section className={styles.panel}>
                <h2>Connection required</h2>
                <p className={styles.muted}>{content.next}</p>
                {section === 'backups' ? <div className={styles.actions}><Link className={styles.primaryButton} href="/api/backups/export">Download JSON</Link><Link className={styles.secondaryButton} href="/api/backups/export?format=zip">Download Markdown ZIP</Link></div> : <Link className={styles.secondaryButton} href="/docs/DEPLOYMENT.md">Read deployment setup</Link>}
            </section>
        </div>
    )
}
