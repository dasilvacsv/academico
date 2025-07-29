import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  TrendingUp, 
  Calendar,
  School,
  Award,
  FileText,
  Building,
  Phone,
  Mail
} from "lucide-react"
import Link from "next/link"
import { obtenerMetricasCompletas } from "@/actions/academicos.actions"
import { requireRole } from "@/lib/auth"

export default async function DashboardPage() {
  await requireRole(["administrador", "director", "docente"])

  const metricas = await obtenerMetricasCompletas()

  if (!metricas) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Error cargando las métricas del sistema</p>
      </div>
    )
  }

  const anoActual = new Date().getFullYear()
  
  // Calcular porcentajes
  const porcentajeOcupacion = metricas.metricas_generales.total_grados > 0 
    ? Math.round((metricas.asignaciones_docentes.grados_con_docente / metricas.asignaciones_docentes.total_grados) * 100)
    : 0

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 p-8 text-white">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 dark:bg-white/30 p-3 backdrop-blur-sm">
                  <School className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Panel de Control</h1>
                  <p className="text-blue-100 dark:text-blue-200 text-lg">
                    Sistema de información para el  registro de matrícula escolar - Año {anoActual}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-white/10 dark:bg-white/20 p-4 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-200 dark:text-blue-300" />
                  <span className="text-sm text-blue-200 dark:text-blue-300">Período Activo</span>
                </div>
                <p className="text-2xl font-bold">{anoActual}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Estudiantes</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {metricas.metricas_generales.matriculas_actuales}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Inscritos de {metricas.metricas_generales.total_estudiantes} total
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Docentes</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                  {metricas.metricas_generales.total_docentes}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  Personal activo
                </p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                <GraduationCap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Grados</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {metricas.metricas_generales.total_grados}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Secciones disponibles
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Pre-inscritos</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  {metricas.metricas_generales.pre_inscritos}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Esperando cupo
                </p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                <UserCheck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Accesos directos a las funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Button asChild className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                <Link href="/dashboard/estudiantes/nuevo">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span className="text-sm">Nuevo Estudiante</span>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-16 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50">
                <Link href="/dashboard/docentes/nuevo">
                  <div className="flex flex-col items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm text-emerald-700 dark:text-emerald-300">Nuevo Docente</span>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-16 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50">
                <Link href="/dashboard/cupos">
                  <div className="flex flex-col items-center gap-2">
                    <UserCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm text-purple-700 dark:text-purple-300">Asignar Cupos</span>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-16 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/50">
                <Link href="/dashboard/reportes">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm text-amber-700 dark:text-amber-300">Reportes</span>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Distribution by Level */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              Distribución por Nivel
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Estudiantes organizados por nivel educativo
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {metricas.distribucion_nivel.map((nivel: any) => (
                <div key={nivel.nivel_educativo} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                      {nivel.nivel_educativo}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {nivel.estudiantes} / {nivel.capacidad_total}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {nivel.grados_disponibles} grados
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min((nivel.estudiantes / nivel.capacidad_total) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Teacher Assignments */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              Asignaciones Docentes
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Estado de las asignaciones docente-grado
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div>
                  <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                    Grados con Docente
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    {metricas.asignaciones_docentes.grados_con_docente} de {metricas.asignaciones_docentes.total_grados} grados
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {porcentajeOcupacion}%
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${porcentajeOcupacion}%` }}
                ></div>
              </div>

              <div className="pt-4">
                <Button asChild variant="outline" className="w-full border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50">
                  <Link href="/dashboard/grados/asignaciones">
                    <GraduationCap className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-300">Gestionar Asignaciones</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teachers by Specialty */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Docentes por Especialidad
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Distribución del personal docente
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {metricas.docentes_especialidad.slice(0, 5).map((especialidad: any, index: number) => (
                <div key={especialidad.especialidad} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                      index === 0 ? 'from-blue-500 to-blue-600' :
                      index === 1 ? 'from-emerald-500 to-emerald-600' :
                      index === 2 ? 'from-purple-500 to-purple-600' :
                      index === 3 ? 'from-amber-500 to-amber-600' :
                      'from-pink-500 to-pink-600'
                    }`}></div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {especialidad.especialidad}
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {especialidad.cantidad} {especialidad.cantidad === 1 ? 'docente' : 'docentes'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-800 text-white">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">¿Necesitas ayuda?</h3>
            <p className="text-blue-100 dark:text-blue-200">
              Contacta al equipo de soporte técnico para cualquier consulta
            </p>
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+58 414 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>cejosemanuelmatutesalazar@gmail.com</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}