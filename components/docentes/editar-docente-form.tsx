"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { actualizarDocente } from "@/actions/docentes.actions"
import { Loader2, User, Mail, Phone, GraduationCap, Save, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface EditarDocenteFormProps {
  docente: any
}

export function EditarDocenteForm({ docente }: EditarDocenteFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await actualizarDocente(docente.id_docente, formData)
      if (result?.error) {
        setMessage({ type: "error", text: result.error })
      } else if (result?.success) {
        setMessage({ type: "success", text: result.success })
        setTimeout(() => {
          router.push("/dashboard/docentes")
        }, 1500)
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error inesperado. Intenta nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
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

      {/* Personal Information */}
      <Card className="border-border dark:border-gray-800 bg-card dark:bg-gray-900">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-foreground dark:text-white">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombres" className="text-sm font-medium text-foreground dark:text-white">
                Nombres *
              </Label>
              <Input 
                id="nombres" 
                name="nombres" 
                defaultValue={docente.nombres}
                className="h-11 bg-background dark:bg-gray-800 border-border dark:border-gray-700 text-foreground dark:text-white"
                required 
                disabled={isLoading} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellidos" className="text-sm font-medium text-foreground dark:text-white">
                Apellidos *
              </Label>
              <Input 
                id="apellidos" 
                name="apellidos" 
                defaultValue={docente.apellidos}
                className="h-11 bg-background dark:bg-gray-800 border-border dark:border-gray-700 text-foreground dark:text-white"
                required 
                disabled={isLoading} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-sm font-medium text-foreground dark:text-white">
                Teléfono *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-gray-400" />
                <Input 
                  id="telefono" 
                  name="telefono" 
                  defaultValue={docente.telefono}
                  className="h-11 pl-10 bg-background dark:bg-gray-800 border-border dark:border-gray-700 text-foreground dark:text-white"
                  required 
                  disabled={isLoading} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="especialidad" className="text-sm font-medium text-foreground dark:text-white">
                Especialidad *
              </Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-gray-400" />
                <Input
                  id="especialidad"
                  name="especialidad"
                  defaultValue={docente.especialidad}
                  className="h-11 pl-10 bg-background dark:bg-gray-800 border-border dark:border-gray-700 text-foreground dark:text-white"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card className="border-border dark:border-gray-800 bg-card dark:bg-gray-900">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-foreground dark:text-white">
            <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Información de Contacto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="correo_institucional" className="text-sm font-medium text-foreground dark:text-white">
              Correo Institucional *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-gray-400" />
              <Input
                id="correo_institucional"
                name="correo_institucional"
                type="email"
                defaultValue={docente.correo_institucional}
                className="h-11 pl-10 bg-background dark:bg-gray-800 border-border dark:border-gray-700 text-foreground dark:text-white"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Nota:</strong> Los cambios en el correo institucional pueden afectar el acceso del docente al sistema. 
              Asegúrese de que el nuevo correo sea válido y esté activo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Read-only Information */}
      <Card className="border-border dark:border-gray-800 bg-muted/50 dark:bg-gray-800/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-muted-foreground dark:text-gray-400">
            <User className="h-5 w-5" />
            Información de Solo Lectura
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground dark:text-gray-400">
              Cédula de Identidad
            </Label>
            <Input
              value={docente.cedula}
              className="h-11 bg-muted dark:bg-gray-700 text-muted-foreground dark:text-gray-300 border-border dark:border-gray-600"
              disabled
              readOnly
            />
            <p className="text-xs text-muted-foreground dark:text-gray-500">
              La cédula no puede ser modificada después del registro
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-border dark:border-gray-800">
        <Button 
          type="button" 
          variant="outline" 
          size="lg"
          disabled={isLoading} 
          onClick={() => router.back()}
          className="sm:w-auto w-full border-border dark:border-gray-700 hover:bg-muted dark:hover:bg-gray-800 text-foreground dark:text-white"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          size="lg"
          className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualizando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Actualizar Docente
            </>
          )}
        </Button>
      </div>
    </form>
  )
}