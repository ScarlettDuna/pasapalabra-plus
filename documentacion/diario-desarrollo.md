## 📓 Diario de desarrollo — Día 1

**Nombre:** Arantxa
**Fecha:** *12 enero 2026*
**Rol:** Backend / Base de datos / Lógica de juego

### Trabajo realizado

* Creación del repositorio del proyecto siguiendo una estructura **monorepo**, separando claramente:

  * `frontend/`
  * `backend/`
  * `documentacion/`
* Configuración inicial del backend con **Node.js y Express**.
* Creación del archivo `server.js` con:

  * configuración de Express
  * middleware CORS
  * soporte para JSON
  * endpoint de comprobación `/api/health`
  * manejo básico de errores y rutas no encontradas.
* Configuración del entorno con `.env` y variables para puerto y CORS.
* Creación de un `.gitignore` adaptado a monorepo (frontend + backend).
* Creación del `README.md` base del proyecto con descripción, arquitectura y tecnologías.
* Definición del contrato de comunicación frontend–backend mediante `documentacion/api.md`.
* Instalación y configuración inicial de **Prisma** como ORM para PostgreSQL.
* Creación del cliente Prisma reutilizable (`src/db/prisma.js`).
* Comprensión del funcionamiento de PostgreSQL, credenciales locales y cadena de conexión.
* Instalación de **PostgreSQL** en local (motor + herramientas).

### Estado actual del proyecto

* El servidor backend arranca correctamente.
* El endpoint `/api/health` responde correctamente.
* PostgreSQL está instalado en local.
* Prisma está inicializado, pero **aún no se han creado tablas**.

## 🗓️ Diario de desarrollo — Día 2

**Nombre:** Arantxa
**Fecha:** *13 enero 2026*
**Rol:** Backend / Base de datos / Lógica de juego

Objetivo del día:
Avanzar desde un rosco funcional hacia un sistema completo de partidas con persistencia (Game + Score).

### ✅ Trabajo realizado

* Se confirmó que Categories y Rosco funcionan correctamente.
* Se detectaron y corrigieron duplicados en base de datos, añadiendo:

  * @@unique en Category (name, language, type)
  * @@unique en Question (letter, language, difficulty, categoryId, question)
  * Limpieza de duplicados existentes vía SQL.

* Se diseñaron e implementaron los modelos:
  * Question
  * Game
  * Score

*Migración de los nuevos modelos realizada con éxito.
*Se implementaron los endpoints:

  * POST `/api/games/start`
  * POST `/api/games/:gameId/finish`

* Se resolvieron errores típicos de Node + ESM:
* Se configuró y probó la API usando Thunder Client.
* Se verificó que:

  * las partidas se crean correctamente
  * los resultados se guardan
  * la duración se calcula
  * la puntuación se genera

## Diario de desarrollo - Día 3

Implementación del ranking y depuración del backend

**Nombre:** Arantxa
**Fecha:** *23 enero 2026*
**Rol:** Backend / Base de datos / Lógica de juego

Durante esta sesión se ha implementado el endpoint de ranking global del juego.

Se ha creado la ruta `GET /api/ranking`, permitiendo obtener los mejores resultados almacenados en la base de datos. El ranking se construye a partir de la entidad `Score`, ordenando los resultados por puntuación de forma descendente y utilizando criterios secundarios de duración y fecha de creación para resolver empates.

El endpoint acepta filtros mediante query params, permitiendo restringir el ranking por idioma y categoría. Para ello, se ha implementado la validación de los parámetros recibidos y el filtrado correcto a través de la relación entre `Score` y `Game` en Prisma.

Durante el desarrollo se han corregido errores relacionados con el enrutado de Express, rutas de importación en un entorno ESM y validaciones incorrectas de parámetros. También se ha verificado el correcto montaje del router en el servidor principal.

Se han realizado pruebas manuales utilizando Thunder Client, creando y finalizando varias partidas en español para generar puntuaciones reales. Se ha comprobado que el endpoint funciona correctamente incluso con pocos registros en la base de datos y que el ranking devuelve los resultados ordenados correctamente.

El backend queda estable tras la incorporación del ranking, con la lógica de partidas y puntuaciones completamente funcional.

## Diario de desarrollo - Día 4

### Implementación del modelo de usuario y endpoint básico

**Nombre:** Arantxa
**Fecha:** *24 enero 2026*
**Rol:** Backend / Base de datos / Lógica de juego


Durante esta sesión se ha incorporado el modelo `User` al proyecto con el objetivo de comenzar a asociar partidas a jugadores, manteniendo la aplicación funcional sin necesidad de autenticación.

Se ha definido un modelo de usuario mínimo, compuesto por un identificador único, un nombre de usuario único y la fecha de creación. La relación entre `User` y `Game` se ha establecido como opcional, permitiendo la coexistencia de partidas anónimas y partidas asociadas a un usuario sin romper la lógica existente.

Se ha implementado el endpoint `POST /api/users`, que permite crear usuarios mediante un nombre de usuario único. El endpoint valida la presencia del campo obligatorio, normaliza el valor recibido y delega la validación de unicidad en la base de datos mediante restricciones `@unique`. Los errores por duplicidad se gestionan devolviendo un código de estado adecuado.

El endpoint ha sido integrado correctamente en el servidor principal y probado mediante Thunder Client, verificando la creación de varios usuarios distintos y el manejo correcto de conflictos por nombre de usuario duplicado.

Con esta incorporación, el backend deja de ser completamente anónimo y queda preparado para futuras ampliaciones como la asociación de partidas a usuarios o la implementación de autenticación en fases posteriores.


### Implementación de autenticación clásica (JWT)

**Nombre:** Arantxa
**Fecha:** *17 febrero 2026*
**Rol:** Backend / Base de datos / Lógica de juego

Durante esta sesión se ha incorporado un sistema completo de autenticación basado en registro, login y verificación mediante JWT.

Se ha ampliado el modelo `User` añadiendo los campos `email` (único) y `passwordHash`, permitiendo almacenar credenciales de forma segura. Tras la modificación del esquema, se ha realizado la migración correspondiente y se ha reseteado la base de datos en entorno de desarrollo para mantener la coherencia estructural.

Se ha implementado el endpoint `POST /api/auth/register`, que permite crear usuarios validando campos obligatorios y almacenando la contraseña mediante hash con `bcrypt`. La unicidad de `username` y `email` se delega en la base de datos y se gestionan correctamente los errores de conflicto.

