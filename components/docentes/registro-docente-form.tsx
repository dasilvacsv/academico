"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { registrarDocente } from "@/actions/docentes.actions"
import { Loader2, User, Mail, Phone, GraduationCap, Lock, CheckCircle, AlertCircle } from "lucide-react"

export function RegistroDocenteForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await registrarDocente(formData)
      if (result?.error) {
        setMessage({ type: "error", text: result.error })
      } else if (result?.success) {
        setMessage({ type: "success", text: result.success })
        // Reset form
        const form = document.getElementById("registro-docente-form") as HTMLFormElement
        form?.reset()
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error inesperado. Intenta nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form id="registro-docente-form" action={handleSubmit} className="space-y-8">
      {message && (
        <Alert 
          variant={message.type === "error" ? "destructive" : "default"}
          className={message.type === "success" ? "border-green-200 bg-green-50" : ""}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-800" : ""}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Personal Information */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-blue-600" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombres" className="text-sm font-medium">
                Nombres *
              </Label>
              <Input 
                id="nombres" 
                name="nombres" 
                placeholder="Ingrese los nombres"
                className="h-11"
                required 
                disabled={isLoading} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellidos" className="text-sm font-medium">
                Apellidos *
              </Label>
              <Input 
                id="apellidos" 
                name="apellidos" 
                placeholder="Ingrese los apellidos"
                className="h-11"
                required 
                disabled={isLoading} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cedula" className="text-sm font-medium">
                Cédula de Identidad *
              </Label>
              <Input 
                id="cedula" 
                name="cedula" 
                placeholder="Ej: 12345678"
                className="h-11"
                required 
                disabled={isLoading} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-sm font-medium">
                Teléfono *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input 
                  id="telefono" 
                  name="telefono" 
                  placeholder="Ej: +58 414 123 4567"
                  className="h-11 pl-10"
                  required 
                  disabled={isLoading} 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            Información Profesional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="especialidad" className="text-sm font-medium">
              Especialidad *
            </Label>
            <Input
              id="especialidad"
              name="especialidad"
              placeholder="Ej: Matemáticas, Lengua y Literatura, Ciencias Naturales"
              className="h-11"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo_institucional" className="text-sm font-medium">
              Correo Institucional *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="correo_institucional"
                name="correo_institucional"
                type="email"
                placeholder="docente@escuela.edu"
                className="h-11 pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Credentials */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5 text-green-600" />
            Credenciales de Acceso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Contraseña Temporal
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Dejar vacío para usar 'temporal123'"
              className="h-11"
              disabled={isLoading}
            />
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                <strong>Nota:</strong> Si no especifica una contraseña, se asignará "temporal123" por defecto. 
                El docente deberá cambiarla en su primer acceso al sistema.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
        <Button 
          type="button" 
          variant="outline" 
          size="lg"
          disabled={isLoading}
          className="sm:w-auto w-full"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          size="lg"
          className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <User className="mr-2 h-4 w-4" />
              Registrar Docente
            </>
          )}
        </Button>
      </div>
    </form>
  )
}