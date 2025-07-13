"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { asignarCupo } from "@/actions/academicos.actions"
import { Loader2, UserCheck, BookOpen, Users, Check, AlertCircle } from "lucide-react"

interface AsignarCupoFormProps {
  estudianteId: string
  grados: any[]
}

export function AsignarCupoForm({ estudianteId, grados }: AsignarCupoFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedGrado, setSelectedGrado] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit() {
    if (!selectedGrado) {
      setMessage({ type: "error", text: "Debe seleccionar un grado" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const result = await asignarCupo(estudianteId, selectedGrado)
      if (result?.error) {
        setMessage({ type: "error", text: result.error })
      } else if (result?.success) {
        setMessage({ type: "success", text: result.success })
        setTimeout(() => {
          setIsOpen(false)
          setSelectedGrado("")
          setMessage(null)
        }, 1500)
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error inesperado. Intenta nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedGradoData = grados.find(g => g.id_grado === selectedGrado)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Asignar Cupo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader className="pb-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Asignar Cupo
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Seleccione el grado y sección para asignar al estudiante
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-6">
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

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Grado y Sección
              </label>
            </div>
            <Select value={selectedGrado} onValueChange={setSelectedGrado} disabled={isLoading}>
              <SelectTrigger className="h-14 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200">
                <SelectValue placeholder="Seleccionar grado..." />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                {grados
                  .filter(grado => (grado.estudiantes_actuales || 0) < grado.capacidad_maxima)
                  .map((grado) => {
                    const ocupacion = ((grado.estudiantes_actuales || 0) / grado.capacidad_maxima) * 100
                    const cuposDisponibles = grado.capacidad_maxima - (grado.estudiantes_actuales || 0)
                    
                    return (
                      <SelectItem 
                        key={grado.id_grado} 
                        value={grado.id_grado}
                        className="hover:bg-blue-50 dark:hover:bg-blue-950 focus:bg-blue-50 dark:focus:bg-blue-950 transition-colors duration-200 py-4"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {grado.nivel_educativo} - {grado.nombre} {grado.seccion}
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {grado.turno} • {cuposDisponibles} cupos disponibles
                            </span>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  ocupacion >= 90 
                                    ? 'bg-red-500' 
                                    : ocupacion >= 70 
                                    ? 'bg-amber-500' 
                                    : 'bg-green-500'
                                }`}
                                style={{ width: `${ocupacion}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 w-10 text-right">
                              {Math.round(ocupacion)}%
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
              </SelectContent>
            </Select>
            
            {selectedGradoData && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                      {selectedGradoData.nivel_educativo} - {selectedGradoData.nombre} {selectedGradoData.seccion}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700 dark:text-blue-300">Turno: </span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">{selectedGradoData.turno}</span>
                      </div>
                      <div>
                        <span className="text-blue-700 dark:text-blue-300">Capacidad: </span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">{selectedGradoData.capacidad_maxima}</span>
                      </div>
                      <div>
                        <span className="text-blue-700 dark:text-blue-300">Ocupados: </span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">{selectedGradoData.estudiantes_actuales || 0}</span>
                      </div>
                      <div>
                        <span className="text-blue-700 dark:text-blue-300">Disponibles: </span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          {selectedGradoData.capacidad_maxima - (selectedGradoData.estudiantes_actuales || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)} 
            disabled={isLoading}
            className="px-6 py-3 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !selectedGrado}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Asignando...
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Asignar Cupo
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}