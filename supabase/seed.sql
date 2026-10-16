-- =============================================================================
-- Datos iniciales (configuración, categorías, servicios, productos y fichas de
-- demostración). Correr DESPUÉS de schema.sql. Se puede correr más de una vez.
-- =============================================================================

insert into public.settings (key, value) values
    ('site_name', 'Tecno Soluciones'),
    ('tagline', 'Servicio Técnico & Microelectrónica'),
    ('bio', 'Tu solución rápida y segura. Expertos en ecosistema Apple, Android, notebooks y microelectrónica.'),
    ('whatsapp_number', '5493794037947'),
    ('phone_display', '+54 9 379 403-7947'),
    ('email', 'contacto@tecnosoluciones.com.ar'),
    ('address', 'Ayacucho 2970, Corrientes, Corrientes'),
    ('city', 'Corrientes, Argentina'),
    ('schedule', E'Lunes a Viernes: 9 a 13 y 16 a 20 hs\nSábados: 9 a 13 hs'),
    ('instagram_url', 'https://www.instagram.com/tecnosoluciones.ctes/'),
    ('map_embed_url', 'https://www.google.com/maps?q=Ayacucho+2970,+Corrientes,+Corrientes&output=embed')
on conflict (key) do nothing;

insert into public.categories (name, slug, icon, sort_order) values
    ('Celulares', 'celulares', 'smartphone', 0),
    ('Notebooks & PC', 'notebooks-pc', 'laptop', 1),
    ('Componentes & Microelectrónica', 'componentes-microelectronica', 'cpu', 2),
    ('Audio & Parlantes', 'audio-parlantes', 'headphones', 3),
    ('Tablets', 'tablets', 'tablet', 4),
    ('Accesorios', 'accesorios', 'plug', 5)
on conflict (slug) do nothing;

insert into public.services (title, slug, icon, description, sort_order) values
    ('Diagnóstico técnico', 'diagnostico-tecnico', 'search-check',
        'Revisión completa del equipo para detectar la falla real antes de presupuestar cualquier reparación.', 0),
    ('Service especializado Apple', 'service-especializado-apple', 'apple',
        'Reparación de iPhone, iPad y Mac: pantallas, baterías, conectores de carga, cámaras y microsoldadura de placa.', 1),
    ('Reparación de celulares Android', 'reparacion-de-celulares-android', 'smartphone',
        'Cambio de pantallas, baterías, módulos de carga, botones y reparación de placa en equipos Android de todas las marcas.', 2),
    ('Notebooks y PC de escritorio', 'notebooks-y-pc-de-escritorio', 'laptop',
        'Mantenimiento, cambio de teclados y pantallas, actualización de memoria/SSD, formateo e instalación de software.', 3),
    ('Microelectrónica y microsoldadura', 'microelectronica-y-microsoldadura', 'cpu',
        'Reparación de placas a nivel de componente: cortos, pistas dañadas, chips de carga y microcontroladores.', 4),
    ('Audio y parlantes', 'audio-y-parlantes', 'headphones',
        'Reparación de parlantes bluetooth, auriculares y equipos de audio: baterías, conectores y placas de sonido.', 5),
    ('Diseño y desarrollo web', 'diseno-y-desarrollo-web', 'globe',
        'Páginas web modernas y a medida para emprendimientos y comercios, igual que la que estás viendo ahora.', 6)
on conflict (slug) do nothing;

