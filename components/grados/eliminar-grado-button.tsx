"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { eliminarGrado } from "@/actions/academicos.actions"
import { Loader2, Trash2, AlertTriangle } from "lucide-react"

interface EliminarGradoButtonProps {
  gradoId: string
  nombreGrado: string
  estudiantesActuales: number
  userRole: string // Nuevo prop para el rol
}

export function EliminarGradoButton({ 
  gradoId, 
  nombreGrado, 
  estudiantesActuales,
  userRole // Recibir el rol
}: EliminarGradoButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Verificar si el usuario es administrador
  const isAdmin = userRole === "administrador"
  if (!isAdmin) return null // Ocultar completamente si no es administrador

  async function handleEliminar() {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await eliminarGrado(gradoId)
      if (result?.error) {
        setMessage({ type: "error", text: result.error })
      } else if (result?.success) {
        setMessage({ type: "success", text: result.success })
        setTimeout(() => {
          setIsOpen(false)
          setMessage(null)
        }, 1500)
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error inesperado. Intenta nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  const puedeEliminar = estudiantesActuales === 0

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400"
          disabled={!puedeEliminar}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Grado
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el grado y sus asignaciones.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              <AlertDescription>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {!puedeEliminar ? (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>No se puede eliminar el grado {nombreGrado}</strong>
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                El grado tiene {estudiantesActuales} estudiantes asignados. Debe desasignar a todos los estudiantes antes de poder eliminarlo.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>¿Estás seguro de que deseas eliminar el grado {nombreGrado}?</strong>
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                • Se eliminará la asignación de docente si existe<br/>
                • Se removerán todas las configuraciones del grado<br/>
                • Esta acción es irreversible
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          {puedeEliminar && (
            <Button variant="destructive" onClick={handleEliminar} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar Grado
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}