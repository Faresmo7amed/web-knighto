import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/auth'
import { exportMarkdownZip, exportSiteData } from '@/lib/backups'

// Exports content as JSON or a ZIP of Markdown files. Both formats require the owner session.
export async function GET(request: NextRequest) {
    try {
        await requireOwner()
        const data = await exportSiteData()
        if (request.nextUrl.searchParams.get('format') === 'zip') {
            const zip = await exportMarkdownZip(data)
            const body = new Uint8Array(zip).buffer as ArrayBuffer
            return new NextResponse(body, {
                headers: {
                    'Content-Type': 'application/zip',
                    'Content-Disposition': 'attachment; filename="knowledge-site-export.zip"',
                },
            })
        }
        return NextResponse.json(data, {
            headers: { 'Content-Disposition': 'attachment; filename="knowledge-site-export.json"' },
        })
    } catch {
        return NextResponse.json({ error: 'Unauthorized or unavailable.' }, { status: 401 })
    }
}
