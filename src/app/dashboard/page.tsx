import Link from 'next/link'
import { requireOwnerPage } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import d from '@/components/dashboard/dash.module.css'

export const instant = false

// Formats a date for tables, in UTC so server and browser agree.
function day(value: string) {
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

// Overview: counts, quick actions, recent edits and site health.
export default async function DashboardOverview() {
    await requireOwnerPage()
    const db = createAdminClient()
    const live = () => db.from('pages').select('*', { count: 'exact', head: true }).is('deleted_at', null).neq('kind', 'section')
    const [pages, published, drafts, roadmaps, recent, factors] = await Promise.all([
        live(),
        live().eq('visibility', 'published'),
        live().eq('visibility', 'draft'),
        db.from('roadmaps').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        db.from('pages').select('id,title,kind,visibility,updated_at').is('deleted_at', null).neq('kind', 'section').order('updated_at', { ascending: false }).limit(6),
        createClient().then((client) => client.auth.mfa.listFactors()),
    ])
    const twoFactor = (factors.data?.totp.length ?? 0) > 0
    const badge = (status: string) => (status === 'published' ? d.bOk : status === 'draft' ? d.bWarn : d.bNeutral)

    return (
        <div className={d.content}>
            <div className={d.pageHead}><div><h1>Overview</h1><p className={d.sub}>Welcome back. Here is what is happening on the site.</p></div></div>
            <div className={d.actions}>
                <Link href="/dashboard/pages" className={d.btnPrimary}>New page</Link>
                <Link href="/dashboard/articles" className={d.btn}>New article</Link>
                <Link href="/dashboard/roadmaps" className={d.btn}>New roadmap</Link>
                <Link href="/dashboard/media" className={d.btn}>Upload media</Link>
            </div>
            <div className={d.cards}>
                <div className={`${d.card} ${d.metric}`}>Pages<strong>{pages.count ?? 0}</strong></div>
                <div className={`${d.card} ${d.metric}`}>Published<strong>{published.count ?? 0}</strong></div>
                <div className={`${d.card} ${d.metric}`}>Drafts<strong>{drafts.count ?? 0}</strong></div>
                <div className={`${d.card} ${d.metric}`}>Roadmaps<strong>{roadmaps.count ?? 0}</strong></div>
            </div>
            <div className={d.split}>
                <section style={{ flex: '2 1 28rem' }}>
                    <h2 style={{ marginTop: 0 }}>Recently edited</h2>
                    <div className={d.tableWrap}>
                        <table className={d.table}>
                            <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Edited</th></tr></thead>
                            <tbody>
                                {(recent.data ?? []).map((row) => (
                                    <tr key={row.id}><td><Link href={`/dashboard/articles/${row.id}`}>{row.title}</Link></td><td>{row.kind}</td><td><span className={`${d.badge} ${badge(row.visibility)}`}>{row.visibility}</span></td><td>{day(row.updated_at)}</td></tr>
                                ))}
                                {!recent.data?.length ? <tr><td colSpan={4}>Nothing yet. Create your first article.</td></tr> : null}
                            </tbody>
                        </table>
                    </div>
                </section>
                <section className={d.card}>
                    <h2>Site health</h2>
                    <ul className={d.healthList}>
                        <li>{twoFactor ? '✓' : '⚠'} Two-step verification is {twoFactor ? 'on' : 'off'}<small>{twoFactor ? 'Authenticator app' : 'Turn it on in Security'}</small></li>
                        <li>{(drafts.count ?? 0) > 0 ? '⚠' : '✓'} {drafts.count ?? 0} drafts are unpublished<small>Review them in Articles</small></li>
                    </ul>
                    <Link href="/dashboard/security">Open security settings</Link>
                </section>
            </div>
        </div>
    )
}