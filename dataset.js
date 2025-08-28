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
    await db.collection("contenido").deleteMany({});
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
        password: bcrypt.hashSync(passwordDefault, salt),
        rol: "admin",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        nombre: "Carlos User",
        email: "carlos@flix.com",
        password: bcrypt.hashSync(passwordDefault, salt),
        rol: "user",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        nombre: "Ana User",
        email: "ana@flix.com",
        password: bcrypt.hashSync(passwordDefault, salt),
        rol: "user",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        nombre: "Laura User",
        email: "laura@flix.com",
        password: bcrypt.hashSync(passwordDefault, salt),
        rol: "user",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        nombre: "Pedro User",
        email: "pedro@flix.com",
        password: bcrypt.hashSync(passwordDefault, salt),
        rol: "user",
        createdAt: new Date(),
      },
    ];

    await db.collection("usuarios").insertMany(usuarios);
    console.log("👤 Usuarios insertados (contraseñas hasheadas)");

    // ========================
    // 2. CONTENIDOS
    // ========================
    const contenidos = [
      {
        _id: new ObjectId("68af7c3d6570cc483af9dcb6"),
        tmdbId: 31910,
        titulo: "Naruto Shippūden",
        sinopsis: "Naruto Uzumaki regresa a Konoha tras dos años de entrenamiento...",
        anio: "2007",
        poster: "https://image.tmdb.org/t/p/w500/zAYRe2bJxpWTVrwwmBc00VFkAf4.jpg",
        generos: [
          { id: 16, name: "Animación" },
          { id: 10759, name: "Acción y Aventura" },
        ],
        estado: "aprobado",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        tmdbId: 550,
        titulo: "Fight Club",
        sinopsis: "Un hombre descontento conoce a un vendedor de jabón que lo arrastra a un club secreto de lucha...",
        anio: "1999",
        poster: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
        generos: [
          { id: 18, name: "Drama" },
          { id: 53, name: "Thriller" },
        ],
        estado: "pendiente",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        tmdbId: 1396,
        titulo: "Breaking Bad",
        sinopsis: "Walter White, un profesor de química, se convierte en fabricante de metanfetaminas...",
        anio: "2008",
        poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
        generos: [
          { id: 80, name: "Crimen" },
          { id: 18, name: "Drama" },
        ],
        estado: "rechazado",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        tmdbId: 2316,
        titulo: "Avatar",
        sinopsis: "Un ex-marine parapléjico viaja a Pandora y se involucra en el conflicto entre humanos y Na'vi...",
        anio: "2009",
        poster: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
        generos: [
          { id: 28, name: "Acción" },
          { id: 12, name: "Aventura" },
          { id: 878, name: "Ciencia ficción" },
        ],
        estado: "aprobado",
        createdAt: new Date(),
      },
    ];

    await db.collection("contenidos").insertMany(contenidos);
    console.log("🎬 Contenidos insertados");

    // ========================
    // 3. RESEÑAS
    // ========================
    const resenias = [
      {
        _id: new ObjectId("68af7dd28609d25f527adce2"),
        contenidoId: contenidos[0]._id,
        titulo: "La peor Serie De Ninjas",
        comentario: "Esta serie es muy aburrida",
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
        titulo: "Naruto es Épico",
        comentario: "Tiene unas peleas increíbles, aunque a veces se alarga demasiado.",
        calificacion: 4,
        usuarioId: usuarios[2]._id,
        likesUsuarios: [usuarios[3]._id],
        dislikesUsuarios: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[1]._id,
        titulo: "Obra maestra del cine",
        comentario: "El Club de la Pelea cambió la forma en la que veo las películas.",
        calificacion: 5,
        usuarioId: usuarios[3]._id,
        likesUsuarios: [usuarios[1]._id, usuarios[2]._id],
        dislikesUsuarios: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        contenidoId: contenidos[3]._id,
        titulo: "Visualmente hermosa",
        comentario: "Avatar tiene unos gráficos espectaculares, pero la historia es predecible.",
        calificacion: 3,
        usuarioId: usuarios[4]._id,
        likesUsuarios: [usuarios[1]._id],
        dislikesUsuarios: [usuarios[2]._id],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection("resenias").insertMany(resenias);
    console.log("📝 Reseñas insertadas");

    console.log("🌱 Seed completado con éxito 🚀");
    console.log("👉 Puedes loguearte con email + contraseña: '123456'");
  } catch (err) {
    console.error("❌ Error seeding:", err);
  } finally {
    await client.close();
  }
}

seed();
