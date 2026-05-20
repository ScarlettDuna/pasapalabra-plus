# Sugerencias de mejora — Frontend

Ordenadas por impacto.

---

## 🔴 Crítico — el juego no funciona sin esto

- [ ] **`src/components/LoginComponent.jsx`** — el login recibe `{ token, refreshToken }` correctamente pero los tokens se descartan (`console.log`). Importar `saveTokens` de `services/token.js` y llamarlo antes de navegar.

- [ ] **`src/components/RegisterComponent.jsx`** — tras registrarse navega a `/gamemode` sin token. Hacer login automático tras el registro o redirigir a `/login` con mensaje de éxito.

- [ ] **`src/components/RoscoComponent.jsx`** — completamente estático. Pregunta, letra y temporizador son texto hardcodeado; los botones no hacen nada. Conectar con la API: recibir `gameId` y `questions` como props, implementar el bucle de juego y llamar a `POST /games/:id/finish` al terminar.

- [ ] **`src/components/GameModeComponent.jsx`** — el botón COMENZAR no hace nada. Llamar a `POST /api/games/start` con idioma, dificultad y categoría y navegar a `/game` con el `gameId` y las preguntas.

---

## 🟡 Importante — afecta a la experiencia de usuario

- [ ] **`src/components/GameModeComponent.jsx`** — textos sin tilde y todo en mayúsculas:
  ```js
  // Está así:
  const idiomas = ["ESPAÑOL", "INGLES", "FRANCES"];
  const niveles = ["FACIL", "MEDIO", "DIFICIL"];
  // Debería ser:
  const idiomas = ["Español", "Inglés", "Francés"];
  const niveles = ["Fácil", "Medio", "Difícil"];
  ```
  La etiqueta "TEMATICA" debería ser "TEMÁTICA".

- [ ] **`src/components/GameModeComponent.jsx`** — los botones ↔ son confusos: el usuario no sabe cuántas opciones hay. Reemplazar por `<select>` o lista desplegable.

- [ ] **`src/components/RoscoComponent.jsx`** — errata en texto hardcodeado: "pensínsula" → "península".

---

## 🟠 Deuda técnica — no rompe nada pero ensucia el código

- [ ] **`src/App.jsx`** — `useState` importado de React sin usarse en ningún sitio. Borrar.

- [ ] **`src/App.jsx`** — la ruta `path="/"` tiene JSX inline dentro del `<Route>`. Extraer a un componente `Welcome.jsx` o `Landing.jsx`.

---

## 🟢 Completado — *por Arantxa*

- [x] **`src/services/token.js`** *(nuevo)* — utilidades para guardar, leer y borrar tokens de `localStorage`. Incluye `saveTokens`, `getAccessToken`, `getRefreshToken`, `clearTokens`, `getAuthHeader` e `isLoggedIn`.

- [x] **`src/pages/AuthCallback.jsx`** *(nuevo)* — recoge `?token=...&refreshToken=...` de la URL tras el login OAuth (Google/GitHub), guarda los tokens y redirige a `/home`.

- [x] **`src/pages/Ranking.jsx`** *(nuevo)* — página de ranking con selector de idioma (ES/EN/FR), tabla con posición/jugador/puntuación/aciertos/tiempo y estados de carga y error.

- [x] **`src/services/api.js`** *(reescrito)* — reemplaza el `API_URL` estático por `apiFetch(url, options)`, un wrapper de `fetch` que añade el header `Authorization` automáticamente y gestiona el refresco de tokens: si recibe 401, llama a `POST /auth/refresh`, guarda el nuevo access token y reintenta la request original. Si el refresh falla, limpia los tokens y redirige a `/login`.

- [x] **Ruta `/auth/callback`** en `App.jsx`.

- [x] **Ruta `/ranking`** en `App.jsx`.

---

> La documentación completa de la API está en `documentacion/api.md`.
> El archivo `src/services/token.js` ya existe — úsalo en lugar de acceder a `localStorage` directamente.
