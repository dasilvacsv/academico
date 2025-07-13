import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, GraduationCap, BookOpen, UserCheck, UserMinus } from "lucide-react"
import Link from "next/link"
import { AsignacionDocenteForm } from "@/components/grados/asignacion-docente-form"
import { DesasignarDocenteButton } from "@/components/grados/desasignar-docente-button"
import { obtenerGrados } from "@/actions/academicos.actions"
import { obtenerDocentes } from "@/actions/docentes.actions"
import { requireRole } from "@/lib/auth"

export default async function AsignacionesPage() {
  await requireRole(["administrador", "director"])

  const [grados, docentes] = await Promise.all([obtenerGrados(), obtenerDocentes()])

  const gradosConDocente = grados.filter((grado: any) => 
    grado.grado_docente && grado.grado_docente.length > 0
  ).length

  const gradosSinDocente = grados.length - gradosConDocente

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        
        <div className="relative px-8 py-12 z-10">
          <div className="flex items-center gap-6 mb-6">
            <Button variant="secondary" size="lg" asChild className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-lg transition-all duration-300 hover:scale-105">
              <Link href="/dashboard/grados">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver a Grados
              </Link>
            </Button>
            <div className="h-8 w-px bg-white/30"></div>
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/20">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Asignaciones Docente-Grado</h1>
                <p className="text-purple-100 text-lg">Gestiona las asignaciones de docentes titulares a cada grado</p>
              </div>
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
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Grados</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{grados.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Con Docente</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{gradosConDocente}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Sin Docente</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{gradosSinDocente}</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Docentes</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{docentes.length}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Assignment Form */}
        <Card className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Asignar Docente a Grado
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Seleccione un grado y asigne un docente titular
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <AsignacionDocenteForm grados={grados} docentes={docentes} />
          </CardContent>
        </Card>

        {/* Current Assignments */}
        <Card className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Asignaciones Actuales
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Estado actual de las asignaciones docente-grado
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {grados.map((grado: any) => (
                <div 
                  key={grado.id_grado} 
                  className="group relative overflow-hidden bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {grado.nivel_educativo} - {grado.nombre} {grado.seccion}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <span>Turno: {grado.turno}</span>
                          <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                          <span>Capacidad: {grado.capacidad_maxima}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {grado.grado_docente && grado.grado_docente.length > 0 ? (
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center gap-2 mb-1">
                              <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                                {grado.grado_docente[0].docentes.nombres} {grado.grado_docente[0].docentes.apellidos}
                              </p>
                            </div>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400">
                              {grado.grado_docente[0].docentes.especialidad}
                            </p>
                          </div>
                          <DesasignarDocenteButton 
                            gradoId={grado.id_grado}
                            nombreGrado={`${grado.nombre} ${grado.seccion}`}
                            nombreDocente={`${grado.grado_docente[0].docentes.nombres} ${grado.grado_docente[0].docentes.apellidos}`}
                          />
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                          <p className="text-sm font-medium text-amber-700 dark:text-amber-300 italic flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Sin docente asignado
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}