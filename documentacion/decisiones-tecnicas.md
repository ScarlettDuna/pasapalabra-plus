## Por qué PostgreSQL y no MongoDB

Para este proyecto se evaluaron dos opciones principales de base de datos: PostgreSQL (relacional) y MongoDB (documental).

Se eligió PostgreSQL por las siguientes razones:

- **Los datos tienen estructura fija y relaciones claras.** Un `Game` pertenece a un `User`, tiene una `Category` y un `Score`. Estas relaciones son naturales en un modelo relacional y se benefician de las restricciones de integridad referencial (claves foráneas, `@@unique`, etc.).
- **La consistencia es importante.** El ranking y las puntuaciones deben ser fiables. PostgreSQL garantiza transacciones ACID, lo que permite operaciones como actualizar un `Game` y crear un `Score` de forma atómica (lo que se usa en `/games/finish`).
- **Prisma tiene soporte excelente para PostgreSQL.** El ORM elegido ofrece migraciones, tipado y queries complejas de forma más madura con bases de datos relacionales.

MongoDB habría sido una buena opción si los datos fueran heterogéneos o si la estructura cambiara con frecuencia, lo cual no es el caso en un juego con esquema estable.

---

## Por qué monorepo

El proyecto agrupa frontend, backend y documentación en un único repositorio en lugar de tener repositorios separados.

Razones:

- **Coordinación entre equipos.** Con un único repositorio, los cambios en el contrato de la API (rutas, formatos de respuesta) son visibles inmediatamente para todo el equipo sin necesidad de sincronizar entre repos.
- **Simplicidad para un proyecto de esta escala.** Un monorepo tiene sentido cuando el proyecto no es suficientemente grande como para justificar la infraestructura de un sistema multi-repo (pipelines independientes, versionado separado, etc.).
- **Documentación centralizada.** La carpeta `documentacion/` es compartida y accesible desde cualquier parte del proyecto.

En proyectos más grandes con equipos independientes, la separación en repositorios distintos (o un monorepo con herramientas como Turborepo o Nx) sería la opción más adecuada.

---

## Por qué Node.js + Express

Para el backend se valoraron varias opciones: Node.js con Express, Node.js con Fastify, y Python con FastAPI.

Se eligió Node.js + Express por las siguientes razones:

- **JavaScript en frontend y backend.** Al usar el mismo lenguaje en ambas capas se reduce la carga cognitiva del equipo y se pueden compartir conceptos y utilidades entre ambas partes del proyecto.
- **Express es el framework más conocido del ecosistema Node.** Su documentación es extensa, la comunidad es grande y la curva de aprendizaje es baja, lo que es relevante en un contexto educativo.
- **Ecosistema compatible.** Librerías clave del proyecto como Prisma, Passport, jsonwebtoken y bcrypt tienen soporte nativo y maduro en Node.js.
- **Express 5** (versión usada en este proyecto) mejora el manejo de errores asíncronos respecto a Express 4, reduciendo la necesidad de bloques `try/catch` en situaciones simples.

Fastify habría ofrecido mejor rendimiento, pero la diferencia no es relevante para la escala de este proyecto. FastAPI (Python) habría requerido cambiar de lenguaje respecto al frontend.

---

## Panel de preguntas personalizadas — diseño y moderación

Los usuarios registrados pueden contribuir preguntas al juego a través de un formulario. Al enviar una pregunta, el usuario elige entre dos modalidades:

- **Personal**: la pregunta solo es visible para el propio usuario que la creó. No pasa por moderación.
- **Pública (pendiente de revisión)**: la pregunta se envía para su revisión por un administrador. Si es aprobada, se incorpora al banco de preguntas general y aparece mezclada con el resto en el rosco.

Esta decisión de diseño responde a varios objetivos:

- **Calidad del contenido**: permitir que cualquiera añada preguntas públicas sin control llevaría a preguntas incorrectas, inapropiadas o mal formuladas en el juego. La moderación garantiza la calidad del banco de preguntas compartido.
- **Valor diferencial del proyecto**: la posibilidad de contribuir preguntas convierte el juego en una plataforma colaborativa, no solo un juego estático.
- **Privacidad opcional**: el modo personal permite al usuario crear sets de preguntas para su propio uso sin necesidad de compartirlas.

Para implementar esto se han añadido los siguientes cambios al modelo de datos:

- `User.role` (`"user"` | `"admin"`, por defecto `"user"`) — distingue usuarios normales de administradores
- `Question.status` (`"approved"` | `"pending"` | `"rejected"`, por defecto `"approved"`) — estado de moderación
- `Question.isPersonal` (booleano, por defecto `false`) — indica si la pregunta es solo para su creador
- `Question.createdBy` (UUID nullable, FK → User) — referencia al usuario que creó la pregunta

Las preguntas del seed tienen `status: "approved"`, `createdBy: null` e `isPersonal: false`.

El endpoint `GET /rosco` devuelve preguntas aprobadas públicas más las preguntas personales del usuario autenticado (si hay token). Las preguntas pendientes o rechazadas nunca aparecen en el rosco.

---

## Por qué Render para el despliegue

*(pendiente de completar cuando se realice el despliegue)*

---

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
