"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { asignarDocenteAGrado } from "@/actions/academicos.actions"
import { Loader2, UserCheck, BookOpen, GraduationCap, Check, AlertCircle } from "lucide-react"

interface AsignacionDocenteFormProps {
  grados: any[]
  docentes: any[]
}

export function AsignacionDocenteForm({ grados, docentes }: AsignacionDocenteFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedGrado, setSelectedGrado] = useState("")
  const [selectedDocente, setSelectedDocente] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit() {
    if (!selectedGrado || !selectedDocente) {
      setMessage({ type: "error", text: "Debe seleccionar un grado y un docente" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const result = await asignarDocenteAGrado(selectedDocente, selectedGrado)
      if (result?.error) {
        setMessage({ type: "error", text: result.error })
      } else if (result?.success) {
        setMessage({ type: "success", text: result.success })
        setSelectedGrado("")
        setSelectedDocente("")
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error inesperado. Intenta nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedGradoData = grados.find(g => g.id_grado === selectedGrado)
  const selectedDocenteData = docentes.find(d => d.id_docente === selectedDocente)

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
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            )}
            <AlertDescription className={message.type === "error" ? "text-red-800 dark:text-red-200" : "text-green-800 dark:text-green-200"}>
              {message.text}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grade Selection */}
        <div className="space-y-4">
          <Label className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Grado y Sección
          </Label>
          <Select value={selectedGrado} onValueChange={setSelectedGrado} disabled={isLoading}>
            <SelectTrigger className="h-14 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200">
              <SelectValue placeholder="Seleccionar grado..." />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              {grados.map((grado) => (
                <SelectItem 
                  key={grado.id_grado} 
                  value={grado.id_grado}
                  className="hover:bg-blue-50 dark:hover:bg-blue-950 focus:bg-blue-50 dark:focus:bg-blue-950 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">
                      {grado.nivel_educativo} - {grado.nombre} {grado.seccion}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                      {grado.turno}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedGradoData && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                    {selectedGradoData.nombre} {selectedGradoData.seccion}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {selectedGradoData.nivel_educativo} • {selectedGradoData.turno}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Capacidad: {selectedGradoData.capacidad_maxima} estudiantes
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Teacher Selection */}
        <div className="space-y-4">
          <Label className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Docente
          </Label>
          <Select value={selectedDocente} onValueChange={setSelectedDocente} disabled={isLoading}>
            <SelectTrigger className="h-14 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500 transition-colors duration-200">
              <SelectValue placeholder="Seleccionar docente..." />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              {docentes.map((docente) => (
                <SelectItem 
                  key={docente.id_docente} 
                  value={docente.id_docente}
                  className="hover:bg-purple-50 dark:hover:bg-purple-950 focus:bg-purple-50 dark:focus:bg-purple-950 transition-colors duration-200"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {docente.nombres} {docente.apellidos}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {docente.especialidad}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedDocenteData && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                    {selectedDocenteData.nombres} {selectedDocenteData.apellidos}
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    {selectedDocenteData.especialidad}
                  </p>
                  {selectedDocenteData.telefono && (
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Tel: {selectedDocenteData.telefono}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !selectedGrado || !selectedDocente} 
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Asignando docente...
            </>
          ) : (
            <>
              <UserCheck className="mr-3 h-5 w-5" />
              Asignar Docente al Grado
            </>
          )}
        </Button>
      </div>
    </div>
  )
}