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
