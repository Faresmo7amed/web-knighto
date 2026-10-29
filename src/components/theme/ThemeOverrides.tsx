import { cacheTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

const TOKEN = /^[a-z0-9-]{2,40}$/
const COLOR = /^#[0-9a-fA-F]{3,8}$/

// Turns the saved color overrides into one <style> tag. Cached until the Appearance screen saves (tag "theme").
export async function ThemeOverrides() {
    'use cache'
    cacheTag('theme')
    try {
        const db = createAdminClient()
        const [a, b] = await Promise.all([db.from('theme_tokens').select('theme,token,value'), db.from('syntax_colors').select('theme,token,value')])
        const rows = [...(a.data ?? []), ...(b.data ?? [])].filter((r) => TOKEN.test(r.token) && COLOR.test(r.value))
        const block = (theme: string) => rows.filter((r) => r.theme === theme).map((r) => `--${r.token}:${r.value};`).join('')
        const css = `:root,[data-theme='light']{${block('light')}}[data-theme='dark']{${block('dark')}}`
        return rows.length ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null
    } catch {
        return null
    }
}