Posteriormente se ha desarrollado el endpoint `POST /api/auth/login`, que verifica credenciales y genera un token JWT firmado con una clave secreta almacenada en variables de entorno. El token incluye información mínima del usuario (id y username) y un tiempo de expiración configurable.

Se ha implementado un middleware de autenticación que valida el token enviado en el header `Authorization: Bearer <token>`, bloqueando accesos no autorizados y añadiendo la identidad decodificada a `req.user`.

Finalmente, se ha protegido el endpoint `POST /api/games/start`, obligando a que las partidas se creen únicamente por usuarios autenticados. La asociación entre partida y usuario se realiza automáticamente a partir del token, eliminando la necesidad de enviar `userId` desde el cliente.

El backend queda ahora preparado para trabajar con identidad verificada y control de acceso básico.

## Diario de desarrollo - Día 5

### Modo anónimo, protección de partidas y endpoints de usuario

**Nombre:** Arantxa
**Fecha:** *30 marzo 2026*
**Rol:** Backend / Base de datos / Lógica de juego

Durante esta sesión se ha rediseñado el sistema de autenticación de partidas para soportar dos modos de juego: anónimo y registrado.

El primer objetivo fue proteger el endpoint `POST /api/games/:gameId/finish`. Al plantearlo, se detectó un problema de diseño: si tanto `/start` como `/finish` requerían token obligatorio, el modo anónimo quedaba completamente bloqueado. Se decidió implementar un middleware `optionalAuth` que intenta verificar el token si está presente, pero no bloquea la petición si no lo hay. En caso de token inválido, trata la petición como anónima. Esto permite que usuarios no registrados puedan jugar con normalidad, mientras que los registrados tienen sus partidas vinculadas a su cuenta.

Se ha actualizado la lógica de `finishGame` para verificar los permisos de forma correcta en todos los casos posibles: partida anónima sin token (permitido), partida de usuario con token propio (permitido), y partida de usuario sin token o con token de otro usuario (denegado con 403). La condición resultante es:

```js
if (game.userId && (!req.user || game.userId !== req.user.userId))
```

A continuación se ha implementado el endpoint `GET /api/users/me`, protegido con el middleware de autenticación obligatorio. El endpoint devuelve los datos del usuario autenticado (id, username, email, createdAt) a partir del `userId` extraído del token, sin necesidad de ningún parámetro en el body ni en la URL.

Por último, se ha añadido el endpoint `GET /api/users/me/games`, que devuelve el historial de partidas finalizadas del usuario autenticado, incluyendo la puntuación asociada a cada una. Los resultados se devuelven ordenados por puntuación descendente. Se utiliza `findMany` con `include: { score: true }` para obtener los datos relacionados en una sola consulta.

Los tres endpoints han sido probados con Thunder Client, verificando el comportamiento correcto en todos los casos.

### Validación de respuestas en el backend

Durante la misma sesión se ha rediseñado el endpoint `POST /api/games/:gameId/finish` para que el backend valide las respuestas del usuario en lugar de confiar en los totales enviados por el cliente.

Anteriormente el frontend enviaba `{ correct, wrong }` y el backend los almacenaba directamente. Esto permitía manipular el ranking enviando valores arbitrarios al endpoint. Con el nuevo diseño, el frontend envía el array completo de respuestas `[{ questionId, answer }]` y el backend verifica cada una contra la base de datos, calculando él mismo los totales y la puntuación.

Para la verificación se obtienen todas las preguntas relevantes en una sola consulta (`findMany` con `id: { in: [...] }`) y se construye un `Map` para acceso en tiempo constante, evitando hacer una query por cada respuesta. La comparación de respuestas es case-insensitive y elimina espacios extra con `.trim().toLowerCase()`.

El frontend sigue teniendo acceso a las respuestas correctas (se incluyen en `GET /rosco`) para dar feedback inmediato al usuario durante el juego. Esto no es una duplicación de lógica sino una separación de responsabilidades: el frontend valida para la experiencia de usuario, el backend valida para la integridad de los datos. Esta decisión queda documentada en `decisiones-tecnicas.md`.

## Diario de desarrollo - Día 6

### Población de la base de datos y preparación para el equipo de frontend

**Nombre:** Arantxa
**Fecha:** *1 abril 2026*
**Rol:** Backend / Base de datos / Lógica de juego


Con motivo de una reunión con el equipo de frontend, se ha preparado el entorno para que puedan levantar el backend en local de forma autónoma.

Se ha reescrito el script `prisma/seed.js` para importar preguntas desde un CSV externo (`Preguntas pasapalabra + - Español.csv`). El script parsea el fichero línea a línea usando el módulo nativo `readline` de Node, sin dependencias externas. Por cada fila construye el texto de la pregunta combinando la condición (`Empieza`/`Contiene`) con la letra y la definición, mapea el nivel (`Fácil`/`Medio`/`Difícil`) al formato interno (`easy`/`medium`/`hard`), y asocia la pregunta a la categoría correspondiente mediante un `Map` en memoria para evitar queries repetidas. Las inserciones se realizan en lotes de 100 con `skipDuplicates: true`. El resultado ha sido la inserción de 567 preguntas en español sin errores.

También se ha corregido un problema estructural del seed anterior, donde parte del código estaba fuera de la función `main()`, lo que podía causar errores en entornos ES modules.

Por último, se ha creado el fichero `backend/README.md` con las instrucciones completas para levantar el proyecto en local: instalación de dependencias, configuración del `.env`, creación de la base de datos, ejecución de migraciones, seed y arranque del servidor.

## Diario de desarrollo - Día 7

### Implementación de autenticación OAuth (Google y GitHub)

**Nombre:** Arantxa
**Fecha:** *5 abril 2026*
**Rol:** Backend / Base de datos / Lógica de juego

Durante esta sesión se ha implementado autenticación OAuth como método alternativo al registro clásico con email y contraseña, integrando los proveedores Google y GitHub.

Se ha instalado `passport`, `passport-google-oauth20` y `passport-github2`. La configuración de ambas estrategias se ha centralizado en un nuevo fichero `src/config/passport.js`, separándola del resto de la lógica de autenticación. Cada estrategia recibe el perfil del usuario desde el proveedor y aplica el patrón find-or-create: busca si ya existe un usuario con ese email en la base de datos y, si no existe, lo crea automáticamente. Para GitHub se ha añadido un email de fallback (`username@github.local`) para los casos en que el usuario tenga el email en privado.

