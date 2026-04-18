# API – Pasapalabra+

Este documento define el contrato de comunicación entre el frontend y el backend
del proyecto Pasapalabra+.

Base URL (local):
http://localhost:5000/api

---

## Health check

### GET /health

Response 200:
```json
{
  "ok": true,
  "service": "pasapalabra-backend",
  "time": "2026-03-30T13:00:00.000Z"
}
```

---

## Autenticación

### POST /auth/register
Registrar un nuevo usuario.

Body:
```json
{
  "username": "string",
  "email": "string",
  "password": "string (mínimo 6 caracteres)"
}
```

Response 201:
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "createdAt": "2026-01-13T..."
}
```

Errores:
- 400 → Faltan campos obligatorios o password < 6 caracteres
- 409 → Username o email ya en uso

---

### POST /auth/login
Iniciar sesión. Devuelve un token JWT con validez de 7 días.

Body:
```json
{
  "email": "string",
  "password": "string"
}
```

Response 200:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Errores:
- 400 → Faltan campos obligatorios
- 401 → Credenciales inválidas

---

## Categorías

### GET /categories
Obtener categorías disponibles según idioma.

Query params:
- `language` (ES | EN | FR) — obligatorio

Response 200:
```json
[
  {
    "id": 1,
    "name": "Ciencia",
    "language": "ES",
    "type": "theme"
  }
]
```

---

## Rosco

### GET /rosco
Obtener un set de preguntas para jugar sin crear partida. Útil para previsualizaciones o pruebas. **Para iniciar una partida real usar `POST /games/start`**, que devuelve las preguntas y el gameId en una sola llamada.

Query params:
- `language` (ES | EN | FR) — obligatorio
- `categoryId` (entero) — obligatorio
- `difficulty` (easy | medium | hard) — obligatorio

Response 200:
```json
{
  "questions": [
    {
      "letter": "A",
      "questionId": "uuid",
      "question": "Empieza por A: Capital de Grecia",
      "answer": "Atenas"
    }
  ]
}
```

---

## Partidas

### POST /games/start
Iniciar una partida y obtener las preguntas del rosco en una sola llamada. Si se envía token, la partida queda vinculada al usuario. Sin token, la partida es anónima.

**Este es el endpoint principal para comenzar a jugar.** Devuelve el `gameId` necesario para el finish y las preguntas listas para mostrar.

Headers:
```
Authorization: Bearer <token>  (opcional)
```

Body:
```json
{
  "language": "ES",
  "difficulty": "medium",
  "categoryId": 1
}
```

Response 201:
```json
{
  "gameId": "uuid",
  "game": {
    "id": "uuid",
    "language": "ES",
    "difficulty": "medium",
    "categoryId": 1,
    "startedAt": "2026-03-30T13:00:00.000Z"
  },
  "questions": [
    {
      "letter": "A",
      "questionId": "uuid",
      "question": "Empieza por A: Capital de Grecia",
      "answer": "Atenas"
    }
  ]
}
```

Errores:
- 400 → Faltan campos o valores inválidos
- 404 → Categoría no encontrada

---

### POST /games/:gameId/finish
Finalizar una partida. El backend verifica cada respuesta contra la base de datos, calcula `correct` y `wrong`, y genera la puntuación. La duración se calcula automáticamente en el servidor.

Si la partida pertenece a un usuario registrado, es obligatorio enviar su token. Sin token o con token de otro usuario se devuelve 403.

Headers:
```
Authorization: Bearer <token>  (obligatorio si la partida es de un usuario registrado)
```

Body:
```json
{
  "answers": [
    { "questionId": "uuid", "answer": "Atenas" },
    { "questionId": "uuid", "answer": "Berlín" }
  ]
}
```

Response 201:
```json
{
  "updatedGame": {
    "id": "uuid",
    "endedAt": "2026-03-30T13:10:00.000Z",
    "duration": 600
  },
  "score": {
    "id": "uuid",
    "correct": 20,
    "wrong": 6,
    "duration": 600,
    "score": 1885,
    "createdAt": "2026-03-30T13:10:00.000Z",
    "gameId": "uuid"
  }
}
```

Fórmula de puntuación: `(correct × 100) - (wrong × 25) - duration`

Errores:
- 400 → Body ausente o `answers` no proporcionado
- 403 → Sin permiso para finalizar esta partida
- 404 → Partida no encontrada
- 409 → La partida ya fue finalizada

---

### GET /auth/google
Inicia el flujo de autenticación con Google. Redirige al usuario a la pantalla de autorización de Google. No requiere body ni headers.

Al completar la autorización, Google redirige a `/auth/google/callback`, que genera un JWT y redirige al frontend:
```
http://localhost:5173/auth/callback?token=eyJhbGciOiJIUzI1NiIs...
```

El frontend debe leer el token de la URL y guardarlo en `localStorage`.

---

### GET /auth/github
Mismo flujo que Google pero con GitHub. Redirige a `/auth/github/callback` tras la autorización.

```
http://localhost:5173/auth/callback?token=eyJhbGciOiJIUzI1NiIs...
```

---

## Ranking

### GET /ranking
Obtener el top 15 de puntuaciones, filtrado por idioma y opcionalmente por categoría.

Query params:
- `language` (ES | EN | FR) — obligatorio
- `category` (entero) — opcional, filtra por categoría concreta

Response 200:
```json
[
  {
    "position": 1,
    "playerName": "arantxa",
    "score": 2264,
    "correct": 24,
    "duration": 86,
    "createdAt": "2026-04-18T19:01:18.027Z"
  },
  {
    "position": 2,
    "playerName": "Ciencia-18abr",
    "score": 1500,
    "correct": 18,
    "duration": 200,
    "createdAt": "2026-04-18T20:00:00.000Z"
  }
]
```

`playerName` es el username si la partida pertenece a un usuario registrado. Para partidas anónimas se genera automáticamente como `"Categoría-DDmmm"` (ej. `"Ciencia-18abr"`).

Errores:
- 400 → `language` ausente o inválido, `category` no es número o no existe

---

## Usuario

### GET /users/me
Obtener el perfil del usuario autenticado.

Headers:
```
Authorization: Bearer <token>  (obligatorio)
```

Response 200:
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "createdAt": "2026-01-13T..."
}
```

