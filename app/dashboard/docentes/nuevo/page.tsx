import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RegistroDocenteForm } from "@/components/docentes/registro-docente-form"
import { ArrowLeft, UserPlus, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { requireRole } from "@/lib/auth"

export default async function NuevoDocentePage() {
  await requireRole(["administrador", "director"])

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-700 dark:via-blue-700 dark:to-purple-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 dark:hover:bg-white/30 hover:text-white backdrop-blur-sm"
              asChild
            >
              <Link href="/dashboard/docentes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Docentes
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white/20 dark:bg-white/30 p-4 backdrop-blur-sm">
              <UserPlus className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Registrar Nuevo Docente</h1>
              <p className="text-emerald-100 dark:text-emerald-200 text-lg">Incorpora un nuevo miembro al equipo educativo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-border bg-card">
            <CardHeader className="pb-8">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
                  <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-foreground">Información del Docente</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    Complete todos los campos requeridos para registrar un nuevo docente
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RegistroDocenteForm />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800 dark:text-blue-300">Información Importante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400">Credenciales de Acceso</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  El docente recibirá sus credenciales de acceso al sistema educativo
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400">Contraseña Temporal</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Si no especifica una contraseña, se asignará "temporal123" por defecto
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400">Primer Acceso</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Se solicitará cambiar la contraseña en el primer inicio de sesión
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-lg text-amber-800 dark:text-amber-300">Documentación Requerida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-medium mb-2">Documentos necesarios:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Cédula de identidad</li>
                  <li>Título profesional</li>
                  <li>Certificado de antecedentes</li>
                  <li>Examen médico</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}