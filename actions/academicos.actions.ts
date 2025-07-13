"use server"

import getDbConnection from "@/lib/database" // <-- 1. Importa la función
const db = getDbConnection(); // <-- 2. Llama a la función UNA VEZ para obtener la conexión
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function asignarCupo(idEstudiante: string, idGrado: string) {
  await requireRole(["administrador", "director"]);

  try {
    // Verificar capacidad del grado
    const gradoStmt = db.prepare("SELECT capacidad_maxima FROM grados WHERE id_grado = ?");
    const grado = gradoStmt.get(idGrado) as any;

    if (!grado) {
      return { error: "Grado no encontrado" };
    }

    // Contar estudiantes ya asignados
    const countStmt = db.prepare("SELECT COUNT(*) as count FROM matriculas WHERE id_grado = ? AND estatus = 'inscrito'");
    const countResult = countStmt.get(idGrado) as any;
    const count = countResult ? countResult.count : 0;

    if (count >= grado.capacidad_maxima) {
      return { error: "El grado ha alcanzado su capacidad máxima" };
    }

    // Actualizar matrícula
    const anoEscolar = new Date().getFullYear().toString();
    const updateStmt = db.prepare(`
      UPDATE matriculas SET 
        id_grado = ?, estatus = 'inscrito', fecha_matricula = date('now')
      WHERE id_estudiante = ? AND ano_escolar = ?
    `);
    updateStmt.run(idGrado, idEstudiante, anoEscolar);

    revalidatePath("/dashboard/cupos");
    revalidatePath("/dashboard/grados");
    return { success: "Cupo asignado exitosamente" };
  } catch (error: any) {
    console.error("Error asignando cupo:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}

export async function desasignarEstudianteDeGrado(idEstudiante: string) {
  await requireRole(["administrador", "director"]);

  try {
    const anoEscolar = new Date().getFullYear().toString();
    
    const stmt = db.prepare(`
      UPDATE matriculas SET 
        estatus = 'pre-inscrito', id_grado = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id_estudiante = ? AND ano_escolar = ?
    `);
    stmt.run(idEstudiante, anoEscolar);

    revalidatePath("/dashboard/cupos");
    revalidatePath("/dashboard/grados");
    return { success: "Estudiante desasignado exitosamente" };
  } catch (error: any) {
    console.error("Error desasignando estudiante:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}

export async function asignarDocenteAGrado(idDocente: string, idGrado: string) {
  await requireRole(["administrador", "director"]);

  try {
    // Verificar si el grado ya tiene docente asignado
    const existingStmt = db.prepare("SELECT * FROM grado_docente WHERE id_grado = ?");
    const existing = existingStmt.all(idGrado) as any[];

    if (existing.length > 0) {
      // Actualizar asignación existente
      const updateStmt = db.prepare("UPDATE grado_docente SET id_docente = ? WHERE id_grado = ?");
      updateStmt.run(idDocente, idGrado);
    } else {
      // Crear nueva asignación
      const insertStmt = db.prepare("INSERT INTO grado_docente (id_docente, id_grado) VALUES (?, ?)");
      insertStmt.run(idDocente, idGrado);
    }

    revalidatePath("/dashboard/grados");
    revalidatePath("/dashboard/grados/asignaciones");
    return { success: "Docente asignado exitosamente" };
  } catch (error: any) {
    console.error("Error asignando docente:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}

export async function desasignarDocenteDeGrado(idGrado: string) {
  await requireRole(["administrador", "director"]);

  try {
    const stmt = db.prepare("DELETE FROM grado_docente WHERE id_grado = ?");
    stmt.run(idGrado);

    revalidatePath("/dashboard/grados");
    revalidatePath("/dashboard/grados/asignaciones");
    return { success: "Docente desasignado exitosamente" };
  } catch (error: any) {
    console.error("Error desasignando docente:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}

export async function crearGrado(formData: FormData) {
  await requireRole(["administrador", "director"]);

  const gradoData = {
    nombre: formData.get("nombre") as string,
    nivel_educativo: formData.get("nivel_educativo") as string,
    seccion: formData.get("seccion") as string,
    turno: formData.get("turno") as string,
    capacidad_maxima: parseInt(formData.get("capacidad_maxima") as string)
  };

  try {
    // Verificar si ya existe el grado con la misma sección
    const existingStmt = db.prepare(`
      SELECT id_grado FROM grados 
      WHERE nombre = ? AND seccion = ? AND nivel_educativo = ? AND turno = ?
    `);
    const existing = existingStmt.all(
      gradoData.nombre, 
      gradoData.seccion, 
      gradoData.nivel_educativo, 
      gradoData.turno
    ) as any[];

    if (existing.length > 0) {
      return { error: "Ya existe un grado con estos datos" };
    }

    const gradoId = `grado-${Date.now()}`;
    const insertStmt = db.prepare(`
      INSERT INTO grados (id_grado, nombre, nivel_educativo, seccion, turno, capacidad_maxima) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertStmt.run(
      gradoId, 
      gradoData.nombre, 
      gradoData.nivel_educativo, 
      gradoData.seccion, 
      gradoData.turno, 
      gradoData.capacidad_maxima
    );

    revalidatePath("/dashboard/grados");
    return { success: "Grado creado exitosamente" };
  } catch (error: any) {
    console.error("Error creando grado:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}

export async function actualizarGrado(idGrado: string, formData: FormData) {
  await requireRole(["administrador", "director"]);

  const gradoData = {
    nombre: formData.get("nombre") as string,
    nivel_educativo: formData.get("nivel_educativo") as string,
    seccion: formData.get("seccion") as string,
    turno: formData.get("turno") as string,
    capacidad_maxima: parseInt(formData.get("capacidad_maxima") as string)
  };

  try {
    const stmt = db.prepare(`
      UPDATE grados SET 
        nombre = ?, nivel_educativo = ?, seccion = ?, turno = ?, capacidad_maxima = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id_grado = ?
    `);
    stmt.run(
      gradoData.nombre, 
      gradoData.nivel_educativo, 
      gradoData.seccion, 
      gradoData.turno, 
      gradoData.capacidad_maxima, 
      idGrado
    );

    revalidatePath("/dashboard/grados");
    return { success: "Grado actualizado exitosamente" };
  } catch (error: any) {
    console.error("Error actualizando grado:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}

export async function eliminarGrado(idGrado: string) {
  await requireRole(["administrador", "director"]);

  try {
    // Verificar si hay estudiantes asignados
    const estudiantesStmt = db.prepare(`
      SELECT COUNT(*) as count 
      FROM matriculas 
      WHERE id_grado = ? AND estatus = 'inscrito'
    `);
    const countResult = estudiantesStmt.get(idGrado) as any;
    const count = countResult ? countResult.count : 0;
    
    if (count > 0) {
      return { error: "No se puede eliminar un grado que tiene estudiantes asignados" };
    }

    // Eliminar asignación de docente si existe
    const deleteDocenteStmt = db.prepare("DELETE FROM grado_docente WHERE id_grado = ?");
    deleteDocenteStmt.run(idGrado);
    
    // Eliminar el grado
    const deleteGradoStmt = db.prepare("DELETE FROM grados WHERE id_grado = ?");
    deleteGradoStmt.run(idGrado);

    revalidatePath("/dashboard/grados");
    return { success: "Grado eliminado exitosamente" };
  } catch (error: any) {
    console.error("Error eliminando grado:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}

export async function obtenerEstudiantesPorGrado(idGrado: string) {
  await requireRole(["administrador", "director", "docente"]);

  try {
    const anoEscolar = new Date().getFullYear().toString();
    
    const sql = `
      SELECT 
        e.*,
        r.nombres as rep_nombres,
        r.apellidos as rep_apellidos,
        r.telefono as rep_telefono,
        r.parentesco,
        m.fecha_matricula,
        m.estatus
      FROM estudiantes e
      JOIN matriculas m ON e.id_estudiante = m.id_estudiante
      LEFT JOIN representantes r ON e.id_representante = r.id_representante
      WHERE m.id_grado = ? AND m.ano_escolar = ? AND m.estatus = 'inscrito'
      ORDER BY e.apellidos, e.nombres
    `;

    const stmt = db.prepare(sql);
    const data = stmt.all(idGrado, anoEscolar) as any[];

    return data.map((row) => ({
      ...row,
      representante: {
        nombres: row.rep_nombres,
        apellidos: row.rep_apellidos,
        telefono: row.rep_telefono,
        parentesco: row.parentesco
      }
    }));
  } catch (error) {
    console.error("Error obteniendo estudiantes por grado:", error);
    return [];
  }
}

export async function obtenerEstudiantesPreInscritos() {
  await requireRole(["administrador", "director"]);

  const anoEscolar = new Date().getFullYear().toString();

  try {
    const sql = `
      SELECT 
        m.*,
        e.nombres || ' ' || e.apellidos as nombre_estudiante,
        e.fecha_nacimiento,
        r.nombres || ' ' || r.apellidos as nombre_representante,
        r.telefono as telefono_representante,
        g.nombre as grado_nombre,
        g.seccion,
        g.turno,
        g.nivel_educativo
      FROM matriculas m
      JOIN estudiantes e ON m.id_estudiante = e.id_estudiante
      JOIN representantes r ON e.id_representante = r.id_representante
      LEFT JOIN grados g ON m.id_grado = g.id_grado
      WHERE m.ano_escolar = ? AND m.estatus = 'pre-inscrito'
      ORDER BY m.created_at ASC
    `;

    const stmt = db.prepare(sql);
    const data = stmt.all(anoEscolar) as any[];

    return data.map((row) => ({
      ...row,
      estudiantes: {
        nombres: row.nombre_estudiante.split(" ")[0],
        apellidos: row.nombre_estudiante.split(" ").slice(1).join(" "),
        fecha_nacimiento: row.fecha_nacimiento,
      },
      grados: row.grado_nombre
        ? {
            nombre: row.grado_nombre,
            seccion: row.seccion,
            turno: row.turno,
            nivel_educativo: row.nivel_educativo,
          }
        : null,
    }));
  } catch (error) {
    console.error("Error obteniendo pre-inscritos:", error);
    return [];
  }
}

export async function obtenerGrados() {
  await requireRole(["administrador", "director", "docente"]);

  try {
    const anoEscolar = new Date().getFullYear().toString();
    
    const sql = `
      SELECT 
        g.*,
        d.id_docente,
        d.nombres as docente_nombres,
        d.apellidos as docente_apellidos,
        d.especialidad,
        COUNT(CASE WHEN m.estatus = 'inscrito' THEN 1 END) as estudiantes_actuales
      FROM grados g
      LEFT JOIN grado_docente gd ON g.id_grado = gd.id_grado
      LEFT JOIN docentes d ON gd.id_docente = d.id_docente
      LEFT JOIN matriculas m ON g.id_grado = m.id_grado AND m.ano_escolar = ?
      GROUP BY g.id_grado, d.id_docente
      ORDER BY 
        CASE g.nivel_educativo 
          WHEN 'Inicial' THEN 1 
          WHEN 'Primaria' THEN 2 
          WHEN 'Media' THEN 3 
        END,
        g.nombre, g.seccion
    `;

    const stmt = db.prepare(sql);
    const data = stmt.all(anoEscolar) as any[];

    // Transformar datos para compatibilidad
    const gradosMap = new Map();

    data.forEach((row) => {
      if (!gradosMap.has(row.id_grado)) {
        gradosMap.set(row.id_grado, {
          ...row,
          grado_docente: [],
        });
      }

      if (row.id_docente) {
        gradosMap.get(row.id_grado).grado_docente.push({
          docentes: {
            id_docente: row.id_docente,
            nombres: row.docente_nombres,
            apellidos: row.docente_apellidos,
            especialidad: row.especialidad,
          },
        });
      }
    });

    return Array.from(gradosMap.values());
  } catch (error) {
    console.error("Error obteniendo grados:", error);
    return [];
  }
}

export async function obtenerMetricasCompletas() {
  await requireRole(["administrador", "director"]);

  try {
    const anoEscolar = new Date().getFullYear().toString();

    // Métricas generales
    const totalEstudiantes = (db.prepare("SELECT COUNT(*) as count FROM estudiantes").get() as any).count;
    const totalDocentes = (db.prepare("SELECT COUNT(*) as count FROM docentes").get() as any).count;
    const totalGrados = (db.prepare("SELECT COUNT(*) as count FROM grados").get() as any).count;
    const totalRepresentantes = (db.prepare("SELECT COUNT(*) as count FROM representantes").get() as any).count;

    // Métricas de matrícula
    const matriculasActuales = (db.prepare("SELECT COUNT(*) as count FROM matriculas WHERE ano_escolar = ? AND estatus = 'inscrito'").get(anoEscolar) as any).count;
    const preInscritos = (db.prepare("SELECT COUNT(*) as count FROM matriculas WHERE ano_escolar = ? AND estatus = 'pre-inscrito'").get(anoEscolar) as any).count;

    // Distribución por género
    const distribucionGenero = db.prepare(`
      SELECT 
        genero,
        COUNT(*) as cantidad
      FROM estudiantes e
      JOIN matriculas m ON e.id_estudiante = m.id_estudiante
      WHERE m.ano_escolar = ? AND m.estatus = 'inscrito'
      GROUP BY genero
    `).all(anoEscolar) as any[];

    // Distribución por nivel educativo
    const distribucionNivel = db.prepare(`
      SELECT 
        g.nivel_educativo,
        COUNT(m.id_matricula) as estudiantes,
        COUNT(DISTINCT g.id_grado) as grados_disponibles,
        SUM(g.capacidad_maxima) as capacidad_total
      FROM grados g
      LEFT JOIN matriculas m ON g.id_grado = m.id_grado AND m.ano_escolar = ? AND m.estatus = 'inscrito'
      GROUP BY g.nivel_educativo
      ORDER BY 
        CASE g.nivel_educativo 
          WHEN 'Inicial' THEN 1 
          WHEN 'Primaria' THEN 2 
          WHEN 'Media' THEN 3 
        END
    `).all(anoEscolar) as any[];

    // Distribución por turno
    const distribucionTurno = db.prepare(`
      SELECT 
        g.turno,
        COUNT(m.id_matricula) as estudiantes,
        COUNT(DISTINCT g.id_grado) as grados
      FROM grados g
      LEFT JOIN matriculas m ON g.id_grado = m.id_grado AND m.ano_escolar = ? AND m.estatus = 'inscrito'
      GROUP BY g.turno
    `).all(anoEscolar) as any[];

    // Grados con mayor ocupación
    const gradosOcupacion = db.prepare(`
      SELECT 
        g.nivel_educativo || ' - ' || g.nombre || ' ' || g.seccion as grado_completo,
        g.capacidad_maxima,
        COUNT(m.id_matricula) as estudiantes_inscritos,
        ROUND((COUNT(m.id_matricula) * 100.0 / g.capacidad_maxima), 2) as porcentaje_ocupacion
      FROM grados g
      LEFT JOIN matriculas m ON g.id_grado = m.id_grado AND m.ano_escolar = ? AND m.estatus = 'inscrito'
      GROUP BY g.id_grado
      ORDER BY porcentaje_ocupacion DESC
      LIMIT 10
    `).all(anoEscolar) as any[];

    // Docentes por especialidad
    const docentesEspecialidad = db.prepare(`
      SELECT 
        especialidad,
        COUNT(*) as cantidad
      FROM docentes
      GROUP BY especialidad
      ORDER BY cantidad DESC
    `).all() as any[];

    // Asignaciones docente-grado
    const asignacionesDocentes = db.prepare(`
      SELECT 
        COUNT(CASE WHEN gd.id_docente IS NOT NULL THEN 1 END) as grados_con_docente,
        COUNT(g.id_grado) as total_grados
      FROM grados g
      LEFT JOIN grado_docente gd ON g.id_grado = gd.id_grado
    `).get() as any;

    // Pagos por mes (últimos 6 meses)
    const pagosPorMes = db.prepare(`
      SELECT 
        strftime('%Y-%m', fecha) as mes,
        COUNT(*) as cantidad_pagos,
        SUM(monto) as total_monto,
        COUNT(CASE WHEN estatus = 'pagado' THEN 1 END) as pagos_completados
      FROM pagos
      WHERE fecha >= date('now', '-6 months')
      GROUP BY strftime('%Y-%m', fecha)
      ORDER BY mes DESC
    `).all() as any[];

    // Estudiantes por edad
    const estudiantesPorEdad = db.prepare(`
      SELECT 
        CASE 
          WHEN (julianday('now') - julianday(fecha_nacimiento)) / 365.25 < 5 THEN '3-4 años'
          WHEN (julianday('now') - julianday(fecha_nacimiento)) / 365.25 < 7 THEN '5-6 años'
          WHEN (julianday('now') - julianday(fecha_nacimiento)) / 365.25 < 13 THEN '7-12 años'
          ELSE '13+ años'
        END as rango_edad,
        COUNT(*) as cantidad
      FROM estudiantes e
      JOIN matriculas m ON e.id_estudiante = m.id_estudiante
      WHERE m.ano_escolar = ? AND m.estatus = 'inscrito'
      GROUP BY rango_edad
    `).all(anoEscolar) as any[];

    // Rendimiento académico promedio
    const rendimientoAcademico = db.prepare(`
      SELECT 
        AVG(promedio) as promedio_general,
        COUNT(*) as total_registros,
        COUNT(CASE WHEN promedio >= 18 THEN 1 END) as excelente,
        COUNT(CASE WHEN promedio >= 14 AND promedio < 18 THEN 1 END) as bueno,
        COUNT(CASE WHEN promedio >= 10 AND promedio < 14 THEN 1 END) as regular,
        COUNT(CASE WHEN promedio < 10 THEN 1 END) as deficiente
      FROM historial_academico
      WHERE ano_escolar = ?
    `).get(anoEscolar) as any;

    return {
      metricas_generales: {
        total_estudiantes: totalEstudiantes,
        total_docentes: totalDocentes,
        total_grados: totalGrados,
        total_representantes: totalRepresentantes,
        matriculas_actuales: matriculasActuales,
        pre_inscritos: preInscritos,
      },
      distribucion_genero: distribucionGenero,
      distribucion_nivel: distribucionNivel,
      distribucion_turno: distribucionTurno,
      grados_ocupacion: gradosOcupacion,
      docentes_especialidad: docentesEspecialidad,
      asignaciones_docentes: asignacionesDocentes,
      pagos_por_mes: pagosPorMes,
      estudiantes_por_edad: estudiantesPorEdad,
      rendimiento_academico: rendimientoAcademico,
    };
  } catch (error) {
    console.error("Error obteniendo métricas:", error);
    return null;
  }
}

export async function generarReporteMatricula(filtros: any) {
  await requireRole(["administrador", "director"]);

  try {
    let sql = `
      SELECT 
        m.*,
        e.nombres || ' ' || e.apellidos as nombre_estudiante,
        e.fecha_nacimiento,
        e.genero,
        r.nombres || ' ' || r.apellidos as nombre_representante,
        r.telefono as telefono_representante,
        g.nombre as grado_nombre,
        g.seccion,
        g.turno,
        g.nivel_educativo
      FROM matriculas m
      JOIN estudiantes e ON m.id_estudiante = e.id_estudiante
      JOIN representantes r ON e.id_representante = r.id_representante
      LEFT JOIN grados g ON m.id_grado = g.id_grado
      WHERE 1=1
    `;

    const params: any[] = [];

    if (filtros.anoEscolar) {
      sql += " AND m.ano_escolar = ?";
      params.push(filtros.anoEscolar);
    }

    if (filtros.estatus && filtros.estatus !== "todos" && filtros.estatus !== "") {
      sql += " AND m.estatus = ?";
      params.push(filtros.estatus);
    }

    if (filtros.grado && filtros.grado !== "todos" && filtros.grado !== "") {
      sql += " AND m.id_grado = ?";
      params.push(filtros.grado);
    }

    sql += " ORDER BY g.nivel_educativo, g.nombre, g.seccion, e.apellidos, e.nombres";

    const stmt = db.prepare(sql);
    const data = stmt.all(...params) as any[];

    // Transformar datos para el reporte
    const transformedData = data.map((row) => ({
      ...row,
      grados: row.grado_nombre
        ? {
            nombre: row.grado_nombre,
            seccion: row.seccion,
            turno: row.turno,
            nivel_educativo: row.nivel_educativo,
          }
        : null,
    }));

    return { data: transformedData, success: "Reporte generado exitosamente" };
  } catch (error: any) {
    console.error("Error generando reporte:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}

export async function generarReporteDocentes() {
  await requireRole(["administrador", "director"]);

  try {
    const sql = `
      SELECT 
        d.*,
        1 as activo
      FROM docentes d
      ORDER BY d.apellidos, d.nombres
    `;

    const stmt = db.prepare(sql);
    const data = stmt.all() as any[];

    return { data, success: "Reporte de docentes generado exitosamente" };
  } catch (error: any) {
    console.error("Error generando reporte de docentes:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}

export async function generarReporteGrados() {
  await requireRole(["administrador", "director"]);

  try {
    const sql = `
      SELECT 
        g.*,
        d.nombres || ' ' || d.apellidos as docente_nombre,
        d.especialidad,
        COUNT(m.id_matricula) as total_estudiantes,
        COUNT(CASE WHEN m.estatus = 'inscrito' THEN 1 END) as estudiantes_inscritos
      FROM grados g
      LEFT JOIN grado_docente gd ON g.id_grado = gd.id_grado
      LEFT JOIN docentes d ON gd.id_docente = d.id_docente
      LEFT JOIN matriculas m ON g.id_grado = m.id_grado AND m.ano_escolar = ?
      GROUP BY g.id_grado
      ORDER BY 
        CASE g.nivel_educativo 
          WHEN 'Inicial' THEN 1 
          WHEN 'Primaria' THEN 2 
          WHEN 'Media' THEN 3 
        END,
        g.nombre, g.seccion
    `;

    const anoEscolar = new Date().getFullYear().toString();
    const stmt = db.prepare(sql);
    const data = stmt.all(anoEscolar) as any[];

    return { data, success: "Reporte de grados generado exitosamente" };
  } catch (error: any) {
    console.error("Error generando reporte de grados:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}