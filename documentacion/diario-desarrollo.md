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
