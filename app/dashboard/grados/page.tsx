import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, GraduationCap, BookOpen, UserCheck, Clock, Building, Edit } from "lucide-react"
import Link from "next/link"
import { obtenerGrados } from "@/actions/academicos.actions"
import { requireRole } from "@/lib/auth"
import { EstudiantesGradoCollapsible } from "@/components/grados/estudiantes-grado-collapsible"
import { EliminarGradoButton } from "@/components/grados/eliminar-grado-button"
import { CrearGradoForm } from "@/components/grados/crear-grado-form"

export default async function GradosPage() {
  const user = await requireRole(["administrador", "director", "docente"]);
  const userRole = user.rol;

  const grados = await obtenerGrados()

  // Agrupar grados por nivel educativo
  const gradosAgrupados = grados.reduce((acc: any, grado: any) => {
    if (!acc[grado.nivel_educativo]) {
      acc[grado.nivel_educativo] = []
    }
    acc[grado.nivel_educativo].push(grado)
    return acc
  }, {})

  const totalEstudiantes = grados.reduce((total, grado) => total + (grado.estudiantes_actuales || 0), 0)
  const totalCapacidad = grados.reduce((total, grado) => total + grado.capacidad_maxima, 0)

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        
        <div className="relative px-8 py-12 z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/20">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white tracking-tight">Grados y Secciones</h1>
                  <p className="text-blue-100 text-lg">Gestiona los grados, secciones y asignaciones de docentes</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <CrearGradoForm userRole={userRole} />
              
              {/* Botón de Gestionar Asignaciones solo visible para administradores */}
              {userRole === "administrador" && (
                <Button asChild className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-lg transition-all duration-300 hover:scale-105">
                  <Link href="/dashboard/grados/asignaciones">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Gestionar Asignaciones
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Grados</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{grados.length}</p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Building className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Estudiantes</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalEstudiantes}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Capacidad Total</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{totalCapacidad}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Ocupación</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  {totalCapacidad > 0 ? Math.round((totalEstudiantes / totalCapacidad) * 100) : 0}%
                </p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grades by Educational Level */}
      <div className="space-y-8">
        {Object.entries(gradosAgrupados).map(([nivelEducativo, gradosNivel]: [string, any]) => (
          <Card key={nivelEducativo} className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 capitalize flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    {nivelEducativo}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 text-lg">
                    Grados y secciones del nivel {nivelEducativo.toLowerCase()}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
                  {gradosNivel.length} {gradosNivel.length === 1 ? 'grado' : 'grados'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {gradosNivel.map((grado: any) => (
                  <div 
                    key={grado.id_grado} 
                    className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl">
                            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                              {grado.nombre} - {grado.seccion}
                            </h3>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {userRole === "administrador" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <EliminarGradoButton 
                            gradoId={grado.id_grado}
                            nombreGrado={`${grado.nombre} - ${grado.seccion}`}
                            estudiantesActuales={grado.estudiantes_actuales || 0}
                            userRole={userRole}
                          />
                        </div>
                        <Badge 
                          variant="outline" 
                          className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                        >
                          {grado.turno}
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Capacidad:</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {grado.capacidad_maxima} estudiantes
                            </span>
                          </div>

                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                              style={{
                                width: `${Math.min(((grado.estudiantes_actuales || 0) / grado.capacidad_maxima) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {grado.grado_docente && grado.grado_docente.length > 0 ? (
                          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                                <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                                  Docente titular:
                                </p>
                                {grado.grado_docente.map((asignacion: any) => (
                                  <div key={asignacion.docentes.id_docente}>
                                    <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                                      {asignacion.docentes.nombres} {asignacion.docentes.apellidos}
                                    </p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                      {asignacion.docentes.especialidad}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                                <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              </div>
                              <p className="text-sm font-medium text-amber-700 dark:text-amber-300 italic">
                                Sin docente asignado
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Users className="h-4 w-4" />
                            <span>
                              {grado.estudiantes_actuales || 0} / {grado.capacidad_maxima} estudiantes
                            </span>
                          </div>
                          <Badge 
                            variant={grado.estudiantes_actuales >= grado.capacidad_maxima ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {grado.estudiantes_actuales >= grado.capacidad_maxima ? "Completo" : "Disponible"}
                          </Badge>
                        </div>

                        {/* Collapsible de Estudiantes */}
                        {(grado.estudiantes_actuales || 0) > 0 && (
                          <div className="pt-2">
                            <EstudiantesGradoCollapsible 
                              gradoId={grado.id_grado} 
                              userRole={userRole} 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}