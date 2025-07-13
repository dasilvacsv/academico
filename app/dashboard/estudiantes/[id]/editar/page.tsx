import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditarEstudianteForm } from "@/components/estudiantes/editar-estudiante-form"
import { ArrowLeft, Edit3, Sparkles, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { obtenerEstudiantePorId } from "@/actions/estudiantes.actions"
import { requireRole } from "@/lib/auth"
import { notFound } from "next/navigation"

interface PageProps {
  params: { id: string }
}

export default async function EditarEstudiantePage({ params }: PageProps) {
  await requireRole(["administrador", "director"])

  const estudiante = await obtenerEstudiantePorId(params.id)

  if (!estudiante) {
    notFound()
  }

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-200 shadow-lg"
          >
            <Link href={`/dashboard/estudiantes/${params.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <Edit3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Editar Estudiante
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Modificar la información de {estudiante.nombres} {estudiante.apellidos}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-lg">
                  <User className="h-6 w-6" />
                </div>
                Información del Estudiante
              </CardTitle>
              <CardDescription className="text-blue-100 font-medium">
                Actualice los campos que desee modificar
              </CardDescription>
            </CardHeader>
          </div>
          <CardContent className="p-8">
            <EditarEstudianteForm estudiante={estudiante} />
          </CardContent>
        </Card>
      </div>
   
  )
}