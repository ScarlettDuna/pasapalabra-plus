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
BACKEND_URL="http://localhost:5000"
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

```env
VITE_API_URL=http://localhost:5000/api
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

- [x] **Migrar base de datos a la propia EC2** — eliminar el RDS para reducir el coste mensual de ~25€ a ~9€. Hacer un dump completo antes de migrar para no perder datos: `pg_dump -h <endpoint-rds> -U pasapalabra_user pasapalabra_db > backup.sql`.
- [ ] **Edición de perfil** — permitir al usuario cambiar su contraseña, actualizar sus datos, añadir una biografía y subir una foto o elegir un avatar.
- [ ] **Modo difícil con tildes** — en la corrección de respuestas no ignorar las tildes, de forma que "Murciélago" y "Murcielago" no sean equivalentes.
- [ ] **Ampliar banco de preguntas** — cargar las preguntas de Cine y TV e Historia ya preparadas en `backend/Preguntas CineTV.tsv` y `backend/Preguntas Historia.tsv` modificando el seed para que las incluya.
- [ ] **CI/CD con GitHub Actions** — automatizar el despliegue en AWS: al hacer push a `develop`, que el frontend se construya y suba a S3 automáticamente y el backend reinicie en EC2 via SSH.
- [ ] **Confirmación de email al registrarse** — enviar un enlace de verificación tras el registro para confirmar que la dirección es real. Los usuarios OAuth (Google/GitHub) se considerarían verificados automáticamente.
- [ ] **Atajo de teclado para "Pasapalabra"** — el botón ya existe, pero requiere levantar la mano del teclado. Añadir un atajo (p. ej. `Tabulador`) para activarlo sin usar el ratón.
- [ ] **Modo multijugador** — dos jugadores compitiendo a la vez o por turnos.
- [ ] **Chat o mensajería** — comunicación entre jugadores dentro del juego.
- [ ] **Estadísticas personales avanzadas** — historial de partidas desglosado por idioma y temática.
- [ ] **Efectos visuales y animaciones** — transiciones entre preguntas, animaciones al acertar o fallar, celebración al completar el rosco.
- [ ] **Contador de palabras durante la partida** — mostrar en tiempo real cuántas palabras quedan por responder y cuántas se han fallado, como en el programa original.
- [ ] **En el ranking, cuando estás conectado, te muestra tu posición**
- [ ] **Panel de analytics para admin** — estadísticas de uso agregadas: qué idioma, categoría y nivel se juegan más, partidas por día, usuarios activos, etc. Útil para decidir dónde ampliar el banco de preguntas.
- [ ] **Sistema de reports** — permitir a los usuarios reportar preguntas erróneas o mal formuladas durante la partida. El admin vería los reports en el panel y podría corregir o eliminar la pregunta.
- [ ] **Rediseñar selección de partida** — sustituir los botones ciclables de idioma, categoría y dificultad por dropdowns (`<select>`), más intuitivos y escalables cuando haya más categorías.
- [ ] **Categoría Popurrí** — mezclar preguntas de todas las categorías en una sola partida, para los que no quieran ceñirse a una temática concreta.
- [ ] **Nivel "Todos"** — opción de dificultad que mezcle preguntas de los tres niveles (fácil, medio y difícil) en la misma partida.
- [ ] **Huevo de pascua: Konami code** — al introducir ↑↑↓↓←→←→BA en cualquier pantalla, activar un efecto visual (confeti, modo arcoíris, etc.).
- [ ] **Huevo de pascua: click en el logo** — hacer clic rápido varias veces (5-10) sobre el logo del menú principal para revelar un mensaje o efecto secreto.
- [ ] **Huevo de pascua: palabra secreta en el rosco** — escribir una palabra concreta en el input del rosco (p. ej. el nombre de alguien del equipo) para activar un easter egg.
- [ ] **Huevo de pascua: secuencia en la selección de partida** — elegir idiomas/dificultades en un orden concreto para desbloquear algo oculto.

---

## Equipo

| Nombre | Rol |
|---|---|
| Arantxa | Backend, frontend (perfil, admin, integración), arquitectura general, despliegue |
| Jaime | Frontend (vistas y estilos) |
| Luis Fernando | Frontend (componentes y flujos) |
