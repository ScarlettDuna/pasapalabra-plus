Por qué PostgreSQL y no Mongo
Por qué monorepo
Por qué Node + Express
Por qué AWS / Render / Vercel

---

## Expiración del token JWT — 7 días

El token JWT de sesión tiene una validez de 7 días.

La alternativa habitual en aplicaciones con datos sensibles es usar tokens de corta duración (15-60 minutos) combinados con un sistema de refresh tokens: cuando el token de acceso expira, el cliente lo renueva automáticamente usando un refresh token de larga duración almacenado de forma segura.

En Pasapalabra+ se ha optado por un token de 7 días por las siguientes razones:

- La aplicación es un juego. No se almacenan datos sensibles como información bancaria, datos médicos o contraseñas en texto plano.
- Obligar al usuario a hacer login cada hora rompe el flujo de juego sin aportar una mejora de seguridad relevante para este contexto.
- Implementar un sistema de refresh tokens añade complejidad significativa (nuevo endpoint, tabla en base de datos, lógica de rotación y revocación) que no está justificada para el alcance de este proyecto.

En una aplicación en producción con datos sensibles, se implementaría el patrón de refresh tokens.

---

## Validación de respuestas — frontend y backend con responsabilidades separadas

Al finalizar una partida, el frontend envía al backend el array completo de respuestas del usuario (`{ questionId, answer }`). El backend verifica cada respuesta contra la base de datos y calcula él mismo `correct`, `wrong` y la puntuación final.

El frontend también tiene acceso a las respuestas correctas (se incluyen en la respuesta del `GET /rosco`) para poder dar feedback inmediato al usuario letra a letra durante el juego.

Esta doble presencia de las respuestas correctas es una decisión deliberada que separa dos responsabilidades distintas:

- **Frontend**: usa las respuestas para dar feedback visual en tiempo real (UX). Sin esto el juego sería menos "engaging".
- **Backend**: verifica las respuestas de forma independiente para garantizar la integridad de los datos almacenados en el ranking. Sin esto, cualquiera podría enviar `{ correct: 26, wrong: 0 }` directamente al endpoint y manipular el ranking.

No es duplicar lógica — es aplicar el principio de que el cliente no es de confianza. El hecho de que las respuestas sean visibles en las DevTools del navegador es una limitación aceptable para un juego educativo sin incentivos económicos. En un contexto competitivo con premios, la solución sería no enviar las respuestas al frontend y validar cada respuesta en tiempo real mediante un endpoint dedicado.
