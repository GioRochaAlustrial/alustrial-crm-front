# CRM Frontend (Next.js + Tailwind) - Login

Proyecto **JavaScript** (App Router) listo para conectarse a tu backend con prefijo **/crm**.

## Configuración
1) Instalar:
```bash
npm install
```

2) Variables de entorno (`.env.local`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/crm
```

3) Correr en puerto 3100:
```bash
npm run dev
```

## Endpoints usados
- Login: `POST ${NEXT_PUBLIC_API_BASE_URL}/auth/login`
- Body: `{ "correo": "...", "contrasena": "..." }`

Rutas:
- `/login`
- `/dashboard` (protegida por cookie httpOnly `token` + middleware)