Se han añadido cuatro rutas nuevas en `auth.routes.js`:
- `GET /api/auth/google` — inicia el flujo OAuth con Google
- `GET /api/auth/google/callback` — Google redirige aquí tras autorizar
- `GET /api/auth/github` — inicia el flujo OAuth con GitHub
- `GET /api/auth/github/callback` — GitHub redirige aquí tras autorizar

En ambos callbacks, una vez que Passport ha verificado la identidad del usuario, el backend genera un JWT propio con el mismo formato que el login clásico y redirige al frontend con el token en la URL (`/auth/callback?token=...`). De esta forma el frontend puede procesarlo de la misma manera independientemente del método de autenticación usado.

Passport se ha inicializado en `server.js` con `app.use(passport.initialize())`. Se usa `session: false` en todas las estrategias ya que la sesión la gestiona el JWT, no Passport.

Las variables `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` y `FRONTEND_URL` se han añadido al `.env`.

### Panel de preguntas personalizadas y sistema de moderación

Durante esta sesión se ha implementado el sistema de preguntas personalizadas, permitiendo a los usuarios registrados contribuir preguntas al juego con un flujo de moderación.

Se ha realizado una nueva migración (`add_question_moderation`) que añade tres campos al modelo `Question`: `status` (estado de moderación: `approved`, `pending`, `rejected`), `isPersonal` (booleano que indica si la pregunta es solo para su creador) y `createdBy` (FK opcional a `User`). Al modelo `User` se le ha añadido el campo `role` (`user` | `admin`) para distinguir usuarios normales de administradores. Las preguntas del seed tienen `status: "approved"` por defecto.

Se ha añadido un usuario administrador por defecto al seed (`admin@pasapalabra.com`) usando `upsert` para que sea idempotente.

Se ha implementado un nuevo middleware `adminMiddleware` que verifica que el usuario autenticado tiene `role: "admin"`. Se encadena tras `authMiddleware` en las rutas protegidas.

Se han creado los siguientes endpoints:
- `POST /api/questions` — permite a usuarios registrados crear preguntas. Si `isPersonal: true` la pregunta se aprueba automáticamente y es solo visible para su creador. Si `isPersonal: false` entra en estado `pending` para revisión del admin.
- `GET /api/admin/pending` — devuelve todas las preguntas pendientes con los datos del creador.
- `PATCH /api/admin/questions/:id/approve` — aprueba una pregunta pendiente.
- `PATCH /api/admin/questions/:id/reject` — rechaza una pregunta pendiente.

Se ha actualizado `GET /rosco` para filtrar correctamente las preguntas: devuelve preguntas públicas aprobadas más las preguntas personales del usuario autenticado (si hay token). Para ello se ha añadido `optionalAuth` a la ruta del rosco y se usa el operador `OR` de Prisma en el `where` del `findMany`.

Se ha detectado y corregido un problema en la validación del campo `isPersonal`: al ser booleano, el valor `false` era interpretado como campo ausente por la validación `!isPersonal`. Se ha corregido usando `isPersonal === undefined` para distinguir ausencia de valor `false`.

## Diario de desarrollo - Día 8

### Estadísticas personales y modelo GameAnswer

**Nombre:** Arantxa
**Fecha:** *6 abril 2026*
**Rol:** Backend / Base de datos / Lógica de juego

Durante esta sesión se ha implementado el endpoint de estadísticas personales `GET /api/users/me/stats` y el modelo auxiliar `GameAnswer` necesario para calcular estadísticas por letra.

Se ha añadido el modelo `GameAnswer` al esquema de Prisma mediante la migración `add_game_answer`. Este modelo guarda una fila por cada respuesta del usuario durante una partida, incluyendo la letra, si fue correcta o no, y referencias a la partida y la pregunta. Se ha actualizado el endpoint `POST /api/games/:gameId/finish` para que, dentro de la transacción existente, cree los registros de `GameAnswer` aprovechando que el array de respuestas ya está disponible y verificado.

Se ha corregido un bug en la construcción del `answerMap` en `finishGame` — el campo se llamaba `anwser` en lugar de `answer`, lo que provocaba errores 500 al intentar finalizar partidas.

Se ha corregido también un problema en la base de datos: las preguntas insertadas por el seed tenían el valor `"aproved"` (con errata) en el campo `status` debido a un typo en el schema original. Se ha corregido con una query SQL directa: `UPDATE "Question" SET "status" = 'approved' WHERE "status" = 'aproved'`.

El endpoint `GET /api/users/me/stats` devuelve las siguientes estadísticas agregadas:
- `totalGames`, `totalCorrect`, `totalWrong`, `avgScore`, `bestScore` — calculados con `prisma.score.aggregate`
- `perfectGames` — partidas con 26 respuestas correctas, calculado con `prisma.score.count`
- `bestGame` — mejor partida con `findFirst` ordenado por score descendente
- `hardestLetter` — letra con más fallos, calculada con `prisma.gameAnswer.groupBy`
- `byLanguage` y `byCategory` — estadísticas agrupadas calculadas en JavaScript sobre los resultados de un único `findMany` de partidas


### Sistema de logros (Achievements)

También se ha implementado el sistema de logros, que desbloquea automáticamente insignias para los usuarios en función de su actividad y rendimiento.

Se ha añadido el modelo `UserAchievement` al esquema de Prisma mediante la migración `add_achievements`. El modelo guarda el código del logro, la fecha de desbloqueo y una fecha de revocación opcional (`revokedAt`), necesaria para el logro especial `DICTIONARY_KING`. Se ha optado por no añadir `@@unique([userId, achievement])` para permitir múltiples registros históricos del mismo logro, ya que un usuario puede ganar y perder `DICTIONARY_KING` varias veces.

Se ha creado el fichero `src/utils/achievements.js` con dos funciones:
- `checkAndGrantAchievements(userId)` — se llama automáticamente al finalizar cada partida y comprueba todos los logros excepto `DICTIONARY_KING`
- `checkDictionaryKing(userId)` — revoca el logro al poseedor anterior y lo otorga al nuevo si el score de la partida es el más alto global

Los logros implementados son:

**Por partidas jugadas:** `FIRST_GAME`, `NEWBIE` (5), `SENIOR` (25), `ADDICTED` (50), `LORD_OF_THE_WORDS` (200)

**Por rendimiento:** `PERFECT_GAME` (26/26), `SHARPSHOOTER` (>2000 pts), `SPEED_DEMON` (<3 minutos)

**Por exploración:** `POLYGLOT` (3 idiomas), `EXPLORER` (3 categorías)

**Por contribución:** `CONTRIBUTOR` (1 pregunta), `EDITOR` (5 preguntas)

