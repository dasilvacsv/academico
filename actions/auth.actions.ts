"use server"

import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDbConnection from "@/lib/database" // <-- 1. Importa la función
const db = getDbConnection(); // <-- 2. Llama a la función UNA VEZ para obtener la conexión

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Definimos un tipo para el usuario para mejorar el autocompletado y la seguridad del código
type User = {
  id: string;
  email: string;
  rol: 'administrador' | 'director' | 'docente';
  nombre_completo: string;
  password_hash: string;
};

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log("🔍 Intento de login:", { email, password: password ? "***" : "vacío" })

  if (!email || !password) {
    console.log("❌ Email o contraseña vacíos")
    return { error: "Email y contraseña son requeridos" }
  }

  try {
    console.log("🔍 Buscando usuario en la base de datos...")

    // 2. Se usa la sintaxis de better-sqlite3 para buscar al usuario
    const stmt = db.prepare<[string]>("SELECT * FROM usuarios WHERE email = ? AND activo = 1");
    const user = stmt.get(email) as User | undefined; // .get() obtiene la primera fila que coincida

    if (!user) {
      console.log("❌ Usuario no encontrado o inactivo para email:", email)
      return { error: "Credenciales inválidas" }
    }

    console.log("✅ Usuario encontrado:", {
      id: user.id,
      email: user.email,
      rol: user.rol,
      password_hash: user.password_hash ? "presente" : "ausente",
    })

    // La lógica de verificación de contraseña se mantiene igual
    let isValidPassword = false
    if (password === user.password_hash) {
      isValidPassword = true
      console.log("✅ Contraseña válida (comparación directa para testing)")
    } else if (user.password_hash && (user.password_hash.startsWith("$2a$") || user.password_hash.startsWith("$2b$"))) {
      isValidPassword = await bcrypt.compare(password, user.password_hash)
      console.log("✅ Verificación bcrypt:", isValidPassword ? "exitosa" : "fallida")
    }

    if (!isValidPassword) {
      console.log("❌ Contraseña inválida")
      return { error: "Credenciales inválidas" }
    }

    console.log("🔑 Creando token JWT...")
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol,
        nombre_completo: user.nombre_completo,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )
    console.log("✅ Token creado exitosamente")

    // Establecer la cookie
    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    })
    console.log("✅ Cookie establecida exitosamente")

    // Redirección basada en rol
    let redirectUrl = "/dashboard"
    if (user.rol === "docente") {
      redirectUrl = "/dashboard/estudiantes"
    } else if (user.rol === "director") {
      redirectUrl = "/dashboard/reportes"
    }

    return { success: "Login exitoso", redirect: redirectUrl }
  } catch (error: any) {
    console.error("❌ Error completo en login:", error)
    return { error: `Error interno del servidor: ${error.message}` }
  }
}

export async function logout() {
  console.log("🚪 Cerrando sesión...")
  cookies().delete("auth-token")
  return { success: "Sesión cerrada" }
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email es requerido" }
  }

  try {
    // 3. Se usa la sintaxis de better-sqlite3 para verificar si el usuario existe
    const stmt = db.prepare<[string]>("SELECT id FROM usuarios WHERE email = ?");
    const user = stmt.get(email);

    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      console.log(`Solicitud de reseteo para email no registrado: ${email}`);
      return { success: "Si el email está registrado, se ha enviado un enlace de recuperación." }
    }

    // Aquí implementarías el envío de email real
    console.log(`✅ Simulación de envío de email de recuperación a: ${email}`)
    return { success: "Si el email está registrado, se ha enviado un enlace de recuperación." }
  } catch (error: any) {
    console.error("Error en recuperación:", error)
    return { error: "Error interno del servidor" }
  }
}