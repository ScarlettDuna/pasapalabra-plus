# Pasapalabra+ — Backend
## Última actualización: 20 de mayo de 2026.

API REST desarrollada con Node.js + Express + PostgreSQL.

## Requisitos previos

- Node.js v18 o superior
- PostgreSQL instalado y corriendo en local

## Instalación

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Crear el archivo `.env`

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
PORT=5000
DATABASE_URL="postgresql://pasapalabra_user:pasapalabra_pass@localhost:5432/pasapalabra_db"
JWT_SECRET="super_clave_larga_y_aleatoria_123"
JWT_EXPIRES_IN="1h"
REFRESH_TOKEN_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
FRONTEND_URL="http://localhost:5173"

# OAuth — obtener las credenciales en Google Cloud Console y GitHub Developer Settings
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret
```

### 3. Crear la base de datos en PostgreSQL

Abre `psql` o pgAdmin y ejecuta:

```sql
CREATE USER pasapalabra_user WITH PASSWORD 'pasapalabra_pass';
CREATE DATABASE pasapalabra_db OWNER pasapalabra_user;
```

### 4. Ejecutar las migraciones

```bash
npx prisma migrate deploy
```

Esto crea todas las tablas en la base de datos.

**Para abrir la interfaz de prima:**

```bash
npx prisma studio
```

### 5. Popular la base de datos (seed)

```bash
node prisma/seed.js
```

Inserta las categorías, las preguntas del rosco en los tres idiomas (ES, EN, FR) y los siguientes usuarios de prueba:

| Usuario | Email | Contraseña | Rol |
|---------|-------|-----------|-----|
| admin | admin@pasapalabra.com | admin1234 | admin |
| user | user@pasapalabra.com | user1234 | user |

### 6. Arrancar el servidor

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:5000`.

---

## Verificar que funciona

```
GET http://localhost:5000/api/health
```

Respuesta esperada:
```json
{
  "ok": true,
  "service": "pasapalabra-backend",
  "time": "..."
}
```

---

## Estructura del proyecto

```
backend/
├── server.js                  # Entrada principal (listen + cron)
├── tests/
│   └── api.test.js            # Tests de integración (Vitest + Supertest)
├── prisma/
│   ├── schema.prisma          # Esquema de la base de datos
│   ├── seed.js                # Script para popular la BD
│   └── migrations/            # Historial de migraciones
└── src/
    ├── app.js                 # App Express configurada (sin listen)
    ├── controllers/           # Lógica de negocio
    ├── routes/                # Rutas de la API
    ├── middlewares/           # Autenticación JWT
    ├── config/
    │   └── passport.js        # Estrategias OAuth (Google, GitHub)
    ├── utils/
    │   ├── achievements.js    # Lógica de logros
    │   └── timeout.js         # Cron de limpieza
    └── db/
        └── prisma.js          # Cliente Prisma
```

---

## Endpoints principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/health` | No | Estado del servidor |
| POST | `/api/auth/register` | No | Registro de usuario |
| POST | `/api/auth/login` | No | Login, devuelve access token + refresh token |
| POST | `/api/auth/refresh` | No | Renovar access token con el refresh token |
| POST | `/api/auth/logout` | No | Invalidar refresh token |
| GET | `/api/categories?language=ES` | No | Categorías por idioma |
| GET | `/api/rosco?language=ES&categoryId=3&difficulty=easy` | No | Preguntas del rosco |
| POST | `/api/games/start` | Opcional | Iniciar partida y preguntas del rosco|
| POST | `/api/games/:gameId/finish` | Opcional | Finalizar partida |
| GET | `/api/ranking?language=ES` | No | Top 15 scores |
| GET | `/api/users/me` | Sí | Perfil del usuario |
| GET | `/api/users/me/games` | Sí | Historial de partidas |
| GET | `/api/users/me/stats` | Sí | Estadísticas personales |
| GET | `/api/users/me/achievements` | Sí | Logros del usuario |
| GET | `/api/auth/google` | No | Login con Google (OAuth) |
| GET | `/api/auth/github` | No | Login con GitHub (OAuth) |
| POST | `/api/questions` | Sí | Crear pregunta personalizada |
| GET | `/api/questions/mine` | Sí | Ver preguntas propias con estado de moderación |
| GET | `/api/admin/questions/pending` | Sí (admin) | Ver preguntas pendientes |
| PATCH | `/api/admin/questions/:id/approve` | Sí (admin) | Aprobar pregunta |
| PATCH | `/api/admin/questions/:id/reject` | Sí (admin) | Rechazar pregunta |

La documentación completa de la API está en `documentacion/api.md`.

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Arranca el servidor con nodemon (recarga automática) |
| `npm start` | Arranca el servidor en producción |
| `npm run lint` | Ejecuta ESLint sobre `src/` y `server.js` |
| `npm test` | Ejecuta los tests de integración con Vitest |

---

## Pendiente

| | Tarea | Notas |
|---|-------|-------|
| ✅ | **ESLint** | Configurado con `eslint.config.js`, 0 errores |
| ✅ | **Helmet.js** | Añadido como primer middleware en `src/app.js` |
| ✅ | **Rate limiting en `/auth/login`** | 10 intentos / 15 min por IP con `express-rate-limit` |
| ✅ | **Limpiar refresh tokens expirados en el cron** | `deleteMany` en `timeout.js` cada 10 min |
| ✅ | **Tests de integración** | 7 tests con Vitest + Supertest en `tests/api.test.js` |
| ⬜ | **Despliegue en AWS** | EC2 + RDS (pendiente activación cuenta estudiante) |
