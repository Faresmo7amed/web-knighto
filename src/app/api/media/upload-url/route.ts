import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/auth'
import { createUploadUrl } from '@/lib/r2'

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const maxBytes = 10 * 1024 * 1024

// Creates a direct R2 upload URL after validating an image request from the owner.
export async function POST(request: NextRequest) {
    try {
        await requireOwner()
        const { filename, contentType, size } = await request.json()
        if (typeof filename !== 'string' || typeof contentType !== 'string' || typeof size !== 'number') {
            return NextResponse.json({ error: 'Invalid upload request.' }, { status: 400 })
        }
        if (!allowedTypes.has(contentType) || size <= 0 || size > maxBytes) {
            return NextResponse.json({ error: 'Unsupported image type or size.' }, { status: 400 })
        }
        const extension = filename.split('.').pop()?.replace(/[^a-z0-9]/gi, '') || 'bin'
        const key = `media/${crypto.randomUUID()}.${extension.toLowerCase()}`
        const uploadUrl = await createUploadUrl(key, contentType)
        return NextResponse.json({ key, uploadUrl })
    } catch {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }
}
