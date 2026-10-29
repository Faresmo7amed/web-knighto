import { requireOwnerPage } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { ListEditor } from '@/components/dashboard/ListEditor'
import { saveSocial } from '../lists/actions'

export const instant = false

export default async function SocialScreen() {
    await requireOwnerPage()
    const { data } = await createAdminClient().from('social_links').select('id,label,href,icon,is_visible').order('sort_order')
    return (
        <ListEditor
            title="Social links" subtitle="The small icons in the header, the footer and the About page."
            cols={[{ key: 'icon', label: 'Icon', type: 'select', options: ['link', 'mail', 'rss'] }, { key: 'label', label: 'Label', type: 'text' }, { key: 'href', label: 'Address', type: 'text', placeholder: 'https://…' }, { key: 'is_visible', label: 'Visible', type: 'switch' }]}
            initial={data ?? []} blank={{ icon: 'link', label: '', href: 'https://', is_visible: true }} save={saveSocial}
        />
    )
}