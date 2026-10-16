-- =============================================================================
-- Tecno Soluciones — esquema de base de datos para Supabase
-- Pegá este archivo completo en Supabase → SQL Editor → New query → Run.
-- Es idempotente para las funciones/políticas, pero las tablas se crean una
-- sola vez (si ya existen, borralas antes de volver a correrlo).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Perfiles de usuario (nombre + rol). Se crean solos al dar de alta un usuario
-- en Authentication. El PRIMER usuario que se crea queda como admin.
-- -----------------------------------------------------------------------------
create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    name text not null default '',
    role text not null default 'user' check (role in ('admin', 'user')),
    created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, name, role)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
        case when exists (select 1 from public.profiles where role = 'admin') then 'user' else 'admin' end
    );
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- updated_at automático
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Tablas
-- -----------------------------------------------------------------------------
create table public.settings (
    key text primary key,
    value text,
    updated_at timestamptz not null default now()
);

create table public.categories (
    id bigint generated always as identity primary key,
    name text not null,
    slug text not null unique,
    icon text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.products (
    id bigint generated always as identity primary key,
    category_id bigint references public.categories (id) on delete set null,
    name text not null,
    slug text not null unique,
    sku text,
    description text,
    price numeric(12, 2) not null default 0 check (price >= 0),
    compare_price numeric(12, 2) check (compare_price >= 0),
    stock integer not null default 0 check (stock >= 0),
    condition text not null default 'nuevo' check (condition in ('nuevo', 'usado', 'reacondicionado')),
    is_featured boolean not null default false,
    is_active boolean not null default true,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.product_images (
    id bigint generated always as identity primary key,
    product_id bigint not null references public.products (id) on delete cascade,
    path text not null,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

create table public.services (
    id bigint generated always as identity primary key,
    title text not null,
    slug text not null unique,
    icon text,
    description text,
    price_from numeric(12, 2) check (price_from >= 0),
    is_active boolean not null default true,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.repair_orders (
    id bigint generated always as identity primary key,
    code text unique,

    customer_name text not null,
    customer_phone text not null,
    customer_dni text,

    device_type text not null check (device_type in ('celular', 'notebook', 'pc', 'tablet', 'componente', 'audio', 'otro')),
    brand text not null,
    model text not null,
    serial_number text,
    reported_issue text not null,
    accessories text,
    device_password text,

    status text not null default 'recibido' check (status in (
        'recibido', 'diagnosticando', 'presupuestado', 'aprobado', 'en_reparacion',
        'listo', 'entregado', 'no_reparable', 'cancelado'
    )),

    parts_cost numeric(12, 2) not null default 0,
    labor_cost numeric(12, 2) not null default 0,
    charged_price numeric(12, 2),

    warranty_days integer not null default 30,
    warranty_notes text,
    internal_notes text,

    technician_id uuid references public.profiles (id) on delete set null,

    received_at timestamptz not null default now(),
    promised_at timestamptz,
    delivered_at timestamptz,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.repair_order_status_logs (
    id bigint generated always as identity primary key,
    repair_order_id bigint not null references public.repair_orders (id) on delete cascade,
    status text not null,
    note text,
    user_id uuid default auth.uid() references public.profiles (id) on delete set null,
    created_at timestamptz not null default now()
);

create table public.contact_messages (
    id bigint generated always as identity primary key,
    name text not null check (char_length(name) <= 120),
    phone text not null check (char_length(phone) <= 40),
    email text check (char_length(email) <= 120),
    source text not null default 'contacto' check (char_length(source) <= 40),
    message text not null check (char_length(message) <= 2000),
    is_attended boolean not null default false,
    created_at timestamptz not null default now()
);

create index on public.products (category_id);
create index on public.product_images (product_id);
create index on public.repair_orders (status);
create index on public.repair_orders (received_at desc);
create index on public.repair_order_status_logs (repair_order_id);

create trigger touch_categories before update on public.categories for each row execute function public.touch_updated_at();
create trigger touch_products before update on public.products for each row execute function public.touch_updated_at();
create trigger touch_services before update on public.services for each row execute function public.touch_updated_at();
create trigger touch_repair_orders before update on public.repair_orders for each row execute function public.touch_updated_at();
create trigger touch_settings before update on public.settings for each row execute function public.touch_updated_at();

-- -----------------------------------------------------------------------------
-- Fichas de reparación: código automático (TS-26-00001) e historial inicial
-- -----------------------------------------------------------------------------
create or replace function public.repair_order_set_code()
returns trigger
language plpgsql
as $$
begin
    if new.code is null or new.code = '' then
        new.code := 'TS-' || to_char(new.received_at, 'YY') || '-' || lpad(new.id::text, 5, '0');
    end if;
    return new;
end;
$$;

create trigger repair_order_set_code
    before insert on public.repair_orders
    for each row execute function public.repair_order_set_code();

create or replace function public.repair_order_initial_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.repair_order_status_logs (repair_order_id, status, note, user_id, created_at)
    values (new.id, new.status, 'Equipo ingresado.', auth.uid(), new.received_at);
    return new;
end;
$$;

create trigger repair_order_initial_log
    after insert on public.repair_orders
    for each row execute function public.repair_order_initial_log();

-- Cambio de estado + registro en el historial en una sola operación
create or replace function public.update_repair_order_status(p_order_id bigint, p_status text, p_note text default null)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
    update public.repair_orders
    set status = p_status,
        delivered_at = case when p_status = 'entregado' and delivered_at is null then now() else delivered_at end
    where id = p_order_id;

    insert into public.repair_order_status_logs (repair_order_id, status, note, user_id)
    values (p_order_id, p_status, nullif(trim(p_note), ''), auth.uid());
end;
$$;

-- -----------------------------------------------------------------------------
-- Seguridad (Row Level Security)
--   · Visitantes: leen catálogo, servicios y configuración; pueden enviar
--     mensajes de contacto.
--   · Admin: acceso total.
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.services enable row level security;
alter table public.repair_orders enable row level security;
alter table public.repair_order_status_logs enable row level security;
alter table public.contact_messages enable row level security;

-- profiles: cada uno ve el suyo, el admin ve todos. Solo se puede editar el nombre.
create policy "profiles_select" on public.profiles for select to authenticated
    using (id = auth.uid() or public.is_admin());
create policy "profiles_update_self" on public.profiles for update to authenticated
    using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated, anon;
grant update (name) on public.profiles to authenticated;

-- Lectura pública
create policy "settings_public_read" on public.settings for select to anon, authenticated using (true);
create policy "categories_public_read" on public.categories for select to anon, authenticated using (true);
create policy "products_public_read" on public.products for select to anon, authenticated
    using (is_active or public.is_admin());
create policy "product_images_public_read" on public.product_images for select to anon, authenticated using (true);
create policy "services_public_read" on public.services for select to anon, authenticated
    using (is_active or public.is_admin());

-- Formulario de contacto: cualquiera puede enviar, solo el admin lee.
create policy "contact_messages_public_insert" on public.contact_messages for insert to anon, authenticated
    with check (is_attended = false);
create policy "contact_messages_admin_read" on public.contact_messages for select to authenticated
    using (public.is_admin());

-- Escritura solo admin
create policy "settings_admin_write" on public.settings for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
create policy "categories_admin_write" on public.categories for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
create policy "products_admin_write" on public.products for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
create policy "product_images_admin_write" on public.product_images for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
create policy "services_admin_write" on public.services for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
create policy "repair_orders_admin_all" on public.repair_orders for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
create policy "repair_order_status_logs_admin_all" on public.repair_order_status_logs for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
create policy "contact_messages_admin_update" on public.contact_messages for update to authenticated
    using (public.is_admin()) with check (public.is_admin());
create policy "contact_messages_admin_delete" on public.contact_messages for delete to authenticated
    using (public.is_admin());

-- -----------------------------------------------------------------------------
-- Storage: bucket público para las fotos de productos
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "products_bucket_admin_insert" on storage.objects for insert to authenticated
    with check (bucket_id = 'products' and public.is_admin());
create policy "products_bucket_admin_update" on storage.objects for update to authenticated
    using (bucket_id = 'products' and public.is_admin());
create policy "products_bucket_admin_delete" on storage.objects for delete to authenticated
    using (bucket_id = 'products' and public.is_admin());
