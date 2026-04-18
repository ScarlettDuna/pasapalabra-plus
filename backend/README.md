# Pasapalabra+ — Backend
## Última actualización: 6 de abril de 2026.

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
JWT_EXPIRES_IN="7d"
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
├── server.js                  # Entrada principal
├── prisma/
│   ├── schema.prisma          # Esquema de la base de datos
│   ├── seed.js                # Script para popular la BD
│   └── migrations/            # Historial de migraciones
└── src/
    ├── controllers/           # Lógica de negocio
    ├── routes/                # Rutas de la API
    ├── middlewares/           # Autenticación JWT
    ├── config/
    │   └── passport.js        # Estrategias OAuth (Google, GitHub)
    └── db/
        └── prisma.js          # Cliente Prisma
```

---

## Endpoints principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/health` | No | Estado del servidor |
| POST | `/api/auth/register` | No | Registro de usuario |
| POST | `/api/auth/login` | No | Login, devuelve JWT |
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
| GET | `/api/admin/questions/pending` | Sí (admin) | Ver preguntas pendientes |
| PATCH | `/api/admin/questions/:id/approve` | Sí (admin) | Aprobar pregunta |
| PATCH | `/api/admin/questions/:id/reject` | Sí (admin) | Rechazar pregunta |

La documentación completa de la API está en `documentacion/api.md`.

---

## Mejoras planificadas

Las siguientes funcionalidades están diseñadas y pendientes de implementar:

| # | Descripción | Notas |
|---|-------------|-------|
| 1 | ~~**Ranking con username**~~ | ✅ Implementado. `GET /ranking` devuelve `playerName` con el username del jugador registrado o un nombre generado `Categoría-DDmmm` para partidas anónimas. |
| 2 | ~~**Unificar `POST /games/start` con la carga del rosco**~~ | ✅ Implementado. `startGame` devuelve ya las preguntas en la misma respuesta. `GET /rosco` sigue disponible. |
| 3 | **Limpieza de partidas no terminadas** | Las partidas sin `endedAt` acumulan ruido en la BD. Se implementará un mecanismo (setTimeout / cron) que marque como abandonadas las partidas con más de 10 minutos de antigüedad sin finalizar. |
| 4 | **`GET /questions/mine`** | Endpoint para que el usuario consulte sus propias preguntas personalizadas con su estado de moderación (aprobada, pendiente, rechazada). |
| 5 | **Refresh tokens** | Sistema de tokens de corta duración + refresh token. Baja prioridad, solo si hay tiempo antes de la entrega. |
