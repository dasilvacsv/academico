import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Users, Calendar, Clock, GraduationCap, BookOpen, Phone } from "lucide-react"
import { obtenerEstudiantesPreInscritos, obtenerGrados } from "@/actions/academicos.actions"
import { AsignarCupoForm } from "@/components/cupos/asignar-cupo-form"
import { requireRole } from "@/lib/auth"

export default async function CuposPage() {
  await requireRole(["administrador", "director"])

  const [estudiantesPreInscritos, grados] = await Promise.all([obtenerEstudiantesPreInscritos(), obtenerGrados()])

  const totalCapacidad = grados.reduce((total, grado) => total + grado.capacidad_maxima, 0)
  const estudiantesAsignados = grados.reduce((total, grado) => total + (grado.estudiantes_actuales || 0), 0)
  const cuposDisponibles = totalCapacidad - estudiantesAsignados

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-950 dark:via-emerald-950 dark:to-teal-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                <UserCheck className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Gestión de Cupos</h1>
                <p className="text-emerald-100 text-lg">Asigna estudiantes pre-inscritos a grados disponibles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Pre-inscritos</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{estudiantesPreInscritos.length}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Esperando asignación</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Grados Disponibles</p>
                  <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{grados.length}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Secciones organizadas</p>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                  <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Cupos Disponibles</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{cuposDisponibles}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">De {totalCapacidad} totales</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Año Escolar</p>
                  <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{new Date().getFullYear()}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Período actual</p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                  <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Pre-enrolled Students */}
          <Card className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Estudiantes Pre-inscritos
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Estudiantes que necesitan asignación de cupo
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 max-h-96 overflow-y-auto">
              <div className="space-y-6">
                {estudiantesPreInscritos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-slate-400 dark:text-slate-600" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">No hay estudiantes pre-inscritos</p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Los nuevos registros aparecerán aquí</p>
                  </div>
                ) : (
                  estudiantesPreInscritos.map((estudiante: any) => (
                    <div
                      key={estudiante.id_matricula}
                      className="group relative overflow-hidden bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative flex items-center justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg">
                              <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {estudiante.nombre_estudiante}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Fecha de nacimiento: {new Date(estudiante.fecha_nacimiento).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Representante: {estudiante.nombre_representante}
                              </span>
                            </div>
                            {estudiante.telefono_representante && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  {estudiante.telefono_representante}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 ml-6">
                          <Badge variant="secondary" className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                            Pre-inscrito
                          </Badge>
                          <AsignarCupoForm estudianteId={estudiante.id_estudiante} grados={grados} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Grade Capacity Summary */}
          <Card className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Capacidad por Grado
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Estado actual de ocupación de cada grado
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 max-h-96 overflow-y-auto">
              <div className="space-y-6">
                {grados.map((grado: any) => {
                  const ocupacion = (grado.estudiantes_actuales || 0) / grado.capacidad_maxima
                  const porcentaje = Math.round(ocupacion * 100)
                  
                  return (
                    <div key={grado.id_grado} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-lg">
                            <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {grado.nombre} - {grado.seccion}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {grado.nivel_educativo} • {grado.turno}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {grado.estudiantes_actuales || 0} / {grado.capacidad_maxima}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">estudiantes</p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full transition-all duration-1000 ${
                              porcentaje >= 90 
                                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                                : porcentaje >= 70 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                                : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                            }`}
                            style={{ width: `${Math.min(porcentaje, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <Badge 
                            variant={porcentaje >= 90 ? "destructive" : porcentaje >= 70 ? "secondary" : "default"}
                            className="text-xs"
                          >
                            {porcentaje}% ocupado
                          </Badge>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {grado.capacidad_maxima - (grado.estudiantes_actuales || 0)} cupos disponibles
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}