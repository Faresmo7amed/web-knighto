import { requireOwnerPage } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { TokenEditor } from '@/components/dashboard/TokenEditor'

export const instant = false

export default async function AppearanceScreen() {
    await requireOwnerPage()
    const db = createAdminClient()
    const [theme, syntax] = await Promise.all([db.from('theme_tokens').select('theme,token,value').order('token'), db.from('syntax_colors').select('theme,token,value').order('token')])
    const pick = (rows: { theme: string; token: string; value: string }[] | null, which: string) => (rows ?? []).filter((r) => r.theme === which).map((r) => ({ name: r.token, value: r.value }))
    return <TokenEditor initial={{ 'theme:light': pick(theme.data, 'light'), 'theme:dark': pick(theme.data, 'dark'), 'syntax:light': pick(syntax.data, 'light'), 'syntax:dark': pick(syntax.data, 'dark') }} />
}