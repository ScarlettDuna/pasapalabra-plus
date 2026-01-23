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
