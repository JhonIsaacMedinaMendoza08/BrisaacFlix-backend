# 🎥 BrisaacFlix - Plataforma de Reseñas y Rankings Geek

BrisaacFlix es una aplicación **full-stack** que permite a los usuarios registrar, calificar y rankear películas, animes y series relacionadas con la cultura geek.  
El proyecto está dividido en dos partes:

- **Backend** → API REST con **Node.js + Express** y base de datos **MongoDB**.  
- **Frontend** → Interfaz web con **HTML + CSS + JS puro** que consume la API.

---

## 🚀 Objetivo

Construir una plataforma donde los usuarios puedan:

- Registrarse y gestionar cuentas.
- Publicar reseñas con calificaciones numéricas.
- Dar like/dislike a reseñas de otros.
- Explorar películas y series con un **ranking dinámico** basado en calificaciones y popularidad.

Los **administradores** cuentan con privilegios adicionales como la gestión de categorías y aprobación de nuevas películas/series.

---

## 🛠️ Tecnologías utilizadas

### Backend
- **Node.js + Express**
- **MongoDB Driver Oficial** (sin mongoose)
- **passport-jwt** + **jsonwebtoken** → autenticación vía JWT
- **bcrypt** → encriptación de contraseñas
- **dotenv** → configuración de variables de entorno
- **express-rate-limit** → protección contra abuso de peticiones
- **express-validator** → validación de datos en endpoints
- **swagger-ui-express** → documentación de API
- **postman-to-openapi** (dev) → generación automática de OpenAPI desde colección Postman

### Frontend
- **React**

---

## 📂 Estructura del proyecto (backend)

```text
/backend
│── /config        # Configuración (DB, passport, dotenv, etc.)
│── /controllers   # Lógica de negocio de cada recurso
│── /models        # Definición de colecciones y validaciones
│── /routes        # Endpoints de la API
│── /middlewares   # Middlewares de auth, validación, rate-limit
│── /services      # Lógica adicional y servicios externos
│── /utils         # Funciones auxiliares (responses, validators, etc.)
│── /docs          # Archivos relacionados con Swagger/OpenAPI (opt)
│── /scripts       # Scripts útiles (ej: genSwagger.js, seed)
│── server.js      # Punto de entrada
│── src/app.js     # Configuración de Express (rutas, swagger)
```

---

## 🔐 Autenticación y roles

- **JWT** para sesiones seguras.  
- **Roles definidos**:
  - 👤 **usuario** → puede registrarse, iniciar sesión, crear/editar/eliminar reseñas, dar likes/dislikes.
  - 🛡️ **admin** → puede aprobar contenidos, gestionar categorías y moderar.

**Nota**: los JWT se firman con `JWT_SECRET` (ver `.env`) y expiran según la configuración (`1h` por defecto en el proyecto).

---

## 🎬 Funcionalidades principales

### Gestión de usuarios
- Registro (`POST /api/v1/usuarios/register`) y login (`POST /api/v1/usuarios/login`) con JWT.
- Listado de usuarios (solo admin).
- Actualización y eliminación de usuarios (autorización requerida).

### Gestión de películas/series (Contenido)
- Crear solicitud de contenido (usuario autenticado): `POST /api/v1/contenido`
- Los contenidos creados aparecen en estado `pendiente` hasta que un admin los marque `aprobada` o `rechazada`.
- Consultas públicas:
  - Listado público con filtros: `GET /api/v1/contenido` (solo `aprobada`).
  - Detalle: `GET /api/v1/contenido/:id`
  - Listado por popularidad: `GET /api/v1/contenido/populares`
  - Filtrado por categoría: `GET /api/v1/contenido/categoria/:categoria`
  - Búsqueda por título: `GET /api/v1/contenido/titulo/:titulo`

### Reseñas
- Crear reseña (usuario autenticado) `POST /api/v1/resenias`
- Editar / borrar reseña (autor o admin) `PATCH|DELETE /api/v1/resenias/:id`
- Votar reseña (like/dislike) `POST /api/v1/resenias/:id/votar`
- Listado público de reseñas: `GET /api/v1/resenias` (y filtro por contenido)

---

## 📖 Documentación API (Swagger)

La API está disponible en **Swagger UI** en:

```
http://localhost:4000/api-docs
```

## ⚡ Instalación y uso (local)

### Requisitos
- Node.js >= 18
- MongoDB accesible (URI)

### Pasos
```bash
# Clonar repositorio
git clone https://github.com/JhonIsaacMedinaMendoza08/BrisaacFlix-backend.git
cd BrisaacFlix-backend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales (MONGODB_URI, JWT_SECRET, etc.)

# Iniciar servidor en modo desarrollo
npm run dev
```

Servidor por defecto: `http://localhost:4000`

---

## 🗄️ Variables de entorno (.env)

Ejemplo mínimo:
```env
PORT=4000
MONGODB_URI=mongodb+srv://reservation_admin:admin1234@mycluster.vlbhwms.mongodb.net/?retryWrites=true&w=majority
DB_NAME=brisaacflix
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=claveSuperSecreta123
API_VERSION=1.0.0
```

---

## 🧪 Pruebas (Postman / Endpoints clave)

### Usuarios
- `POST /api/v1/usuarios/register`  
  Body JSON: `{ "nombre": "Juan", "email": "juan@example.com", "contrasena": "password123" }`

- `POST /api/v1/usuarios/login`  
  Body JSON: `{ "email": "juan@example.com", "contrasena": "password123" }`  
  → Devuelve `token` (usar en `Authorization: Bearer <token>`)

### Contenido
- `GET /api/v1/contenido` → Listado público (solo aprobados). Soporta `?page=1&limit=10&sort=topRated&generoId=16&q=naruto`
- `POST /api/v1/contenido` → Crear solicitud (usuario autenticado). Body con `tmdbId`, `titulo`, `sinopsis`, `anio`, `poster`, `generos`.
- `GET /api/v1/contenido/populares` → Listado por popularidad (público)
- `GET /api/v1/contenido/categoria/:categoria` → Filtrar por nombre de género
- `GET /api/v1/contenido/titulo/:titulo` → Buscar por título (insensible a mayúsculas)

### Reseñas
- `POST /api/v1/resenias` → Crear reseña (token requerido). Body: `{ "contenidoId": "<ObjectId>", "titulo":"...", "comentario":"...", "calificacion": 8 }`
- `PATCH /api/v1/resenias/:id` → Editar reseña (autor)
- `DELETE /api/v1/resenias/:id` → Borrar reseña (autor o admin)
- `POST /api/v1/resenias/:id/votar` → Votar `{ "tipo": "like" }` o `{ "tipo": "dislike" }`

---

## 🔁 Scripts útiles (package.json)

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "seed": "node scripts/dataset.js"
  }
}
```
---

## 🔗 Frontend
**Repositorio frontend :** _[[link repo](https://github.com/JhonIsaacMedinaMendoza08/brisaacflix-frontend.git)]_  
**Deploy de frontend:** _[[link ](https://gestor-de-reservas-de-canchas-front.vercel.app/)]_ 

---

## 🔗 Video explicativo
**Video de Youtube :** _[[[link](https://youtu.be/-rfr3Kpvxpk)]]_  

---

## 📜 Licencia

Este proyecto está bajo licencia **MIT**.

---

## ✨ Créditos

- Equipo del proyecto: Isaac Medina y Brian Suarez.
- Inspiración/recursos: The Movie Database (TMDB) para metadata de contenidos.