Errores:
- 401 → Token no proporcionado o inválido
- 404 → Usuario no encontrado

---

### GET /users/me/games
Obtener el historial de partidas finalizadas del usuario autenticado, ordenadas por puntuación descendente.

Headers:
```
Authorization: Bearer <token>  (obligatorio)
```

Response 200:
```json
[
  {
    "id": "uuid",
    "language": "ES",
    "difficulty": "medium",
    "categoryId": 1,
    "startedAt": "2026-03-30T13:00:00.000Z",
    "endedAt": "2026-03-30T13:10:00.000Z",
    "duration": 600,
    "score": {
      "correct": 20,
      "wrong": 6,
      "duration": 600,
      "score": 1885,
      "createdAt": "2026-03-30T13:10:00.000Z"
    }
  }
]
```

Errores:
- 401 → Token no proporcionado o inválido

---

## Preguntas personalizadas

### POST /questions
Crear una pregunta personalizada. Solo usuarios registrados.

Headers:
```
Authorization: Bearer <token>  (obligatorio)
```

Body:
```json
{
  "letter": "A",
  "question": "Empieza con A: Capital de Grecia",
  "answer": "Atenas",
  "language": "ES",
  "difficulty": "easy",
  "categoryId": 1,
  "isPersonal": false
}
```

- `isPersonal: false` → la pregunta se envía a revisión (`status: "pending"`)
- `isPersonal: true` → la pregunta es solo para el creador (`status: "approved"` automáticamente)

Response 201:
```json
{
  "id": "uuid",
  "letter": "A",
  "question": "Empieza con A: Capital de Grecia",
  "answer": "Atenas",
  "language": "ES",
  "difficulty": "easy",
  "categoryId": 1,
  "isPersonal": false,
  "status": "pending",
  "createdBy": "uuid"
}
```

Errores:
- 400 → Faltan campos obligatorios o valores inválidos
- 401 → Token no proporcionado o inválido

---

## Administración

Rutas protegidas exclusivamente para usuarios con `role: "admin"`.

