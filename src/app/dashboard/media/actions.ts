'use server'

import { revalidatePath } from 'next/cache'
import { fail, guard } from '@/lib/dashboard/db'
import { deleteObject } from '@/lib/r2'
import type { MediaRow } from '@/lib/dashboard/types'

// Records an uploaded file in the media table. Call it after the browser finished the direct R2 upload.
export async function registerMedia(key: string, size: number, mime: string) {
    return guard(async ({ db }) => {
        const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, '')
        if (!base) return fail('Set R2_PUBLIC_URL in .env.local to the public address of your bucket.')
        if (!key.startsWith('media/')) return fail('Invalid media key.')
        const { data, error } = await db.from('media').insert({ object_key: key, public_url: `${base}/${key}`, mime_type: mime, byte_size: size, alt_text: '' }).select('*').single()
        if (error) throw error
        revalidatePath('/dashboard/media')
        return { ok: true, media: data as MediaRow }
    })
}

// Saves the alt text of one file.
export async function updateMediaAlt(id: string, alt: string) {
    return guard(async ({ db }) => {
        const { error } = await db.from('media').update({ alt_text: alt.trim() }).eq('id', id)
        if (error) throw error
        return { ok: true }
    })
}

// Lists the pages that use a file (in text or as a banner), so you know what deleting it would break.
export async function getMediaUsage(id: string) {
    return guard(async ({ db }) => {
        const { data: media } = await db.from('media').select('public_url').eq('id', id).single()
        if (!media) return fail('File not found.')
        const pattern = `%${media.public_url.replace(/[\\%_]/g, (char: string) => '\\' + char)}%`
        const [inText, asBanner] = await Promise.all([db.from('articles').select('page_id').ilike('markdown', pattern), db.from('pages').select('id').eq('banner_url', media.public_url)])
        const ids = [...new Set([...(inText.data ?? []).map((row) => row.page_id), ...(asBanner.data ?? []).map((row) => row.id)])]
        if (!ids.length) return { ok: true, usage: [] }
        const { data: pages } = await db.from('pages').select('title').in('id', ids)
        return { ok: true, usage: (pages ?? []).map((page) => page.title as string) }
    })
}

// Deletes the file from R2 and the media table. The confirmation happens in the browser first.
export async function deleteMedia(id: string) {
    return guard(async ({ db }) => {
        const { data } = await db.from('media').select('object_key').eq('id', id).single()
        if (!data) return fail('File not found.')
        await deleteObject(data.object_key)
        const { error } = await db.from('media').delete().eq('id', id)
        if (error) throw error
        revalidatePath('/dashboard/media')
        return { ok: true }
    })
}