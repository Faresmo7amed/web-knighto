import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Runs a tiny authenticated query for the scheduled keep-alive workflow.
export async function GET(request: NextRequest) {
    const secret = process.env.KEEPALIVE_SECRET
    if (!secret || request.headers.get('x-keepalive-secret') !== secret) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }
    try {
        const supabase = await createClient()
        const { error } = await supabase.from('site_settings').select('id').limit(1)
        if (error) throw error
        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ ok: false }, { status: 503 })
    }
}
