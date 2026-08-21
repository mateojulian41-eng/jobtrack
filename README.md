# JobTrack

## Organiza tu búsqueda laboral, una postulación a la vez

JobTrack es una aplicación web full stack para registrar, organizar y dar seguimiento a postulaciones laborales desde un solo lugar.

| Recurso | Enlace |
| --- | --- |
| Aplicación web | [jobtrack-fawn.vercel.app](https://jobtrack-fawn.vercel.app) |
| API | [jobtrack-api-rc04.onrender.com](https://jobtrack-api-rc04.onrender.com) |
| Health check | [Estado de la API](https://jobtrack-api-rc04.onrender.com/api/health) |
| Repositorio | [github.com/mateojulian41-eng/jobtrack](https://github.com/mateojulian41-eng/jobtrack) |

## Descripción

JobTrack ayuda a estudiantes, practicantes, desarrolladores junior y demás personas en búsqueda de empleo a centralizar la información de sus procesos: empresa, cargo, enlace de la vacante, fecha, fuente, modalidad, tecnologías, notas y estado actual.

## Problema y solución

Buscar empleo suele implicar aplicar a muchas vacantes en diferentes plataformas. Sin un registro centralizado, es fácil olvidar fechas, perder enlaces, duplicar postulaciones o no saber qué proceso requiere seguimiento.

JobTrack resuelve este problema con un espacio personal donde cada usuario puede administrar sus postulaciones, filtrarlas, consultar estadísticas y visualizar el avance general de su búsqueda.

## Funcionalidades

- Registro de usuarios e inicio de sesión.
- Autenticación mediante JWT.
- Creación, consulta, edición y eliminación de postulaciones.
- Estados de seguimiento: guardada, aplicada, entrevista, prueba técnica, oferta, rechazada y retirada.
- Modalidad de trabajo: remota, híbrida, presencial o no especificada.
- Registro de empresa, cargo, ubicación, fecha, fuente, tecnologías, enlace y notas.
- Búsqueda y filtros por estado y modalidad.
- Dashboard con estadísticas de postulaciones.
- Protección de rutas privadas en el frontend y backend.

## Capturas de pantalla

![Pantalla de inicio de sesión de JobTrack](./docs/screenshots/login.png)

![Pantalla de registro de JobTrack](./docs/screenshots/register.png)

![Dashboard de JobTrack](./docs/screenshots/dashboard.png)

![Gestión de postulaciones en JobTrack](./docs/screenshots/applications.png)

## Tecnologías

### Frontend

- React 19 y JavaScript.
- Vite.
- Tailwind CSS.
- React Router.
- Axios.
- Lucide React.
- Recharts.

### Backend y datos

- Node.js.
- Express 5.
- Prisma ORM.
- PostgreSQL.
- JWT para autenticación.
- bcryptjs para el hash de contraseñas.
- CORS y dotenv.

### Despliegue

- Vercel para el frontend.
- Render Web Service para la API.
- Render PostgreSQL para la base de datos.

## Arquitectura cliente-servidor

JobTrack utiliza una arquitectura desacoplada:

1. El cliente React, servido por Vercel, gestiona la interfaz, la navegación y el estado de la sesión.
2. Axios envía solicitudes HTTP a la API Express usando `VITE_API_URL`.
3. Express expone las rutas REST, valida las solicitudes y protege los recursos con middleware JWT.
4. Prisma ORM comunica el backend con PostgreSQL.
5. La API devuelve respuestas JSON al frontend.

```text
Usuario
	|
	v
React + Vite + Tailwind CSS (Vercel)
	|
	| HTTP/JSON + Bearer token
	v
Express API (Render Web Service)
	|
	v
Prisma ORM
	|
	v
PostgreSQL (Render)
```

## Estructura del repositorio

```text
jobtrack/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── utils/
├── docs/
│   ├── project-definition.md
│   └── screenshots/
└── README.md
```

## Seguridad implementada

- Las contraseñas no se almacenan en texto plano; se guardan como hashes generados con bcryptjs.
- Los endpoints privados requieren un token JWT válido en `Authorization: Bearer <token>`.
- Cada postulación se asocia al usuario autenticado y las operaciones validan esa pertenencia.
- El correo electrónico se normaliza y tiene una restricción de unicidad.
- CORS restringe los orígenes permitidos según el entorno.
- Las variables sensibles se cargan desde variables de entorno y no deben incluirse en el repositorio.
- La API valida estados, modalidades, fechas y tipos de datos recibidos.

## Modelo de datos

La relación principal es **User 1:N Application**: un usuario puede tener muchas postulaciones y cada postulación pertenece a un único usuario.

```text
User (1) ──────────────── (N) Application
	id                         id
	name                       company
	email                      position
	passwordHash               status
	createdAt                  userId (FK)
	updatedAt                  createdAt
														 updatedAt
```

`Application.userId` es una clave foránea hacia `User.id`. La eliminación de un usuario elimina sus postulaciones asociadas mediante `onDelete: Cascade`.

## Endpoints principales

Base URL: `https://jobtrack-api-rc04.onrender.com/api`

### Salud y autenticación

| Método | Endpoint | Autenticación | Descripción |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Comprueba el estado de la API. |
| `POST` | `/auth/register` | No | Registra un usuario. |
| `POST` | `/auth/login` | No | Inicia sesión y devuelve un JWT. |
| `GET` | `/auth/profile` | JWT | Consulta el perfil autenticado. |

### Postulaciones

Todas estas rutas requieren un JWT válido.

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `POST` | `/applications` | Crea una postulación. |
| `GET` | `/applications` | Lista postulaciones; admite filtros por `status`, `workMode` y `search`. |
| `GET` | `/applications/stats` | Devuelve estadísticas del usuario. |
| `GET` | `/applications/:id` | Consulta una postulación por ID. |
| `PATCH` | `/applications/:id` | Actualiza una postulación. |
| `DELETE` | `/applications/:id` | Elimina una postulación. |

## Instalación local

### Requisitos

- Node.js 24 o superior.
- PostgreSQL local o una instancia remota.
- Git.

### Pasos

```bash
git clone https://github.com/mateojulian41-eng/jobtrack.git
cd jobtrack
```

Configura las variables de entorno del backend y frontend según los ejemplos siguientes.

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:deploy
npm run dev
```

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La interfaz estará disponible normalmente en `http://localhost:5173`.

## Variables de entorno

### `backend/.env`

```env
DATABASE_URL="postgresql://USUARIO:CONTRASENA@HOST:5432/NOMBRE_BASE_DE_DATOS?schema=public"
JWT_SECRET="reemplaza-este-valor-por-un-secreto-largo-y-aleatorio"
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
PORT=3000
```

### `frontend/.env`

```env
VITE_API_URL="http://localhost:3000/api"
```

Los valores anteriores son ejemplos. No publiques credenciales, tokens, `DATABASE_URL` ni `JWT_SECRET` reales.

## Despliegue

1. Crear una base de datos PostgreSQL en Render y configurar `DATABASE_URL` en el servicio backend.
2. Desplegar `backend` como Render Web Service, ejecutar `npm install` como instalación y `npm start` como comando de inicio.
3. Ejecutar las migraciones con `npm run prisma:deploy` y generar el cliente con `npm run prisma:generate` cuando corresponda.
4. Configurar en Render `JWT_SECRET`, `FRONTEND_URL`, `NODE_ENV=production` y el puerto asignado por la plataforma.
5. Desplegar `frontend` en Vercel con `VITE_API_URL` apuntando a la API pública.
6. Verificar la API mediante `/api/health` y probar el flujo de registro, autenticación y gestión de postulaciones.

## Aprendizajes

- Diseño de una aplicación full stack con frontend y backend desacoplados.
- Construcción de una API REST con Express y Prisma.
- Modelado de relaciones y migraciones en PostgreSQL.
- Implementación de autenticación JWT y almacenamiento seguro de contraseñas.
- Protección de recursos por usuario y configuración de CORS.
- Integración y despliegue de servicios en Vercel y Render.

## Posibles mejoras

- Historial detallado de cambios de estado.
- Recordatorios y notificaciones para entrevistas y fechas límite.
- Exportación de postulaciones a CSV o PDF.
- Integración con calendarios.
- Recuperación y cambio de contraseña.
- Paginación y ordenamiento avanzado.
- Pruebas automatizadas de frontend, backend e integración.
- Observabilidad, límites de solicitudes y validación más robusta de entradas.

## Autor

**Mateo Julian Payares Carcamo**

- GitHub: [mateojulian41-eng](https://github.com/mateojulian41-eng)