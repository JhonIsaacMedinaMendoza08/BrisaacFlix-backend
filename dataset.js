// dataset.js
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";

const uri = "mongodb+srv://reservation_admin:admin1234@mycluster.vlbhwms.mongodb.net/?retryWrites=true&w=majority";
const dbName = "brisaacflix";

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB");

    const db = client.db(dbName);

    // Limpiar colecciones
    await db.collection("usuarios").deleteMany({});
    await db.collection("contenidos").deleteMany({});
    await db.collection("resenias").deleteMany({});

    // ========================
    // 1. USUARIOS (con bcrypt)
    // ========================
    const passwordDefault = "1234567890"; // contraseña clara para pruebas
    const salt = bcrypt.genSaltSync(10);

    const usuarios = [
      {
        _id: new ObjectId("68af7beb6570cc483af9dcb5"),
        nombre: "Brian Admin",
        email: "admin@flix.com",
        contrasena: bcrypt.hashSync(passwordDefault, salt),
        rol: "admin",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        nombre: "Carlos User",
        email: "carlos@flix.com",
        contrasena: bcrypt.hashSync(passwordDefault, salt),
        rol: "user",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        nombre: "Ana User",
        email: "ana@flix.com",
        contrasena: bcrypt.hashSync(passwordDefault, salt),
        rol: "user",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        nombre: "Laura User",
        email: "laura@flix.com",
        contrasena: bcrypt.hashSync(passwordDefault, salt),
        rol: "user",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        nombre: "Pedro User",
        email: "pedro@flix.com",
        contrasena: bcrypt.hashSync(passwordDefault, salt),
        rol: "user",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        nombre: "Marta User",
        email: "marta@flix.com",
        contrasena: bcrypt.hashSync(passwordDefault, salt),
        rol: "user",
        createdAt: new Date(),
      },
    ];

    await db.collection("usuarios").insertMany(usuarios);
    console.log("👤 Usuarios insertados (contraseñas hasheadas)");

    // ========================
    // 2. CONTENIDOS (12 items)
    // ========================
    const contenidos = [
      {
        _id: new ObjectId(),
        tmdbId: 31910,
        titulo: "Naruto Shippūden",
        sinopsis: "Naruto regresa a Konoha tras dos años de entrenamiento.",
        anio: "2007",
        poster: "https://image.tmdb.org/t/p/w500/zAYRe2bJxpWTVrwwmBc00VFkAf4.jpg",
        generos: [{ id: 16, name: "Animación" }, { id: 10759, name: "Acción y Aventura" }],
        estado: "aprobado",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        tmdbId: 550,
        titulo: "Fight Club",
        sinopsis: "Un hombre descontento entra en un club secreto de lucha.",
        anio: "1999",
        poster: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
        generos: [{ id: 18, name: "Drama" }, { id: 53, name: "Thriller" }],
        estado: "pendiente",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        tmdbId: 1396,
        titulo: "Breaking Bad",
        sinopsis: "Un profesor de química se convierte en fabricante de drogas.",
        anio: "2008",
        poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
        generos: [{ id: 80, name: "Crimen" }, { id: 18, name: "Drama" }],
        estado: "rechazado",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        tmdbId: 19995,
        titulo: "Avatar",
        sinopsis: "Un ex-marine se une a los Na'vi en Pandora.",
        anio: "2009",
        poster: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
        generos: [{ id: 28, name: "Acción" }, { id: 12, name: "Aventura" }, { id: 878, name: "Sci-Fi" }],
        estado: "aprobado",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        tmdbId: 66732,
        titulo: "Stranger Things",
        sinopsis: "Un grupo de niños enfrenta fuerzas sobrenaturales en Hawkins.",
        anio: "2016",
        poster: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
        generos: [{ id: 18, name: "Drama" }, { id: 9648, name: "Misterio" }, { id: 10765, name: "Sci-Fi" }],
        estado: "aprobado",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        tmdbId: 82856,
        titulo: "The Mandalorian",
        sinopsis: "Un cazarrecompensas viaja por la galaxia con Grogu.",
        anio: "2019",
        poster: "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
        generos: [{ id: 10765, name: "Sci-Fi" }, { id: 10759, name: "Acción" }],
        estado: "aprobado",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        tmdbId: 157336,
        titulo: "Interstellar",
        sinopsis: "Un grupo viaja a través de un agujero de gusano en busca de un nuevo hogar.",
        anio: "2014",
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        generos: [{ id: 12, name: "Aventura" }, { id: 18, name: "Drama" }, { id: 878, name: "Sci-Fi" }],
        estado: "aprobado",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        tmdbId: 24428,
        titulo: "The Avengers",
        sinopsis: "Los héroes más poderosos de la Tierra se unen contra Loki.",
        anio: "2012",
        poster: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
        generos: [{ id: 28, name: "Acción" }, { id: 12, name: "Aventura" }],
        estado: "aprobado",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        tmdbId: 155,
        titulo: "The Dark Knight",
        sinopsis: "Batman enfrenta al Joker en Gotham.",
        anio: "2008",
        poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        generos: [{ id: 28, name: "Acción" }, { id: 80, name: "Crimen" }],
        estado: "aprobado",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        tmdbId: 424,
        titulo: "Schindler's List",
        sinopsis: "La historia de Oskar Schindler durante el Holocausto.",
        anio: "1993",
        poster: "https://image.tmdb.org/t/p/w500/c8Ass7acuOe4za6DhSattE359gr.jpg",
        generos: [{ id: 18, name: "Drama" }, { id: 36, name: "Historia" }],
        estado: "pendiente",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        tmdbId: 27205,
        titulo: "Inception",
        sinopsis: "Un ladrón roba secretos infiltrándose en los sueños.",
        anio: "2010",
        poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
        generos: [{ id: 28, name: "Acción" }, { id: 878, name: "Sci-Fi" }],
        estado: "rechazado",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        tmdbId: 603,
        titulo: "The Matrix",
        sinopsis: "Neo descubre la verdad detrás de la Matrix.",
        anio: "1999",
        poster: "https://image.tmdb.org/t/p/w500/aoiGjcZ3G6mxF6RxmLq5yRvCNrU.jpg",
        generos: [{ id: 28, name: "Acción" }, { id: 878, name: "Sci-Fi" }],
        estado: "aprobado",
        createdAt: new Date(),
      },
    ];

    await db.collection("contenidos").insertMany(contenidos);
    console.log("🎬 Contenidos insertados");

    // ========================
    // 3. RESEÑAS (15 items)
    // ========================
    const resenias = [
      {
        _id: new ObjectId(),
        contenidoId: contenidos[0]._id,
        titulo: "Naruto aburrido",
        comentario: "Demasiados rellenos.",
        calificacion: 2,
        usuarioId: usuarios[1]._id,
        likesUsuarios: [],
        dislikesUsuarios: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[0]._id,
        titulo: "Naruto épico",
        comentario: "Peleas increíbles.",
        calificacion: 4,
        usuarioId: usuarios[2]._id,
        likesUsuarios: [usuarios[3]._id.toString()],
        dislikesUsuarios: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[3]._id,
        titulo: "Avatar hermosa",
        comentario: "Visualmente brutal.",
        calificacion: 4,
        usuarioId: usuarios[4]._id,
        likesUsuarios: [usuarios[1]._id.toString()],
        dislikesUsuarios: [usuarios[2]._id.toString()],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[4]._id,
        titulo: "Stranger Things genial",
        comentario: "Gran ambientación ochentera.",
        calificacion: 5,
        usuarioId: usuarios[5]._id,
        likesUsuarios: [usuarios[1]._id.toString(), usuarios[2]._id.toString()],
        dislikesUsuarios: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[4]._id,
        titulo: "Muy sobrevalorada",
        comentario: "Esperaba más de la historia.",
        calificacion: 3,
        usuarioId: usuarios[2]._id,
        likesUsuarios: [],
        dislikesUsuarios: [usuarios[5]._id.toString()],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[5]._id,
        titulo: "Star Wars vibes",
        comentario: "El Mandalorian me encantó.",
        calificacion: 5,
        usuarioId: usuarios[3]._id,
        likesUsuarios: [usuarios[4]._id.toString()],
        dislikesUsuarios: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[6]._id,
        titulo: "Interstellar épica",
        comentario: "Hans Zimmer se lució con la música.",
        calificacion: 5,
        usuarioId: usuarios[1]._id,
        likesUsuarios: [usuarios[2]._id.toString(), usuarios[3]._id.toString()],
        dislikesUsuarios: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[6]._id,
        titulo: "Muy larga",
        comentario: "La historia se enreda demasiado.",
        calificacion: 3,
        usuarioId: usuarios[5]._id,
        likesUsuarios: [],
        dislikesUsuarios: [usuarios[2]._id.toString()],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[7]._id,
        titulo: "Avengers increíble",
        comentario: "La batalla en NY es un clásico.",
        calificacion: 5,
        usuarioId: usuarios[2]._id,
        likesUsuarios: [usuarios[1]._id.toString(), usuarios[3]._id.toString()],
        dislikesUsuarios: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[7]._id,
        titulo: "Demasiados personajes",
        comentario: "Un poco saturada de héroes.",
        calificacion: 4,
        usuarioId: usuarios[4]._id,
        likesUsuarios: [],
        dislikesUsuarios: [usuarios[5]._id.toString()],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[8]._id,
        titulo: "Joker brillante",
        comentario: "Heath Ledger se robó la película.",
        calificacion: 5,
        usuarioId: usuarios[5]._id,
        likesUsuarios: [usuarios[1]._id.toString()],
        dislikesUsuarios: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[10]._id,
        titulo: "Sueños locos",
        comentario: "Inception te explota la cabeza.",
        calificacion: 5,
        usuarioId: usuarios[3]._id,
        likesUsuarios: [usuarios[2]._id.toString()],
        dislikesUsuarios: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[11]._id,
        titulo: "Matrix revolucionaria",
        comentario: "Cambió el cine de acción.",
        calificacion: 5,
        usuarioId: usuarios[4]._id,
        likesUsuarios: [usuarios[1]._id.toString(), usuarios[5]._id.toString()],
        dislikesUsuarios: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[11]._id,
        titulo: "Matrix confusa",
        comentario: "No entendí nada de la trama.",
        calificacion: 2,
        usuarioId: usuarios[2]._id,
        likesUsuarios: [],
        dislikesUsuarios: [usuarios[3]._id.toString()],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[2]._id,
        titulo: "Breaking Bad brutal",
        comentario: "La mejor serie de la historia.",
        calificacion: 5,
        usuarioId: usuarios[1]._id,
        likesUsuarios: [usuarios[4]._id.toString()],
        dislikesUsuarios: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection("resenias").insertMany(resenias);
    console.log("📝 Reseñas insertadas");

    console.log("🌱 Seed completado con éxito 🚀");
    console.log("👉 Puedes loguearte con: email + contraseña '1234567890'");
  } catch (err) {
    console.error("❌ Error seeding:", err);
  } finally {
    await client.close();
  }
}

seed();
