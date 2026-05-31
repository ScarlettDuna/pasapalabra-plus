# Despliegue — Pasapalabra+

**Fecha:** 31 mayo 2026
**Región AWS:** eu-north-1 (Estocolmo)

---

## URLs de producción

| Servicio | URL |
|---|---|
| Frontend | http://pasapalabra-plus-frontend.s3-website.eu-north-1.amazonaws.com |
| Backend | http://13.53.132.73:5000 |
| Health check | http://13.53.132.73:5000/api/health |
| Base de datos | pasapalabra-db.cdco4uco8oul.eu-north-1.rds.amazonaws.com:5432 |

---

## Arquitectura

```
Usuario / Navegador
        │
        │  HTTP
        ▼
┌─────────────────────────────────────────┐
│           AWS Cloud (eu-north-1)        │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │  S3 — Static Website Hosting     │   │
│  │  Frontend: React + Vite (build)  │   │
│  │  http://pasapalabra-plus-        │   │
│  │  frontend.s3-website.eu-north-   │   │
│  │  1.amazonaws.com                 │   │
│  └──────────────┬───────────────────┘   │
│                 │ HTTP :5000            │
│                 ▼                       │
│  ┌──────────────────────────────────┐   │
│  │  EC2 — Ubuntu 24.04 (t3.micro)   │   │
│  │  Backend: Node.js + Express      │   │
│  │  PM2 (process manager)           │   │
│  │  http://13.53.132.73:5000        │   │
│  │                                  │   │
│  │  Security Group: sg-backend      │   │
│  │  Puerto 22 (SSH) + 5000 (API)    │   │
│  └──────────────┬───────────────────┘   │
│                 │ PostgreSQL :5432      │
│                 ▼                       │
│  ┌──────────────────────────────────┐   │
│  │  RDS — PostgreSQL (db.t3.micro)  │   │
│  │  pasapalabra-db.cdco4uco8oul.    │   │
│  │  eu-north-1.rds.amazonaws.com    │   │
│  │                                  │   │
│  │  Security Group: sg-rds          │   │
│  │  Puerto 5432 solo desde sg-backend│  │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘

Limitación conocida:
  Google OAuth ✗ — requiere HTTPS + dominio real
  GitHub OAuth ✓ — acepta IP pública
```

---

## Servicios AWS utilizados

| Servicio | Tipo | Coste |
|---|---|---|
| EC2 | t3.micro Ubuntu 24.04 | Free tier (750h/mes) |
| RDS | db.t3.micro PostgreSQL | Free tier (750h/mes) |
| S3 | Static website hosting | Free tier (5GB) |

---

## Variables de entorno (backend — EC2)

```env
PORT=5000
DATABASE_URL="postgresql://pasapalabra_user:<password>@pasapalabra-db.cdco4uco8oul.eu-north-1.rds.amazonaws.com:5432/pasapalabra_db"
JWT_SECRET=<secreto>
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=<id>
GOOGLE_CLIENT_SECRET=<secret>
GITHUB_CLIENT_ID=<id>
GITHUB_CLIENT_SECRET=<secret>
BACKEND_URL=http://13.53.132.73:5000
FRONTEND_URL=http://pasapalabra-plus-frontend.s3-website.eu-north-1.amazonaws.com
CORS_ORIGIN=http://pasapalabra-plus-frontend.s3-website.eu-north-1.amazonaws.com
```

## Variables de entorno (frontend — build)

```env
VITE_API_URL=http://13.53.132.73:5000/api
```

---

## Comandos útiles

**Conectar a EC2:**
```bash
ssh -i "pasapalabra-key.pem" ubuntu@13.53.132.73
```

**Ver estado del backend:**
```bash
pm2 status
pm2 logs pasapalabra-backend
```

**Reiniciar backend:**
```bash
pm2 restart pasapalabra-backend
```

**Actualizar backend (nuevo deploy):**
```bash
cd ~/pasapalabra-plus
git pull origin develop
cd backend
npm install
pm2 restart pasapalabra-backend
```

**Actualizar frontend (nuevo deploy):**
1. En local: `npm run build` dentro de `/frontend`
2. En S3: borrar objetos actuales y subir contenido de `/dist`

---

## Limitaciones conocidas

- **Google OAuth no funciona** — Google exige HTTPS con dominio real. La IP pública no es aceptada como redirect URI. Solución futura: adquirir dominio + configurar nginx + Let's Encrypt en EC2.
- **HTTP sin cifrado** — al no tener dominio ni certificado SSL, toda la comunicación va en HTTP. No recomendable para producción real, aceptable para entorno de demostración de TFG.
- **IP pública de EC2 puede cambiar** — si la instancia se reinicia, la IP pública cambia. Para fijarla se necesita una Elastic IP (servicio de AWS, coste adicional si no está asociada a una instancia running).
