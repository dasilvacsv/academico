// main/database.ts
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
// La ruta es relativa a la carpeta 'main'
const setupDatabaseFunction = require('../scripts/setup-database.js');

/**
 * Devuelve la ruta segura y correcta para almacenar la base de datos.
 * Usa la carpeta de datos del usuario proporcionada por Electron.
 */
export function getDatabasePath(): string {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, "school_system.db");
}

/**
 * Verifica si la base de datos existe en la ruta correcta.
 * Si no existe, la crea llamando al script de setup.
 */
export function initializeDatabase() {
  const dbPath = getDatabasePath();
  console.log("🔍 Verificando la base de datos en:", dbPath);

  if (!fs.existsSync(dbPath)) {
    console.log("❌ Base de datos no encontrada. Creando una nueva...");
    try {
      setupDatabaseFunction(dbPath);
      console.log("✅ Base de datos inicializada correctamente.");
    } catch (error) {
      console.error("🔥 Error crítico al crear la base de datos:", error);
      app.quit(); // Si la DB no se puede crear, la app no puede continuar.
    }
  } else {
    console.log("👍 La base de datos ya existe.");
  }
}
