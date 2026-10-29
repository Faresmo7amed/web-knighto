import { requireOwnerPage } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { ListEditor } from '@/components/dashboard/ListEditor'
import { savePackageManagers } from '../lists/actions'

export const instant = false

export default async function CodeBlocksScreen() {
    await requireOwnerPage()
    const { data } = await createAdminClient().from('package_managers').select('id,id_key,label,install_command,run_command,is_enabled').order('sort_order')
    return (
        <ListEditor
            title="Code blocks" subtitle="Package manager tabs for install commands. Use {pkg} for the package name in the patterns."
            cols={[{ key: 'id_key', label: 'Key', type: 'text', placeholder: 'npm' }, { key: 'label', label: 'Tab label', type: 'text' }, { key: 'install_command', label: 'Install pattern', type: 'text', placeholder: 'npm install {pkg}' }, { key: 'run_command', label: 'Run pattern', type: 'text', placeholder: 'npm run {script}' }, { key: 'is_enabled', label: 'Shown', type: 'switch' }]}
            initial={data ?? []} blank={{ id_key: '', label: '', install_command: '', run_command: '', is_enabled: true }} save={savePackageManagers}
        />
    )
}