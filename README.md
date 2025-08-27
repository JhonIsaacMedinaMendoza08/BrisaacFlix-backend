# 🎥 BrisaacFlix - Plataforma de Reseñas y Rankings Geek

BrisaacFlix es una aplicación **full-stack** que permite a los usuarios registrar, calificar y rankear películas, animes y series relacionadas con la cultura geek.  
El proyecto está dividido en dos partes:  

- **Backend** → API desarrollada con **Node.js + Express**.  
- **Frontend** → Interfaz web en **HTML + CSS + JS puro** que consume la API.  

---

## 🚀 Objetivo

El objetivo de este proyecto es construir una plataforma donde los usuarios puedan:  
- Registrar y gestionar cuentas.  
- Publicar reseñas con calificaciones numéricas.  
- Dar like/dislike a reseñas de otros.  
- Explorar películas y series con un **ranking dinámico** basado en calificaciones y popularidad.  

Los administradores cuentan con privilegios adicionales como la gestión de categorías y aprobación de nuevas películas/series.

---

## 🛠️ Tecnologías utilizadas

### Backend
- Node.js + Express
- MongoDB Driver Oficial (sin mongoose)
- jsonwebtoken + passport-jwt para autenticación con JWT  
- bcrypt para encriptación de contraseñas  
- dotenv para variables de entorno  
- express-rate-limit para evitar abusos en peticiones  
- express-validator para validaciones de endpoints  
- swagger-ui-express para documentación de API  

### Frontend
- **HTML + CSS + JS puro** (sin frameworks)  
- Fetch API para consumo del backend  

---

## 📂 Estructura del proyecto (backend)

```
/backend
│── /config        # Configuración general (DB, passport, dotenv, etc.)
│── /controllers   # Lógica de negocio de cada recurso
│── /models        # Definición de esquemas de datos y validaciones
│── /routes        # Definición de endpoints de la API
│── /middlewares   # Middlewares de autenticación, validación, rate-limit
│── /services      # Lógica adicional y servicios externos
│── /utils         # Funciones auxiliares
│── /docs          # Configuración de Swagger
│── server.js      # Punto de entrada
```

---

## 🔐 Autenticación y roles

- **JWT** para sesiones seguras.  
- **Roles definidos**:  
  - 👤 **Usuario** → Puede registrarse, iniciar sesión, publicar reseñas, calificar y dar likes/dislikes.  
  - 🛡️ **Administrador** → Puede gestionar categorías, aprobar nuevas películas/series y moderar contenido.  

---

## 🎬 Funcionalidades principales

### 👤 Gestión de usuarios
- Registro y login con JWT.  
- Roles diferenciados (usuario/admin).  

### 🎥 Gestión de películas y series
- CRUD de películas/series.  
- Solo administradores pueden aprobar nuevas entradas.  
- Validación para evitar títulos duplicados.  
- Atributos mínimos: `título`, `descripción`, `categoría`, `año`, `imagen opcional`.  

### 📝 Reseñas y ratings
- Los usuarios pueden crear, editar y eliminar reseñas.  
- Cada reseña incluye:  
  - Título  
  - Comentario  
  - Calificación (1-10)  
- Likes/dislikes a reseñas (no a las propias).  
- Ranking ponderado basado en:  
  - Calificación numérica  
  - Likes/dislikes  
  - Fecha de publicación  

### 🗂️ Categorías
- CRUD de categorías (Anime, Ciencia Ficción, Superhéroes, etc.).  
- Solo administradores pueden gestionarlas.  

### 📊 Ranking y listados
- Listado de películas ordenadas por popularidad y ranking.  
- Filtros por categoría.  
- Vista de detalle con información y reseñas asociadas.  

---

## 📖 Documentación API

La API está documentada con **Swagger** y accesible en:  

```
http://localhost:4000/api/docs
```

---

## ⚡ Instalación y uso

### Backend
```bash
# Clonar repositorio
git clone https://github.com/JhonIsaacMedinaMendoza08/BrisaacFlix-backend.git
cd BrisaacFlix-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor
npm run dev
```

### Frontend
```bash
# Clonar repositorio
git clone https://github.com/tuusuario/geekrank-frontend.git
cd geekrank-frontend

# Abrir index.html en el navegador
```

---

## 🗄️ Variables de entorno (.env)

Ejemplo de configuración mínima:  

```
PORT=4000
MONGODB_URI=mongodb+srv://reservation_admin:admin1234@mycluster.vlbhwms.mongodb.net/?retryWrites=true&w=majority
DB_NAME=brisaacflix
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=claveSuperSecreta123
API_VERSION=1.0.0
```

---


## 📜 Licencia

Este proyecto se distribuye bajo la licencia **MIT**.  
