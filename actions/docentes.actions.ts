"use server"

import getDbConnection from "@/lib/database" // <-- 1. Importa la función
const db = getDbConnection(); // <-- 2. Llama a la función UNA VEZ para obtener la conexión
import { requireRole } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"

// --- REGISTRAR DOCENTE ---
export async function registrarDocente(formData: FormData) {
  await requireRole(["administrador", "director"]);

  const docenteData = {
    nombres: formData.get("nombres") as string,
    apellidos: formData.get("apellidos") as string,
    cedula: formData.get("cedula") as string,
    especialidad: formData.get("especialidad") as string,
    telefono: formData.get("telefono") as string,
    correo_institucional: formData.get("correo_institucional") as string,
  };

  // 1. Hashear la contraseña FUERA de la transacción (operación asíncrona)
  const password = (formData.get("password") as string) || "temporal123";
  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. Definir la transacción con una función SÍNCRONA
  const transaction = db.transaction(() => {
    // Verificar si la cédula o el correo ya existen
    const existingStmt = db.prepare(
      "SELECT id_docente FROM docentes WHERE cedula = ? OR correo_institucional = ?"
    );
    const existing = existingStmt.get(
      docenteData.cedula,
      docenteData.correo_institucional
    );

    if (existing) {
      throw new Error("Ya existe un docente con esta cédula o correo electrónico.");
    }

    // Insertar el nuevo docente
    const insertDocenteStmt = db.prepare(
      `INSERT INTO docentes (id_docente, nombres, apellidos, cedula, especialidad, telefono, correo_institucional) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    insertDocenteStmt.run(
      randomUUID(),
      docenteData.nombres,
      docenteData.apellidos,
      docenteData.cedula,
      docenteData.especialidad,
      docenteData.telefono,
      docenteData.correo_institucional
    );

    // Crear el usuario para el docente
    const insertUserStmt = db.prepare(
      // 3. Añadir la columna 'cedula' a la consulta
      `INSERT INTO usuarios (id, email, password_hash, rol, nombre_completo, cedula) 
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    insertUserStmt.run(
      randomUUID(),
      docenteData.correo_institucional,
      hashedPassword, // Usamos la contraseña ya hasheada
      "docente",
      `${docenteData.nombres} ${docenteData.apellidos}`,
      docenteData.cedula // 4. Añadir el valor de la cédula aquí
    );
  });

  try {
    transaction(); // Ejecutar la transacción
    revalidatePath("/dashboard/docentes");
    return { success: "Docente registrado exitosamente" };
  } catch (error: any) {
    console.error("Error registrando docente:", error);
    return { error: error.message || "Error interno del servidor" };
  }
}

// --- ELIMINAR DOCENTE ---
export async function eliminarDocente(id: string) {
  await requireRole(["administrador", "director"])

  // Transacción para eliminar el docente, su usuario y sus asignaciones de forma atómica.
  const transaction = db.transaction(() => {
    const docenteStmt = db.prepare("SELECT correo_institucional FROM docentes WHERE id_docente = ?")
    const docente = docenteStmt.get(id) as { correo_institucional: string } | undefined

    if (!docente) {
      throw new Error("Docente no encontrado")
    }

    // Eliminar dependencias primero
    db.prepare("DELETE FROM grado_docente WHERE id_docente = ?").run(id)
    db.prepare("DELETE FROM usuarios WHERE email = ?").run(docente.correo_institucional)
    
    // Finalmente, eliminar el docente
    const result = db.prepare("DELETE FROM docentes WHERE id_docente = ?").run(id)

    if (result.changes === 0) {
      throw new Error("No se pudo eliminar al docente.")
    }
  })

  try {
    transaction()
    revalidatePath("/dashboard/docentes")
    revalidatePath("/dashboard/grados")
    return { success: "Docente eliminado exitosamente" }
  } catch (error: any) {
    console.error("Error eliminando docente:", error)
    return { error: error.message || "Error interno del servidor" }
  }
}

// --- ACTUALIZAR DOCENTE ---
export async function actualizarDocente(id: string, formData: FormData) {
  await requireRole(["administrador", "director"])

  const docenteData = {
    nombres: formData.get("nombres") as string,
    apellidos: formData.get("apellidos") as string,
    especialidad: formData.get("especialidad") as string,
    telefono: formData.get("telefono") as string,
    correo_institucional: formData.get("correo_institucional") as string,
  }

  const transaction = db.transaction(() => {
    const docenteAnteriorStmt = db.prepare("SELECT correo_institucional FROM docentes WHERE id_docente = ?")
    const docenteAnterior = docenteAnteriorStmt.get(id) as { correo_institucional: string } | undefined
    
    if (!docenteAnterior) {
      throw new Error("Docente no encontrado para actualizar.")
    }

    // Actualizar la tabla de docentes
    db.prepare(
      `UPDATE docentes SET 
       nombres = ?, apellidos = ?, especialidad = ?, telefono = ?, correo_institucional = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id_docente = ?`
    ).run(
      docenteData.nombres,
      docenteData.apellidos,
      docenteData.especialidad,
      docenteData.telefono,
      docenteData.correo_institucional,
      id,
    )

    // Actualizar la tabla de usuarios
    db.prepare(
      `UPDATE usuarios SET 
       email = ?, nombre_completo = ?, updated_at = CURRENT_TIMESTAMP
       WHERE email = ?`
    ).run(
        docenteData.correo_institucional, 
        `${docenteData.nombres} ${docenteData.apellidos}`, 
        docenteAnterior.correo_institucional
    )
  })

  try {
    transaction()
    revalidatePath("/dashboard/docentes")
    return { success: "Docente actualizado exitosamente" }
  } catch (error: any) {
    console.error("Error actualizando docente:", error)
    return { error: error.message || "Error interno del servidor" }
  }
}

// --- OBTENER DOCENTES (LEER) ---
// No necesita transacción porque solo lee datos
export async function obtenerDocentes() {
  await requireRole(["administrador", "director", "docente"]) // Permitir a docentes ver la lista

  try {
    const sql = `
      SELECT 
        d.id_docente, d.nombres, d.apellidos, d.cedula, d.especialidad, d.telefono, d.correo_institucional,
        g.nombre as grado_nombre, g.seccion, g.turno, g.nivel_educativo
      FROM docentes d
      LEFT JOIN grado_docente gd ON d.id_docente = gd.id_docente
      LEFT JOIN grados g ON gd.id_grado = g.id_grado
      ORDER BY d.apellidos, d.nombres`
    
    const data = db.prepare(sql).all() as any[]

    const docentesMap = new Map()
    data.forEach((row) => {
      if (!docentesMap.has(row.id_docente)) {
        docentesMap.set(row.id_docente, {
          ...row,
          grados_asignados: [],
        })
      }
      if (row.grado_nombre) {
        docentesMap.get(row.id_docente).grados_asignados.push({
          nombre: row.grado_nombre,
          seccion: row.seccion,
          turno: row.turno,
        })
      }
    })
    return Array.from(docentesMap.values())
  } catch (error) {
    console.error("Error obteniendo docentes:", error)
    return []
  }
}

// --- OBTENER DOCENTE POR ID (LEER) ---
export async function obtenerDocentePorId(id: string) {
  await requireRole(["administrador", "director"])

  try {
    const sql = "SELECT * FROM docentes WHERE id_docente = ?"
    const docente = db.prepare(sql).get(id)
    return docente || null
  } catch (error) {
    console.error("Error obteniendo docente:", error)
    return null
  }
}