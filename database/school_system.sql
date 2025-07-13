-- =====================================================
-- Sistema de información para el  registro de matrícula escolar - BASE DE DATOS COMPLETA
-- Archivo SQL para SQLite - Base de datos local
-- =====================================================

-- Habilitar claves foráneas en SQLite
PRAGMA foreign_keys = ON;

-- =====================================================
-- CREAR TODAS LAS TABLAS
-- =====================================================

-- Tabla de usuarios para autenticación
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

-- =====================================================
-- CREAR ÍNDICES PARA OPTIMIZAR RENDIMIENTO
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_estudiantes_representante ON estudiantes(id_representante);
CREATE INDEX IF NOT EXISTS idx_matriculas_estudiante ON matriculas(id_estudiante);
CREATE INDEX IF NOT EXISTS idx_matriculas_grado ON matriculas(id_grado);
CREATE INDEX IF NOT EXISTS idx_matriculas_ano_estatus ON matriculas(ano_escolar, estatus);
CREATE INDEX IF NOT EXISTS idx_historial_estudiante ON historial_academico(id_estudiante);
CREATE INDEX IF NOT EXISTS idx_pagos_matricula ON pagos(id_matricula);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_representantes_cedula ON representantes(cedula);
CREATE INDEX IF NOT EXISTS idx_docentes_cedula ON docentes(cedula);

-- =====================================================
-- CREAR TRIGGERS PARA ACTUALIZAR TIMESTAMPS
-- =====================================================

-- Trigger para usuarios
CREATE TRIGGER IF NOT EXISTS update_usuarios_timestamp 
    AFTER UPDATE ON usuarios
BEGIN
    UPDATE usuarios SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para representantes
CREATE TRIGGER IF NOT EXISTS update_representantes_timestamp 
    AFTER UPDATE ON representantes
BEGIN
    UPDATE representantes SET updated_at = CURRENT_TIMESTAMP WHERE id_representante = NEW.id_representante;
END;

-- Trigger para docentes
CREATE TRIGGER IF NOT EXISTS update_docentes_timestamp 
    AFTER UPDATE ON docentes
BEGIN
    UPDATE docentes SET updated_at = CURRENT_TIMESTAMP WHERE id_docente = NEW.id_docente;
END;

-- Trigger para estudiantes
CREATE TRIGGER IF NOT EXISTS update_estudiantes_timestamp 
    AFTER UPDATE ON estudiantes
BEGIN
    UPDATE estudiantes SET updated_at = CURRENT_TIMESTAMP WHERE id_estudiante = NEW.id_estudiante;
END;

-- Trigger para grados
CREATE TRIGGER IF NOT EXISTS update_grados_timestamp 
    AFTER UPDATE ON grados
BEGIN
    UPDATE grados SET updated_at = CURRENT_TIMESTAMP WHERE id_grado = NEW.id_grado;
END;

-- Trigger para matrículas
CREATE TRIGGER IF NOT EXISTS update_matriculas_timestamp 
    AFTER UPDATE ON matriculas
BEGIN
    UPDATE matriculas SET updated_at = CURRENT_TIMESTAMP WHERE id_matricula = NEW.id_matricula;
END;

-- =====================================================
-- INSERTAR DATOS DE EJEMPLO
-- =====================================================

-- Usuario administrador
INSERT OR REPLACE INTO usuarios (id, email, password_hash, rol, nombre_completo) VALUES
('admin-001', 'admin@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador', 'Administrador del Sistema');

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
-- Educación Inicial
('grado-001', 'Maternal', 'Inicial', 'A', 'Mañana', 15),
('grado-002', 'Maternal', 'Inicial', 'B', 'Tarde', 15),
('grado-003', 'Preescolar', 'Inicial', 'A', 'Mañana', 20),
('grado-004', 'Preescolar', 'Inicial', 'B', 'Tarde', 20),
-- Educación Primaria
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
-- Educación Media
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

