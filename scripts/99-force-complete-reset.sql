-- Script de reseteo forzado - Elimina ABSOLUTAMENTE TODO y recrea desde cero

-- =====================================================
-- PASO 1: DESCONECTAR TODAS LAS SESIONES Y FORZAR LIMPIEZA
-- =====================================================

-- Terminar todas las transacciones activas
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid();

-- Deshabilitar todas las restricciones temporalmente
SET session_replication_role = replica;

-- =====================================================
-- PASO 2: ELIMINAR TODO FORZADAMENTE
-- =====================================================

-- Eliminar todas las vistas que puedan existir
DROP VIEW IF EXISTS vista_estudiantes CASCADE;
DROP VIEW IF EXISTS vista_matriculas CASCADE;

-- Eliminar todas las secuencias
DROP SEQUENCE IF EXISTS representantes_id_seq CASCADE;
DROP SEQUENCE IF EXISTS docentes_id_seq CASCADE;
DROP SEQUENCE IF EXISTS estudiantes_id_seq CASCADE;
DROP SEQUENCE IF EXISTS grados_id_seq CASCADE;
DROP SEQUENCE IF EXISTS matriculas_id_seq CASCADE;
DROP SEQUENCE IF EXISTS usuarios_id_seq CASCADE;
DROP SEQUENCE IF EXISTS pagos_id_seq CASCADE;
DROP SEQUENCE IF EXISTS historial_id_seq CASCADE;
DROP SEQUENCE IF EXISTS documentos_id_seq CASCADE;

-- Eliminar todos los triggers
DROP TRIGGER IF EXISTS update_representantes_updated_at ON representantes CASCADE;
DROP TRIGGER IF EXISTS update_estudiantes_updated_at ON estudiantes CASCADE;
DROP TRIGGER IF EXISTS update_docentes_updated_at ON docentes CASCADE;
DROP TRIGGER IF EXISTS update_grados_updated_at ON grados CASCADE;
DROP TRIGGER IF EXISTS update_matriculas_updated_at ON matriculas CASCADE;
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios CASCADE;

-- Eliminar todas las funciones
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Eliminar todas las tablas en cualquier orden
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS historial_academico CASCADE;
DROP TABLE IF EXISTS grado_docente CASCADE;
DROP TABLE IF EXISTS matriculas CASCADE;
DROP TABLE IF EXISTS estudiantes CASCADE;
DROP TABLE IF EXISTS representantes CASCADE;
DROP TABLE IF EXISTS docentes CASCADE;
DROP TABLE IF EXISTS grados CASCADE;
DROP TABLE IF EXISTS documentos_requeridos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Eliminar tipos personalizados si existen
DROP TYPE IF EXISTS rol_usuario CASCADE;
DROP TYPE IF EXISTS estatus_matricula CASCADE;
DROP TYPE IF EXISTS genero_tipo CASCADE;

-- Limpiar cualquier resto en el esquema
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Eliminar cualquier tabla restante
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    
    -- Eliminar cualquier secuencia restante
    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') 
    LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;
END $$;

-- Rehabilitar restricciones
SET session_replication_role = DEFAULT;

-- =====================================================
-- PASO 3: CREAR EXTENSIONES
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PASO 4: CREAR TODAS LAS TABLAS DESDE CERO
-- =====================================================

-- Tabla de usuarios (primero, sin dependencias)
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'docente',
    nombre_completo VARCHAR(200) NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de representantes
