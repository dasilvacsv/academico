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
import { desasignarDocenteDeGrado } from "@/actions/academicos.actions"
import { Loader2, UserMinus, AlertTriangle } from "lucide-react"

interface DesasignarDocenteButtonProps {
  gradoId: string
  nombreGrado: string
  nombreDocente: string
  userRole: string // Nuevo prop para el rol
}

export function DesasignarDocenteButton({ 
  gradoId, 
  nombreGrado, 
  nombreDocente,
  userRole // Recibir el rol
}: DesasignarDocenteButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Verificar si el usuario es administrador
  const isAdmin = userRole === "administrador"
  if (!isAdmin) return null // Ocultar completamente si no es administrador

  async function handleDesasignar() {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await desasignarDocenteDeGrado(gradoId)
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="hover:bg-amber-50 dark:hover:bg-amber-950/50 text-amber-600 dark:text-amber-400"
        >
          <UserMinus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            Desasignar Docente
          </DialogTitle>
          <DialogDescription>
            El docente será removido de este grado y quedará disponible para otras asignaciones.
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

          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>¿Deseas desasignar a {nombreDocente} del grado {nombreGrado}?</strong>
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              • El docente quedará disponible para otras asignaciones<br/>
              • El grado quedará sin docente titular<br/>
              • Podrá ser reasignado posteriormente
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={handleDesasignar} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Desasignando...
              </>
            ) : (
              <>
                <UserMinus className="mr-2 h-4 w-4" />
                Desasignar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}