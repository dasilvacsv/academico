"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { crearGrado } from "@/actions/academicos.actions"
import { Loader2, Plus, BookOpen, CheckCircle, AlertCircle } from "lucide-react"

interface CrearGradoFormProps {
  userRole: string // Nuevo prop para el rol
}

export function CrearGradoForm({ userRole }: CrearGradoFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Verificar si el usuario es administrador
  const isAdmin = userRole === "administrador"
  if (!isAdmin) return null // Ocultar completamente si no es administrador

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await crearGrado(formData)
      if (result?.error) {
        setMessage({ type: "error", text: result.error })
      } else if (result?.success) {
        setMessage({ type: "success", text: result.success })
        // Reset form
        const form = document.getElementById("crear-grado-form") as HTMLFormElement
        form?.reset()
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
        <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-lg transition-all duration-300 hover:scale-105">
          <Plus className="mr-2 h-5 w-5" />
          Nuevo Grado
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader className="pb-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Crear Nuevo Grado
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Configura un nuevo grado o sección
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form id="crear-grado-form" action={handleSubmit} className="space-y-6">
          {message && (
            <Alert 
              variant={message.type === "error" ? "destructive" : "default"}
              className={message.type === "success" ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30" : ""}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription className={message.type === "success" ? "text-green-800 dark:text-green-300" : ""}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nivel_educativo" className="text-sm font-medium">
                Nivel Educativo *
              </Label>
              <Select name="nivel_educativo" required disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inicial">Inicial</SelectItem>
                  <SelectItem value="Primaria">Primaria</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium">
                Nombre del Grado *
              </Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Ej: 1er Grado"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seccion" className="text-sm font-medium">
                Sección *
              </Label>
              <Select name="seccion" required disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sección" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                  <SelectItem value="E">E</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="turno" className="text-sm font-medium">
                Turno *
              </Label>
              <Select name="turno" required disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mañana">Mañana</SelectItem>
                  <SelectItem value="Tarde">Tarde</SelectItem>
                  <SelectItem value="Noche">Noche</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacidad_maxima" className="text-sm font-medium">
              Capacidad Máxima *
            </Label>
            <Input
              id="capacidad_maxima"
              name="capacidad_maxima"
              type="number"
              min="1"
              max="40"
              placeholder="30"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setIsOpen(false)} 
              disabled={isLoading}
              className="px-6"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Grado
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}