CREATE TABLE representantes (
    id_representante UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    correo_electronico VARCHAR(100),
    direccion TEXT,
    parentesco VARCHAR(50),
    ocupacion VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de docentes
CREATE TABLE docentes (
    id_docente UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    especialidad VARCHAR(100),
    telefono VARCHAR(20),
    correo_institucional VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de grados (SIN restricción única problemática)
CREATE TABLE grados (
    id_grado UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL,
    nivel_educativo VARCHAR(50) NOT NULL,
    seccion VARCHAR(10) NOT NULL,
    turno VARCHAR(20) NOT NULL,
    capacidad_maxima INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de estudiantes
CREATE TABLE estudiantes (
    id_estudiante UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero VARCHAR(10) NOT NULL,
    nacionalidad VARCHAR(50) NOT NULL,
    estado_nacimiento VARCHAR(50),
    direccion TEXT,
    telefono_contacto VARCHAR(20),
    correo_electronico VARCHAR(100),
    condicion_especial TEXT,
    id_representante UUID REFERENCES representantes(id_representante),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de matrículas
CREATE TABLE matriculas (
    id_matricula UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_estudiante UUID REFERENCES estudiantes(id_estudiante),
    id_grado UUID REFERENCES grados(id_grado),
    ano_escolar VARCHAR(10) NOT NULL,
    fecha_matricula DATE NOT NULL DEFAULT CURRENT_DATE,
    estatus VARCHAR(20) NOT NULL DEFAULT 'pre-inscrito',
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de historial académico
CREATE TABLE historial_academico (
    id_historial UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_estudiante UUID REFERENCES estudiantes(id_estudiante),
    ano_escolar VARCHAR(10) NOT NULL,
    promedio DECIMAL(4,2),
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de documentos requeridos
CREATE TABLE documentos_requeridos (
    id_documento UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    obligatorio BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE pagos (
    id_pago UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_matricula UUID REFERENCES matriculas(id_matricula),
    concepto VARCHAR(100) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    metodo_pago VARCHAR(50),
    estatus VARCHAR(20) DEFAULT 'pendiente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de relación grado-docente
CREATE TABLE grado_docente (
    id_grado UUID REFERENCES grados(id_grado),
    id_docente UUID REFERENCES docentes(id_docente),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id_grado, id_docente)
);

-- =====================================================
-- PASO 5: INSERTAR DATOS BÁSICOS
-- =====================================================

-- Usuario administrador
INSERT INTO usuarios (email, password_hash, rol, nombre_completo) VALUES
('admin@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador', 'Administrador del Sistema');

-- Documentos requeridos
INSERT INTO documentos_requeridos (nombre, descripcion, obligatorio) VALUES
('Partida de Nacimiento', 'Copia certificada de la partida de nacimiento', true),
('Cédula del Representante', 'Copia de la cédula de identidad del representante', true),
('Certificado Médico', 'Certificado médico actualizado del estudiante', true);

-- Grados básicos (sin duplicados)
INSERT INTO grados (nombre, nivel_educativo, seccion, turno, capacidad_maxima) VALUES
('1er Grado', 'Primaria', 'A', 'Mañana', 25),
('1er Grado', 'Primaria', 'B', 'Mañana', 25),
('2do Grado', 'Primaria', 'A', 'Mañana', 25),
('2do Grado', 'Primaria', 'B', 'Mañana', 25),
('3er Grado', 'Primaria', 'A', 'Mañana', 25),
('3er Grado', 'Primaria', 'B', 'Mañana', 25),
('4to Grado', 'Primaria', 'A', 'Mañana', 25),
('4to Grado', 'Primaria', 'B', 'Mañana', 25),
('5to Grado', 'Primaria', 'A', 'Mañana', 25),
('5to Grado', 'Primaria', 'B', 'Mañana', 25),
('6to Grado', 'Primaria', 'A', 'Mañana', 25),
('6to Grado', 'Primaria', 'B', 'Mañana', 25);

-- Docentes
INSERT INTO docentes (nombres, apellidos, cedula, especialidad, telefono, correo_institucional) VALUES
('María Elena', 'González Pérez', '12345678', 'Educación Primaria', '0414-1234567', 'mgonzalez@escuela.edu'),
('Carlos Alberto', 'Rodríguez Silva', '23456789', 'Matemáticas', '0424-2345678', 'crodriguez@escuela.edu'),
('Ana Sofía', 'Martínez López', '34567890', 'Lengua y Literatura', '0412-3456789', 'amartinez@escuela.edu');

-- Usuarios para docentes
INSERT INTO usuarios (email, password_hash, rol, nombre_completo) VALUES
('mgonzalez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'María Elena González Pérez'),
('crodriguez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'Carlos Alberto Rodríguez Silva'),
('amartinez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'Ana Sofía Martínez López');

-- Representantes
INSERT INTO representantes (nombres, apellidos, cedula, telefono, correo_electronico, direccion, parentesco, ocupacion) VALUES
('Pedro José', 'Ramírez Díaz', '11111111', '0414-1111111', 'pedro.ramirez@email.com', 'Av. Principal, Casa #123', 'Padre', 'Ingeniero'),
('Carmen Rosa', 'Vásquez Moreno', '22222222', '0424-2222222', 'carmen.vasquez@email.com', 'Calle Los Rosales, Qta. Bella Vista', 'Madre', 'Doctora'),
('Miguel Ángel', 'Fernández Ruiz', '33333333', '0412-3333333', 'miguel.fernandez@email.com', 'Urb. Los Jardines, Casa 45', 'Padre', 'Abogado');

-- Estudiantes
INSERT INTO estudiantes (nombres, apellidos, fecha_nacimiento, genero, nacionalidad, estado_nacimiento, direccion, telefono_contacto, id_representante) VALUES
('Juan Carlos', 'Ramírez Vásquez', '2015-03-15', 'Masculino', 'Venezolana', 'Distrito Capital', 'Av. Principal, Casa #123', '0414-1111111', (SELECT id_representante FROM representantes WHERE cedula = '11111111')),
('María Alejandra', 'Vásquez Fernández', '2014-07-22', 'Femenino', 'Venezolana', 'Aragua', 'Calle Los Rosales, Qta. Bella Vista', '0424-2222222', (SELECT id_representante FROM representantes WHERE cedula = '22222222')),
('Diego Andrés', 'Fernández Castillo', '2013-11-08', 'Masculino', 'Venezolana', 'Carabobo', 'Urb. Los Jardines, Casa 45', '0412-3333333', (SELECT id_representante FROM representantes WHERE cedula = '33333333'));

-- Matrículas
INSERT INTO matriculas (id_estudiante, id_grado, ano_escolar, fecha_matricula, estatus, observaciones) VALUES
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Juan Carlos'), (SELECT id_grado FROM grados WHERE nombre = '3er Grado' AND seccion = 'A' LIMIT 1), '2024', CURRENT_DATE, 'inscrito', 'Matrícula regular'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'María Alejandra'), (SELECT id_grado FROM grados WHERE nombre = '4to Grado' AND seccion = 'A' LIMIT 1), '2024', CURRENT_DATE, 'inscrito', 'Matrícula regular'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Diego Andrés'), (SELECT id_grado FROM grados WHERE nombre = '5to Grado' AND seccion = 'A' LIMIT 1), '2024', CURRENT_DATE, 'inscrito', 'Matrícula regular');

-- Asignaciones docente-grado
INSERT INTO grado_docente (id_grado, id_docente) VALUES
((SELECT id_grado FROM grados WHERE nombre = '1er Grado' AND seccion = 'A' LIMIT 1), (SELECT id_docente FROM docentes WHERE nombres = 'María Elena')),
((SELECT id_grado FROM grados WHERE nombre = '2do Grado' AND seccion = 'A' LIMIT 1), (SELECT id_docente FROM docentes WHERE nombres = 'Carlos Alberto')),
((SELECT id_grado FROM grados WHERE nombre = '3er Grado' AND seccion = 'A' LIMIT 1), (SELECT id_docente FROM docentes WHERE nombres = 'Ana Sofía'));

-- Pagos
INSERT INTO pagos (id_matricula, concepto, monto, fecha, metodo_pago, estatus) VALUES
((SELECT id_matricula FROM matriculas m JOIN estudiantes e ON m.id_estudiante = e.id_estudiante WHERE e.nombres = 'Juan Carlos'), 'Matrícula Anual', 500.00, CURRENT_DATE, 'Transferencia', 'pagado'),
((SELECT id_matricula FROM matriculas m JOIN estudiantes e ON m.id_estudiante = e.id_estudiante WHERE e.nombres = 'María Alejandra'), 'Mensualidad Octubre', 150.00, CURRENT_DATE, 'Efectivo', 'pendiente');

-- =====================================================
-- PASO 6: VERIFICACIÓN FINAL
-- =====================================================

SELECT '🎉 SISTEMA COMPLETAMENTE RESETADO Y CONFIGURADO' as estado;
SELECT '📊 RESUMEN DE DATOS:' as resumen;

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
SELECT 'Documentos' as tabla, COUNT(*) as total FROM documentos_requeridos
UNION ALL
SELECT 'Asignaciones' as tabla, COUNT(*) as total FROM grado_docente;

SELECT '✅ CREDENCIALES DE ACCESO:' as info;
SELECT '📧 Email: admin@escuela.edu' as email;
SELECT '🔑 Password: password123' as password;
