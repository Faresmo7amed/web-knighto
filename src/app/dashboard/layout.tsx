import { signOut } from './actions'
import { requireOwner } from '@/lib/auth'
import { DashShell } from '@/components/dashboard/DashShell'
import { connection } from 'next/server'

// Authenticated dashboard pages wait for the request-specific session.
export const instant = false

// Signed-out visitors get the bare page (the login cards). proxy.ts already redirects them away from every other dashboard path.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    await connection()
    let user
    try {
        user = await requireOwner()
    } catch {
        return <>{children}</>
    }
    return <DashShell email={user.email ?? ''} signOutAction={signOut}>{children}</DashShell>
}