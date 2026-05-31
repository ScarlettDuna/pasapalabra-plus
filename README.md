# Pasapalabra+

Aplicación web de tipo *Pasapalabra* desarrollada como Trabajo de Fin de Ciclo (DAW).
Un juego educativo, multilingüe y multitemática que permite poner a prueba el conocimiento
general de forma divertida, con soporte para usuarios registrados e invitados.

---

## Características principales

- Juego tipo rosco (A–Z) con dificultad y temática configurables
- Multilingüe: Español, Inglés y Francés
- 3 niveles de dificultad: fácil, medio, difícil
- Sistema de puntuación basado en aciertos, fallos y tiempo
- Ranking global por puntuación
- Resumen de letras al finalizar la partida
- Usuarios registrados e invitados (sin cuenta)
- Autenticación con Google y GitHub (OAuth 2.0)
- Sistema de logros desbloqueables
- Preguntas personalizadas creadas por usuarios
- Panel de administración para gestionar preguntas
- Perfil de usuario con estadísticas e historial
- Interfaz responsive (móvil y escritorio)

---

## Arquitectura

Monorepo con separación clara entre frontend, backend y documentación:

```
/frontend       → Interfaz de usuario (React + Vite)
/backend        → API REST y lógica de negocio (Node.js + Express)
/documentacion  → Anteproyecto, diagramas y diario de desarrollo
```

---

## Tecnologías

### Frontend
- React 19
- Vite 7
- React Router DOM v7
- CSS (estilos propios, sin framework)

### Backend
- Node.js + Express 5
- PostgreSQL
- Prisma ORM
- JWT (access token + refresh token)
- bcrypt
- Passport.js (Google OAuth 2.0, GitHub OAuth)
- Helmet (cabeceras de seguridad)
- express-rate-limit
- node-cron (limpieza automática de partidas abandonadas)
- Vitest + Supertest (tests)

---

## Instalación y ejecución en local

### Requisitos previos
- Node.js 18+
- PostgreSQL en local (o una URL de conexión remota)

### Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en `/backend` con:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/pasapalabra"
JWT_SECRET="tu_secreto_jwt"
JWT_REFRESH_SECRET="tu_secreto_refresh"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
FRONTEND_URL="http://localhost:5173"
```

```bash
npx prisma migrate deploy
npx prisma db seed     # carga categorías y preguntas iniciales
npm run dev            # servidor en http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # aplicación en http://localhost:5173
```

---

## Rutas de la aplicación

| Ruta | Descripción | Acceso |
|---|---|---|
| `/` | Pantalla de bienvenida | Todos |
| `/home` | Página principal | Todos |
| `/login` | Iniciar sesión | Todos |
| `/register` | Registrarse | Todos |
| `/gamemode` | Selección de partida | Todos |
| `/game` | Partida en curso | Todos |
| `/ranking` | Tabla de clasificación | Todos |
| `/profile` | Perfil de usuario | Registrados |
| `/logros` | Logros desbloqueados | Registrados |
| `/mis-preguntas` | Preguntas creadas | Registrados |
| `/nueva-pregunta` | Crear pregunta | Registrados |
| `/admin` | Panel de administración | Admins |

---

## Endpoints principales de la API

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registro de usuario |
| `POST` | `/api/auth/login` | Login con email y contraseña |
| `POST` | `/api/auth/refresh` | Renovar access token |
| `GET` | `/api/auth/google` | Login con Google |
| `GET` | `/api/auth/github` | Login con GitHub |
| `GET` | `/api/users/me` | Perfil propio |
| `GET` | `/api/users/me/achievements` | Logros del usuario |
| `POST` | `/api/games/start` | Iniciar partida |
| `POST` | `/api/games/:id/finish` | Finalizar partida |
| `GET` | `/api/ranking` | Ranking global |
| `GET` | `/api/categories` | Listado de categorías |
| `POST` | `/api/questions` | Crear pregunta personalizada |
| `GET` | `/api/questions/mine` | Preguntas del usuario |
| `GET` | `/api/admin/questions` | Panel admin — gestión de preguntas |
| `PATCH` | `/api/admin/questions/:id` | Aprobar o rechazar pregunta |

---

## Ideas para próximas mejoras

- **Confirmación de email al registrarse** — enviar un enlace de verificación tras el registro para confirmar que la dirección es real. Los usuarios OAuth (Google/GitHub) se considerarían verificados automáticamente.
- **Tecla "Pasapalabra"** — permitir omitir una pregunta durante la partida y volver a ella más tarde, replicando la mecánica original del programa.

---

## Equipo

| Nombre | Rol |
|---|---|
| Arantxa | Backend, frontend, arquitectura general |
| Jaime | Frontend (vistas y estilos) |
| Luis Fernando | Frontend (componentes y flujos) |
| Scarlett | Frontend (perfil, Admin, integración) |
