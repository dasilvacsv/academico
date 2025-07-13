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
import { desasignarEstudianteDeGrado } from "@/actions/academicos.actions"
import { Loader2, UserMinus, AlertTriangle } from "lucide-react"

interface DesasignarEstudianteButtonProps {
  estudianteId: string;
  nombreEstudiante: string;
  onDesasignar: () => void;
  children: React.ReactNode;
  userRole?: string; // Nuevo prop opcional para el rol
}

export function DesasignarEstudianteButton({ 
  estudianteId, 
  nombreEstudiante, 
  onDesasignar,
  children,
  userRole // Recibir el rol
}: DesasignarEstudianteButtonProps) {
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
      const result = await desasignarEstudianteDeGrado(estudianteId)
      if (result?.error) {
        setMessage({ type: "error", text: result.error })
      } else if (result?.success) {
        setMessage({ type: "success", text: result.success })
        onDesasignar()
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
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            Desasignar Estudiante
          </DialogTitle>
          <DialogDescription>
            El estudiante será movido de vuelta a la lista de pre-inscritos y podrá ser reasignado posteriormente.
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
              <strong>¿Deseas desasignar a {nombreEstudiante}?</strong>
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              • El estudiante será movido a pre-inscrito<br/>
              • El cupo quedará disponible para otros estudiantes<br/>
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