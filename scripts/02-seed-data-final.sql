-- Limpiar datos existentes si es necesario (en orden correcto por dependencias)
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

-- Insertar documentos requeridos básicos
INSERT INTO documentos_requeridos (nombre, descripcion, obligatorio) VALUES
('Partida de Nacimiento', 'Copia certificada de la partida de nacimiento del estudiante', true),
('Cédula del Representante', 'Copia de la cédula de identidad del representante legal', true),
('Constancia de Residencia', 'Documento que certifique la dirección de residencia', true),
('Certificado Médico', 'Certificado médico actualizado del estudiante', true),
('Fotos Tipo Carnet', '4 fotografías tipo carnet recientes', true),
('Boletín del Año Anterior', 'Calificaciones del año escolar anterior (si aplica)', false);

-- Insertar grados básicos
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

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (email, password_hash, rol, nombre_completo) VALUES
('admin@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador', 'Administrador del Sistema');

-- Insertar algunos docentes de ejemplo
INSERT INTO docentes (nombres, apellidos, cedula, especialidad, telefono, correo_institucional) VALUES
('María Elena', 'González Pérez', '12345678', 'Educación Inicial', '0414-1234567', 'mgonzalez@escuela.edu'),
('Carlos Alberto', 'Rodríguez Silva', '23456789', 'Matemáticas', '0424-2345678', 'crodriguez@escuela.edu'),
('Ana Sofía', 'Martínez López', '34567890', 'Lengua y Literatura', '0412-3456789', 'amartinez@escuela.edu'),
('José Miguel', 'Hernández Castro', '45678901', 'Ciencias Naturales', '0416-4567890', 'jhernandez@escuela.edu'),
('Luisa Fernanda', 'Torres Morales', '56789012', 'Ciencias Sociales', '0426-5678901', 'ltorres@escuela.edu');

