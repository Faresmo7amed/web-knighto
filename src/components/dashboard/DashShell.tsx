'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { ToastProvider } from './Toast'
import d from './dash.module.css'

const groups = [
    { label: '', items: [{ href: '/dashboard', label: 'Overview' }] },
    { label: 'Content', items: [
        { href: '/dashboard/pages', label: 'Pages' }, { href: '/dashboard/articles', label: 'Articles' },
        { href: '/dashboard/roadmaps', label: 'Roadmaps' }, { href: '/dashboard/media', label: 'Media' }, { href: '/dashboard/trash', label: 'Trash' },
    ] },
    { label: 'Site', items: [
        { href: '/dashboard/navigation', label: 'Navigation' }, { href: '/dashboard/appearance', label: 'Appearance' },
        { href: '/dashboard/code-blocks', label: 'Code blocks' }, { href: '/dashboard/search', label: 'Search' },
        { href: '/dashboard/legal', label: 'Pages and legal' }, { href: '/dashboard/social', label: 'Social links' }, { href: '/dashboard/site', label: 'Site settings' },
    ] },
    { label: 'Admin', items: [
        { href: '/dashboard/users', label: 'Users' }, { href: '/dashboard/security', label: 'Security' },
        { href: '/dashboard/backups', label: 'Backups' }, { href: '/dashboard/activity', label: 'Activity log' },
    ] },
]
const all = groups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.label })))

// Rail, top bar, breadcrumbs, jump dialog and toasts around every signed-in dashboard page.
export function DashShell({ email, signOutAction, children }: { email: string; signOutAction: () => Promise<void>; children: ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const dialog = useRef<HTMLDialogElement>(null)

    // Ctrl/Cmd+K opens the jump dialog.
    useEffect(() => {
        function onKey(event: KeyboardEvent) {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault()
                dialog.current?.showModal()
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    const current = [...all].reverse().find((item) => (item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)))
    const isEdit = current && pathname.split('/').length > 3
    const results = all.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))

    return (
        <ToastProvider>
            <div className={d.shell}>
                {open ? <div className={d.scrim} onClick={() => setOpen(false)} /> : null}
                <aside className={`${d.rail} ${open ? d.railOpen : ''}`} aria-label="Dashboard menu">
                    <div className={d.railHead}><Link href="/dashboard" className={d.brand} onClick={() => setOpen(false)}>Dashboard</Link><span className={d.badge}>Dashboard</span></div>
                    {groups.map((group) => (
                        <nav key={group.label || 'top'} aria-label={group.label || 'Main'}>
                            {group.label ? <div className={d.navLabel}>{group.label}</div> : null}
                            {group.items.map((item) => {
                                const on = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)
                                return <Link key={item.href} href={item.href} className={`${d.navItem} ${on ? d.navItemOn : ''}`} aria-current={on ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</Link>
                            })}
                        </nav>
                    ))}
                    <div className={d.railFoot}>
                        <span className={d.avatar} aria-hidden="true">{email.slice(0, 2).toUpperCase()}</span>
                        <span className={d.userMeta}><b>{email}</b>Owner</span>
                        <form action={signOutAction}><button className={d.iconBtn} type="submit" aria-label="Sign out" title="Sign out">↪</button></form>
                    </div>
                </aside>
                <div className={d.main}>
                    <header className={d.topbar}>
                        <button type="button" className={`${d.iconBtn} ${d.menuBtn}`} onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
                        <div className={d.crumbs}>
                            {current?.group ? <><span>{current.group}</span><span>›</span></> : null}
                            {current ? (isEdit ? <><Link href={current.href}>{current.label}</Link><span>›</span><b>Edit</b></> : <b>{current.label}</b>) : <b>Dashboard</b>}
                        </div>
                        <span className={d.grow} />
                        <button type="button" className={`${d.btn} ${d.searchBtn}`} onClick={() => dialog.current?.showModal()} aria-label="Jump to a dashboard page, Ctrl K"><span>Jump to…</span><span className={d.kbd}>Ctrl K</span></button>
                        <Link href="/" className={d.btn} target="_blank">View site ↗</Link>
                        <ThemeToggle />
                    </header>
                    {children}
                </div>
                <dialog ref={dialog} className={d.palette} onClose={() => setQuery('')}>
                    <input autoFocus placeholder="Jump to a page" aria-label="Jump to a page" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && results[0]) { router.push(results[0].href); dialog.current?.close() } }} />
                    {results.map((item) => <Link key={item.href} href={item.href} onClick={() => dialog.current?.close()}>{item.label}</Link>)}
                </dialog>
            </div>
        </ToastProvider>
    )
}