-- Script completo para eliminar y recrear todo el sistema desde cero

-- =====================================================
-- PASO 1: ELIMINAR TODAS LAS TABLAS EXISTENTES
-- =====================================================

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

-- Eliminar funciones si existen
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =====================================================
-- PASO 2: CREAR EXTENSIONES NECESARIAS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PASO 3: CREAR TODAS LAS TABLAS
-- =====================================================

-- Tabla de Representantes
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

-- Tabla de Grados
CREATE TABLE grados (
    id_grado UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL,
    nivel_educativo VARCHAR(50) NOT NULL,
    seccion VARCHAR(10) NOT NULL,
    turno VARCHAR(20) NOT NULL,
    capacidad_maxima INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(nivel_educativo, seccion, turno)
);

-- Tabla de Docentes
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

-- Tabla de Estudiantes
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

-- Tabla de Matrículas
CREATE TABLE matriculas (
    id_matricula UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_estudiante UUID REFERENCES estudiantes(id_estudiante),
    id_grado UUID REFERENCES grados(id_grado),
    ano_escolar VARCHAR(10) NOT NULL,
    fecha_matricula DATE NOT NULL DEFAULT CURRENT_DATE,
    estatus VARCHAR(20) NOT NULL DEFAULT 'pre-inscrito',
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(id_estudiante, ano_escolar)
);

