import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { obtenerMetricasCompletas } from "@/actions/academicos.actions";
import { BotonDescargaPDF } from './BotonDescargaPDF'; 
import { 
  BarChart3, Users, BookOpen, TrendingUp, 
  Clock, Target, UserCheck, School, Baby, Heart, Building
} from "lucide-react";

export default async function ReportesPage() {
  const metricas = await obtenerMetricasCompletas();

  // Estado de error si las métricas no se pueden cargar
  if (!metricas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 dark:from-slate-950 dark:via-red-950 dark:to-pink-950 p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-red-600 dark:text-red-400">Error al cargar las métricas del sistema.</p>
        </div>
      </div>
    );
  }
  
  const {
    metricas_generales,
    distribucion_genero,
    distribucion_nivel,
    distribucion_turno,
    grados_ocupacion,
    rendimiento_academico,
    estudiantes_por_edad,
  } = metricas;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-12 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard de Métricas</h1>
                <p className="text-indigo-100 text-lg">Análisis completo del sistema educativo</p>
              </div>
            </div>
            {/* --- Componente de Cliente para el Botón de Descarga --- */}
            <BotonDescargaPDF metricas={metricas} />
          </div>
        </div>

        {/* Métricas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Estudiantes</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{metricas_generales.total_estudiantes}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {metricas_generales.matriculas_actuales} inscritos
                  </p>
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
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Grados</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{metricas_generales.total_grados}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Secciones disponibles</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Pre-inscritos</p>
                  <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{metricas_generales.pre_inscritos}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Pendientes de asignar</p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribución por Nivel Educativo */}
        <Card className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                <School className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Distribución por Nivel Educativo
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Estudiantes y capacidad por nivel académico
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid gap-6 md:grid-cols-3">
              {distribucion_nivel.map((nivel: any) => {
                const ocupacion = nivel.capacidad_total > 0 ? (nivel.estudiantes / nivel.capacidad_total) * 100 : 0;
                return (
                  <div key={nivel.nivel_educativo} className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">
                        {nivel.nivel_educativo}
                      </h3>
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                        {nivel.grados_disponibles} grados
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Estudiantes:</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {nivel.estudiantes || 0} / {nivel.capacidad_total}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-1000 ${
                            ocupacion >= 90 
                              ? 'bg-gradient-to-r from-red-500 to-red-600' 
                              : ocupacion >= 70 
                              ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                              : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                          }`}
                          style={{ width: `${Math.min(ocupacion, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Ocupación:</span>
                        <span className={`font-semibold ${
                          ocupacion >= 90 ? 'text-red-600 dark:text-red-400' :
                          ocupacion >= 70 ? 'text-amber-600 dark:text-amber-400' :
                          'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {ocupacion.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Distribución por Género y Turno */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Distribución por Género
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Estudiantes inscritos por género
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {distribucion_genero.map((genero: any) => {
                  const total = distribucion_genero.reduce((sum: number, g: any) => sum + g.cantidad, 0);
                  const porcentaje = total > 0 ? (genero.cantidad / total) * 100 : 0;
                  return (
                    <div key={genero.genero} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            genero.genero === 'Masculino' 
                              ? 'bg-blue-100 dark:bg-blue-900' 
                              : 'bg-pink-100 dark:bg-pink-900'
                          }`}>
                            {genero.genero === 'Masculino' ? (
                              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                            )}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {genero.genero}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {genero.cantidad}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {porcentaje.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            genero.genero === 'Masculino'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                              : 'bg-gradient-to-r from-pink-500 to-pink-600'
                          }`}
                          style={{ width: `${porcentaje}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Distribución por Turno
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Estudiantes por horario de clases
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {distribucion_turno.map((turno: any) => {
                  const total = distribucion_turno.reduce((sum: number, t: any) => sum + t.estudiantes, 0);
                  const porcentaje = total > 0 ? (turno.estudiantes / total) * 100 : 0;
                  return (
                    <div key={turno.turno} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            turno.turno === 'Mañana' 
                              ? 'bg-yellow-100 dark:bg-yellow-900' 
                              : 'bg-indigo-100 dark:bg-indigo-900'
                          }`}>
                            <Clock className={`h-4 w-4 ${
                              turno.turno === 'Mañana'
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-indigo-600 dark:text-indigo-400'
                            }`} />
                          </div>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {turno.turno}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {turno.estudiantes || 0}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {turno.grados} grados
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            turno.turno === 'Mañana'
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                              : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                          }`}
                          style={{ width: `${porcentaje}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grados con Mayor Ocupación */}
        <Card className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Grados con Mayor Ocupación
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Top 10 grados por porcentaje de ocupación
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {grados_ocupacion.slice(0, 10).map((grado: any, index: number) => (
                <div key={index} className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                        <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          {grado.grado_completo}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {grado.estudiantes_inscritos} / {grado.capacidad_maxima} estudiantes
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={grado.porcentaje_ocupacion >= 90 ? "destructive" : grado.porcentaje_ocupacion >= 70 ? "secondary" : "default"}
                      className="text-sm font-semibold"
                    >
                      {grado.porcentaje_ocupacion}%
                    </Badge>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        grado.porcentaje_ocupacion >= 90 
                          ? 'bg-gradient-to-r from-red-500 to-red-600' 
                          : grado.porcentaje_ocupacion >= 70 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                      }`}
                      style={{ width: `${Math.min(grado.porcentaje_ocupacion, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estudiantes por Edad */}
        <Card className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                <Baby className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Distribución por Edad
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Estudiantes agrupados por rango de edad
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {estudiantes_por_edad.map((edad: any, index: number) => {
                const total = estudiantes_por_edad.reduce((sum: number, e: any) => sum + e.cantidad, 0);
                const porcentaje = total > 0 ? (edad.cantidad / total) * 100 : 0;
                return (
                  <div key={index} className="text-center p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                    <div className="p-3 bg-cyan-100 dark:bg-cyan-900 rounded-full w-fit mx-auto mb-3">
                      <Baby className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                      {edad.cantidad}
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {edad.rango_edad}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {porcentaje.toFixed(1)}%
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Rendimiento Académico */}
        {rendimiento_academico.total_registros > 0 && (
          <Card className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Rendimiento Académico
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Distribución de calificaciones del año escolar
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
                    {rendimiento_academico.promedio_general?.toFixed(2) || 'N/A'}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">Promedio General</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Excelente (18-20):</span>
                    <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                      {rendimiento_academico.excelente} estudiantes
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Bueno (14-17):</span>
                    <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700">
                      {rendimiento_academico.bueno} estudiantes
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-lg border border-amber-200 dark:border-amber-800">
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Regular (10-13):</span>
                    <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700">
                      {rendimiento_academico.regular} estudiantes
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 rounded-lg border border-red-200 dark:border-red-800">
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">Deficiente (&lt;10):</span>
                    <Badge variant="outline" className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700">
                      {rendimiento_academico.deficiente} estudiantes
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}