import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log("🔍 Middleware ejecutándose para:", pathname)

  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/login", "/olvide-mi-contrasena", "/registro"]

  if (publicPaths.includes(pathname)) {
    console.log("✅ Ruta pública, permitiendo acceso")
    return NextResponse.next()
  }

  // Verificar token de autenticación
  const token = request.cookies.get("auth-token")
  console.log("🔍 Token encontrado:", token ? "Sí" : "No")

  if (!token) {
    console.log("❌ No hay token, redirigiendo a login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verificación básica del token (sin jwt.verify que no funciona en Edge Runtime)
  try {
    // Verificar que el token tenga el formato correcto de JWT
    const parts = token.value.split(".")
    if (parts.length !== 3) {
      console.log("❌ Token con formato inválido")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Decodificar el payload para verificar expiración
    const payload = JSON.parse(atob(parts[1]))
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp && payload.exp < now) {
      console.log("❌ Token expirado")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    console.log("✅ Token válido, permitiendo acceso")
    return NextResponse.next()
  } catch (error) {
    if (error instanceof Error) {
      console.log("❌ Error verificando token:", error.message)
    } else {
      console.log("❌ Error verificando token:", error)
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