**Especial:** `DICTIONARY_KING` — puntuación más alta global, dinámico y revocable

Se ha añadido el endpoint `GET /api/users/me/achievements` que devuelve todos los logros del usuario autenticado ordenados por fecha de desbloqueo, incluyendo los revocados para mantener el historial completo.


### Banco de preguntas multiidioma y refactorización del seed

Se ha creado un nuevo fichero de preguntas en formato TSV (`Preguntas pasapalabra + allLang.tsv`) que unifica los tres idiomas del juego (ES, EN, FR) en un único archivo, sustituyendo al CSV original solo en español.

El fichero TSV incluye 1747 preguntas repartidas entre los tres idiomas y distintas categorías y niveles de dificultad. Se ha optado por TSV en lugar de CSV para evitar problemas de parseo con campos que contienen comas.

Se han actualizado los valores de la columna `Condición` para que la pregunta generada sea gramaticalmente correcta en cada idioma:
- ES: `Empieza por` / `Contiene la`
- EN: `Starts with` / `Contains`
- FR: `Commence par` / `Contient la`

El formato de pregunta en el seed ha pasado de `${condicion} con ${letra}: ${definicion}` (que generaba frases incorrectas para preguntas de tipo "Contiene") a `${condicion} ${letra}: ${definicion}`.

Se ha refactorizado el seed:
- La función `parseCSV` se ha sustituido por `parseTSV`, que simplemente separa por tabuladores sin necesidad de lógica para campos entre comillas.
- El `categoryMap` ahora incluye categorías de los tres idiomas, usando la clave `${idioma}:${nombre}` para evitar colisiones entre idiomas.
- Se lee el campo `Idioma` de cada fila para asignar correctamente el idioma a cada pregunta.

Se han actualizado las categorías del seed: se han eliminado los placeholders de EN/FR que no se usaban (`Vocabulary`, `Vocabulaire`, etc.) y se han añadido las categorías reales que aparecen en el TSV: `General` (type `theme`) y `Definición` y `Traducción` (type `learning`) para EN y FR.

Se ha añadido un usuario de prueba básico al seed (`user@pasapalabra.com` / `user1234`) para facilitar las pruebas del equipo de frontend, junto al usuario admin ya existente.

## Diario de desarrollo - Día 10

**Nombre:** Arantxa
**Fecha:** *18 abril 2026*
**Rol:** Backend / Base de datos / Lógica de juego

### Unificación de `POST /games/start` con la carga del rosco

Se ha refactorizado el controlador del rosco para extraer la lógica de selección de preguntas a una función reutilizable `getRoscoQuestions(lang, catId, diff, userId)`, exportada desde `rosco.controller.js`.

Esta función encapsula la consulta a la BD con el filtro OR (preguntas públicas aprobadas + preguntas personales del usuario), la agrupación por letra y la selección aleatoria de una pregunta por letra.

`GET /rosco` sigue existiendo y ahora delega en esta función, eliminando el `gameId` temporal que generaba antes (ya no tiene sentido, el gameId real viene de `startGame`).

`POST /games/start` importa `getRoscoQuestions` y la llama al final del flujo, tras crear la partida en la BD. La respuesta ahora incluye el campo `questions` junto al `gameId` y los datos de la partida. El frontend puede iniciar una partida y obtener las preguntas en una sola llamada HTTP en lugar de dos.

### Ranking con username

Se ha actualizado `GET /ranking` para incluir el nombre del jugador en cada entrada. El campo `playerName` devuelve:
- El `username` del usuario registrado si la partida está vinculada a un usuario.
- Un nombre generado automáticamente con el formato `Categoría-DDmmm` (ej. `"Ciencia-18abr"`) para partidas anónimas.

Para obtener estos datos se ha ampliado el `select` de Prisma para incluir el `user` y la `category` a través de la relación `game`, evitando consultas adicionales a la BD. El mapeo del nombre anónimo se realiza en JavaScript con `toLocaleString("es-ES", { month: "short" })` para el formato de mes abreviado.

---

## Diario de desarrollo - Día 11

**Nombre:** Arantxa
**Fecha:** *4 mayo 2026*
**Rol:** Backend / Base de datos / Lógica de juego

### Sistema de estados y limpieza de partidas huérfanas

Se ha añadido el campo `status` al modelo `Game` con tres valores posibles mediante un enum de Prisma: `active`, `finished` y `abandoned`. Antes el único indicador de si una partida había terminado era la presencia de `endedAt`, lo que dejaba las partidas no completadas sin un estado explícito y acumulando ruido en la base de datos.

Los cambios implementados son:

- **Enum `GameStatus` en el schema**: `active` es el valor por defecto al crear una partida. `finished` se asigna al completarla con éxito en `finishGame`. `abandoned` marca las partidas que nunca se terminaron.
- **Cron de limpieza** (`src/utils/timeout.js`): se ejecuta cada 10 minutos y marca como `abandoned` todas las partidas con `status: 'active'` cuyo `startedAt` tenga más de 15 minutos de antigüedad. Se inicializa en `server.js` con `initCronJobs()` al arrancar el servidor.
- **Auto-cierre en `startGame`**: cuando un usuario registrado inicia una partida nueva, el controller abandona automáticamente cualquier partida `active` previa suya antes de crear la nueva. Esto cubre el caso de usuarios que cierran el navegador a mitad de partida y vuelven a jugar.
- **Verificación de estado en `finishGame`**: el check de partida ya terminada ahora usa `status !== 'active'` en lugar de `endedAt !== null`, lo que también caza correctamente las partidas marcadas como `abandoned` por el cron.

### Validación robusta de respuestas en `finishGame`

Se han añadido tres capas de validación al array de respuestas que llega al endpoint `POST /games/:gameId/finish`:

1. **Validación de forma**: cada item del array debe ser un objeto con `questionId` (string) y `answer` (string). Antes, un `answer: null` o un item que no fuera objeto provocaba un crash en `.trim()`.
2. **Deduplicación por `questionId`**: si el cliente envía el mismo `questionId` dos veces, se queda solo con la primera ocurrencia. Sin esto, los duplicados inflaban `correct` y `wrong`.
3. **Verificación de existencia en BD**: tras buscar las preguntas con `findMany`, se comprueba que todos los `questionId` enviados están en el mapa resultante. Si alguno no existe en la BD, se devuelve 400. Antes, `answerMap.get(id)` devolvía `undefined` y la operación siguiente crashaba con un error 500.