### GET /admin/questions/pending
Obtener todas las preguntas pendientes de revisión.

Headers:
```
Authorization: Bearer <token>  (obligatorio, rol admin)
```

Response 200:
```json
[
  {
    "id": "uuid",
    "letter": "A",
    "question": "Empieza con A: Capital de Grecia",
    "answer": "Atenas",
    "language": "ES",
    "difficulty": "easy",
    "status": "pending",
    "createdBy": {
      "id": "uuid",
      "username": "string"
    }
  }
]
```

Errores:
- 401 → Token no proporcionado o inválido
- 403 → El usuario no es admin

---

### PATCH /admin/questions/:id/approve
Aprobar una pregunta pendiente. Pasa a `status: "approved"` y queda disponible en el rosco general.

Headers:
```
Authorization: Bearer <token>  (obligatorio, rol admin)
```

Response 200:
```json
{
  "id": "uuid",
  "status": "approved"
}
```

---

### PATCH /admin/questions/:id/reject
Rechazar una pregunta pendiente. Pasa a `status: "rejected"`.

Headers:
```
Authorization: Bearer <token>  (obligatorio, rol admin)
```

Response 200:
```json
{
  "id": "uuid",
  "status": "rejected"
}
```

Errores (approve y reject):
- 401 → Token no proporcionado o inválido
- 403 → El usuario no es admin
- 404 → Pregunta no encontrada

---

## Logros

### GET /users/me/achievements
Devuelve todos los logros del usuario autenticado, incluyendo los revocados.

Headers:
```
Authorization: Bearer <token>  (obligatorio)
```

Response 200:
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "achievement": "FIRST_GAME",
    "unlockedAt": "2026-04-06T...",
    "revokedAt": null
  },
  {
    "id": "uuid",
    "userId": "uuid",
    "achievement": "DICTIONARY_KING",
    "unlockedAt": "2026-04-06T...",
    "revokedAt": "2026-04-06T..."
  }
]
```

Logros disponibles:
| Código | Descripción |
|--------|-------------|
| `FIRST_GAME` | Primera partida completada |
| `NEWBIE` | 5 partidas completadas |
| `SENIOR` | 25 partidas completadas |
| `ADDICTED` | 50 partidas completadas |
| `LORD_OF_THE_WORDS` | 200 partidas completadas |
| `PERFECT_GAME` | Rosco sin ningún fallo (26/26) |
| `SHARPSHOOTER` | Más de 2000 puntos en una partida |
| `SPEED_DEMON` | Rosco completado en menos de 3 minutos |
| `POLYGLOT` | Jugar en los 3 idiomas disponibles |
| `EXPLORER` | Jugar en 3 categorías diferentes |
| `CONTRIBUTOR` | Primera pregunta personalizada añadida |
| `EDITOR` | 5 preguntas personalizadas añadidas |
| `DICTIONARY_KING` | Puntuación más alta del ranking global (revocable) |

Errores:
- 401 → Token no proporcionado o inválido

---

## Estadísticas personales

### GET /users/me/stats
Devuelve estadísticas agregadas de todas las partidas finalizadas del usuario autenticado.

Headers:
```
Authorization: Bearer <token>  (obligatorio)
```

Response 200:
```json
{
  "totalGames": 10,
  "totalCorrect": 180,
  "totalWrong": 40,
  "avgScore": 1650,
  "bestScore": 2100,
  "perfectGames": 2,
  "bestGame": {
    "id": "uuid",
    "correct": 24,
    "score": 2100,
    "createdAt": "2026-04-05T..."
  },
  "hardestLetter": "Ñ",
  "byLanguage": [
    { "language": "ES", "games": 8, "avgScore": 1700 }
  ],
  "byCategory": [
    { "categoryId": 1, "name": "Música", "games": 5, "avgScore": 1800 }
  ]
}
```

Errores:
- 401 → Token no proporcionado o inválido

---

## Códigos de error comunes

- 400 → Datos inválidos o campos obligatorios ausentes
- 401 → No autenticado (token ausente o inválido)
- 403 → No autorizado (token de otro usuario)
- 404 → Recurso no encontrado
- 409 → Conflicto (recurso duplicado o acción ya realizada)
- 500 → Error interno del servidor
