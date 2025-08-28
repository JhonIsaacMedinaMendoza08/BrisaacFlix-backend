// scripts/genSwagger.js
import fs from "fs";
import path from "path";
import postmanToOpenApi from "postman-to-openapi";
import yaml from "js-yaml";

const postmanFile = path.resolve("src/docs/BrisaacFlix.postman_collection.json");
const outputFile = path.resolve("swagger/swagger.json");

async function generateSwagger() {
  try {
    // Convierte la colección Postman → OpenAPI (por defecto YAML)
    const openapiSpec = await postmanToOpenApi(postmanFile, null, {
      defaultTag: "General",
    });

    // Si el resultado es YAML, lo parseamos y guardamos como JSON
    let parsed;
    try {
      parsed = JSON.parse(openapiSpec); // ya es JSON
    } catch {
      parsed = yaml.load(openapiSpec); // era YAML
    }

    // Creamos la carpeta si no existe
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });

    // Guardamos siempre en formato JSON bonito
    fs.writeFileSync(outputFile, JSON.stringify(parsed, null, 2));

    console.log(`✅ Swagger JSON generado en: ${outputFile}`);
  } catch (error) {
    console.error("❌ Error generando Swagger:", error);
    process.exit(1);
  }
}

generateSwagger();
