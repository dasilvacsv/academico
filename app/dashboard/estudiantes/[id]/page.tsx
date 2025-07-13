import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar, User, GraduationCap, BookOpen, Award, Shield, Heart } from "lucide-react"
import Link from "next/link"
import { obtenerEstudiantePorId } from "@/actions/estudiantes.actions"
import { requireRole, getUser } from "@/lib/auth"
import { notFound } from "next/navigation"

interface PageProps {
  params: { id: string }
}

export default async function EstudianteDetallePage({ params }: PageProps) {
  // Verificar permisos primero
  await requireRole(["administrador", "director", "docente"])
  
  // Obtener información del usuario actual
  const user = await getUser()
  const userRole = user?.rol || ""
  
  // Obtener datos del estudiante
  const estudiante = await obtenerEstudiantePorId(params.id)

  if (!estudiante) {
    notFound()
  }

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "inscrito":
        return "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg shadow-emerald-500/30"
      case "retirado":
        return "bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-lg shadow-red-500/30"
      case "egresado":
        return "bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0 shadow-lg shadow-purple-500/30"
      default:
        return "bg-gradient-to-r from-slate-500 to-gray-600 text-white border-0 shadow-lg shadow-slate-500/30"
    }
  }

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-200 shadow-lg"
            >
              <Link href="/dashboard/estudiantes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Link>
            </Button>
            <div className="space-y-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                {estudiante.nombres} {estudiante.apellidos}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Información detallada del estudiante
              </p>
            </div>
          </div>
          
          {/* Botón de editar solo visible para administradores */}
          {userRole === "administrador" && (
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 border-0"
            >
              <Link href={`/dashboard/estudiantes/${params.id}/editar`}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Link>
            </Button>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Información Personal */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-lg">
                  <User className="h-6 w-6" />
                </div>
                Información Personal
              </CardTitle>
            </div>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Nombres</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{estudiante.nombres}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Apellidos</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{estudiante.apellidos}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Fecha de Nacimiento</p>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {new Date(estudiante.fecha_nacimiento).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Género</p>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <Heart className="h-5 w-5 text-pink-500" />
                    <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">{estudiante.genero}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Nacionalidad</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{estudiante.nacionalidad}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Estado de Nacimiento</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{estudiante.estado_nacimiento || "No especificado"}</p>
                </div>
              </div>

              {estudiante.telefono_contacto && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Teléfono</p>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <Phone className="h-5 w-5 text-green-500" />
                    <p className="font-medium text-slate-900 dark:text-slate-100">{estudiante.telefono_contacto}</p>
                  </div>
                </div>
              )}

              {estudiante.correo_electronico && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Correo Electrónico</p>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <p className="font-medium text-slate-900 dark:text-slate-100">{estudiante.correo_electronico}</p>
                  </div>
                </div>
              )}

              {estudiante.direccion && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Dirección</p>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="font-medium text-slate-900 dark:text-slate-100 leading-relaxed">{estudiante.direccion}</p>
                  </div>
                </div>
              )}

              {estudiante.condicion_especial && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Condición Especial</p>
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 leading-relaxed">{estudiante.condicion_especial}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información del Representante */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                Representante Legal
              </CardTitle>
            </div>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Nombre Completo</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {estudiante.representantes?.nombres} {estudiante.representantes?.apellidos}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Cédula</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{estudiante.representantes?.cedula}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Parentesco</p>
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg shadow-blue-500/30 text-sm px-3 py-1">
                    {estudiante.representantes?.parentesco}
                  </Badge>
                </div>
              </div>

              {estudiante.representantes?.telefono && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Teléfono</p>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <Phone className="h-5 w-5 text-green-500" />
                    <p className="font-medium text-slate-900 dark:text-slate-100">{estudiante.representantes.telefono}</p>
                  </div>
                </div>
              )}

              {estudiante.representantes?.correo_electronico && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Correo Electrónico</p>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <p className="font-medium text-slate-900 dark:text-slate-100">{estudiante.representantes.correo_electronico}</p>
                  </div>
                </div>
              )}

              {estudiante.representantes?.ocupacion && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Ocupación</p>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    <p className="font-medium text-slate-900 dark:text-slate-100">{estudiante.representantes.ocupacion}</p>
                  </div>
                </div>
              )}

              {estudiante.representantes?.direccion && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Dirección</p>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="font-medium text-slate-900 dark:text-slate-100 leading-relaxed">{estudiante.representantes.direccion}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información Académica */}
        {estudiante.matriculas && estudiante.matriculas.length > 0 && (
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  Información Académica
                </CardTitle>
                <CardDescription className="text-green-100 font-medium">
                  Estado actual de matrícula y grado asignado
                </CardDescription>
              </CardHeader>
            </div>
            <CardContent className="p-6">
              {estudiante.matriculas.map((matricula: any) => (
                <div key={matricula.id_matricula} className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {matricula.grados?.nombre} - Sección {matricula.grados?.seccion}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {matricula.grados?.nivel_educativo}
                        </span>
                        <span>•</span>
                        <span>Turno {matricula.grados?.turno}</span>
                      </div>
                    </div>
                    <Badge className={`text-sm px-4 py-2 ${getBadgeStyle(matricula.estatus)}`}>
                      {matricula.estatus}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Año Escolar</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{matricula.ano_escolar}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Fecha de Matrícula</p>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {new Date(matricula.fecha_matricula).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {matricula.observaciones && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Observaciones</p>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{matricula.observaciones}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Historial Académico */}
        {estudiante.historial_academico && estudiante.historial_academico.length > 0 && (
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Award className="h-6 w-6" />
                  </div>
                  Historial Académico
                </CardTitle>
                <CardDescription className="text-orange-100 font-medium">
                  Rendimiento académico por año escolar
                </CardDescription>
              </CardHeader>
            </div>
            <CardContent className="p-6">
              <div className="space-y-6">
                {estudiante.historial_academico.map((historial: any) => (
                  <div key={historial.id_historial} className="p-6 bg-gradient-to-r from-slate-50 to-orange-50 dark:from-slate-800/50 dark:to-orange-900/20 border border-slate-200 dark:border-slate-700/50 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Año Escolar {historial.ano_escolar}
                      </h4>
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg shadow-orange-500/30 text-sm px-3 py-1">
                        Promedio: {historial.promedio}
                      </Badge>
                    </div>
                    {historial.observaciones && (
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{historial.observaciones}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
  )
}