-- Tabla de Historial Académico
CREATE TABLE historial_academico (
    id_historial UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_estudiante UUID REFERENCES estudiantes(id_estudiante),
    ano_escolar VARCHAR(10) NOT NULL,
    promedio DECIMAL(4,2),
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Documentos Requeridos
CREATE TABLE documentos_requeridos (
    id_documento UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    obligatorio BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Pagos
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

-- Tabla de relación Grado-Docente (Titular)
CREATE TABLE grado_docente (
    id_grado UUID REFERENCES grados(id_grado),
    id_docente UUID REFERENCES docentes(id_docente),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id_grado, id_docente)
);

-- Tabla de usuarios para autenticación
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

-- =====================================================
-- PASO 4: CREAR ÍNDICES
-- =====================================================

CREATE INDEX idx_estudiantes_representante ON estudiantes(id_representante);
CREATE INDEX idx_matriculas_estudiante ON matriculas(id_estudiante);
CREATE INDEX idx_matriculas_grado ON matriculas(id_grado);
CREATE INDEX idx_matriculas_ano_estatus ON matriculas(ano_escolar, estatus);
CREATE INDEX idx_historial_estudiante ON historial_academico(id_estudiante);
CREATE INDEX idx_pagos_matricula ON pagos(id_matricula);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_representantes_cedula ON representantes(cedula);
CREATE INDEX idx_docentes_cedula ON docentes(cedula);

-- =====================================================
-- PASO 5: CREAR FUNCIONES Y TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_representantes_updated_at BEFORE UPDATE ON representantes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_estudiantes_updated_at BEFORE UPDATE ON estudiantes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_docentes_updated_at BEFORE UPDATE ON docentes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grados_updated_at BEFORE UPDATE ON grados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matriculas_updated_at BEFORE UPDATE ON matriculas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PASO 6: INSERTAR DATOS DE EJEMPLO
-- =====================================================

-- Insertar usuario administrador
INSERT INTO usuarios (email, password_hash, rol, nombre_completo) VALUES
('admin@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador', 'Administrador del Sistema');

-- Insertar documentos requeridos
INSERT INTO documentos_requeridos (nombre, descripcion, obligatorio) VALUES
('Partida de Nacimiento', 'Copia certificada de la partida de nacimiento del estudiante', true),
('Cédula del Representante', 'Copia de la cédula de identidad del representante legal', true),
('Constancia de Residencia', 'Documento que certifique la dirección de residencia', true),
('Certificado Médico', 'Certificado médico actualizado del estudiante', true),
('Fotos Tipo Carnet', '4 fotografías tipo carnet recientes', true),
('Boletín del Año Anterior', 'Calificaciones del año escolar anterior (si aplica)', false);

-- Insertar grados
INSERT INTO grados (nombre, nivel_educativo, seccion, turno, capacidad_maxima) VALUES
-- Educación Inicial
('Maternal', 'Inicial', 'A', 'Mañana', 15),
('Maternal', 'Inicial', 'B', 'Tarde', 15),
('Preescolar', 'Inicial', 'A', 'Mañana', 20),
('Preescolar', 'Inicial', 'B', 'Tarde', 20),
-- Educación Primaria
('1er Grado', 'Primaria', 'A', 'Mañana', 25),
('1er Grado', 'Primaria', 'B', 'Mañana', 25),
('1er Grado', 'Primaria', 'C', 'Tarde', 25),
('2do Grado', 'Primaria', 'A', 'Mañana', 25),
('2do Grado', 'Primaria', 'B', 'Mañana', 25),
('2do Grado', 'Primaria', 'C', 'Tarde', 25),
('3er Grado', 'Primaria', 'A', 'Mañana', 25),
('3er Grado', 'Primaria', 'B', 'Mañana', 25),
('3er Grado', 'Primaria', 'C', 'Tarde', 25),
('4to Grado', 'Primaria', 'A', 'Mañana', 25),
('4to Grado', 'Primaria', 'B', 'Tarde', 25),
('5to Grado', 'Primaria', 'A', 'Mañana', 25),
('5to Grado', 'Primaria', 'B', 'Tarde', 25),
('6to Grado', 'Primaria', 'A', 'Mañana', 25),
('6to Grado', 'Primaria', 'B', 'Tarde', 25),
-- Educación Media
('1er Año', 'Media', 'A', 'Mañana', 30),
('1er Año', 'Media', 'B', 'Tarde', 30),
('2do Año', 'Media', 'A', 'Mañana', 30),
('2do Año', 'Media', 'B', 'Tarde', 30),
('3er Año', 'Media', 'A', 'Mañana', 30),
('3er Año', 'Media', 'B', 'Tarde', 30),
('4to Año', 'Media', 'A', 'Mañana', 30),
('4to Año', 'Media', 'B', 'Tarde', 30),
('5to Año', 'Media', 'A', 'Mañana', 30),
('5to Año', 'Media', 'B', 'Tarde', 30);

-- Insertar docentes
INSERT INTO docentes (nombres, apellidos, cedula, especialidad, telefono, correo_institucional) VALUES
('María Elena', 'González Pérez', '12345678', 'Educación Inicial', '0414-1234567', 'mgonzalez@escuela.edu'),
('Carlos Alberto', 'Rodríguez Silva', '23456789', 'Matemáticas', '0424-2345678', 'crodriguez@escuela.edu'),
('Ana Sofía', 'Martínez López', '34567890', 'Lengua y Literatura', '0412-3456789', 'amartinez@escuela.edu'),
('José Miguel', 'Hernández Castro', '45678901', 'Ciencias Naturales', '0416-4567890', 'jhernandez@escuela.edu'),
('Luisa Fernanda', 'Torres Morales', '56789012', 'Ciencias Sociales', '0426-5678901', 'ltorres@escuela.edu');

-- Insertar usuarios para docentes
INSERT INTO usuarios (email, password_hash, rol, nombre_completo) VALUES
('mgonzalez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'María Elena González Pérez'),
('crodriguez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'Carlos Alberto Rodríguez Silva'),
('amartinez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'Ana Sofía Martínez López'),
('jhernandez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'José Miguel Hernández Castro'),
('ltorres@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'Luisa Fernanda Torres Morales');

-- Insertar representantes
INSERT INTO representantes (nombres, apellidos, cedula, telefono, correo_electronico, direccion, parentesco, ocupacion) VALUES
('Pedro José', 'Ramírez Díaz', '11111111', '0414-1111111', 'pedro.ramirez@email.com', 'Av. Principal, Casa #123, Caracas', 'Padre', 'Ingeniero'),
('Carmen Rosa', 'Vásquez Moreno', '22222222', '0424-2222222', 'carmen.vasquez@email.com', 'Calle Los Rosales, Qta. Bella Vista, Maracay', 'Madre', 'Doctora'),
('Miguel Ángel', 'Fernández Ruiz', '33333333', '0412-3333333', 'miguel.fernandez@email.com', 'Urb. Los Jardines, Casa 45, Valencia', 'Padre', 'Abogado'),
('Rosa María', 'Castillo Herrera', '44444444', '0416-4444444', 'rosa.castillo@email.com', 'Sector El Paraíso, Manzana 12, Casa 8', 'Madre', 'Profesora'),
('Antonio Carlos', 'Mendoza Jiménez', '55555555', '0426-5555555', 'antonio.mendoza@email.com', 'Av. Bolívar, Edif. San Rafael, Apto 3-B', 'Padre', 'Comerciante');

-- Insertar estudiantes
INSERT INTO estudiantes (nombres, apellidos, fecha_nacimiento, genero, nacionalidad, estado_nacimiento, direccion, telefono_contacto, correo_electronico, condicion_especial, id_representante) VALUES
('Juan Carlos', 'Ramírez Vásquez', '2015-03-15', 'Masculino', 'Venezolana', 'Distrito Capital', 'Av. Principal, Casa #123, Caracas', '0414-1111111', NULL, NULL, (SELECT id_representante FROM representantes WHERE cedula = '11111111')),
('María Alejandra', 'Vásquez Fernández', '2014-07-22', 'Femenino', 'Venezolana', 'Aragua', 'Calle Los Rosales, Qta. Bella Vista, Maracay', '0424-2222222', NULL, NULL, (SELECT id_representante FROM representantes WHERE cedula = '22222222')),
('Diego Andrés', 'Fernández Castillo', '2013-11-08', 'Masculino', 'Venezolana', 'Carabobo', 'Urb. Los Jardines, Casa 45, Valencia', '0412-3333333', NULL, NULL, (SELECT id_representante FROM representantes WHERE cedula = '33333333')),
('Sofía Isabel', 'Castillo Mendoza', '2016-01-30', 'Femenino', 'Venezolana', 'Miranda', 'Sector El Paraíso, Manzana 12, Casa 8', '0416-4444444', NULL, NULL, (SELECT id_representante FROM representantes WHERE cedula = '44444444')),
('Sebastián José', 'Mendoza Ramírez', '2012-09-12', 'Masculino', 'Venezolana', 'Distrito Capital', 'Av. Bolívar, Edif. San Rafael, Apto 3-B', '0426-5555555', NULL, NULL, (SELECT id_representante FROM representantes WHERE cedula = '55555555'));

-- Insertar matrículas
INSERT INTO matriculas (id_estudiante, id_grado, ano_escolar, fecha_matricula, estatus, observaciones) VALUES
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Juan Carlos'), (SELECT id_grado FROM grados WHERE nombre = '3er Grado' AND seccion = 'A' AND turno = 'Mañana'), '2024', CURRENT_DATE, 'inscrito', 'Matrícula regular'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'María Alejandra'), (SELECT id_grado FROM grados WHERE nombre = '4to Grado' AND seccion = 'A' AND turno = 'Mañana'), '2024', CURRENT_DATE, 'inscrito', 'Matrícula regular'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Diego Andrés'), (SELECT id_grado FROM grados WHERE nombre = '5to Grado' AND seccion = 'A' AND turno = 'Mañana'), '2024', CURRENT_DATE, 'inscrito', 'Matrícula regular'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Sofía Isabel'), (SELECT id_grado FROM grados WHERE nombre = '2do Grado' AND seccion = 'A' AND turno = 'Mañana'), '2024', CURRENT_DATE, 'inscrito', 'Matrícula regular'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Sebastián José'), (SELECT id_grado FROM grados WHERE nombre = '6to Grado' AND seccion = 'A' AND turno = 'Mañana'), '2024', CURRENT_DATE, 'inscrito', 'Matrícula regular');

-- Asignar docentes a grados
INSERT INTO grado_docente (id_grado, id_docente) VALUES
((SELECT id_grado FROM grados WHERE nombre = '1er Grado' AND seccion = 'A' AND turno = 'Mañana'), (SELECT id_docente FROM docentes WHERE nombres = 'María Elena')),
((SELECT id_grado FROM grados WHERE nombre = '2do Grado' AND seccion = 'A' AND turno = 'Mañana'), (SELECT id_docente FROM docentes WHERE nombres = 'Ana Sofía')),
((SELECT id_grado FROM grados WHERE nombre = '3er Grado' AND seccion = 'A' AND turno = 'Mañana'), (SELECT id_docente FROM docentes WHERE nombres = 'Carlos Alberto')),
((SELECT id_grado FROM grados WHERE nombre = '4to Grado' AND seccion = 'A' AND turno = 'Mañana'), (SELECT id_docente FROM docentes WHERE nombres = 'José Miguel')),
((SELECT id_grado FROM grados WHERE nombre = '5to Grado' AND seccion = 'A' AND turno = 'Mañana'), (SELECT id_docente FROM docentes WHERE nombres = 'Luisa Fernanda'));

-- Insertar pagos
INSERT INTO pagos (id_matricula, concepto, monto, fecha, metodo_pago, estatus) VALUES
((SELECT id_matricula FROM matriculas m JOIN estudiantes e ON m.id_estudiante = e.id_estudiante WHERE e.nombres = 'Juan Carlos'), 'Matrícula Anual', 500.00, CURRENT_DATE, 'Transferencia', 'pagado'),
((SELECT id_matricula FROM matriculas m JOIN estudiantes e ON m.id_estudiante = e.id_estudiante WHERE e.nombres = 'María Alejandra'), 'Matrícula Anual', 500.00, CURRENT_DATE, 'Efectivo', 'pagado'),
((SELECT id_matricula FROM matriculas m JOIN estudiantes e ON m.id_estudiante = e.id_estudiante WHERE e.nombres = 'Diego Andrés'), 'Matrícula Anual', 500.00, CURRENT_DATE, 'Transferencia', 'pagado'),
((SELECT id_matricula FROM matriculas m JOIN estudiantes e ON m.id_estudiante = e.id_estudiante WHERE e.nombres = 'Sofía Isabel'), 'Mensualidad Octubre', 150.00, CURRENT_DATE, 'Efectivo', 'pendiente'),
((SELECT id_matricula FROM matriculas m JOIN estudiantes e ON m.id_estudiante = e.id_estudiante WHERE e.nombres = 'Sebastián José'), 'Mensualidad Octubre', 150.00, CURRENT_DATE, 'Transferencia', 'pendiente');

-- Insertar historial académico
INSERT INTO historial_academico (id_estudiante, ano_escolar, promedio, observaciones) VALUES
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Juan Carlos'), '2023', 18.50, 'Excelente rendimiento académico'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'María Alejandra'), '2023', 17.80, 'Muy buen desempeño'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Diego Andrés'), '2023', 19.20, 'Estudiante destacado'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Sebastián José'), '2023', 16.90, 'Buen rendimiento general');

-- =====================================================
-- PASO 7: VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar resumen de datos insertados
SELECT 'RESUMEN DE DATOS INSERTADOS:' as mensaje;

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

SELECT '✅ SISTEMA COMPLETAMENTE CONFIGURADO Y LISTO PARA USAR' as estado;
SELECT '📧 Usuario: admin@escuela.edu' as credenciales;
SELECT '🔑 Contraseña: password123' as password;
