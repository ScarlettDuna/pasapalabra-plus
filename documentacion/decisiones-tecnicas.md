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

## Estadísticas personales — modelo GameAnswer

Para implementar estadísticas detalladas por letra (como "letra con la que más errores cometes") se necesita persistir el resultado de cada respuesta individual, no solo los totales de la partida.

Se ha añadido el modelo `GameAnswer` que guarda una fila por cada respuesta del usuario durante una partida: la letra, si fue correcta o no, y referencias a la partida y la pregunta. Esto se rellena en el endpoint `/games/:gameId/finish` aprovechando que ya recibimos el array de respuestas y las verificamos contra la BD.

La alternativa habría sido guardar solo los totales (como se hacía antes) y no poder ofrecer estadísticas por letra. Se optó por el modelo completo porque:

- El coste de almacenamiento es bajo (máximo 26 filas por partida).
- Los datos ya están disponibles en el momento del finish — no requiere trabajo extra del frontend.
- Permite estadísticas mucho más ricas: letra más fallada, progreso por letra a lo largo del tiempo, etc.
- Es una funcionalidad diferencial que aporta valor al proyecto.

---

## Sistema de logros — diseño e implementación

Se ha implementado un sistema de logros que se desbloquean automáticamente al finalizar cada partida, sin necesidad de que el usuario los reclame manualmente.

### Modelo de datos

Se ha creado el modelo `UserAchievement` con los campos `userId`, `achievement` (código del logro), `unlockedAt` y `revokedAt` (nullable). Se ha decidido **no añadir** `@@unique([userId, achievement])` para permitir múltiples registros históricos del mismo logro. Esto es necesario para `DICTIONARY_KING`, que puede ganarse y perderse varias veces — el historial completo de reinados queda registrado con sus fechas de concesión y revocación.

### Desbloqueo automático vs bajo demanda

Se optó por desbloquear los logros automáticamente al terminar cada partida (`POST /games/:gameId/finish`) en lugar de tener un endpoint separado que el usuario llame para "reclamarlos". Las razones:

- **Mejor experiencia de usuario**: el frontend puede mostrar la notificación del logro inmediatamente tras la partida sin necesidad de una petición adicional.
- **Consistencia**: los logros siempre están al día, no dependen de que el usuario consulte su perfil.
- **Simplicidad**: no hay estado intermedio de "logro pendiente de reclamar".

### DICTIONARY_KING — logro dinámico

`DICTIONARY_KING` es el único logro que puede revocarse. Al finalizar cada partida se comprueba si el score es el más alto global. Si lo es, se revoca el logro al poseedor anterior (se pone `revokedAt`) y se crea un nuevo registro para el nuevo rey. Un logro activo es aquel con `revokedAt: null`.

Esta implementación permite mantener el historial completo de quién ha sido rey del diccionario y cuándo, lo que añade valor narrativo al ranking.

### Separación en fichero de utilidades

La lógica de logros se ha extraído a `src/utils/achievements.js` en lugar de ponerla directamente en el controlador de partidas. Esto mantiene `games.controller.js` limpio y hace que la lógica de logros sea fácilmente extensible sin tocar el flujo principal de la partida.

---

## Despliegue en AWS EC2 + RDS

*(pendiente de completar cuando se realice el despliegue)*

Se ha decidido desplegar en AWS con la arquitectura EC2 + RDS en lugar de una plataforma PaaS como Render o Heroku. Las razones:

- **Aprendizaje**: EC2 + RDS expone todas las capas de la infraestructura (segurity groups, gestión de procesos con PM2, proxy inverso con nginx), lo que es más didáctico para un TFG.
- **Control**: es posible ajustar cualquier parámetro de la instancia o la BD sin estar limitado por los valores por defecto de la plataforma.
- **Coste en el free tier**: las instancias `t2.micro` (EC2) y `db.t3.micro` (RDS) están incluidas en el free tier de AWS durante 12 meses.

La alternativa Elastic Beanstalk se descartó porque abstrae demasiado la infraestructura, lo que dificulta entender qué está pasando cuando algo falla.

---

---

## Sistema de refresh tokens — access token 1h + refresh token 7 días

Se ha diseñado un sistema de doble token para equilibrar seguridad y experiencia de usuario:

- **Access token** (JWT): validez de **1 hora**. Se adjunta en el header `Authorization: Bearer` en cada request autenticado. Al expirar, el servidor devuelve 401.
- **Refresh token** (UUID opaco): validez de **7 días**, almacenado en la tabla `RefreshToken` de la BD. No contiene información del usuario — es solo un identificador que el servidor cruza contra la BD para emitir un nuevo access token.

