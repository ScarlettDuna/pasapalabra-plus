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
Iniciar sesión. Devuelve un token JWT con validez de 1 hora.

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
Obtener un set de preguntas para jugar. Devuelve una pregunta por letra disponible.

Query params:
- `language` (ES | EN | FR) — obligatorio
- `categoryId` (entero) — obligatorio
- `difficulty` (easy | medium | hard) — obligatorio

Response 200:
```json
{
  "gameId": "uuid",
  "questions": [
    {
      "letter": "A",
      "questionId": "uuid",
      "question": "Empieza con A: Capital de Grecia"
    }
  ]
}
```

---

## Partidas

### POST /games/start
Iniciar una partida. Si se envía token, la partida queda vinculada al usuario. Sin token, la partida es anónima.

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
  }
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

## Ranking

### GET /ranking
Obtener el top 15 de puntuaciones, filtrado por idioma y opcionalmente por categoría.

Query params:
- `language` (ES | EN | FR) — obligatorio
- `category` (entero) — opcional

Response 200:
```json
[
  {
    "score": 1885,
    "correct": 20,
    "duration": 600,
    "createdAt": "2026-03-30T13:10:00.000Z"
  }
]
```

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

## Códigos de error comunes

- 400 → Datos inválidos o campos obligatorios ausentes
- 401 → No autenticado (token ausente o inválido)
- 403 → No autorizado (token de otro usuario)
- 404 → Recurso no encontrado
- 409 → Conflicto (recurso duplicado o acción ya realizada)
- 500 → Error interno del servidor