Además se ha reorganizado el orden de las validaciones: la partida se busca y valida (404, 403, 409) **antes** de consultar las preguntas en BD, evitando queries innecesarias cuando la partida no existe o el usuario no tiene permiso.

### Sistema de refresh tokens

Se ha implementado el sistema de doble token para autenticación. El access token JWT pasa a tener una validez de **1 hora** (antes 7 días) y se introduce un refresh token de **7 días** almacenado en BD para renovarlo sin obligar al usuario a hacer login.

Cambios realizados:

- **Nuevo modelo `RefreshToken`** en el schema con campos `token` (UUID único), `userId`, `expiresAt` y `createdAt`. Migración: `add_refresh_tokens`.
- **`generateTokenPair(user)`**: función helper exportada desde `auth.controller.js` que firma el JWT y crea el registro del refresh token en BD en una sola llamada. La usan tanto `login` como los callbacks de OAuth.
- **`POST /auth/refresh`**: recibe el refresh token, lo busca en BD con su usuario relacionado, comprueba que no ha expirado y emite un nuevo access token. No rota el refresh token.
- **`POST /auth/logout`**: elimina el refresh token de BD con `deleteMany` (no falla si ya no existe). A partir de ese momento el token queda inválido aunque no haya expirado.
- **Callbacks OAuth** (Google y GitHub): actualizados para ser `async` y usar `generateTokenPair`. La URL de redirección ahora incluye ambos parámetros: `?token=...&refreshToken=...`.

La documentación del flujo completo para el frontend (almacenamiento de tokens, patrón de interceptor con Axios, gestión de 401) está en `documentacion/api.md`.

## Diario de desarrollo - Día 12

**Nombre:** Arantxa
**Fecha:** *20 mayo 2026*
**Rol:** Backend / Base de datos / Lógica de juego

### Seguridad HTTP: Helmet y rate limiting

Se ha instalado `helmet` y añadido como primer middleware con `app.use(helmet())`, antes que CORS. Helmet inyecta automáticamente cabeceras HTTP de seguridad reconocidas por los navegadores: `X-Frame-Options` (evita clickjacking), `X-Content-Type-Options` (deshabilita MIME sniffing), cabeceras de política de referencia, y otras. Es una medida de mínimo esfuerzo con impacto de seguridad real.

Se ha añadido rate limiting al endpoint `POST /api/auth/login` con `express-rate-limit`. La configuración elegida es 10 intentos por IP en una ventana de 15 minutos. Al superar el límite, la API devuelve 429 con un mensaje descriptivo. Las cabeceras `RateLimit-*` están activas para que los clientes puedan leer el estado del límite.

### Limpieza de refresh tokens expirados en el cron

Se ha añadido una segunda operación al cron de limpieza (`src/utils/timeout.js`). Junto a la limpieza de partidas abandonadas, el cron ahora también elimina con `deleteMany` todos los registros de `RefreshToken` cuya `expiresAt` sea anterior a la hora actual. Esto evita que la tabla crezca indefinidamente con tokens caducados que ya no pueden usarse.

### Refactorización: separación de `app.js` y `server.js`

Para poder importar la aplicación Express en los tests sin arrancar el servidor, se ha extraído toda la configuración de Express a un nuevo fichero `src/app.js`. Este fichero exporta la instancia `app` configurada con todos los middlewares y rutas, pero sin llamar a `app.listen()`.

`server.js` queda reducido a tres responsabilidades: importar `app`, iniciar el cron y llamar a `listen()`. Los tests importan directamente `src/app.js` y Supertest gestiona el puerto internamente.

Este patrón es estándar en proyectos Node.js y hace que la app sea completamente testable sin efectos secundarios.

### Tests de integración con Vitest + Supertest

Se han implementado 7 tests de integración en `tests/api.test.js` que cubren los flujos principales de la API:

- **Auth (4 tests):** registro de usuario, login correcto (verifica token + refreshToken), login con contraseña incorrecta (401), y renovación de access token con refresh token.
- **Games (2 tests):** inicio de partida autenticada (verifica gameId y array de questions), y finalización de partida con array de respuestas (verifica objeto score).
- **Ranking (1 test):** GET con filtro por idioma devuelve 200 y array.

Los tests usan un usuario de test con email `vitest_user@test.internal` que se crea en `beforeAll` y se elimina en `afterAll`. Se eliminan primero los `UserAchievement` y `RefreshToken` del usuario antes de borrarlo, respetando las restricciones de clave foránea del schema.

Se eligió Vitest en lugar de Jest por compatibilidad nativa con módulos ES (`"type": "module"` en `package.json`). Jest requiere configuración adicional para ESM; Vitest lo soporta sin configuración extra.

### Primera contribución al frontend

Con el backend completado y el equipo de frontend con poco tiempo, se ha comenzado a contribuir al frontend para desbloquear funcionalidades que dependen directamente del backend implementado.

Se ha creado una rama `develop` mergeando `frontend-luisfer` (la rama de frontend más actualizada) con `main`, para tener backend y frontend juntos en una sola rama de trabajo.

Los archivos añadidos, todos nuevos sin tocar los componentes existentes del equipo:

- **`src/services/token.js`**: utilidades para gestionar los tokens de autenticación en `localStorage`. Expone `saveTokens`, `getAccessToken`, `getRefreshToken`, `clearTokens`, `getAuthHeader` e `isLoggedIn`. Es la única fuente de verdad para los tokens en el frontend.

- **`src/services/api.js`** (reescrito): el archivo solo contenía la URL base. Se ha reescrito para exportar `apiFetch(url, options)`, un wrapper de `fetch` que añade el header `Authorization` automáticamente si hay token y gestiona el refresco transparente: si recibe 401, llama a `POST /auth/refresh`, guarda el nuevo access token y reintenta la request original. Si el refresh falla, limpia los tokens y redirige a `/login`. La URL base sigue exportándose como default para mantener compatibilidad con los servicios existentes del equipo.

- **`src/pages/AuthCallback.jsx`**: página que recoge los parámetros `?token=...&refreshToken=...` de la URL tras el login con Google o GitHub, los guarda con `saveTokens` y redirige a `/home`. Sin esta página el flujo OAuth del backend no tenía destino en el frontend.

- **`src/pages/Ranking.jsx`**: página de ranking global con selector de idioma (ES/EN/FR), tabla con posición, nombre del jugador, puntuación, aciertos y tiempo formateado (MM:SS), y estados de carga y error. Usa `apiFetch` para las llamadas a `GET /api/ranking`.

