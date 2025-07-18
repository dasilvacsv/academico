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
    db.exec(`
      -- Tabla de preguntas de seguridad predeterminadas
      CREATE TABLE IF NOT EXISTS preguntas_seguridad (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          texto_pregunta TEXT NOT NULL UNIQUE
      );

      -- Tabla de usuarios (MODIFICADA)
      CREATE TABLE IF NOT EXISTS usuarios (
          id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
          email TEXT UNIQUE NOT NULL,
          cedula TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          rol TEXT NOT NULL DEFAULT 'docente',
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

      -- Tabla de docentes
      CREATE TABLE IF NOT EXISTS docentes (
          id_docente TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
          nombres TEXT NOT NULL,
          apellidos TEXT NOT NULL,
          cedula TEXT UNIQUE NOT NULL,
          especialidad TEXT,
          telefono TEXT,
          correo_institucional TEXT UNIQUE,
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

      -- Tabla de relación grado-docente
      CREATE TABLE IF NOT EXISTS grado_docente (
          id_grado TEXT,
          id_docente TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id_grado, id_docente),
          FOREIGN KEY (id_grado) REFERENCES grados(id_grado),
          FOREIGN KEY (id_docente) REFERENCES docentes(id_docente)
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
        DELETE FROM grado_docente;
        DELETE FROM pagos;
        DELETE FROM historial_academico;
        DELETE FROM matriculas;
        DELETE FROM estudiantes;
        DELETE FROM representantes;
        DELETE FROM docentes;
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

    // Insertar el resto de los datos de ejemplo
    db.exec(`
      -- Documentos requeridos
      INSERT INTO documentos_requeridos (id_documento, nombre, descripcion, obligatorio) VALUES
      ('doc-001', 'Partida de Nacimiento', 'Copia certificada de la partida de nacimiento del estudiante', 1),
      ('doc-002', 'Cédula del Representante', 'Copia de la cédula de identidad del representante legal', 1),
      ('doc-003', 'Constancia de Residencia', 'Documento que certifique la dirección de residencia', 1),
      ('doc-004', 'Certificado Médico', 'Certificado médico actualizado del estudiante', 1),
      ('doc-005', 'Fotos Tipo Carnet', '4 fotografías tipo carnet recientes', 1),
      ('doc-006', 'Boletín del Año Anterior', 'Calificaciones del año escolar anterior (si aplica)', 0);

      -- Grados
      INSERT INTO grados (id_grado, nombre, nivel_educativo, seccion, turno, capacidad_maxima) VALUES
      ('grado-001', 'Maternal', 'Inicial', 'A', 'Mañana', 15), ('grado-002', 'Maternal', 'Inicial', 'B', 'Tarde', 15),
      ('grado-003', 'Preescolar', 'Inicial', 'A', 'Mañana', 20), ('grado-004', 'Preescolar', 'Inicial', 'B', 'Tarde', 20),
      ('grado-005', '1er Grado', 'Primaria', 'A', 'Mañana', 25), ('grado-006', '1er Grado', 'Primaria', 'B', 'Mañana', 25),
      ('grado-007', '1er Grado', 'Primaria', 'C', 'Tarde', 25), ('grado-008', '2do Grado', 'Primaria', 'A', 'Mañana', 25),
      ('grado-009', '2do Grado', 'Primaria', 'B', 'Mañana', 25), ('grado-010', '2do Grado', 'Primaria', 'C', 'Tarde', 25),
      ('grado-011', '3er Grado', 'Primaria', 'A', 'Mañana', 25), ('grado-012', '3er Grado', 'Primaria', 'B', 'Mañana', 25),
      ('grado-013', '3er Grado', 'Primaria', 'C', 'Tarde', 25), ('grado-014', '4to Grado', 'Primaria', 'A', 'Mañana', 25),
      ('grado-015', '4to Grado', 'Primaria', 'B', 'Tarde', 25), ('grado-016', '5to Grado', 'Primaria', 'A', 'Mañana', 25),
      ('grado-017', '5to Grado', 'Primaria', 'B', 'Tarde', 25), ('grado-018', '6to Grado', 'Primaria', 'A', 'Mañana', 25),
      ('grado-019', '6to Grado', 'Primaria', 'B', 'Tarde', 25), ('grado-020', '1er Año', 'Media', 'A', 'Mañana', 30),
      ('grado-021', '1er Año', 'Media', 'B', 'Tarde', 30), ('grado-022', '2do Año', 'Media', 'A', 'Mañana', 30),
      ('grado-023', '2do Año', 'Media', 'B', 'Tarde', 30), ('grado-024', '3er Año', 'Media', 'A', 'Mañana', 30),
      ('grado-025', '3er Año', 'Media', 'B', 'Tarde', 30), ('grado-026', '4to Año', 'Media', 'A', 'Mañana', 30),
      ('grado-027', '4to Año', 'Media', 'B', 'Tarde', 30), ('grado-028', '5to Año', 'Media', 'A', 'Mañana', 30),
      ('grado-029', '5to Año', 'Media', 'B', 'Tarde', 30);

      -- Docentes
      INSERT INTO docentes (id_docente, nombres, apellidos, cedula, especialidad, telefono, correo_institucional) VALUES
      ('docente-001', 'María Elena', 'González Pérez', '12345678', 'Educación Inicial', '0414-1234567', 'mgonzalez@escuela.edu'),
      ('docente-002', 'Carlos Alberto', 'Rodríguez Silva', '23456789', 'Matemáticas', '0424-2345678', 'crodriguez@escuela.edu'),
      ('docente-003', 'Ana Sofía', 'Martínez López', '34567890', 'Lengua y Literatura', '0412-3456789', 'amartinez@escuela.edu'),
      ('docente-004', 'José Miguel', 'Hernández Castro', '45678901', 'Ciencias Naturales', '0416-4567890', 'jhernandez@escuela.edu'),
      ('docente-005', 'Luisa Fernanda', 'Torres Morales', '56789012', 'Ciencias Sociales', '0426-5678901', 'ltorres@escuela.edu');

      -- Representantes
      INSERT INTO representantes (id_representante, nombres, apellidos, cedula, telefono, correo_electronico, direccion, parentesco, ocupacion) VALUES
      ('rep-001', 'Pedro José', 'Ramírez Díaz', '11111111', '0414-1111111', 'pedro.ramirez@email.com', 'Av. Principal, Casa #123, Caracas', 'Padre', 'Ingeniero'),
      ('rep-002', 'Carmen Rosa', 'Vásquez Moreno', '22222222', '0424-2222222', 'carmen.vasquez@email.com', 'Calle Los Rosales, Qta. Bella Vista, Maracay', 'Madre', 'Doctora'),
      ('rep-003', 'Miguel Ángel', 'Fernández Ruiz', '33333333', '0412-3333333', 'miguel.fernandez@email.com', 'Urb. Los Jardines, Casa 45, Valencia', 'Padre', 'Abogado');

      -- Estudiantes
      INSERT INTO estudiantes (id_estudiante, nombres, apellidos, fecha_nacimiento, genero, nacionalidad, id_representante) VALUES
      ('est-001', 'Juan Carlos', 'Ramírez Vásquez', '2015-03-15', 'Masculino', 'Venezolana', 'rep-001'),
      ('est-002', 'María Alejandra', 'Vásquez Fernández', '2014-07-22', 'Femenino', 'Venezolana', 'rep-002'),
      ('est-003', 'Diego Andrés', 'Fernández Castillo', '2013-11-08', 'Masculino', 'Venezolana', 'rep-003');

      -- Matrículas
      INSERT INTO matriculas (id_matricula, id_estudiante, id_grado, ano_escolar, estatus) VALUES
      ('mat-001', 'est-001', 'grado-011', '2024', 'inscrito'),
      ('mat-002', 'est-002', 'grado-014', '2024', 'inscrito'),
      ('mat-003', 'est-003', 'grado-016', '2024', 'inscrito');
    `);
    console.log("✅ Datos de ejemplo para el resto de tablas han sido insertados.");

    // --- 3. RESUMEN FINAL ---
    console.log("\n📊 RESUMEN DE LA BASE DE DATOS:");
    const tables = ["usuarios", "representantes", "docentes", "estudiantes", "grados", "matriculas"];
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