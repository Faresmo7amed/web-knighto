import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/auth'
import { deleteObject } from '@/lib/r2'

// Deletes one R2 object after the owner has confirmed the deletion in the dashboard.
export async function DELETE(request: NextRequest) {
    try {
        await requireOwner()
        const { key } = await request.json()
        if (typeof key !== 'string' || !key.startsWith('media/')) return NextResponse.json({ error: 'Invalid media key.' }, { status: 400 })
        await deleteObject(key)
        return new NextResponse(null, { status: 204 })
    } catch {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }
}