- **`frontend/TODO.md`**: documento con todas las mejoras y correcciones pendientes en el frontend, ordenadas por impacto, para orientar al equipo.

## Diario de desarrollo - Día 13

**Nombre:** Arantxa
**Fecha:** *30 mayo 2026*
**Rol:** Frontend / Integración

### Revisión de ramas de compañeros e integración en develop

Se revisó el estado de las ramas de los compañeros (`frontend-luisfer`, `frontend-jaime`) antes de comenzar el trabajo propio. La rama `frontend-luisfer` tenía estructura base pero carecía de las páginas de perfil, logros, preguntas personalizadas y panel de administración. Se hizo merge de `origin/frontend-luisfer` en `develop` sin conflictos.

### Reescritura de `HeroComponent`

El componente Hero solo mostraba un botón de "Jugar" que abría un popup de instrucciones. Se rediseñó para comportarse de forma diferente según el estado de autenticación usando `isLoggedIn()`:

- **Usuario autenticado:** un único botón "Jugar" → `/gamemode`.
- **Usuario no autenticado:** tres botones: "Iniciar sesión" → `/login`, "Registrarse" → `/register`, "Jugar como invitado" → `/gamemode`.

El popup de instrucciones se mantuvo.

### Header responsive con menú hamburguesa y control de sesión

Se reescribió `HeaderComponent` para añadir:

- **Navegación condicional:** los enlaces solo se muestran si el usuario está autenticado (`isLoggedIn()`).
- **Control de rol:** el enlace "Admin" solo aparece si `getRole() === "admin"`. La función `getRole()` decodifica el payload del JWT desde localStorage con `atob()` sin necesidad de llamada al servidor.
- **Botón de cierre de sesión:** llama a `logoutUser()` (que invalida el refresh token en el backend y limpia localStorage) y redirige con `window.location.href = "/"` para forzar un rerender completo.
- **Menú hamburguesa (responsive):** en móvil se oculta la barra de navegación y se muestra un botón ☰/✕. Al pulsarlo aparece un menú desplegable con posición absoluta. Los enlaces cierran el menú al hacer click.

Se actualizó `HeaderComponent.css` con media queries para alternar entre la barra desktop y el botón hamburguesa en pantallas menores de 600px.

### `services/token.js` — función `getRole`

Se añadió la función `getRole()` que decodifica el payload del JWT almacenado y devuelve el campo `role`, o `null` si no hay token o el formato es inválido.

### `services/auth.js` — función `logoutUser`

Se añadió `logoutUser()`, que envía el refresh token al endpoint `POST /api/auth/logout` para invalidarlo en base de datos y después limpia ambos tokens de localStorage.

### Página de perfil (`Profile.jsx`)

Se implementó la página `/profile` con:

- Carga paralela de datos de usuario y estadísticas con `Promise.all([getMe(), getMyStats()])`.
- Información básica del usuario: username, email, fecha de registro.
- Grid de `StatCard` con: partidas jugadas, mejor puntuación, puntuación media, aciertos totales, fallos totales, partidas perfectas y letra más fallada (condicional).
- Tabla de estadísticas por categoría con scroll horizontal para móvil.
- Botones: "Crear pregunta" (verde) → `/nueva-pregunta`, "Volver al menú" (outline) → `/home`.

### Página de creación de preguntas (`CreateQuestion.jsx`)

Se implementó el formulario `/nueva-pregunta` con:

- Selectores para idioma, categoría (dinámica: se recarga al cambiar el idioma), letra, dificultad.
- Textarea para la pregunta e input para la respuesta.
- Checkbox `isPersonal`: si está marcado la pregunta se aprueba automáticamente y es solo para el creador; si no, entra en revisión para el admin.
- Pantalla de confirmación tras el envío exitoso con opciones "Crear otra" y "Volver al perfil".

### Panel de administración (`Admin.jsx`)

Se implementó la página `/admin` que:

- Carga las preguntas pendientes de revisión desde `GET /api/admin/pending`.
- Muestra cada pregunta como una tarjeta con badges de letra, idioma, dificultad, categoría (en amarillo) y creador (atenuado).
- Botones "Aprobar" y "Rechazar" que llaman a los endpoints PATCH correspondientes y eliminan la tarjeta de la lista de forma optimista.
- Muestra "Acceso restringido" si la respuesta es 403 (usuario sin rol admin).

Para que el panel mostrara la categoría correctamente se actualizó el controlador de admin en el backend para incluir `category: { select: { id: true, name: true } }` en el `include` de Prisma.

### Página de logros (`Achievements.jsx`)

Se implementó la página `/logros` con:

- 13 logros definidos en el frontend con código, nombre y descripción.
- Imágenes cargadas desde `/achievements/CODENAME.png` (archivos PNG en `frontend/public/achievements/`). Si la imagen no existe, un fallback con emoji 🏆 ocupa su lugar mediante el evento `onError`.
- Las imágenes de logros bloqueados se muestran en escala de grises y reducida opacidad.
- Tooltip al pasar el ratón: muestra la descripción del logro si está bloqueado, o la fecha de desbloqueo si está desbloqueado.
- Contador de logros desbloqueados en la parte superior.

Los archivos PNG de los logros fueron proporcionados por los compañeros. Ocho de ellos tenían espacios al final del nombre de archivo (ej. `EDITOR .png`) que se corrigieron con un script de PowerShell.

### Comparación de respuestas insensible a tildes

Se detectó que respuestas correctas como "Murciélago" no se aceptaban si el usuario escribía "Murcielago". Se implementó una función `normalize()` en ambos extremos:

```js
function normalize(str) {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}
```

Se aplicó en `games.controller.js` (validación oficial en backend) y en `RoscoComponent.jsx` (feedback visual inmediato al usuario).

### Corrección de URL hardcodeada en `api.js`

Se detectó que un compañero había hardcodeado la URL de su túnel de desarrollo en `src/services/api.js`, rompiendo el login para el resto del equipo. Se corrigió usando `import.meta.env.VITE_API_URL || "http://localhost:5000/api"` y se documentó el uso de `.env.local` para configuración local sin afectar al repositorio.

### Análisis y merge de `frontend-jaime`

Se analizó la rama `frontend-jaime` antes del merge. Los cambios relevantes eran la adición de los botones de login con Google y GitHub en `LoginComponent`. El merge resultó en un único conflicto en `api.js` (la URL hardcodeada de Jaime vs. la variable de entorno de develop), resuelto manteniendo la versión de develop.


### Corrección del flujo OAuth: `passwordHash` opcional y redirect roto

Se han detectado y corregido dos bugs que impedían el login con Google y GitHub:

