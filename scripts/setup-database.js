const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

// Trata de obtener el 'app' de Electron. Si no está disponible, significa que se está ejecutando en un entorno de desarrollo normal.
let app;
try {
  app = require("electron").app;
} catch (error) {
  app = null;
}

// Determina la ruta de la base de datos.
// Si 'app' existe (entorno Electron), usa la carpeta de datos del usuario.
// De lo contrario (entorno de desarrollo), crea una carpeta 'database' en el proyecto.
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

// Crear todas las tablas y datos directamente en el script
try {
  // Crear tablas
  db.exec(`
    -- Tabla de usuarios
    CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        rol TEXT NOT NULL DEFAULT 'docente',
        nombre_completo TEXT NOT NULL,
        activo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

  console.log("✅ Tablas creadas exitosamente");

  // Insertar datos de ejemplo
  db.exec(`
    -- Usuario administrador (contraseña: password123)
    INSERT OR REPLACE INTO usuarios (id, email, password_hash, rol, nombre_completo) VALUES
    ('admin-001', 'admin@escuela.edu', 'password123', 'administrador', 'Administrador del Sistema');

    -- Usuarios para docentes (contraseña: password123)
    INSERT OR REPLACE INTO usuarios (id, email, password_hash, rol, nombre_completo) VALUES
    ('user-001', 'mgonzalez@escuela.edu', 'password123', 'docente', 'María Elena González Pérez'),
    ('user-002', 'crodriguez@escuela.edu', 'password123', 'docente', 'Carlos Alberto Rodríguez Silva'),
    ('user-003', 'amartinez@escuela.edu', 'password123', 'docente', 'Ana Sofía Martínez López'),
    ('user-004', 'jhernandez@escuela.edu', 'password123', 'docente', 'José Miguel Hernández Castro'),
    ('user-005', 'ltorres@escuela.edu', 'password123', 'docente', 'Luisa Fernanda Torres Morales');

    -- Documentos requeridos
    INSERT OR REPLACE INTO documentos_requeridos (id_documento, nombre, descripcion, obligatorio) VALUES
    ('doc-001', 'Partida de Nacimiento', 'Copia certificada de la partida de nacimiento del estudiante', 1),
    ('doc-002', 'Cédula del Representante', 'Copia de la cédula de identidad del representante legal', 1),
    ('doc-003', 'Constancia de Residencia', 'Documento que certifique la dirección de residencia', 1),
    ('doc-004', 'Certificado Médico', 'Certificado médico actualizado del estudiante', 1),
    ('doc-005', 'Fotos Tipo Carnet', '4 fotografías tipo carnet recientes', 1),
    ('doc-006', 'Boletín del Año Anterior', 'Calificaciones del año escolar anterior (si aplica)', 0);

    -- Grados
    INSERT OR REPLACE INTO grados (id_grado, nombre, nivel_educativo, seccion, turno, capacidad_maxima) VALUES
    ('grado-001', 'Maternal', 'Inicial', 'A', 'Mañana', 15),
    ('grado-002', 'Maternal', 'Inicial', 'B', 'Tarde', 15),
    ('grado-003', 'Preescolar', 'Inicial', 'A', 'Mañana', 20),
    ('grado-004', 'Preescolar', 'Inicial', 'B', 'Tarde', 20),
    ('grado-005', '1er Grado', 'Primaria', 'A', 'Mañana', 25),
    ('grado-006', '1er Grado', 'Primaria', 'B', 'Mañana', 25),
    ('grado-007', '1er Grado', 'Primaria', 'C', 'Tarde', 25),
    ('grado-008', '2do Grado', 'Primaria', 'A', 'Mañana', 25),
    ('grado-009', '2do Grado', 'Primaria', 'B', 'Mañana', 25),
    ('grado-010', '2do Grado', 'Primaria', 'C', 'Tarde', 25),
    ('grado-011', '3er Grado', 'Primaria', 'A', 'Mañana', 25),
    ('grado-012', '3er Grado', 'Primaria', 'B', 'Mañana', 25),
    ('grado-013', '3er Grado', 'Primaria', 'C', 'Tarde', 25),
    ('grado-014', '4to Grado', 'Primaria', 'A', 'Mañana', 25),
    ('grado-015', '4to Grado', 'Primaria', 'B', 'Tarde', 25),
    ('grado-016', '5to Grado', 'Primaria', 'A', 'Mañana', 25),
    ('grado-017', '5to Grado', 'Primaria', 'B', 'Tarde', 25),
    ('grado-018', '6to Grado', 'Primaria', 'A', 'Mañana', 25),
    ('grado-019', '6to Grado', 'Primaria', 'B', 'Tarde', 25),
    ('grado-020', '1er Año', 'Media', 'A', 'Mañana', 30),
    ('grado-021', '1er Año', 'Media', 'B', 'Tarde', 30),
    ('grado-022', '2do Año', 'Media', 'A', 'Mañana', 30),
    ('grado-023', '2do Año', 'Media', 'B', 'Tarde', 30),
    ('grado-024', '3er Año', 'Media', 'A', 'Mañana', 30),
    ('grado-025', '3er Año', 'Media', 'B', 'Tarde', 30),
    ('grado-026', '4to Año', 'Media', 'A', 'Mañana', 30),
    ('grado-027', '4to Año', 'Media', 'B', 'Tarde', 30),
    ('grado-028', '5to Año', 'Media', 'A', 'Mañana', 30),
    ('grado-029', '5to Año', 'Media', 'B', 'Tarde', 30);

    -- Docentes
    INSERT OR REPLACE INTO docentes (id_docente, nombres, apellidos, cedula, especialidad, telefono, correo_institucional) VALUES
    ('docente-001', 'María Elena', 'González Pérez', '12345678', 'Educación Inicial', '0414-1234567', 'mgonzalez@escuela.edu'),
    ('docente-002', 'Carlos Alberto', 'Rodríguez Silva', '23456789', 'Matemáticas', '0424-2345678', 'crodriguez@escuela.edu'),
    ('docente-003', 'Ana Sofía', 'Martínez López', '34567890', 'Lengua y Literatura', '0412-3456789', 'amartinez@escuela.edu'),
    ('docente-004', 'José Miguel', 'Hernández Castro', '45678901', 'Ciencias Naturales', '0416-4567890', 'jhernandez@escuela.edu'),
    ('docente-005', 'Luisa Fernanda', 'Torres Morales', '56789012', 'Ciencias Sociales', '0426-5678901', 'ltorres@escuela.edu');

    -- Representantes
    INSERT OR REPLACE INTO representantes (id_representante, nombres, apellidos, cedula, telefono, correo_electronico, direccion, parentesco, ocupacion) VALUES
    ('rep-001', 'Pedro José', 'Ramírez Díaz', '11111111', '0414-1111111', 'pedro.ramirez@email.com', 'Av. Principal, Casa #123, Caracas', 'Padre', 'Ingeniero'),
    ('rep-002', 'Carmen Rosa', 'Vásquez Moreno', '22222222', '0424-2222222', 'carmen.vasquez@email.com', 'Calle Los Rosales, Qta. Bella Vista, Maracay', 'Madre', 'Doctora'),
    ('rep-003', 'Miguel Ángel', 'Fernández Ruiz', '33333333', '0412-3333333', 'miguel.fernandez@email.com', 'Urb. Los Jardines, Casa 45, Valencia', 'Padre', 'Abogado'),
    ('rep-004', 'Rosa María', 'Castillo Herrera', '44444444', '0416-4444444', 'rosa.castillo@email.com', 'Sector El Paraíso, Manzana 12, Casa 8', 'Madre', 'Profesora'),
    ('rep-005', 'Antonio Carlos', 'Mendoza Jiménez', '55555555', '0426-5555555', 'antonio.mendoza@email.com', 'Av. Bolívar, Edif. San Rafael, Apto 3-B', 'Padre', 'Comerciante');

    -- Estudiantes
    INSERT OR REPLACE INTO estudiantes (id_estudiante, nombres, apellidos, fecha_nacimiento, genero, nacionalidad, estado_nacimiento, direccion, telefono_contacto, correo_electronico, condicion_especial, id_representante) VALUES
    ('est-001', 'Juan Carlos', 'Ramírez Vásquez', '2015-03-15', 'Masculino', 'Venezolana', 'Distrito Capital', 'Av. Principal, Casa #123, Caracas', '0414-1111111', NULL, NULL, 'rep-001'),
    ('est-002', 'María Alejandra', 'Vásquez Fernández', '2014-07-22', 'Femenino', 'Venezolana', 'Aragua', 'Calle Los Rosales, Qta. Bella Vista, Maracay', '0424-2222222', NULL, NULL, 'rep-002'),
    ('est-003', 'Diego Andrés', 'Fernández Castillo', '2013-11-08', 'Masculino', 'Venezolana', 'Carabobo', 'Urb. Los Jardines, Casa 45, Valencia', '0412-3333333', NULL, NULL, 'rep-003'),
    ('est-004', 'Sofía Isabel', 'Castillo Mendoza', '2016-01-30', 'Femenino', 'Venezolana', 'Miranda', 'Sector El Paraíso, Manzana 12, Casa 8', '0416-4444444', NULL, NULL, 'rep-004'),
    ('est-005', 'Sebastián José', 'Mendoza Ramírez', '2012-09-12', 'Masculino', 'Venezolana', 'Distrito Capital', 'Av. Bolívar, Edif. San Rafael, Apto 3-B', '0426-5555555', NULL, NULL, 'rep-005');

    -- Matrículas
    INSERT OR REPLACE INTO matriculas (id_matricula, id_estudiante, id_grado, ano_escolar, fecha_matricula, estatus, observaciones) VALUES
    ('mat-001', 'est-001', 'grado-011', '2024', '2024-01-15', 'inscrito', 'Matrícula regular'),
    ('mat-002', 'est-002', 'grado-014', '2024', '2024-01-16', 'inscrito', 'Matrícula regular'),
    ('mat-003', 'est-003', 'grado-016', '2024', '2024-01-17', 'inscrito', 'Matrícula regular'),
    ('mat-004', 'est-004', 'grado-008', '2024', '2024-01-18', 'inscrito', 'Matrícula regular'),
    ('mat-005', 'est-005', 'grado-018', '2024', '2024-01-19', 'inscrito', 'Matrícula regular');

    -- Asignaciones docente-grado
    INSERT OR REPLACE INTO grado_docente (id_grado, id_docente) VALUES
    ('grado-005', 'docente-001'),
    ('grado-008', 'docente-003'),
    ('grado-011', 'docente-002'),
    ('grado-014', 'docente-004'),
    ('grado-016', 'docente-005');

    -- Pagos
    INSERT OR REPLACE INTO pagos (id_pago, id_matricula, concepto, monto, fecha, metodo_pago, estatus) VALUES
    ('pago-001', 'mat-001', 'Matrícula Anual', 500.00, '2024-01-15', 'Transferencia', 'pagado'),
    ('pago-002', 'mat-002', 'Matrícula Anual', 500.00, '2024-01-16', 'Efectivo', 'pagado'),
    ('pago-003', 'mat-003', 'Matrícula Anual', 500.00, '2024-01-17', 'Transferencia', 'pagado'),
    ('pago-004', 'mat-004', 'Mensualidad Octubre', 150.00, '2024-10-01', 'Efectivo', 'pendiente'),
    ('pago-005', 'mat-005', 'Mensualidad Octubre', 150.00, '2024-10-01', 'Transferencia', 'pendiente');

    -- Historial académico
    INSERT OR REPLACE INTO historial_academico (id_historial, id_estudiante, ano_escolar, promedio, observaciones) VALUES
    ('hist-001', 'est-001', '2023', 18.50, 'Excelente rendimiento académico'),
    ('hist-002', 'est-002', '2023', 17.80, 'Muy buen desempeño'),
    ('hist-003', 'est-003', '2023', 19.20, 'Estudiante destacado'),
    ('hist-004', 'est-005', '2023', 16.90, 'Buen rendimiento general');
  `);

  console.log("✅ Datos de ejemplo insertados exitosamente");

  // Mostrar resumen
  const tables = [
    "usuarios",
    "representantes",
    "docentes",
    "estudiantes",
    "grados",
    "matriculas",
    "pagos",
    "historial_academico",
    "documentos_requeridos",
    "grado_docente",
  ];

  console.log("\n📊 RESUMEN DE LA BASE DE DATOS:");
  tables.forEach((table) => {
    const result = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
    console.log(`${table}: ${result.count} registros`);
  });

  console.log("\n🎉 BASE DE DATOS SQLITE CREADA EXITOSAMENTE");
  console.log("📁 Ubicación:", dbPath);
  console.log("📧 Usuario: admin@escuela.edu");
  console.log("🔑 Contraseña: password123");
} catch (error) {
  console.error("❌ Error creando la base de datos:", error.message);
} finally {
  db.close();
}