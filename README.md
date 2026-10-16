# Tecno Soluciones — Next.js + Supabase

Sitio público (inicio, catálogo, servicios, nosotros, contacto) y panel de administración
(equipos/reparaciones, productos, categorías, servicios, mensajes, configuración).

## Puesta en marcha

### 1. Crear el proyecto en Supabase
En [supabase.com](https://supabase.com) → **New project**.

### 2. Crear las tablas
**SQL Editor → New query**: pegá todo `supabase/schema.sql` y tocá **Run**.

### 3. Crear tu usuario administrador
**Authentication → Users → Add user → Create new user**, con tu email y contraseña y
**Auto Confirm User** tildado. El **primer** usuario que crees queda como admin.

### 4. Cargar los datos iniciales
**SQL Editor**: pegá `supabase/seed.sql` y **Run** (configuración del sitio, categorías,
servicios, productos y fichas de demostración).

### 5. Ajustes de Authentication
- **Sign In / Providers → Email**: desactivá *Allow new users to sign up* (así nadie más puede registrarse).
- **URL Configuration**: *Site URL* = `http://localhost:3000` y en *Redirect URLs* agregá
  `http://localhost:3000/auth/callback` (para "¿Olvidaste tu contraseña?"). Cuando lo subas a
  Vercel, agregá también `https://tu-dominio/auth/callback`.

### 6. Variables de entorno
Copiá `.env.example` a `.env.local` y completá con los datos de **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 7. Correrlo
```bash
npm install
npm run dev
```
- Sitio: http://localhost:3000
- Panel: http://localhost:3000/admin (te pide login)

## Estructura
- `app/` — rutas de Next.js. Cada página carga los datos de Supabase en el servidor.
- `views/` — pantallas (componentes de cliente), portadas del proyecto Laravel.
- `Components/`, `Layouts/` — componentes reutilizados del diseño original.
- `lib/` — clientes de Supabase, validaciones, helpers.
- `supabase/` — esquema SQL (tablas, seguridad RLS, storage) y datos iniciales.

La seguridad está en la base de datos (Row Level Security): los visitantes solo pueden leer el
catálogo/servicios y enviar mensajes de contacto; todo lo demás requiere un usuario con rol `admin`.
Para dar acceso de admin a otro usuario: `update profiles set role = 'admin' where id = '<uuid>';`