-- Crear usuarios para los docentes
INSERT INTO usuarios (email, password_hash, rol, nombre_completo) VALUES
('mgonzalez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'María Elena González Pérez'),
('crodriguez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'Carlos Alberto Rodríguez Silva'),
('amartinez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'Ana Sofía Martínez López'),
('jhernandez@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'José Miguel Hernández Castro'),
('ltorres@escuela.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'docente', 'Luisa Fernanda Torres Morales');

-- Insertar algunos representantes de ejemplo
INSERT INTO representantes (nombres, apellidos, cedula, telefono, correo_electronico, direccion, parentesco, ocupacion) VALUES
('Pedro José', 'Ramírez Díaz', '11111111', '0414-1111111', 'pedro.ramirez@email.com', 'Av. Principal, Casa #123, Caracas', 'Padre', 'Ingeniero'),
('Carmen Rosa', 'Vásquez Moreno', '22222222', '0424-2222222', 'carmen.vasquez@email.com', 'Calle Los Rosales, Qta. Bella Vista, Maracay', 'Madre', 'Doctora'),
('Miguel Ángel', 'Fernández Ruiz', '33333333', '0412-3333333', 'miguel.fernandez@email.com', 'Urb. Los Jardines, Casa 45, Valencia', 'Padre', 'Abogado'),
('Rosa María', 'Castillo Herrera', '44444444', '0416-4444444', 'rosa.castillo@email.com', 'Sector El Paraíso, Manzana 12, Casa 8', 'Madre', 'Profesora'),
('Antonio Carlos', 'Mendoza Jiménez', '55555555', '0426-5555555', 'antonio.mendoza@email.com', 'Av. Bolívar, Edif. San Rafael, Apto 3-B', 'Padre', 'Comerciante');

-- Insertar algunos estudiantes de ejemplo (usando subqueries para obtener los IDs)
INSERT INTO estudiantes (nombres, apellidos, fecha_nacimiento, genero, nacionalidad, estado_nacimiento, direccion, telefono_contacto, correo_electronico, condicion_especial, id_representante) VALUES
('Juan Carlos', 'Ramírez Vásquez', '2015-03-15', 'Masculino', 'Venezolana', 'Distrito Capital', 'Av. Principal, Casa #123, Caracas', '0414-1111111', NULL, NULL, (SELECT id_representante FROM representantes WHERE cedula = '11111111')),
('María Alejandra', 'Vásquez Fernández', '2014-07-22', 'Femenino', 'Venezolana', 'Aragua', 'Calle Los Rosales, Qta. Bella Vista, Maracay', '0424-2222222', NULL, NULL, (SELECT id_representante FROM representantes WHERE cedula = '22222222')),
('Diego Andrés', 'Fernández Castillo', '2013-11-08', 'Masculino', 'Venezolana', 'Carabobo', 'Urb. Los Jardines, Casa 45, Valencia', '0412-3333333', NULL, NULL, (SELECT id_representante FROM representantes WHERE cedula = '33333333')),
('Sofía Isabel', 'Castillo Mendoza', '2016-01-30', 'Femenino', 'Venezolana', 'Miranda', 'Sector El Paraíso, Manzana 12, Casa 8', '0416-4444444', NULL, NULL, (SELECT id_representante FROM representantes WHERE cedula = '44444444')),
('Sebastián José', 'Mendoza Ramírez', '2012-09-12', 'Masculino', 'Venezolana', 'Distrito Capital', 'Av. Bolívar, Edif. San Rafael, Apto 3-B', '0426-5555555', NULL, NULL, (SELECT id_representante FROM representantes WHERE cedula = '55555555'));

-- Crear matrículas para los estudiantes de ejemplo
INSERT INTO matriculas (id_estudiante, id_grado, ano_escolar, fecha_matricula, estatus, observaciones) VALUES
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Juan Carlos'), (SELECT id_grado FROM grados WHERE nombre = '3er Grado' AND seccion = 'A' AND turno = 'Mañana'), '2024', CURRENT_DATE, 'inscrito', 'Matrícula regular'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'María Alejandra'), (SELECT id_grado FROM grados WHERE nombre = '4to Grado' AND seccion = 'A' AND turno = 'Mañana'), '2024', CURRENT_DATE, 'inscrito', 'Matrícula regular'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Diego Andrés'), (SELECT id_grado FROM grados WHERE nombre = '5to Grado' AND seccion = 'A' AND turno = 'Mañana'), '2024', CURRENT_DATE, 'inscrito', 'Matrícula regular'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Sofía Isabel'), (SELECT id_grado FROM grados WHERE nombre = '2do Grado' AND seccion = 'A' AND turno = 'Mañana'), '2024', CURRENT_DATE, 'inscrito', 'Matrícula regular'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Sebastián José'), (SELECT id_grado FROM grados WHERE nombre = '6to Grado' AND seccion = 'A' AND turno = 'Mañana'), '2024', CURRENT_DATE, 'inscrito', 'Matrícula regular');

-- Asignar algunos docentes a grados
INSERT INTO grado_docente (id_grado, id_docente) VALUES
((SELECT id_grado FROM grados WHERE nombre = '1er Grado' AND seccion = 'A' AND turno = 'Mañana'), (SELECT id_docente FROM docentes WHERE nombres = 'María Elena')),
((SELECT id_grado FROM grados WHERE nombre = '2do Grado' AND seccion = 'A' AND turno = 'Mañana'), (SELECT id_docente FROM docentes WHERE nombres = 'Ana Sofía')),
((SELECT id_grado FROM grados WHERE nombre = '3er Grado' AND seccion = 'A' AND turno = 'Mañana'), (SELECT id_docente FROM docentes WHERE nombres = 'Carlos Alberto')),
((SELECT id_grado FROM grados WHERE nombre = '4to Grado' AND seccion = 'A' AND turno = 'Mañana'), (SELECT id_docente FROM docentes WHERE nombres = 'José Miguel')),
((SELECT id_grado FROM grados WHERE nombre = '5to Grado' AND seccion = 'A' AND turno = 'Mañana'), (SELECT id_docente FROM docentes WHERE nombres = 'Luisa Fernanda'));

-- Crear algunos pagos de ejemplo
INSERT INTO pagos (id_matricula, concepto, monto, fecha, metodo_pago, estatus) VALUES
((SELECT id_matricula FROM matriculas m JOIN estudiantes e ON m.id_estudiante = e.id_estudiante WHERE e.nombres = 'Juan Carlos'), 'Matrícula Anual', 500.00, CURRENT_DATE, 'Transferencia', 'pagado'),
((SELECT id_matricula FROM matriculas m JOIN estudiantes e ON m.id_estudiante = e.id_estudiante WHERE e.nombres = 'María Alejandra'), 'Matrícula Anual', 500.00, CURRENT_DATE, 'Efectivo', 'pagado'),
((SELECT id_matricula FROM matriculas m JOIN estudiantes e ON m.id_estudiante = e.id_estudiante WHERE e.nombres = 'Diego Andrés'), 'Matrícula Anual', 500.00, CURRENT_DATE, 'Transferencia', 'pagado'),
((SELECT id_matricula FROM matriculas m JOIN estudiantes e ON m.id_estudiante = e.id_estudiante WHERE e.nombres = 'Sofía Isabel'), 'Mensualidad Octubre', 150.00, CURRENT_DATE, 'Efectivo', 'pendiente'),
((SELECT id_matricula FROM matriculas m JOIN estudiantes e ON m.id_estudiante = e.id_estudiante WHERE e.nombres = 'Sebastián José'), 'Mensualidad Octubre', 150.00, CURRENT_DATE, 'Transferencia', 'pendiente');

-- Crear algunos registros de historial académico
INSERT INTO historial_academico (id_estudiante, ano_escolar, promedio, observaciones) VALUES
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Juan Carlos'), '2023', 18.50, 'Excelente rendimiento académico'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'María Alejandra'), '2023', 17.80, 'Muy buen desempeño'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Diego Andrés'), '2023', 19.20, 'Estudiante destacado'),
((SELECT id_estudiante FROM estudiantes WHERE nombres = 'Sebastián José'), '2023', 16.90, 'Buen rendimiento general');
