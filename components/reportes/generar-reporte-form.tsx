"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { generarReporteMatricula, generarReporteDocentes, generarReporteGrados } from "@/actions/academicos.actions"
import { Loader2, Download, FileText, Eye, BarChart3, Users, CheckCircle, AlertCircle } from "lucide-react"

interface GenerarReporteFormProps {
  tipoReporte: string
  grados: any[]
}

export function GenerarReporteForm({ tipoReporte, grados }: GenerarReporteFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [reporteData, setReporteData] = useState<any>(null)
  const [filtros, setFiltros] = useState({
    anoEscolar: new Date().getFullYear().toString(),
    estatus: "",
    grado: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleGenerar() {
    setIsLoading(true)
    setMessage(null)
    setReporteData(null)

    try {
      if (tipoReporte === "matricula") {
        const result = await generarReporteMatricula(filtros)
        if (result?.error) {
          setMessage({ type: "error", text: result.error })
        } else if (result?.success && result?.data) {
          const resumen = {
            total: result.data.length,
            inscritos: result.data.filter((item: any) => item.estatus === "inscrito").length,
            preInscritos: result.data.filter((item: any) => item.estatus === "pre-inscrito").length,
          }

          setReporteData({
            data: result.data,
            filtros,
            resumen,
          })
          setMessage({ type: "success", text: `${result.success}. ${result.data.length} registros encontrados.` })
        }
      } else if (tipoReporte === "docentes") {
        const result = await generarReporteDocentes()
        if (result?.error) {
          setMessage({ type: "error", text: result.error })
        } else if (result?.success && result?.data) {
          const resumen = {
            total: result.data.length,
            activos: result.data.filter((item: any) => item.activo === 1).length,
          }

          setReporteData({
            data: result.data,
            resumen,
          })
          setMessage({ type: "success", text: `${result.success}. ${result.data.length} registros encontrados.` })
        }
      } else if (tipoReporte === "grados") {
        const result = await generarReporteGrados()
        if (result?.error) {
          setMessage({ type: "error", text: result.error })
        } else if (result?.success && result?.data) {
          const resumen = {
            totalGrados: result.data.length,
            totalEstudiantes: result.data.reduce((sum: number, grado: any) => sum + (grado.total_estudiantes || 0), 0),
            gradosConDocente: result.data.filter((grado: any) => grado.docente_nombre).length,
          }

          setReporteData({
            data: result.data,
            resumen,
          })
          setMessage({ type: "success", text: `${result.success}. ${result.data.length} registros encontrados.` })
        }
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error inesperado. Intenta nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVistaPrevia() {
    if (!reporteData) return

    try {
      setIsLoading(true)

      const response = await fetch("/api/preview-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipoReporte,
          data: reporteData,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        window.open(url, "_blank")
        window.URL.revokeObjectURL(url)
      } else {
        setMessage({ type: "error", text: "Error al generar vista previa" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al generar vista previa" })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDescargarPDF() {
    if (!reporteData) return

    try {
      setIsLoading(true)

      const response = await fetch("/api/generar-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipoReporte,
          data: reporteData,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = getFileName()
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setMessage({ type: "success", text: "PDF descargado exitosamente" })
      } else {
        setMessage({ type: "error", text: "Error al generar el PDF" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error al descargar el PDF" })
    } finally {
      setIsLoading(false)
    }
  }

  const getFileName = () => {
    const fecha = new Date().toISOString().split("T")[0]
    switch (tipoReporte) {
      case "matricula":
        return `reporte-matricula-${filtros.anoEscolar}-${fecha}.pdf`
      case "docentes":
        return `reporte-docentes-${fecha}.pdf`
      case "grados":
        return `reporte-grados-${fecha}.pdf`
      default:
        return `reporte-${fecha}.pdf`
    }
  }

  const getReportIcon = () => {
    switch (tipoReporte) {
      case "matricula":
        return <Users className="h-5 w-5" />
      case "docentes":
        return <Users className="h-5 w-5" />
      case "grados":
        return <BarChart3 className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-8">
      {message && (
        <Alert 
          variant={message.type === "error" ? "destructive" : "default"} 
          className={`border-l-4 ${
            message.type === "error" 
              ? "border-l-red-500 bg-red-50 dark:bg-red-950/50" 
              : "border-l-green-500 bg-green-50 dark:bg-green-950/50"
          } transition-all duration-300`}
        >
          <div className="flex items-center gap-2">
            {message.type === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            )}
            <AlertDescription className={message.type === "error" ? "text-red-800 dark:text-red-200" : "text-green-800 dark:text-green-200"}>
              {message.text}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {tipoReporte === "matricula" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Filtros de Búsqueda
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Año Escolar</Label>
              <Select
                value={filtros.anoEscolar}
                onValueChange={(value) => setFiltros({ ...filtros, anoEscolar: value })}
                disabled={isLoading}
              >
                <SelectTrigger className="h-12 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Estatus</Label>
              <Select
                value={filtros.estatus}
                onValueChange={(value) => setFiltros({ ...filtros, estatus: value })}
                disabled={isLoading}
              >
                <SelectTrigger className="h-12 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors duration-200">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="inscrito">Inscrito</SelectItem>
                  <SelectItem value="pre-inscrito">Pre-inscrito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Grado</Label>
              <Select
                value={filtros.grado}
                onValueChange={(value) => setFiltros({ ...filtros, grado: value })}
                disabled={isLoading}
              >
                <SelectTrigger className="h-12 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500 transition-colors duration-200">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem value="todos">Todos</SelectItem>
                  {grados.map((grado) => (
                    <SelectItem key={grado.id_grado} value={grado.id_grado}>
                      {grado.nivel_educativo} - {grado.nombre} {grado.seccion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleGenerar} 
          disabled={isLoading} 
          className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Generando reporte...
            </>
          ) : (
            <>
              {getReportIcon()}
              <span className="ml-3">Generar Reporte</span>
            </>
          )}
        </Button>

        {reporteData && (
          <>
            <Button 
              variant="outline" 
              onClick={handleVistaPrevia} 
              disabled={isLoading}
              className="h-14 px-8 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105"
            >
              <Eye className="mr-2 h-5 w-5" />
              Vista Previa
            </Button>

            <Button 
              onClick={handleDescargarPDF} 
              disabled={isLoading}
              className="h-14 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Download className="mr-2 h-5 w-5" />
              )}
              Descargar PDF
            </Button>
          </>
        )}
      </div>

      {reporteData && (
        <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Resumen del Reporte</h3>
          </div>
          
          {tipoReporte === "matricula" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{reporteData.resumen.total}</p>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{reporteData.resumen.inscritos}</p>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Inscritos</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{reporteData.resumen.preInscritos}</p>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Pre-inscritos</p>
                </div>
              </div>
            </div>
          )}
          
          {tipoReporte === "docentes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{reporteData.resumen.total}</p>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{reporteData.resumen.activos}</p>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Activos</p>
                </div>
              </div>
            </div>
          )}
          
          {tipoReporte === "grados" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{reporteData.resumen.totalGrados}</p>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Grados</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{reporteData.resumen.totalEstudiantes}</p>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Estudiantes</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{reporteData.resumen.gradosConDocente}</p>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Con Docente</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}