### Por qué 1h para el access token

Un token de 7 días (la configuración anterior) significa que un token robado es válido durante una semana sin posibilidad de revocarlo, ya que los JWT son stateless. Con 1 hora, la ventana de exposición se reduce drásticamente.

Se descartó un expiry muy corto (15 minutos) porque en una sesión de juego activa el usuario estaría renovando el token constantemente, lo que añade latencia perceptible. 1 hora cubre cualquier sesión de juego razonable sin interrupciones.

### Por qué el refresh token es un UUID y no otro JWT

Un refresh token JWT podría validarse sin consultar la BD, pero eso impide revocarlo (logout, cuenta comprometida). Al usar un UUID opaco almacenado en BD, el logout simplemente borra la fila — el token queda inválido de inmediato aunque no haya expirado.

### Modelo de datos

```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

### Variables de entorno a añadir

```env
JWT_EXPIRES_IN="1h"
REFRESH_TOKEN_EXPIRES_IN="7d"
```

### Estado de implementación

> **Pendiente**. El diseño está completo. La implementación (backend + frontend) queda pendiente de coordinación. Ver `api.md` para el contrato de los endpoints y el patrón de interceptor recomendado para el frontend.

---

## Validación de respuestas — frontend y backend con responsabilidades separadas

Al finalizar una partida, el frontend envía al backend el array completo de respuestas del usuario (`{ questionId, answer }`). El backend verifica cada respuesta contra la base de datos y calcula él mismo `correct`, `wrong` y la puntuación final.

El frontend también tiene acceso a las respuestas correctas (se incluyen en la respuesta del `GET /rosco`) para poder dar feedback inmediato al usuario letra a letra durante el juego.

Esta doble presencia de las respuestas correctas es una decisión deliberada que separa dos responsabilidades distintas:

- **Frontend**: usa las respuestas para dar feedback visual en tiempo real (UX). Sin esto el juego sería menos "engaging".
- **Backend**: verifica las respuestas de forma independiente para garantizar la integridad de los datos almacenados en el ranking. Sin esto, cualquiera podría enviar `{ correct: 26, wrong: 0 }` directamente al endpoint y manipular el ranking.

No es duplicar lógica — es aplicar el principio de que el cliente no es de confianza. El hecho de que las respuestas sean visibles en las DevTools del navegador es una limitación aceptable para un juego educativo sin incentivos económicos. En un contexto competitivo con premios, la solución sería no enviar las respuestas al frontend y validar cada respuesta en tiempo real mediante un endpoint dedicado.

---

## Estados de partida y cron de limpieza

Al finalizar una partida, el único indicador de que había terminado era `endedAt`. Las partidas que el usuario abandonaba (cerrar el navegador, perder conexión) quedaban sin `endedAt` indefinidamente, acumulando filas inútiles en la tabla `Game`.

Se evaluaron dos enfoques para limpiarlas:

- **Solo `endedAt`**: marcar `endedAt` al detectar inactividad. Simple, pero no permite distinguir semánticamente entre una partida terminada correctamente y una abandonada.
- **Campo `status` + cron**: añadir un enum (`active` / `finished` / `abandoned`) y un proceso que revise periódicamente las partidas activas muy antiguas.

Se eligió el campo `status` por las siguientes razones:

- **Semántica explícita**: `status: 'abandoned'` comunica la razón del cierre, no solo el hecho. Esto es útil para estadísticas futuras (tasa de abandono, duración media antes de abandonar, etc.) y para el filtrado en queries.
- **El cron es la solución correcta para limpieza periódica**: un timeout en memoria (setTimeout) se perdería si el servidor se reinicia. Un cron persiste entre reinicios porque actúa sobre el estado de la BD, no sobre el estado del proceso.
- **`startGame` como segunda línea de defensa**: cuando el usuario vuelve a jugar, el controller abandona su partida activa anterior en el mismo request, sin esperar al cron. El cron solo es necesario para usuarios que no vuelven.

El intervalo del cron es 10 minutos con un umbral de abandono de 15 minutos. Un rosco tiene 26 preguntas; 15 minutos es tiempo más que suficiente para terminarlo. Esta combinación garantiza que ninguna partida huérfana persiste más de 25 minutos en la BD.

---

## Validación de respuestas en `finishGame` — defensa en profundidad

El endpoint `POST /games/:gameId/finish` recibe del frontend un array de respuestas `{ questionId, answer }`. El backend verifica cada respuesta contra la BD de forma independiente, pero el array en sí puede contener datos malformados o malintencionados.

Se han implementado tres capas de validación antes de calcular el score:

1. **Validación de forma de cada item**: se comprueba que cada elemento del array es un objeto con `questionId` y `answer` de tipo string. Esto previene crashes por `null.trim()` o por intentar acceder a propiedades de un valor primitivo.

2. **Deduplicación por `questionId`**: un cliente podría enviar el mismo `questionId` dos veces (bug o manipulación). Sin deduplicar, esa respuesta contaría doble en `correct` y `wrong`, inflando la puntuación. Se deduplica quedándose con la primera ocurrencia.

3. **Verificación de existencia en BD**: tras el `findMany` de preguntas, se comprueba que todos los `questionId` enviados tienen correspondencia en la BD. Un ID inventado no aparecería en el `answerMap` y la operación `.answer.trim()` produciría un crash. En lugar de un 500, se devuelve un 400 controlado.

Estas validaciones no cambian el comportamiento para un cliente que opera correctamente — solo blindan el endpoint ante datos inesperados.

---

## Seguridad HTTP: Helmet, rate limiting y separación app/server

### Helmet

Se ha añadido `helmet` como primer middleware de la app. Helmet configura automáticamente un conjunto de cabeceras HTTP defensivas (`X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, etc.) sin necesidad de configuración manual. Se coloca antes que CORS para que sus cabeceras se establezcan en todas las respuestas.

