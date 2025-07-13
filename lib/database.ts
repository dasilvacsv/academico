// lib/database.ts
import Database from 'better-sqlite3';
import path from 'path';

let dbInstance: Database.Database | null = null;

/**
 * Devuelve una conexión única y compartida a la base de datos SQLite.
 * Esta función es segura tanto para el proceso de compilación de Next.js
 * como para la ejecución dentro de Electron.
 */
const getDbConnection = (): Database.Database => {
  // Si la instancia ya existe, la devolvemos inmediatamente.
  if (dbInstance) {
    return dbInstance;
  }

  try {
    // Lógica clave:
    // 1. Si `process.env.DB_PATH` existe (establecido por Electron en tiempo de ejecución), úsalo.
    // 2. Si no existe (porque estamos en 'next build'), usa la ruta local por defecto.
    const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'school_system.db');
    
    console.log("✅ Intentando conectar a SQLite en:", dbPath);
    
    dbInstance = new Database(dbPath);
    dbInstance.pragma('journal_mode = WAL'); // Mejora el rendimiento
    
    console.log("✅ Conexión a SQLite establecida exitosamente.");
    
    return dbInstance;

  } catch (error) {
    console.error("🔥 Error fatal al conectar con SQLite:", error);
    throw new Error("No se pudo inicializar la conexión con la base de datos.");
  }
};

// Exportamos la FUNCIÓN que obtiene la conexión.
export default getDbConnection;
