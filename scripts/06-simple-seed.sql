-- Script alternativo más simple

-- Limpiar solo si hay datos
DO $$
BEGIN
    -- Verificar si hay datos y limpiar si es necesario
    IF EXISTS (SELECT 1 FROM grados LIMIT 1) THEN
        DELETE FROM pagos;
        DELETE FROM historial_academico;
        DELETE FROM grado_docente;
        DELETE FROM matriculas;
        DELETE FROM estudiantes;
        DELETE FROM representantes;
        DELETE FROM docentes;
        DELETE FROM grados;
        DELETE FROM documentos_requeridos;
        DELETE FROM usuarios;
    END IF;
END $$;

-- Insertar datos básicos
INSERT INTO usuarios (email, password_hash, rol, nombre_completo) VALUES
('admin@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador', 'Administrador del Sistema');

INSERT INTO grados (nombre, nivel_educativo, seccion, turno, capacidad_maxima) VALUES
('1er Grado', 'Primaria', 'A', 'Mañana', 25),
('2do Grado', 'Primaria', 'A', 'Mañana', 25),
('3er Grado', 'Primaria', 'A', 'Mañana', 25);

INSERT INTO docentes (nombres, apellidos, cedula, especialidad, telefono, correo_institucional) VALUES
('María Elena', 'González Pérez', '12345678', 'Educación Inicial', '0414-1234567', 'mgonzalez@escuela.edu');

INSERT INTO usuarios (email, password_hash, rol, nombre_completo) VALUES
('mgonzalez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'María Elena González Pérez');

INSERT INTO representantes (nombres, apellidos, cedula, telefono, correo_electronico, direccion, parentesco, ocupacion) VALUES
('Pedro José', 'Ramírez Díaz', '11111111', '0414-1111111', 'pedro.ramirez@email.com', 'Av. Principal, Casa #123, Caracas', 'Padre', 'Ingeniero');

INSERT INTO estudiantes (nombres, apellidos, fecha_nacimiento, genero, nacionalidad, estado_nacimiento, direccion, telefono_contacto, id_representante) VALUES
('Juan Carlos', 'Ramírez Vásquez', '2015-03-15', 'Masculino', 'Venezolana', 'Distrito Capital', 'Av. Principal, Casa #123, Caracas', '0414-1111111', (SELECT id_representante FROM representantes WHERE cedula = '11111111'));

INSERT INTO matriculas (id_estudiante, id_grado, ano_escolar, fecha_matricula, estatus, observaciones) VALUES
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Juan Carlos'), (SELECT id_grado FROM grados WHERE nombre = '1er Grado' AND seccion = 'A'), '2024', CURRENT_DATE, 'inscrito', 'Matrícula regular');

SELECT 'Datos básicos insertados correctamente' as resultado;
