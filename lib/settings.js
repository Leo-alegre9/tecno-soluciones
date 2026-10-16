export const DEFAULT_SETTINGS = {
    site_name: 'Tecno Soluciones',
    tagline: 'Servicio Técnico & Microelectrónica',
    bio: 'Tu solución rápida y segura. Expertos en ecosistema Apple, Android, notebooks y microelectrónica.',
    whatsapp_number: '5493794037947',
    phone_display: '+54 9 379 403-7947',
    email: 'contacto@tecnosoluciones.com.ar',
    address: 'Ayacucho 2970, Corrientes, Corrientes',
    city: 'Corrientes, Argentina',
    schedule: 'Lunes a Viernes: 9 a 13 y 16 a 20 hs\nSábados: 9 a 13 hs',
    instagram_url: 'https://www.instagram.com/tecnosoluciones.ctes/',
    map_embed_url: 'https://www.google.com/maps?q=Ayacucho+2970,+Corrientes&output=embed',
};

export async function getSettings(supabase) {
    const { data } = await supabase.from('settings').select('key, value');
    const settings = { ...DEFAULT_SETTINGS };
    for (const row of data ?? []) {
        if (row.key in settings) settings[row.key] = row.value ?? '';
    }
    return settings;
}