insert into public.products (category_id, name, slug, description, price, compare_price, stock, condition, is_featured, sort_order)
select c.id, p.name, p.slug, p.description, p.price, p.compare_price, p.stock, p.condition, p.is_featured, p.sort_order
from (values
    ('celulares', 'iPhone 11 64GB', 'iphone-11-64gb', 'iPhone 11 reacondicionado, batería verificada, con garantía de nuestro taller.', 380000, 420000, 2, 'usado', true, 0),
    ('celulares', 'Samsung Galaxy A34 128GB', 'samsung-galaxy-a34-128gb', 'Equipo nuevo sellado, garantía oficial.', 310000, null, 4, 'nuevo', true, 1),
    ('notebooks-pc', 'Notebook Lenovo IdeaPad 3 i5', 'notebook-lenovo-ideapad-3-i5', 'Notebook reacondicionada, 8GB RAM, SSD 256GB, ideal estudio y trabajo.', 520000, null, 1, 'usado', true, 2),
    ('notebooks-pc', 'SSD 480GB Kingston', 'ssd-480gb-kingston', 'Repuesto nuevo para upgrade de PC o notebook.', 45000, null, 10, 'nuevo', false, 3),
    ('componentes-microelectronica', 'Pantalla iPhone 12 (repuesto)', 'pantalla-iphone-12-repuesto', 'Módulo de pantalla compatible, instalación disponible en el local.', 95000, null, 5, 'nuevo', false, 4),
    ('componentes-microelectronica', 'Batería genérica notebook', 'bateria-generica-notebook', 'Batería de reemplazo para distintos modelos, consultar compatibilidad.', 38000, null, 6, 'nuevo', false, 5),
    ('audio-parlantes', 'Parlante Bluetooth JBL Go', 'parlante-bluetooth-jbl-go', 'Parlante portátil, resistente a salpicaduras.', 42000, null, 3, 'nuevo', false, 6),
    ('accesorios', 'Cargador rápido tipo C 20W', 'cargador-rapido-tipo-c-20w', 'Cargador original compatible, carga rápida certificada.', 15000, null, 15, 'nuevo', true, 7),
    ('tablets', 'Tablet Samsung Galaxy Tab A9', 'tablet-samsung-galaxy-tab-a9', 'Tablet nueva sellada con garantía oficial.', 260000, null, 2, 'nuevo', false, 8)
) as p (category_slug, name, slug, description, price, compare_price, stock, condition, is_featured, sort_order)
left join public.categories c on c.slug = p.category_slug
on conflict (slug) do nothing;

-- Fichas de reparación de demostración (solo si la tabla está vacía)
insert into public.repair_orders (
    customer_name, customer_phone, device_type, brand, model, reported_issue, status,
    parts_cost, labor_cost, charged_price, warranty_days, technician_id,
    received_at, delivered_at, created_at, updated_at
)
select
    'Cliente demo ' || s.n,
    '379400000' || lpad((s.n - 1)::text, 2, '0'),
    s.device_type, s.brand, s.model, s.issue, s.status,
    s.parts, s.labor, s.price, 30,
    (select id from public.profiles where role = 'admin' order by created_at limit 1),
    now() - make_interval(days => s.days_ago),
    case when s.status = 'entregado' then now() - make_interval(days => s.days_ago - 3) end,
    now() - make_interval(days => s.days_ago),
    now() - make_interval(days => s.days_ago)
from (values
    (1, 'celular', 'Apple', 'iPhone 12', 'No enciende, se moja el equipo', 'entregado', 45000, 20000, 110000, 58),
    (2, 'celular', 'Samsung', 'Galaxy S21', 'Pantalla rota', 'entregado', 60000, 15000, 130000, 50),
    (3, 'notebook', 'HP', 'Pavilion 15', 'No carga la batería', 'entregado', 30000, 15000, 75000, 45),
    (4, 'celular', 'Motorola', 'Moto G22', 'Cambio de módulo de carga', 'entregado', 18000, 10000, 45000, 40),
    (5, 'componente', 'Genérico', 'Placa fuente PC', 'Cortocircuito en fuente', 'entregado', 12000, 12000, 35000, 33),
    (6, 'celular', 'Apple', 'iPhone XR', 'Cambio de batería', 'entregado', 22000, 8000, 48000, 28),
    (7, 'notebook', 'Lenovo', 'IdeaPad 3', 'Formateo y limpieza', 'entregado', 0, 15000, 25000, 20),
    (8, 'audio', 'JBL', 'Charge 4', 'No enciende', 'entregado', 8000, 9000, 28000, 15),
    (9, 'celular', 'Samsung', 'A34', 'Pantalla táctil no responde', 'en_reparacion', 55000, 0, null, 6),
    (10, 'celular', 'Apple', 'iPhone 13', 'Cámara trasera no enfoca', 'presupuestado', 0, 0, null, 4),
    (11, 'notebook', 'ASUS', 'Vivobook 15', 'Se apaga sola / recalienta', 'diagnosticando', 0, 0, null, 2),
    (12, 'celular', 'Xiaomi', 'Redmi Note 12', 'Cambio de pin de carga', 'recibido', 0, 0, null, 1)
) as s (n, device_type, brand, model, issue, status, parts, labor, price, days_ago)
where not exists (select 1 from public.repair_orders)
order by s.n;
