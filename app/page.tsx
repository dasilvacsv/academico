import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export default async function HomePage() {
  console.log("🏠 Página principal cargada")

  // Verificar si el usuario ya está autenticado
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (token) {
    try {
      jwt.verify(token.value, JWT_SECRET)
      console.log("✅ Usuario autenticado, redirigiendo a dashboard")
      redirect("/dashboard")
    } catch {
      console.log("❌ Token inválido, redirigiendo a login")
      redirect("/login")
    }
  } else {
    console.log("❌ No hay token, redirigiendo a login")
    redirect("/login")
  }
}