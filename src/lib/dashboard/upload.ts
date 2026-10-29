'use client'

import { registerMedia } from '@/app/dashboard/media/actions'
import type { Result } from './types'

// Uploads an image straight to R2 (with progress) and records it in the media table. Use from the editor and the Media screen.
export async function uploadImage(file: File, onProgress?: (percent: number) => void): Promise<Result> {
    const response = await fetch('/api/media/upload-url', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
    })
    if (!response.ok) return { ok: false, error: 'This file type or size is not allowed (images up to 10 MB).' }
    const { key, uploadUrl } = await response.json()
    const stored = await new Promise<boolean>((resolve) => {
        const request = new XMLHttpRequest()
        request.open('PUT', uploadUrl)
        request.setRequestHeader('Content-Type', file.type)
        request.upload.onprogress = (event) => { if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100)) }
        request.onload = () => resolve(request.status >= 200 && request.status < 300)
        request.onerror = () => resolve(false)
        request.send(file)
    })
    if (!stored) return { ok: false, error: 'Upload to storage failed. Check the R2 CORS settings.' }
    return registerMedia(key, file.size, file.type)
}