**Bug 1 — `passwordHash` obligatorio en el schema:** El modelo `User` tenía `passwordHash String` como campo requerido, pero los usuarios OAuth se crean sin contraseña. Esto provocaba un error 500 al intentar crear el usuario. Se ha cambiado a `passwordHash String?` y se ha ejecutado la migración `optional_password_hash`. Además se ha añadido una comprobación en `POST /auth/login` para devolver un 401 descriptivo si un usuario OAuth intenta autenticarse con email y contraseña.

**Bug 2 — `FRONTEND_URL` no definida:** El callback OAuth hacía `res.redirect(\`${process.env.FRONTEND_URL}/auth/callback?token=...\`)` pero `FRONTEND_URL` no estaba en el `.env`, resultando en un redirect a una URL relativa incorrecta. Se ha añadido `FRONTEND_URL=http://localhost:5173` al `.env`.

**Bug 3 — Orden de carga de dotenv:** En un proyecto ES modules (`"type": "module"`), todos los `import` se resuelven antes de que se ejecute el cuerpo del módulo. `passport.js` leía `process.env.GOOGLE_CLIENT_ID` al importarse, pero `dotenv.config()` se llamaba después en el cuerpo de `app.js`, resultando en estrategias OAuth inicializadas con `undefined`. Se ha corregido moviendo la carga de dotenv a `server.js` como primer import: `import 'dotenv/config'`, y eliminando la llamada duplicada de `app.js`.

### Botones OAuth en el registro

Se han añadido los botones de Google y GitHub al formulario de registro (`RegisterComponent.jsx`), replicando el patrón ya existente en `LoginComponent`. Los handlers se han colocado dentro del componente para mantener coherencia de estilo.

### Nuevas páginas y navegación

Se han añadido botones "Volver" en todas las páginas que carecían de ellos: `GameMode` → `/home`, `Ranking` → `/home`, `Admin` → `/home`, `CreateQuestion` → `/profile`. También se ha añadido `FooterComponent` a `Ranking`, donde faltaba.

Se ha creado la página `MyQuestions.jsx` que muestra las preguntas creadas por el usuario con badges de idioma, dificultad, tipo (personal/pública) y estado de moderación (aprobada/pendiente/rechazada) con código de colores. El botón "Mis preguntas" en `Profile` es condicional: solo aparece si el usuario tiene al menos una pregunta creada. La carga de preguntas en Profile es independiente de la carga principal — si falla, el perfil sigue mostrándose correctamente y el botón simplemente no aparece.

### Corrección en `getMyQuestions`

El controlador `getMyQuestions` tenía `orderBy: { createdAt: 'desc' }` y `createdAt: true` en el `select`, pero el modelo `Question` no tiene campo `createdAt` en el schema de Prisma, lo que provocaba un error 500. Se han eliminado ambas referencias.

### Logro CONTRIBUTOR y EDITOR: disparo inmediato

`checkAndGrantAchievements` solo se llamaba al finalizar una partida, por lo que los logros de contribución (`CONTRIBUTOR`, `EDITOR`) nunca se desbloqueaban al crear una pregunta. Se ha añadido la llamada en `questions.controller.js` tras crear la pregunta con `checkAndGrantAchievements(req.user.userId).catch(() => {})`. El `.catch` vacío evita que un fallo en los logros afecte a la respuesta ya enviada al cliente.

### Score mínimo 0

La fórmula de puntuación `correct * 100 - wrong * 25 - duration` podía producir valores negativos en partidas largas con muchos errores. Se ha añadido `Math.max(0, ...)` para garantizar que el mínimo posible sea siempre 0.

### Revisión de calidad y correcciones críticas

Se ha realizado una revisión completa del proyecto evaluando seguridad, calidad de código, UX y arquitectura. Los problemas críticos identificados y resueltos han sido:

- **`alert()` del navegador eliminados:** `LoginComponent` y `RegisterComponent` usaban `window.alert()` para mostrar errores y confirmaciones. Se han sustituido por mensajes de error inline (`<p style={{ color: "#ff6b6b" }}>`) renderizados dentro del formulario. Se han añadido estados `error` y `loading` a ambos componentes. El botón de submit muestra "Entrando..." / "Registrando..." durante la petición y se deshabilita para evitar envíos dobles.

- **`console.log` de debug eliminados:** Se han eliminado `console.log("LOGIN RESPONSE:", result)` y `console.log("REGISTER RESPONSE:", result)` que quedaban activos en producción.

- **Auto-login tras registro:** Al registrarse correctamente, el sistema ahora hace login automáticamente con las mismas credenciales y redirige al juego, sin obligar al usuario a volver a introducir sus datos.

- **Modo invitado funcional:** Los botones "Invitado" en Login y Register ya navegaban a `/gamemode` pero lo precedían de un `alert()` placeholder. Se han limpiado para navegar directamente sin bloquear al usuario.

- **Rutas protegidas:** Se ha creado el componente `ProtectedRoute` que redirige a `/login` si no hay token en localStorage. Se ha aplicado a `/profile`, `/logros`, `/nueva-pregunta`, `/admin` y `/mis-preguntas`. Las rutas de juego (`/gamemode`, `/game`, `/ranking`) permanecen accesibles para invitados.

### Mejoras en el popup de instrucciones

Se ha ampliado el contenido del popup de instrucciones en `HeroComponent` para explicar las mecánicas específicas del juego: cómo funciona la puntuación (aciertos +100, fallos -25, tiempo descontado), las temáticas disponibles, los niveles de dificultad y los idiomas. Se ha añadido `max-height: 85vh` y `overflow-y: auto` al CSS del popup para que sea usable en móvil sin desbordar la pantalla.

### Corrección del fin automático de partida en `RoscoComponent`

Se ha corregido un bug por el que el rosco no terminaba automáticamente al responder la última pregunta, quedando bloqueado hasta que el usuario pulsaba el botón "Terminar" manualmente.

La causa era que `irASiguientePregunta` y la comprobación de fin de partida usaban `estadoLetras` y `answers` del closure, que en React son el estado del render anterior (stale). Al responder la última letra, `estadoLetras` todavía no incluía esa respuesta y la comprobación fallaba.

La solución fue calcular el nuevo `estadoLetras` y el nuevo array `answers` de forma local dentro de `responderPregunta`, antes de llamar a `setEstadoLetras` y `setAnswers`. Con el estado local actualizado se comprueba si todas las preguntas tienen estado `"correcta"` o `"incorrecta"` y, si es así, se llama a `terminarPartida(newAnswers)` pasando el array fresco directamente. `irASiguientePregunta` se ha actualizado para aceptar el estado como parámetro opcional por la misma razón.

