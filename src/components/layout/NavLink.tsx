'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense, type ReactNode } from 'react'

type NavLinkProps = {
    href: string
    className?: string
    onClick?: () => void
    children: ReactNode
}

// Link that marks itself as the current page. Only this small part waits for the URL.
function ActiveLink({ href, ...rest }: NavLinkProps) {
    const pathname = usePathname()
    const active = pathname === href || pathname.startsWith(href + '/')
    return <Link href={href} aria-current={active ? 'page' : undefined} {...rest} />
}

// Use for nav links that should highlight when active. The fallback is the same link without the highlight.
export function NavLink(props: NavLinkProps) {
    const { href, ...rest } = props
    return (
        <Suspense fallback={<Link href={href} {...rest} />}>
            <ActiveLink {...props} />
        </Suspense>
    )
}