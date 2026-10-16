import SettingsEdit from '@/views/Admin/Settings/Edit';
import { getSettings } from '@/lib/settings';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Configuración' };

export default async function SettingsPage() {
    const supabase = await createClient();
    return <SettingsEdit settings={await getSettings(supabase)} />;
}
