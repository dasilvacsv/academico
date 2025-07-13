import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  id: string
  email: string
  rol: string
  nombre_completo: string
}

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as User
    return decoded
  } catch (error) {
    if (error instanceof Error) {
      console.log("❌ Error verificando token en getUser:", error.message)
    } else {
      console.log("❌ Error verificando token en getUser:", error)
    }
    return null
  }
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.rol)) {
    redirect("/dashboard")
  }
  return user
}
