-- Crear extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_estudiantes_representante ON estudiantes(id_representante);
CREATE INDEX IF NOT EXISTS idx_matriculas_estudiante ON matriculas(id_estudiante);
CREATE INDEX IF NOT EXISTS idx_matriculas_grado ON matriculas(id_grado);
CREATE INDEX IF NOT EXISTS idx_matriculas_ano_estatus ON matriculas(ano_escolar, estatus);
CREATE INDEX IF NOT EXISTS idx_historial_estudiante ON historial_academico(id_estudiante);
CREATE INDEX IF NOT EXISTS idx_pagos_matricula ON pagos(id_matricula);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_representantes_cedula ON representantes(cedula);
CREATE INDEX IF NOT EXISTS idx_docentes_cedula ON docentes(cedula);

-- Crear funciones para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar automáticamente updated_at
CREATE TRIGGER update_representantes_updated_at BEFORE UPDATE ON representantes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_estudiantes_updated_at BEFORE UPDATE ON estudiantes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_docentes_updated_at BEFORE UPDATE ON docentes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grados_updated_at BEFORE UPDATE ON grados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matriculas_updated_at BEFORE UPDATE ON matriculas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
