// start.js
const fs = require('fs');
const path = require('path');
// Importamos la función que crea la base de datos. La ruta es relativa
// a la ubicación final que tendrá dentro de la carpeta 'standalone'.
const setupDatabaseFunction = require('./scripts/setup-database.js');

console.log('--- Iniciando Aplicación ---');

// --- Lógica de la Base de Datos ---
function initializeDatabase() {
  // La ruta de la base de datos se calcula al lado del .exe
  const dbPath = path.join(path.dirname(process.execPath), "school_system.db");
  console.log("🔍 Verificando la base de datos en:", dbPath);

  if (!fs.existsSync(dbPath)) {
    console.log("❌ Base de datos no encontrada. Creando una nueva...");
    try {
      setupDatabaseFunction(dbPath);
      console.log("✅ Base de datos inicializada correctamente.");
    } catch (error) {
      console.error("🔥 Error crítico al crear la base de datos:", error);
      // Creamos un archivo de log para poder ver el error si el .exe se cierra
      fs.writeFileSync("db_error_log.txt", error.toString());
      process.exit(1);
    }
  } else {
    console.log("👍 La base de datos ya existe.");
  }
}

// 1. Ejecutamos nuestra lógica de inicialización primero.
initializeDatabase();

// 2. Una vez que la base de datos está lista, iniciamos el servidor de Next.js.
//    El archivo 'server.js' es el que Next.js genera automáticamente en la carpeta 'standalone'.
console.log('🚀 Lanzando el servidor de Next.js...');
require('./server.js');
