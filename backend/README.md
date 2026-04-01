# Pasapalabra+ — Backend

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

### 5. Popular la base de datos (seed)

```bash
node prisma/seed.js
```

Inserta las categorías y las preguntas del rosco en español.

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
| POST | `/api/games/start` | Opcional | Iniciar partida |
| POST | `/api/games/:gameId/finish` | Opcional | Finalizar partida |
| GET | `/api/ranking?language=ES` | No | Top 15 scores |
| GET | `/api/users/me` | Sí | Perfil del usuario |
| GET | `/api/users/me/games` | Sí | Historial de partidas |

La documentación completa de la API está en `documentacion/api.md`.
