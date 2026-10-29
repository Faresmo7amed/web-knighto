import { requireOwnerPage } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { ExtraForm, type Field } from '@/components/dashboard/ExtraForm'
import { LegalEditor, type LegalRow } from '@/components/dashboard/LegalEditor'

export const instant = false

const fields: Field[] = [
    { key: 'cookie_message', label: 'Cookie notice message', type: 'textarea' },
    { key: 'cookie_accept', label: 'Accept button', type: 'text' },
    { key: 'notfound_title', label: '404 headline', type: 'text' },
    { key: 'notfound_message', label: '404 message', type: 'textarea' },
    { key: 'error_title', label: 'Error headline', type: 'text' },
]

export default async function LegalScreen() {
    await requireOwnerPage()
    const db = createAdminClient()
    const [{ data: pages }, { data: site }] = await Promise.all([db.from('legal_pages').select('kind,title,markdown'), db.from('site_settings').select('extra').eq('id', true).maybeSingle()])
    const order = ['about', 'terms', 'privacy', 'copyright', 'contact']
    const sorted = ((pages ?? []) as LegalRow[]).sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind))
    const values = { cookie_message: 'This site saves your reading progress in this browser. Nothing is sent to a server.', cookie_accept: 'Got it', notfound_title: 'This page could not be found', notfound_message: 'The link may be old, or the page may have moved. Search for what you were after.', error_title: 'Something went wrong', ...(site?.extra ?? {}) }
    return <ExtraForm title="Pages and legal" subtitle="Edit the fixed pages, the cookie notice and the error pages." fields={fields} values={values}><LegalEditor pages={sorted} /></ExtraForm>
}