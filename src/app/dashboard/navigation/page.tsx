import { requireOwnerPage } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { ListEditor } from '@/components/dashboard/ListEditor'
import { saveNav } from '../lists/actions'

export const instant = false

export default async function NavigationScreen() {
    await requireOwnerPage()
    const { data } = await createAdminClient().from('nav_links').select('id,label,href,placement,is_visible').order('sort_order')
    return (
        <ListEditor
            title="Navigation" subtitle="Choose what appears in the top bar. Up to 5 items show in the bar; the rest go under More."
            cols={[{ key: 'label', label: 'Label', type: 'text' }, { key: 'href', label: 'Links to', type: 'text', placeholder: '/frontend' }, { key: 'placement', label: 'Where', type: 'select', options: ['main', 'more', 'footer'] }, { key: 'is_visible', label: 'Visible', type: 'switch' }]}
            initial={data ?? []} blank={{ label: '', href: '/', placement: 'main', is_visible: true }} save={saveNav}
        />
    )
}