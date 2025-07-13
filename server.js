// server.js

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");
const setupDatabaseFunction = require('./scripts/setup-database.js'); // <-- Se importa la función

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Define la ruta donde se guardará la base de datos
const dbPath = process.pkg
  ? path.join(path.dirname(process.execPath), "school_system.db") // Para el .exe
  : path.join(process.cwd(), "school_system.db");                 // Para desarrollo

function initializeDatabase() {
  console.log("🔍 Verificando la base de datos en:", dbPath);
  if (!fs.existsSync(dbPath)) {
    console.log("❌ Base de datos no encontrada. Creando una nueva...");
    try {
      // Se llama a la función directamente en lugar de usar execSync
      setupDatabaseFunction(dbPath);
      console.log("✅ Base de datos inicializada correctamente.");
    } catch (error) {
      console.error("🔥 Error crítico al crear la base de datos:", error);
      // Creamos un archivo de log para poder ver el error
      fs.writeFileSync("db_error_log.txt", error.toString());
      process.exit(1); // Detiene la ejecución si la DB no se puede crear
    }
  } else {
    console.log("👍 La base de datos ya existe.");
  }
}

app.prepare().then(() => {
  // Llama a la función de la base de datos ANTES de iniciar el servidor.
  initializeDatabase();

  // Crea y arranca el servidor web.
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("🚀 Servidor listo en http://localhost:3000");
    console.log("Presiona CTRL + C para detener el servidor.");
  });
});