import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("auth-token")

  if (!token) {
    return NextResponse.json({ rol: null }, { status: 200 })
  }

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as any
    return NextResponse.json({ rol: decoded.rol }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      console.log("❌ Error verificando token:", error.message)
    } else {
      console.log("❌ Error verificando token:", error)
    }
    return NextResponse.json({ rol: null }, { status: 200 })
  }
}