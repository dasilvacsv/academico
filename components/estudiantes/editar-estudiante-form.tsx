"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { actualizarEstudiante } from "@/actions/estudiantes.actions"
import { Loader2, User, Calendar, MapPin, Phone, Mail, Heart, Globe, Save, CheckCircle, AlertCircle, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface EditarEstudianteFormProps {
  estudiante: any
}

export function EditarEstudianteForm({ estudiante }: EditarEstudianteFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await actualizarEstudiante(estudiante.id_estudiante, formData)
      if (result?.error) {
        setMessage({ type: "error", text: result.error })
      } else if (result?.success) {
        setMessage({ type: "success", text: result.success })
        setTimeout(() => {
          router.push(`/dashboard/estudiantes/${estudiante.id_estudiante}`)
        }, 1500)
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error inesperado. Intenta nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form action={handleSubmit} className="space-y-8">
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Alert 
              variant={message.type === "error" ? "destructive" : "default"}
              className={`${
                message.type === "success" 
                  ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 shadow-lg shadow-emerald-500/10" 
                  : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 shadow-lg shadow-red-500/10"
              } backdrop-blur-sm`}
            >
              <div className="flex items-center gap-2">
                {message.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
                <AlertDescription className={`font-medium ${
                  message.type === "success" 
                    ? "text-emerald-800 dark:text-emerald-300" 
                    : "text-red-800 dark:text-red-300"
                }`}>
                  {message.text}
                </AlertDescription>
              </div>
            </Alert>
          </motion.div>
        )}

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <User className="h-6 w-6" />
                  </div>
                  Información Personal
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent className="space-y-8 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="nombres" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Nombres *
                  </Label>
                  <Input 
                    id="nombres" 
                    name="nombres" 
                    defaultValue={estudiante.nombres}
                    className="h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-slate-900 dark:text-slate-100"
                    required 
                    disabled={isLoading} 
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="apellidos" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Apellidos *
                  </Label>
                  <Input 
                    id="apellidos" 
                    name="apellidos" 
                    defaultValue={estudiante.apellidos}
                    className="h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-slate-900 dark:text-slate-100"
                    required 
                    disabled={isLoading} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="fecha_nacimiento" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Fecha de Nacimiento *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="fecha_nacimiento"
                      name="fecha_nacimiento"
                      type="date"
                      defaultValue={estudiante.fecha_nacimiento}
                      className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-slate-900 dark:text-slate-100"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="genero" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Género *
                  </Label>
                  <div className="relative">
                    <Heart className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 z-10" />
                    <Select name="genero" defaultValue={estudiante.genero} required disabled={isLoading}>
                      <SelectTrigger className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-slate-900 dark:text-slate-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 rounded-xl">
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Femenino">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="nacionalidad" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Nacionalidad *
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 z-10" />
                    <Select name="nacionalidad" defaultValue={estudiante.nacionalidad} required disabled={isLoading}>
                      <SelectTrigger className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-slate-900 dark:text-slate-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 rounded-xl">
                        <SelectItem value="Venezolana">Venezolana</SelectItem>
                        <SelectItem value="Extranjera">Extranjera</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="estado_nacimiento" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Estado de Nacimiento
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="estado_nacimiento"
                      name="estado_nacimiento"
                      defaultValue={estudiante.estado_nacimiento || ""}
                      className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-slate-900 dark:text-slate-100"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="telefono_contacto" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Teléfono de Contacto
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="telefono_contacto"
                      name="telefono_contacto"
                      defaultValue={estudiante.telefono_contacto || ""}
                      className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-slate-900 dark:text-slate-100"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Mail className="h-6 w-6" />
                  </div>
                  Información de Contacto
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-3">
                <Label htmlFor="direccion" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Dirección
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <Textarea 
                    id="direccion" 
                    name="direccion" 
                    defaultValue={estudiante.direccion || ""} 
                    className="min-h-[100px] pl-12 pt-4 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-slate-900 dark:text-slate-100 resize-none"
                    disabled={isLoading} 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="correo_electronico" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="correo_electronico"
                    name="correo_electronico"
                    type="email"
                    defaultValue={estudiante.correo_electronico || ""}
                    className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-slate-900 dark:text-slate-100"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Special Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Shield className="h-6 w-6" />
                  </div>
                  Información Médica y Especial
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-3">
                <Label htmlFor="condicion_especial" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Condición Especial
                </Label>
                <div className="relative">
                  <Shield className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <Textarea
                    id="condicion_especial"
                    name="condicion_especial"
                    defaultValue={estudiante.condicion_especial || ""}
                    placeholder="Alergias, condiciones médicas, necesidades especiales, etc."
                    className="min-h-[120px] pl-12 pt-4 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-slate-900 dark:text-slate-100 resize-none"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-amber-800 dark:text-amber-300">Información Confidencial</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-200 leading-relaxed">
                      Esta información es confidencial y solo será utilizada para brindar el mejor cuidado y atención al estudiante.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-slate-200/50 dark:border-slate-700/50"
        >
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            disabled={isLoading} 
            onClick={() => router.back()}
            className="sm:w-auto w-full h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-200 text-slate-700 dark:text-slate-300"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            size="lg"
            className="sm:w-auto w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 border-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Actualizar Estudiante
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}