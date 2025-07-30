const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs"); // Asegúrate de tenerlo instalado

// Trata de obtener el 'app' de Electron.
let app;
try {
  app = require("electron").app;
} catch (error) {
  app = null;
}

// Determina la ruta de la base de datos.
const dbDir = app
  ? app.getPath("userData")
  : path.join(process.cwd(), "database");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "school_system.db");
console.log("Creando base de datos en:", dbPath);

const db = new Database(dbPath);

// Habilitar claves foráneas
db.pragma("foreign_keys = ON");

async function setup() {
  try {
    // --- 1. CREACIÓN DE TABLAS ---
    // Se mantiene la creación de todas las tablas para que el esquema esté completo.
    db.exec(`
      -- Tabla de preguntas de seguridad predeterminadas
      CREATE TABLE IF NOT EXISTS preguntas_seguridad (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          texto_pregunta TEXT NOT NULL UNIQUE
      );

      -- Tabla de usuarios
      CREATE TABLE IF NOT EXISTS usuarios (
          id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
          email TEXT UNIQUE NOT NULL,
          cedula TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          rol TEXT NOT NULL DEFAULT 'administrador',
          nombre_completo TEXT NOT NULL,
          activo INTEGER DEFAULT 1,
          pregunta_1_id INTEGER,
          respuesta_1_hash TEXT,
          pregunta_2_id INTEGER,
          respuesta_2_hash TEXT,
          pregunta_3_id INTEGER,
          respuesta_3_hash TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (pregunta_1_id) REFERENCES preguntas_seguridad(id),
          FOREIGN KEY (pregunta_2_id) REFERENCES preguntas_seguridad(id),
          FOREIGN KEY (pregunta_3_id) REFERENCES preguntas_seguridad(id)
      );

      -- Tabla de representantes
      CREATE TABLE IF NOT EXISTS representantes (
          id_representante TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
          nombres TEXT NOT NULL,
          apellidos TEXT NOT NULL,
          cedula TEXT UNIQUE NOT NULL,
          telefono TEXT,
          correo_electronico TEXT,
          direccion TEXT,
          parentesco TEXT,
          ocupacion TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabla de grados
      CREATE TABLE IF NOT EXISTS grados (
          id_grado TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
          nombre TEXT NOT NULL,
          nivel_educativo TEXT NOT NULL,
          seccion TEXT NOT NULL,
          turno TEXT NOT NULL,
          capacidad_maxima INTEGER NOT NULL DEFAULT 30,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabla de estudiantes
      CREATE TABLE IF NOT EXISTS estudiantes (
          id_estudiante TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
          nombres TEXT NOT NULL,
          apellidos TEXT NOT NULL,
          fecha_nacimiento DATE NOT NULL,
          genero TEXT NOT NULL,
          nacionalidad TEXT NOT NULL,
          estado_nacimiento TEXT,
          direccion TEXT,
          telefono_contacto TEXT,
          correo_electronico TEXT,
          condicion_especial TEXT,
          id_representante TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (id_representante) REFERENCES representantes(id_representante)
      );

      -- Tabla de matrículas
      CREATE TABLE IF NOT EXISTS matriculas (
          id_matricula TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
          id_estudiante TEXT,
          id_grado TEXT,
          ano_escolar TEXT NOT NULL,
          fecha_matricula DATE NOT NULL DEFAULT (date('now')),
          estatus TEXT NOT NULL DEFAULT 'pre-inscrito',
          observaciones TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante),
          FOREIGN KEY (id_grado) REFERENCES grados(id_grado)
      );

      -- Tabla de historial académico
      CREATE TABLE IF NOT EXISTS historial_academico (
          id_historial TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
          id_estudiante TEXT,
          ano_escolar TEXT NOT NULL,
          promedio REAL,
          observaciones TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante)
      );

      -- Tabla de documentos requeridos
      CREATE TABLE IF NOT EXISTS documentos_requeridos (
          id_documento TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
          nombre TEXT NOT NULL,
          descripcion TEXT,
          obligatorio INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabla de pagos
      CREATE TABLE IF NOT EXISTS pagos (
          id_pago TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
          id_matricula TEXT,
          concepto TEXT NOT NULL,
          monto REAL NOT NULL,
          fecha DATE NOT NULL DEFAULT (date('now')),
          metodo_pago TEXT,
          estatus TEXT DEFAULT 'pendiente',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (id_matricula) REFERENCES matriculas(id_matricula)
      );
    `);
    console.log("✅ Todas las tablas han sido creadas/verificadas exitosamente.");

    // --- 2. INSERCIÓN DE DATOS ESTÁTICOS Y DE EJEMPLO ---
    
    // Insertar preguntas de seguridad predeterminadas (si no existen)
    db.exec(`
      INSERT OR IGNORE INTO preguntas_seguridad (id, texto_pregunta) VALUES
      (1, '¿Cuál es el nombre de tu primera mascota?'),
      (2, '¿En qué ciudad naciste?'),
      (3, '¿Cuál es tu comida favorita?'),
      (4, '¿Cuál es el segundo nombre de tu madre?'),
      (5, '¿Cuál fue tu primer colegio?');
    `);
    console.log("✅ Preguntas de seguridad insertadas.");

    // Limpiar tablas de datos para evitar duplicados en cada ejecución
    db.exec(`
        DELETE FROM pagos;
        DELETE FROM historial_academico;
        DELETE FROM matriculas;
        DELETE FROM estudiantes;
        DELETE FROM representantes;
        DELETE FROM grados;
        DELETE FROM documentos_requeridos;
        DELETE FROM usuarios;
    `);
    console.log("🧹 Tablas de datos limpiadas para nueva inserción.");

    // Hashear contraseñas y respuestas
    const passwordHash = await bcrypt.hash("password123", 10);
    const respuesta1Hash = await bcrypt.hash("firulais", 10);
    const respuesta2Hash = await bcrypt.hash("caracas", 10);
    const respuesta3Hash = await bcrypt.hash("pizza", 10);

    // Insertar usuario administrador
    const userStmt = db.prepare(`
        INSERT INTO usuarios (id, email, cedula, password_hash, rol, nombre_completo, pregunta_1_id, respuesta_1_hash, pregunta_2_id, respuesta_2_hash, pregunta_3_id, respuesta_3_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);
    userStmt.run('admin-001', 'admin@escuela.edu', 'V-12345678', passwordHash, 'administrador', 'Administrador del Sistema', 1, respuesta1Hash, 2, respuesta2Hash, 3, respuesta3Hash);
    console.log("✅ Usuario administrador de ejemplo creado.");

    // Insertar documentos requeridos
    db.exec(`
      INSERT INTO documentos_requeridos (id_documento, nombre, descripcion, obligatorio) VALUES
      ('doc-001', 'Partida de Nacimiento', 'Copia certificada de la partida de nacimiento del estudiante', 1),
      ('doc-002', 'Cédula del Representante', 'Copia de la cédula de identidad del representante legal', 1),
      ('doc-003', 'Constancia de Residencia', 'Documento que certifique la dirección de residencia', 1),
      ('doc-004', 'Certificado Médico', 'Certificado médico actualizado del estudiante', 1),
      ('doc-005', 'Fotos Tipo Carnet', '4 fotografías tipo carnet recientes', 1),
      ('doc-006', 'Boletín del Año Anterior', 'Calificaciones del año escolar anterior (si aplica)', 0);
    `);
    console.log("✅ Datos de documentos requeridos han sido insertados.");

    // --- 3. RESUMEN FINAL ---
    console.log("\n📊 RESUMEN DE LA BASE DE DATOS:");
    const tables = ["usuarios", "documentos_requeridos", "representantes", "estudiantes", "grados", "matriculas"];
    tables.forEach((table) => {
      const result = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
      console.log(`- ${table}: ${result.count} registros`);
    });

    console.log("\n🎉 BASE DE DATOS SQLITE CREADA Y POBLADA EXITOSAMENTE");
    console.log("📁 Ubicación:", dbPath);
    console.log("📧 Usuario de admin: admin@escuela.edu");
    console.log("🔑 Contraseña de admin: password123");
    console.log("🤫 Respuestas de seguridad de admin (en minúsculas): firulais, caracas, pizza");

  } catch (error) {
    console.error("❌ Error durante la configuración de la base de datos:", error.message);
  } finally {
    db.close();
    console.log("Conexión a la base de datos cerrada.");
  }
}

// Ejecutar la función principal asíncrona
setup();
