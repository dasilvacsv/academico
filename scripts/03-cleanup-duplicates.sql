-- Script para limpiar duplicados y verificar integridad de datos

-- Verificar duplicados en grados
SELECT nivel_educativo, seccion, turno, COUNT(*) as duplicados
FROM grados 
GROUP BY nivel_educativo, seccion, turno 
HAVING COUNT(*) > 1;

-- Verificar duplicados en representantes
SELECT cedula, COUNT(*) as duplicados
FROM representantes 
GROUP BY cedula 
HAVING COUNT(*) > 1;

-- Verificar duplicados en docentes
SELECT cedula, COUNT(*) as duplicados
FROM docentes 
GROUP BY cedula 
HAVING COUNT(*) > 1;

-- Verificar duplicados en usuarios
SELECT email, COUNT(*) as duplicados
FROM usuarios 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Si hay duplicados, este script los eliminará manteniendo solo el más reciente
-- SOLO EJECUTAR SI HAY DUPLICADOS CONFIRMADOS

-- DELETE FROM grados 
-- WHERE id_grado NOT IN (
--     SELECT MIN(id_grado) 
--     FROM grados 
--     GROUP BY nivel_educativo, seccion, turno
-- );

-- DELETE FROM representantes 
-- WHERE id_representante NOT IN (
--     SELECT MIN(id_representante) 
--     FROM representantes 
--     GROUP BY cedula
-- );

-- DELETE FROM docentes 
-- WHERE id_docente NOT IN (
--     SELECT MIN(id_docente) 
--     FROM docentes 
--     GROUP BY cedula
-- );

-- DELETE FROM usuarios 
-- WHERE id NOT IN (
--     SELECT MIN(id) 
--     FROM usuarios 
--     GROUP BY email
-- );
