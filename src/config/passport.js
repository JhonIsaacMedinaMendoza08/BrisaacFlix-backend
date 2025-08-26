import { Strategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { ObjectId } from "mongodb";
import {Usuario} from "../models/usuario.model.js";
import { getDB } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new Strategy(opts, async (jwt_payload, done) => {
        try {
            const db = getDB();

            // Buscar en la colección "usuarios" usando el ObjectId del payload
            const usuarioDoc = await db
                .collection("usuarios")
                .findOne({ _id: new ObjectId(jwt_payload.id) });

            if (!usuarioDoc) {
                return done(null, false); // Usuario no encontrado
            }

            // Reconstruir como instancia de tu clase Usuario
            const usuario = Usuario.fromDocument(usuarioDoc);

            return done(null, usuario);
        } catch (err) {
            return done(err, false);
        }
    })
);

export default passport;
