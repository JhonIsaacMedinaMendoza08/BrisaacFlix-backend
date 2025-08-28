import { MongoClient, ServerApiVersion } from "mongodb";

let client;
let db;

export async function connectDB(uri, DB_NAME) {
    if (db) return db;
    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        maxPoolSize: 10,
    });
    await client.connect();
    db = client.db(DB_NAME);
    
    // Creacion de indice unico para el campo de correo
    await Promise.all([
        db.collection('usuarios').createIndex({ email: 1 }, { unique: true }),
    ]);
    
    console.log("✅ MongoDB Driver conectado");
    return db;
}

export function getDB() {
    if (!db) throw new Error("DB not initialized. Call connectDB first.");
    return db;
}

export function getCollection(name) {
    return getDB().collection(name);
}

export async function disconnectDB() {
    if (client) await client.close();
    db = null;
}
