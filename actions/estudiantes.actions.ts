"use server"

import getDbConnection from "@/lib/database" // <-- 1. Importa la función
const db = getDbConnection(); // <-- 2. Llama a la función UNA VEZ para obtener la conexión
import { requireRole } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

// --- REGISTRAR ESTUDIANTE (CON TRANSACCIÓN) ---
export async function registrarEstudiante(formData: FormData) {
  await requireRole(["administrador", "director"]);

  const representanteData = {
    nombres: formData.get("rep_nombres") as string,
    apellidos: formData.get("rep_apellidos") as string,
    cedula: formData.get("rep_cedula") as string,
    telefono: formData.get("rep_telefono") as string,
    correo_electronico: formData.get("rep_correo") as string,
    direccion: formData.get("rep_direccion") as string,
    parentesco: formData.get("rep_parentesco") as string,
    ocupacion: formData.get("rep_ocupacion") as string,
  };
  const estudianteData = {
    nombres: formData.get("est_nombres") as string,
    apellidos: formData.get("est_apellidos") as string,
    fecha_nacimiento: formData.get("est_fecha_nacimiento") as string,
    genero: formData.get("est_genero") as string,
    nacionalidad: formData.get("est_nacionalidad") as string,
    estado_nacimiento: formData.get("est_estado_nacimiento") as string,
    direccion: formData.get("est_direccion") as string,
    telefono_contacto: formData.get("est_telefono") as string,
    correo_electronico: formData.get("est_correo") as string,
    condicion_especial: formData.get("est_condicion_especial") as string,
  };

  // Se define la transacción
  const transaction = db.transaction(() => {
    // 1. Buscar o crear al representante
    const repStmt = db.prepare("SELECT id_representante FROM representantes WHERE cedula = ?");
    let representante = repStmt.get(representanteData.cedula) as { id_representante: string } | undefined;
    let representanteId: string;

    if (representante) {
      representanteId = representante.id_representante;
    } else {
      representanteId = randomUUID();
      const insertRepStmt = db.prepare(
        `INSERT INTO representantes (id_representante, nombres, apellidos, cedula, telefono, correo_electronico, direccion, parentesco, ocupacion) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );
      insertRepStmt.run(
        representanteId,
        representanteData.nombres,
        representanteData.apellidos,
        representanteData.cedula,
        representanteData.telefono,
        representanteData.correo_electronico,
        representanteData.direccion,
        representanteData.parentesco,
        representanteData.ocupacion
      );
    }

    // 2. Insertar al estudiante
    const estudianteId = randomUUID();
    const insertEstStmt = db.prepare(
      `INSERT INTO estudiantes (id_estudiante, nombres, apellidos, fecha_nacimiento, genero, nacionalidad, estado_nacimiento, direccion, telefono_contacto, correo_electronico, condicion_especial, id_representante) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    insertEstStmt.run(
      estudianteId,
      estudianteData.nombres,
      estudianteData.apellidos,
      estudianteData.fecha_nacimiento,
      estudianteData.genero,
      estudianteData.nacionalidad,
      estudianteData.estado_nacimiento,
      estudianteData.direccion,
      estudianteData.telefono_contacto,
      estudianteData.correo_electronico,
      estudianteData.condicion_especial,
      representanteId
    );

    // 3. Crear la matrícula inicial en estado "pre-inscrito"
    const anoEscolar = new Date().getFullYear().toString();
    const insertMatStmt = db.prepare(
      `INSERT INTO matriculas (id_matricula, id_estudiante, ano_escolar, estatus) 
       VALUES (?, ?, ?, ?)`
    );
    insertMatStmt.run(randomUUID(), estudianteId, anoEscolar, "pre-inscrito");
  });

  try {
    transaction(); // Se ejecuta la transacción
    revalidatePath("/dashboard/estudiantes");
    return { success: "Estudiante registrado exitosamente" };
  } catch (error: any) {
    console.error("Error registrando estudiante:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}

// --- ACTUALIZAR ESTUDIANTE ---
export async function actualizarEstudiante(id: string, formData: FormData) {
  await requireRole(["administrador", "director"]);

  const estudianteData = {
    nombres: formData.get("nombres") as string,
    apellidos: formData.get("apellidos") as string,
    fecha_nacimiento: formData.get("fecha_nacimiento") as string,
    genero: formData.get("genero") as string,
    nacionalidad: formData.get("nacionalidad") as string,
    estado_nacimiento: formData.get("estado_nacimiento") as string,
    direccion: formData.get("direccion") as string,
    telefono_contacto: formData.get("telefono_contacto") as string,
    correo_electronico: formData.get("correo_electronico") as string,
    condicion_especial: formData.get("condicion_especial") as string,
  };

  try {
    const stmt = db.prepare(
      `UPDATE estudiantes SET 
       nombres = ?, apellidos = ?, fecha_nacimiento = ?, genero = ?, 
       nacionalidad = ?, estado_nacimiento = ?, direccion = ?, 
       telefono_contacto = ?, correo_electronico = ?, condicion_especial = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id_estudiante = ?`
    );
    stmt.run(
      estudianteData.nombres, estudianteData.apellidos, estudianteData.fecha_nacimiento,
      estudianteData.genero, estudianteData.nacionalidad, estudianteData.estado_nacimiento,
      estudianteData.direccion, estudianteData.telefono_contacto, estudianteData.correo_electronico,
      estudianteData.condicion_especial, id
    );

    revalidatePath(`/dashboard/estudiantes/${id}`);
    revalidatePath("/dashboard/estudiantes");
    return { success: "Estudiante actualizado exitosamente" };
  } catch (error: any) {
    console.error("Error actualizando estudiante:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}

// --- OBTENER ESTUDIANTES PAGINADOS (FUNCIÓN PRINCIPAL) ---
export async function obtenerEstudiantesPaginados(params: {
  page: number;
  limite: number;
  filtro?: string;
  estatus?: string;
}) {
  await requireRole(["administrador", "director", "docente"]);

  const { page, limite, filtro, estatus } = params;
  const offset = (page - 1) * limite;

  let whereClauses: string[] = [];
  let sqlParams: (string | number)[] = [];

  if (filtro) {
    whereClauses.push("(e.nombres LIKE ? OR e.apellidos LIKE ?)");
    sqlParams.push(`%${filtro}%`, `%${filtro}%`);
  }
  if (estatus) {
    whereClauses.push("m.estatus = ?");
    sqlParams.push(estatus);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
  const baseJoin = `FROM estudiantes e LEFT JOIN matriculas m ON e.id_estudiante = m.id_estudiante`;
  
  try {
    // Consulta para el total de registros que coinciden con el filtro
    const countSql = `SELECT COUNT(DISTINCT e.id_estudiante) as total ${baseJoin} ${whereSql}`;
    const totalResult = db.prepare(countSql).get(...sqlParams) as { total: number };
    const totalEstudiantes = totalResult.total || 0;
    const totalPaginas = Math.ceil(totalEstudiantes / limite);

    // Consulta para obtener los datos de la página actual
    const dataSql = `
      SELECT e.id_estudiante, e.nombres, e.apellidos, e.correo_electronico, m.estatus, g.nombre as grado_nombre
      FROM estudiantes e
      LEFT JOIN matriculas m ON e.id_estudiante = m.id_estudiante
      LEFT JOIN grados g ON m.id_grado = g.id_grado
      ${whereSql}
      ORDER BY e.created_at DESC
      LIMIT ? OFFSET ?`;
    const dataParams = [...sqlParams, limite, offset];
    const estudiantes = db.prepare(dataSql).all(...dataParams);

    return { estudiantes, totalPaginas };
  } catch (error) {
    console.error("Error obteniendo estudiantes paginados:", error);
    return { estudiantes: [], totalPaginas: 0 };
  }
}

// --- OBTENER UN ESTUDIANTE POR ID ---
export async function obtenerEstudiantePorId(id: string) {
  await requireRole(["administrador", "director", "docente"]);

  try {
    const sql = `
      SELECT e.*, r.*, m.*, g.nombre as grado_nombre, g.seccion, g.turno, g.nivel_educativo
      FROM estudiantes e
      LEFT JOIN representantes r ON e.id_representante = r.id_representante
      LEFT JOIN matriculas m ON e.id_estudiante = m.id_estudiante
      LEFT JOIN grados g ON m.id_grado = g.id_grado
      WHERE e.id_estudiante = ?`;
    const estudiante = db.prepare(sql).get(id);

    if (!estudiante) return null;

    // Obtener datos adicionales
    const historial = db.prepare("SELECT * FROM historial_academico WHERE id_estudiante = ? ORDER BY ano_escolar DESC").all(id);
    const pagos = db.prepare(
      `SELECT p.* FROM pagos p JOIN matriculas m ON p.id_matricula = m.id_matricula WHERE m.id_estudiante = ? ORDER BY p.fecha DESC`
    ).all(id);

    return { ...estudiante, historial_academico: historial, pagos };
  } catch (error) {
    console.error("Error obteniendo estudiante:", error);
    return null;
  }
}