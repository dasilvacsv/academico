import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditarDocenteForm } from "@/components/docentes/editar-docente-form"
import { ArrowLeft, FolderEdit as UserEdit, GraduationCap, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { obtenerDocentePorId } from "@/actions/docentes.actions"
import { requireRole } from "@/lib/auth"
import { notFound } from "next/navigation"

interface PageProps {
  params: { id: string }
}

export default async function EditarDocentePage({ params }: PageProps) {
  await requireRole(["administrador", "director"])

  const docente = await obtenerDocentePorId(params.id)

  if (!docente) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-800 p-8 text-white">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 hover:text-white backdrop-blur-sm border-white/20 dark:border-white/30"
              asChild
            >
              <Link href="/dashboard/docentes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Docentes
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-6">
            <Avatar className="h-16 w-16 border-4 border-white/30">
              <AvatarFallback className="bg-white/20 text-white text-lg font-bold backdrop-blur-sm">
                {docente.nombres.charAt(0)}{docente.apellidos.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <UserEdit className="h-8 w-8" />
                <h1 className="text-4xl font-bold tracking-tight">Editar Docente</h1>
              </div>
              <p className="text-purple-100 text-lg">
                Modificar la información de {docente.nombres} {docente.apellidos}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  {docente.especialidad}
                </Badge>
                {docente.grado_docente?.[0] && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {docente.grado_docente[0].grados.nombre} - {docente.grado_docente[0].grados.seccion}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-border dark:border-gray-800 bg-card dark:bg-gray-900">
            <CardHeader className="pb-8">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-2">
                  <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-foreground dark:text-white">Información del Docente</CardTitle>
                  <CardDescription className="text-base text-muted-foreground dark:text-gray-400">
                    Actualice los campos que desee modificar
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <EditarDocenteForm docente={docente} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border dark:border-gray-800 bg-card dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg text-foreground dark:text-white">Información Actual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground dark:text-white">Cédula</h4>
                <p className="text-sm text-muted-foreground dark:text-gray-400 font-mono bg-muted dark:bg-gray-800 p-2 rounded">
                  {docente.cedula}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground dark:text-white">Fecha de Registro</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(docente.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/30">
            <CardHeader>
              <CardTitle className="text-lg text-orange-800 dark:text-orange-300">Notas Importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-orange-700 dark:text-orange-300">
                <p className="font-medium mb-2">Cambios en la información:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Los cambios se aplicarán inmediatamente</li>
                  <li>El docente será notificado de los cambios</li>
                  <li>Algunos campos pueden requerir validación</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30">
            <CardHeader>
              <CardTitle className="text-lg text-green-800 dark:text-green-300">Historial de Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600 dark:text-green-400">
                Próximamente podrás ver el historial de actividades del docente
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}