Se ha corregido también que el botón "Terminar" usaba `onClick={terminarPartida}`, lo que hacía que React le pasara el evento sintético como primer argumento. Se ha cambiado a `onClick={() => terminarPartida()}`.

### Resumen de letras al terminar la partida

Se ha añadido un botón "Ver resumen de letras" en la pantalla de resultados. Al pulsarlo se despliega una lista con las 26 letras, el resultado de cada una (✓ correcta / ✗ incorrecta / — no respondida) y la respuesta correcta resaltada en amarillo. El botón alterna entre mostrar y ocultar el resumen.

### Correcciones en `CreateQuestion`

- **Reset del formulario al crear otra:** El botón "Crear otra" solo hacía `setExito(false)` y volvía a mostrar el formulario con los datos de la pregunta anterior. Se ha añadido el reset completo del estado `form` a sus valores iniciales en el mismo click.

- **Posición del formulario:** El formulario tenía `display: "inline-flex"`, lo que lo convertía en un elemento inline y hacía que el botón "Volver al perfil" apareciera a su lado en vez de debajo. Se ha cambiado a `display: "flex"` con `margin: "0 auto"` para que se comporte como bloque centrado.

---

## 🗓️ Diario de desarrollo — Día 15

**Nombre:** Arantxa
**Fecha:** 31 mayo 2026
**Rol:** Backend / Frontend / DevOps

### Trabajo realizado

#### Corrección de `callbackURL` en OAuth para producción

Se detectó que las URLs de callback en `passport.js` estaban hardcodeadas a `http://localhost:5000`, lo que impedía que OAuth funcionara en cualquier entorno distinto al local. Se han sustituido por `${process.env.BACKEND_URL}/api/auth/google/callback` y `${process.env.BACKEND_URL}/api/auth/github/callback`, y se ha añadido `BACKEND_URL=http://localhost:5000` al `.env` local.

Se detectó también que las ramas de los compañeros (`frontend-jaime` y `frontend-luisfer`) habían revertido este cambio junto con otros arreglos críticos (check de `passwordHash` en auth, filtro de categorías vacías). Se decidió hacer el despliegue sobre `develop`, que tiene todos los fixes correctos.

#### Filtro de categorías sin preguntas

Se ha modificado el endpoint `GET /api/categories` para devolver únicamente las categorías que tienen al menos una pregunta aprobada (`status: "approved"`, `isPersonal: false`). Esto resuelve el problema de que las categorías "Traducción EN" y "Traducción FR" aparecían en el selector pero generaban un rosco vacío al no tener preguntas asociadas.

Se ha corregido también un bug relacionado en `GameModeComponent`: al cambiar de idioma, el índice de temática no se reseteaba a 0, lo que podía causar un acceso fuera de rango si el nuevo idioma tenía menos categorías que el anterior.

#### Actualización del README general

Se ha reescrito el `README.md` del proyecto para reflejar el estado actual completo: stack real (React 19, Vite 7, Express 5, Prisma, Passport.js, Helmet, node-cron, Vitest), instrucciones de instalación con todas las variables de entorno necesarias, tabla de rutas, tabla de endpoints de la API, sección de ideas para próximas mejoras y equipo corregido (Scarlett y Arantxa son la misma persona).

#### Despliegue completo en AWS

Se ha realizado el primer despliegue en producción de la aplicación completa usando los servicios de AWS. La arquitectura final:

- **Base de datos:** AWS RDS PostgreSQL (`db.t3.micro`, eu-north-1). Security Group configurado para aceptar conexiones únicamente desde el Security Group del backend.
- **Backend:** AWS EC2 Ubuntu 24.04 LTS (`t3.micro`, eu-north-1). Node.js 20, PM2 como process manager con startup automático. El backend clona la rama `develop` del repositorio, usa `prisma db push` para crear el schema (el repositorio no incluía carpeta de migraciones) y `prisma db seed` para cargar 1747 preguntas y los usuarios de prueba.
- **Frontend:** AWS S3 con static website hosting habilitado. Build de producción generado con `npm run build` usando `.env.production` con `VITE_API_URL` apuntando al backend.

**Problemas encontrados durante el despliegue:**

1. **CloudFront bloqueado en AWS Academy:** Los permisos de Academy no permiten `cloudfront:CreateOriginAccessControl`. Se intentó con una cuenta de Academy sin éxito y se migró a una cuenta personal de AWS.

2. **Mixed Content (HTTPS → HTTP):** Al servir el frontend desde CloudFront (HTTPS) y el backend en HTTP puro (IP sin dominio), el navegador bloqueaba todas las peticiones a la API por política de mixed content. Solución: usar la URL HTTP del website endpoint de S3 en lugar de CloudFront, manteniendo todo en HTTP.

3. **CORS bloqueando peticiones:** El backend tenía `CORS_ORIGIN=http://localhost:5173` hardcodeado por defecto. Al llegar peticiones desde la URL de S3, el servidor las rechazaba. Solución: añadir `CORS_ORIGIN=http://pasapalabra-plus-frontend.s3-website.eu-north-1.amazonaws.com` al `.env` de producción.

4. **Google OAuth no funciona en producción:** Google exige que las redirect URIs sean dominios reales con HTTPS. La IP pública del backend no es aceptada. Se documenta como limitación técnica del entorno: requeriría comprar un dominio y configurar HTTPS con nginx + Let's Encrypt. GitHub OAuth sí funciona porque acepta IPs.

5. **Archivos subidos como carpeta en S3:** En la primera subida se cargó la carpeta `dist/` entera en lugar de su contenido, resultando en `NoSuchKey` para `index.html`. Se borró y se volvió a subir seleccionando el contenido de `dist/`, no la carpeta.

#### URLs de producción

| Servicio | URL |
|---|---|
| Frontend | `http://pasapalabra-plus-frontend.s3-website.eu-north-1.amazonaws.com` |
| Backend | `http://13.53.132.73:5000` |
| Base de datos | RDS `pasapalabra-db.cdco4uco8oul.eu-north-1.rds.amazonaws.com` |

### Estado actual del proyecto

- Aplicación completamente funcional en producción
- Login con email/contraseña y GitHub OAuth operativos
- Google OAuth pendiente de dominio con HTTPS
- 1747 preguntas cargadas en RDS
- Backend gestionado con PM2 con reinicio automático al arrancar la instancia
