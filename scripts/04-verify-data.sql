-- Script para verificar que los datos se insertaron correctamente

-- Contar registros en cada tabla
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
SELECT 'Usuarios' as tabla, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'Pagos' as tabla, COUNT(*) as total FROM pagos
UNION ALL
SELECT 'Historial Académico' as tabla, COUNT(*) as total FROM historial_academico
UNION ALL
SELECT 'Documentos Requeridos' as tabla, COUNT(*) as total FROM documentos_requeridos
UNION ALL
SELECT 'Asignaciones Docente-Grado' as tabla, COUNT(*) as total FROM grado_docente;

-- Verificar estudiantes con sus representantes
SELECT 
    e.nombres || ' ' || e.apellidos as estudiante,
    r.nombres || ' ' || r.apellidos as representante,
    r.parentesco,
    m.estatus as estatus_matricula
FROM estudiantes e
JOIN representantes r ON e.id_representante = r.id_representante
LEFT JOIN matriculas m ON e.id_estudiante = m.id_estudiante AND m.ano_escolar = '2024';

-- Verificar grados con docentes asignados
SELECT 
    g.nivel_educativo,
    g.nombre,
    g.seccion,
    g.turno,
    d.nombres || ' ' || d.apellidos as docente_titular,
    d.especialidad
FROM grados g
LEFT JOIN grado_docente gd ON g.id_grado = gd.id_grado
LEFT JOIN docentes d ON gd.id_docente = d.id_docente
ORDER BY g.nivel_educativo, g.nombre, g.seccion;

-- Verificar usuarios del sistema
SELECT 
    email,
    rol,
    nombre_completo,
    activo
FROM usuarios
ORDER BY rol, nombre_completo;
