// src/app/dashboard/trash/page.tsx
import { requireOwnerPage } from '@/lib/auth'
import { TrashList } from '@/components/dashboard/TrashList'
import { loadTrashItems } from '@/lib/dashboard/trash'
import { connection } from 'next/server'

export const instant = false

export default async function TrashScreen() {
    await requireOwnerPage()
    await connection()
    const items = await loadTrashItems()
    return <TrashList items={items} />
}