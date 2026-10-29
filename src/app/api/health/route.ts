import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Reports whether the app can reach Supabase without exposing credentials or database contents.
export async function GET() {
    try {
        const supabase = await createClient()
        const { error } = await supabase.from('site_settings').select('id').limit(1)
        if (error) throw error
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Health check failed', error)
        const errorRecord = error as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown }
        const message = error instanceof Error
            ? error.message
            : typeof errorRecord.message === 'string'
                ? errorRecord.message
                : 'Unknown database error'

        return NextResponse.json(
            process.env.NODE_ENV === 'development'
                ? {
                    ok: false,
                    error: message,
                    code: typeof errorRecord.code === 'string' ? errorRecord.code : undefined,
                    details: typeof errorRecord.details === 'string' ? errorRecord.details : undefined,
                    hint: typeof errorRecord.hint === 'string' ? errorRecord.hint : undefined,
                }
                : { ok: false },
            { status: 503 }
        )
    }
}