-- Usuarios para docentes
INSERT OR REPLACE INTO usuarios (id, email, password_hash, rol, nombre_completo) VALUES
('user-001', 'mgonzalez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'María Elena González Pérez'),
('user-002', 'crodriguez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'Carlos Alberto Rodríguez Silva'),
('user-003', 'amartinez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'Ana Sofía Martínez López'),
('user-004', 'jhernandez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'José Miguel Hernández Castro'),
('user-005', 'ltorres@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'Luisa Fernanda Torres Morales');

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

-- =====================================================
-- VISTAS ÚTILES PARA CONSULTAS
-- =====================================================

-- Vista de estudiantes con representantes
CREATE VIEW IF NOT EXISTS vista_estudiantes_completa AS
SELECT 
    e.id_estudiante,
    e.nombres || ' ' || e.apellidos as nombre_completo_estudiante,
    e.fecha_nacimiento,
    e.genero,
    e.nacionalidad,
    e.telefono_contacto,
    r.nombres || ' ' || r.apellidos as nombre_completo_representante,
    r.telefono as telefono_representante,
    r.parentesco,
    r.ocupacion,
    m.ano_escolar,
    m.estatus as estatus_matricula,
    g.nivel_educativo,
    g.nombre as grado,
    g.seccion,
    g.turno
FROM estudiantes e
LEFT JOIN representantes r ON e.id_representante = r.id_representante
LEFT JOIN matriculas m ON e.id_estudiante = m.id_estudiante
LEFT JOIN grados g ON m.id_grado = g.id_grado;

-- Vista de docentes con grados asignados
CREATE VIEW IF NOT EXISTS vista_docentes_grados AS
SELECT 
    d.id_docente,
    d.nombres || ' ' || d.apellidos as nombre_completo,
    d.especialidad,
    d.telefono,
    d.correo_institucional,
    g.nivel_educativo,
    g.nombre as grado,
    g.seccion,
    g.turno,
    g.capacidad_maxima
FROM docentes d
LEFT JOIN grado_docente gd ON d.id_docente = gd.id_docente
LEFT JOIN grados g ON gd.id_grado = g.id_grado;

-- Vista de matrículas con detalles
CREATE VIEW IF NOT EXISTS vista_matriculas_detalle AS
SELECT 
    m.id_matricula,
    e.nombres || ' ' || e.apellidos as nombre_estudiante,
    g.nivel_educativo,
    g.nombre as grado,
    g.seccion,
    g.turno,
    m.ano_escolar,
    m.fecha_matricula,
    m.estatus,
    r.nombres || ' ' || r.apellidos as nombre_representante,
    r.telefono as telefono_representante
FROM matriculas m
JOIN estudiantes e ON m.id_estudiante = e.id_estudiante
JOIN grados g ON m.id_grado = g.id_grado
JOIN representantes r ON e.id_representante = r.id_representante;

-- =====================================================
-- CONSULTAS DE VERIFICACIÓN
-- =====================================================

-- Mostrar resumen de datos
SELECT 'RESUMEN DE LA BASE DE DATOS:' as info;

SELECT 'Usuarios' as tabla, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'Representantes' as tabla, COUNT(*) as total FROM representantes
UNION ALL
SELECT 'Docentes' as tabla, COUNT(*) as total FROM docentes
UNION ALL
SELECT 'Estudiantes' as tabla, COUNT(*) as total FROM estudiantes
UNION ALL
SELECT 'Grados' as tabla, COUNT(*) as total FROM grados
UNION ALL
SELECT 'Matrículas' as tabla, COUNT(*) as total FROM matriculas
UNION ALL
SELECT 'Pagos' as tabla, COUNT(*) as total FROM pagos
UNION ALL
SELECT 'Historial Académico' as tabla, COUNT(*) as total FROM historial_academico
UNION ALL
SELECT 'Documentos Requeridos' as tabla, COUNT(*) as total FROM documentos_requeridos
UNION ALL
SELECT 'Asignaciones Docente-Grado' as tabla, COUNT(*) as total FROM grado_docente;

-- Mostrar credenciales de acceso
SELECT '✅ BASE DE DATOS SQLITE CREADA EXITOSAMENTE' as estado;
SELECT '📧 Email: admin@escuela.edu' as credenciales;
SELECT '🔑 Password: password123' as password;
SELECT '📁 Archivo: database/school_system.db' as ubicacion;
