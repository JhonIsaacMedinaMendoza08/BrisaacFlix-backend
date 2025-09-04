import rateLimit from "express-rate-limit";

// // 🔹 1. Limitador global: Máx. 500 requests por hora por IP
export const globalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 500,
  message: {
    ok: false,
    error: "Demasiadas solicitudes desde esta IP. Intenta de nuevo en 1 hora."
  }
});

// // 🔹 2. Limitador para crear contenido: Máx. 5 creaciones por día por usuario
// export const contenidoLimiter = rateLimit({
//   windowMs: 24 * 60 * 60 * 1000, // 24 horas
//   max: 5,
//   message: {
//     ok: false,
//     error: "Has alcanzado el límite de creación de contenido por hoy."
//   },
//   keyGenerator: (req) => req.usuario?.id || req.ip
// });

// // 🔹 3. Limitador para crear reseñas: Máx. 20 por hora por usuario
// export const reseñaLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hora
//   max: 20,
//   message: {
//     ok: false,
//     error: "Has alcanzado el límite de 20 reseñas por hora."
//   },
//   keyGenerator: (req) => req.usuario?.id || req.ip
// });
