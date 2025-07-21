"use server"

import getDbConnection from "@/lib/database"
import { requireRole } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

const db = getDbConnection();

// --- REGISTRAR ESTUDIANTE ---
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

  const transaction = db.transaction(() => {
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

    const anoEscolar = new Date().getFullYear().toString();
    const insertMatStmt = db.prepare(
      `INSERT INTO matriculas (id_matricula, id_estudiante, ano_escolar, estatus) 
       VALUES (?, ?, ?, ?)`
    );
    insertMatStmt.run(randomUUID(), estudianteId, anoEscolar, "pre-inscrito");
  });

  try {
    transaction();
    revalidatePath("/dashboard/estudiantes");
    return { success: "Estudiante registrado exitosamente" };
  } catch (error: any) {
    console.error("Error registrando estudiante:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}

export async function actualizarEstudiante(id_estudiante: string, formData: FormData) {
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

  const representanteData = {
    id: formData.get("id_representante") as string,
    nombres: formData.get("rep_nombres") as string,
    apellidos: formData.get("rep_apellidos") as string,
    cedula: formData.get("rep_cedula") as string,
    telefono: formData.get("rep_telefono") as string,
    correo_electronico: formData.get("rep_correo") as string,
    direccion: formData.get("rep_direccion") as string,
    parentesco: formData.get("rep_parentesco") as string,
    ocupacion: formData.get("rep_ocupacion") as string,
  };

  const transaction = db.transaction(() => {
    // Actualizar estudiante
    const updateEstStmt = db.prepare(
      `UPDATE estudiantes SET 
        nombres = ?, apellidos = ?, fecha_nacimiento = ?, genero = ?, 
        nacionalidad = ?, estado_nacimiento = ?, direccion = ?, 
        telefono_contacto = ?, correo_electronico = ?, condicion_especial = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id_estudiante = ?`
    );
    updateEstStmt.run(
      estudianteData.nombres, estudianteData.apellidos, estudianteData.fecha_nacimiento,
      estudianteData.genero, estudianteData.nacionalidad, estudianteData.estado_nacimiento,
      estudianteData.direccion, estudianteData.telefono_contacto, estudianteData.correo_electronico,
      estudianteData.condicion_especial, id_estudiante
    );

    // Actualizar representante (si existe)
    if (representanteData.id) {
      const updateRepStmt = db.prepare(
        // 👇 AQUÍ ESTÁ LA CORRECCIÓN
        `UPDATE representantes SET
          nombres = ?, apellidos = ?, cedula = ?, telefono = ?,
          correo_electronico = ?, direccion = ?, parentesco = ?, ocupacion = ?
          WHERE id_representante = ?`
      );
      updateRepStmt.run(
        representanteData.nombres, representanteData.apellidos, representanteData.cedula,
        representanteData.telefono, representanteData.correo_electronico, representanteData.direccion,
        representanteData.parentesco, representanteData.ocupacion, representanteData.id
      );
    }
  });

  try {
    transaction();
    revalidatePath(`/dashboard/estudiantes/${id_estudiante}`);
    revalidatePath("/dashboard/estudiantes");
    return { success: "Estudiante y representante actualizados exitosamente" };
  } catch (error: any) {
    console.error("Error actualizando:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}

// --- OBTENER ESTUDIANTES PAGINADOS (FUNCIÓN CON CORRECCIÓN DE TIPO) ---
export async function obtenerEstudiantesPaginados(params: {
  page: number;
  limite: number;
  filtro?: string;
  estatus?: string;
}) {
  try {
    const { page, limite, filtro, estatus } = params;
    const offset = (page - 1) * limite;

    let whereClauses: string[] = [];
    let queryParams: (string | number)[] = [];
    
    if (filtro) {
      whereClauses.push("(e.nombres LIKE ? OR e.apellidos LIKE ?)");
      queryParams.push(`%${filtro}%`, `%${filtro}%`);
    }
    if (estatus) {
      whereClauses.push("latest_matricula.estatus = ?");
      queryParams.push(estatus);
    }
    
    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const dataSql = `
      SELECT 
        e.id_estudiante, e.nombres, e.apellidos, e.correo_electronico as email,
        json_object(
          'estatus', latest_matricula.estatus,
          'grados', json_object('nombre', g.nombre)
        ) as matricula_data
      FROM estudiantes e
      LEFT JOIN (
        SELECT id_estudiante, MAX(ano_escolar) as max_ano_escolar
        FROM matriculas GROUP BY id_estudiante
      ) as max_m ON e.id_estudiante = max_m.id_estudiante
      LEFT JOIN matriculas as latest_matricula ON max_m.id_estudiante = latest_matricula.id_estudiante AND max_m.max_ano_escolar = latest_matricula.ano_escolar
      LEFT JOIN grados g ON latest_matricula.id_grado = g.id_grado
      ${whereSql}
      ORDER BY e.apellidos, e.nombres
      LIMIT ? OFFSET ?
    `;

    const finalParams = [...queryParams, limite, offset];
    const rawEstudiantes = db.prepare(dataSql).all(...finalParams) as Array<{
      id_estudiante: string;
      nombres: string;
      apellidos: string;
      email: string | null;
      matricula_data: string;
    }>;

    
    // Se define el tipo para la variable 'row' dentro del .map()
    const estudiantes = rawEstudiantes.map((row) => ({
      id_estudiante: row.id_estudiante,
      nombres: row.nombres,
      apellidos: row.apellidos,
      email: row.email,
      matriculas: [JSON.parse(row.matricula_data || '{}')] 
    }));
    
    const countSql = `SELECT COUNT(DISTINCT e.id_estudiante) as total
                      FROM estudiantes e
                      LEFT JOIN matriculas latest_matricula ON e.id_estudiante = latest_matricula.id_estudiante
                      ${whereSql}`;
                      
    const totalResult = db.prepare(countSql).get(...queryParams) as { total: number };
    const totalPaginas = Math.ceil(totalResult.total / limite);

    const statsSql = `
      SELECT
        (SELECT COUNT(*) FROM estudiantes) as total,
        COUNT(CASE WHEN estatus = 'inscrito' THEN 1 END) as inscritos,
        COUNT(CASE WHEN estatus = 'retirado' THEN 1 END) as retirados,
        COUNT(CASE WHEN estatus = 'egresado' THEN 1 END) as egresados
      FROM matriculas
      WHERE (id_estudiante, ano_escolar) IN (
        SELECT id_estudiante, MAX(ano_escolar) FROM matriculas GROUP BY id_estudiante
      )
    `;
    const stats = db.prepare(statsSql).get();

    return { estudiantes, totalPaginas, stats };

  } catch (error: any) {
    console.error("Error obteniendo estudiantes paginados:", error);
    return {
      estudiantes: [],
      totalPaginas: 1,
      stats: { total: 0, inscritos: 0, retirados: 0, egresados: 0 }
    };
  }
}

// --- OBTENER UN ESTUDIANTE POR ID ---
export async function obtenerEstudiantePorId(id: string) {
  try {
  
    const sql = `
  SELECT 
    e.*,
    json_object(
      'id_representante', r.id_representante,
      'nombres', r.nombres, 'apellidos', r.apellidos, 'cedula', r.cedula,
      'telefono', r.telefono, 'correo_electronico', r.correo_electronico,
      'direccion', r.direccion, 'parentesco', r.parentesco, 'ocupacion', r.ocupacion
    ) as representante_data,
    json_group_array(
      CASE 
        WHEN m.id_matricula IS NOT NULL THEN
          json_object(
            'id_matricula', m.id_matricula, 'ano_escolar', m.ano_escolar,
            'fecha_matricula', m.fecha_matricula, 'estatus', m.estatus,
            'observaciones', m.observaciones,
            -- 👇 CORRECCIÓN AQUÍ: Se cambió 'grados' por 'grado'
            'grado', json_object(
              'nombre', g.nombre, 'seccion', g.seccion,
              'turno', g.turno, 'nivel_educativo', g.nivel_educativo
            )
          )
      END
    ) as matriculas_data
  FROM estudiantes e
  LEFT JOIN representantes r ON e.id_representante = r.id_representante
  LEFT JOIN matriculas m ON e.id_estudiante = m.id_estudiante
  LEFT JOIN grados g ON m.id_grado = g.id_grado
  WHERE e.id_estudiante = ?
  GROUP BY e.id_estudiante
`;

    const row = db.prepare(sql).get(id) as any;

    if (!row) return null;

    // Parsear los datos JSON de la base de datos
    const matriculas_parsed = JSON.parse(row.matriculas_data || '[]').filter((m: any) => m !== null);

    const estudiante = {
      ...row,
      representantes: JSON.parse(row.representante_data || '{}'),
      // Ordenar y asegurarse de que no haya nulos en el array
      matriculas: matriculas_parsed.sort((a: any, b: any) => b.ano_escolar.localeCompare(a.ano_escolar)),
    };

    // Limpiar propiedades de datos JSON sin procesar
    delete estudiante.representante_data;
    delete estudiante.matriculas_data;

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