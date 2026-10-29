import { requireOwnerPage } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { ExtraForm, type Field } from '@/components/dashboard/ExtraForm'
import { ClearProgress } from '@/components/dashboard/ClearProgress'

export const instant = false

const fields: Field[] = [
    { key: 'name', label: 'Site name', type: 'text', column: true },
    { key: 'owner_name', label: 'Owner name', type: 'text', column: true },
    { key: 'description', label: 'Tagline and default description', type: 'textarea', column: true, hint: 'Also used as the default search-engine description.' },
    { key: 'default_locale', label: 'Default language', type: 'select', column: true, options: [{ value: 'en', label: 'English' }, { value: 'ar', label: 'Arabic' }] },
    { key: 'timezone', label: 'Time zone', type: 'text', hint: 'For example Africa/Cairo.' },
    { key: 'noindex', label: 'Ask search engines not to index the site', type: 'switch' },
    { key: 'maintenance', label: 'Maintenance mode', type: 'switch', hint: 'You can still sign in to the dashboard.' },
    { key: 'maintenance_message', label: 'Maintenance message', type: 'textarea' },
    { key: 'analytics', label: 'Enable analytics', type: 'switch', hint: 'Off by default. Nothing about readers is collected unless you turn this on.' },
    { key: 'cookie_notice', label: 'Show the cookie and storage notice', type: 'switch' },
]

export default async function SiteScreen() {
    await requireOwnerPage()
    const { data } = await createAdminClient().from('site_settings').select('*').eq('id', true).maybeSingle()
    const values = { timezone: 'Africa/Cairo', cookie_notice: true, maintenance_message: 'The site is being updated. Please check back soon.', ...(data?.extra ?? {}), name: data?.name ?? '', owner_name: data?.owner_name ?? '', description: data?.description ?? '', default_locale: data?.default_locale ?? 'en' }
    return <ExtraForm title="Site settings" subtitle="Name, language, sharing and availability." fields={fields} values={values}><ClearProgress /></ExtraForm>
}