### Rate limiting en login

Se ha limitado `POST /api/auth/login` a 10 intentos por IP en 15 minutos con `express-rate-limit`. El límite se aplica solo a este endpoint porque es el único que acepta credenciales repetidamente. El resto de endpoints autenticados ya están protegidos por el JWT — un atacante necesitaría el token para llegar a ellos.

Se eligió un límite de 10 en lugar de uno más restrictivo (3-5) para evitar falsos positivos en entornos donde varios usuarios comparten IP (NAT corporativo, aula), sin dejar el endpoint abierto a ataques de diccionario masivos.

### Separación `src/app.js` / `server.js`

La configuración de Express se ha extraído a `src/app.js`, que exporta la instancia `app` sin llamar a `listen()`. `server.js` importa `app`, lanza el cron y llama a `listen()`.

Esta separación tiene un único objetivo práctico: los tests pueden importar `src/app.js` y obtener la app configurada sin arrancar el servidor ni el cron. Supertest gestiona su propio puerto internamente. Sin esta separación, cualquier `import` de `server.js` en los tests ejecutaría `listen()` y `initCronJobs()` como efectos secundarios.

### Tests de integración: Vitest + Supertest

Se eligió Vitest como test runner en lugar de Jest porque el proyecto usa `"type": "module"` en `package.json` (ES modules nativos). Jest requiere Babel o `--experimental-vm-modules` para ESM, lo que añade complejidad de configuración. Vitest soporta ESM de forma nativa.

Se eligieron tests de integración (contra la BD real) en lugar de tests unitarios con mocks porque:
- Los mocks de Prisma tienden a divergir del comportamiento real de PostgreSQL, especialmente en casos de restricciones de unicidad y transacciones.
- El proyecto tuvo una experiencia directa de esto: un bug de typo en `answer`/`anwser` habría sido invisible para un mock que no ejecuta la query real.
- El coste de mantener una BD de test es bajo — es la misma instancia local con datos de seed.

---

## Unificación de `POST /games/start` con la carga del rosco

El flujo original de inicio de partida requería dos llamadas HTTP desde el frontend:

1. `POST /games/start` — crea la partida y devuelve el `gameId`.
2. `GET /rosco?language=...&categoryId=...&difficulty=...` — carga las preguntas.

Se ha refactorizado para que `POST /games/start` devuelva también las preguntas del rosco en la misma respuesta, reduciendo el flujo a una sola llamada.

### Implementación

La lógica de selección de preguntas se extrajo de `rosco.controller.js` a una función reutilizable `getRoscoQuestions(language, categoryId, difficulty, userId)`. Esta función es usada tanto por `GET /rosco` (que permanece disponible) como por `startGame` al final de su ejecución.

La respuesta de `POST /games/start` incluye el campo `questions`:

```json
{
  "gameId": "uuid",
  "game": { "..." },
  "questions": [
    { 
      "letter": "A", 
      "questionId": "uuid", 
      "question": "...", 
      "answer": "Atenas" 
    }
  ]
}
```

### Por qué este cambio

- **Menos latencia percibida**: el frontend carga todo en una sola petición en lugar de encadenar dos.
- **Menos superficie de error**: no puede darse el caso de que `start` tenga éxito pero `GET /rosco` falle dejando al usuario con un `gameId` inútil.
- **`GET /rosco` no desaparece**: sigue siendo útil para previsualizaciones o tests sin necesidad de crear una partida.
