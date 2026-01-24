# API – Pasapalabra+

Este documento define el contrato de comunicación entre el frontend y el backend
del proyecto Pasapalabra+.

Base URL (local):
http://localhost:5000/api

---

## 🔐 Autenticación

### POST /auth/register
Registrar un usuario.

Body:
{
  "username": "string",
  "email": "string",
  "password": "string"
}

Response 201:
{
  "id": "uuid",
  "username": "string",
  "email": "string"
}

---

### POST /auth/login
Iniciar sesión.

Body:
{
  "email": "string",
  "password": "string"
}

Response 200:
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "username": "string"
  }
}

---

## 🌍 Categorías / Tipos de juego

### GET /categories
Obtener categorías según idioma.

Query params:
- language (ES | EN | FR)

Response 200:
[
  {
    "id": 1,
    "name": "Ciencia",
    "language": "ES",
    "type": "theme"
  }
]

---

## 🔤 Rosco (partida)

### GET /rosco
Obtener un rosco de preguntas.

Query params:
- language
- categoryId
- difficulty (easy | medium | hard)

Response 200:
{
  "gameId": "uuid",
  "questions": [
    {
      "letter": "A",
      "question": "Empieza con A: Capital de Grecia"
    }
  ]
}

---
## 🕹️ Iniciar partida

### POST /api/games/start (opcional)

{
  "language": "ES",
  "difficulty": "medium",
  "categoryId": 1,
  "userId": "uuid-opcional"
}


## 🏁 Finalizar partida

### POST /games/:gameId/finish
Guardar resultado de una partida.

Headers:
Authorization: Bearer <token> (opcional si invitado)

Body:
{
  "correct": 20,
  "wrong": 6,
  "duration": 185
}

Response 201:
{
  "score": 1940
}

---

## 🏆 Ranking

### GET /ranking
Obtener ranking filtrado.

Query params:
- language
- categoryId
- difficulty

Response 200:
[
  { 
    "score": 1745, 
  "correct": 18, 
  "duration": 30, 
  "createdAt": "2026-01-23T22:22:02.545Z" }
]
Más adelante se añadirá usuario

## 🙎 Añadir usuario

### POST /api/users
Para crear usuario sin contraseña

{
  "username": "Anchan"
}
Respuesta:
{
  "id": "uuid",
  "username": "Anchan",
  "createdAt": "2026-01-23T22:40:00.000Z"
}


---

## ⚠️ Códigos de error comunes

- 400 → Datos inválidos
- 401 → No autenticado
- 403 → No autorizado
- 404 → Recurso no encontrado
- 500 → Error interno del servidor
