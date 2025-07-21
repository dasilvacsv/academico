"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { actualizarEstudiante } from "@/actions/estudiantes.actions"

// Iconos importados para los campos del formulario
import { 
    Loader2, User, Calendar, MapPin, Phone, Mail, Heart, 
    Globe, Save, CheckCircle, AlertCircle, Shield, BookOpen 
} from "lucide-react"

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
          // Se refresca la ruta para asegurar que los datos actualizados se muestren.
          router.refresh() 
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
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
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

        {/* Información Personal del Estudiante */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                    <CardHeader className="p-0">
                        <CardTitle className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-white/20 rounded-lg"><User className="h-6 w-6" /></div>
                            Información Personal del Estudiante
                        </CardTitle>
                    </CardHeader>
                </div>
                <CardContent className="space-y-8 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="nombres" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Nombres *</Label>
                            <Input id="nombres" name="nombres" defaultValue={estudiante.nombres} className="h-12" required disabled={isLoading} />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="apellidos" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Apellidos *</Label>
                            <Input id="apellidos" name="apellidos" defaultValue={estudiante.apellidos} className="h-12" required disabled={isLoading} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="fecha_nacimiento" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Fecha de Nacimiento *</Label>
                            <Input type="date" id="fecha_nacimiento" name="fecha_nacimiento" defaultValue={estudiante.fecha_nacimiento} className="h-12" required disabled={isLoading} />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="genero" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Género *</Label>
                            <Select name="genero" defaultValue={estudiante.genero} required disabled={isLoading}>
                                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Masculino">Masculino</SelectItem><SelectItem value="Femenino">Femenino</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="nacionalidad" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Nacionalidad *</Label>
                            <Select name="nacionalidad" defaultValue={estudiante.nacionalidad} required disabled={isLoading}>
                                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Venezolana">Venezolana</SelectItem><SelectItem value="Extranjera">Extranjera</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="estado_nacimiento" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Estado de Nacimiento</Label>
                            <Input id="estado_nacimiento" name="estado_nacimiento" defaultValue={estudiante.estado_nacimiento || ""} className="h-12" disabled={isLoading} />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="telefono_contacto" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Teléfono de Contacto</Label>
                            <Input id="telefono_contacto" name="telefono_contacto" defaultValue={estudiante.telefono_contacto || ""} className="h-12" disabled={isLoading} />
                        </div>
                    </div>
                    <div className="space-y-3">
                         <Label htmlFor="correo_electronico" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Correo Electrónico</Label>
                         <Input type="email" id="correo_electronico" name="correo_electronico" defaultValue={estudiante.correo_electronico || ""} className="h-12" disabled={isLoading} />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="direccion" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Dirección del Estudiante</Label>
                        <Textarea id="direccion" name="direccion" defaultValue={estudiante.direccion || ""} className="min-h-[100px]" disabled={isLoading} />
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {/* Información del Representante Legal */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6">
                    <CardHeader className="p-0">
                        <CardTitle className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-white/20 rounded-lg"><Shield className="h-6 w-6" /></div>
                            Información del Representante Legal
                        </CardTitle>
                    </CardHeader>
                </div>
                <CardContent className="space-y-8 p-8">
                    {/* Campo oculto para enviar el ID del representante a la acción del servidor */}
                    <input type="hidden" name="id_representante" value={estudiante.representantes?.id_representante || ''} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="rep_nombres" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Nombres *</Label>
                            <Input id="rep_nombres" name="rep_nombres" defaultValue={estudiante.representantes?.nombres || ''} className="h-12" required disabled={isLoading} />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="rep_apellidos" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Apellidos *</Label>
                            <Input id="rep_apellidos" name="rep_apellidos" defaultValue={estudiante.representantes?.apellidos || ''} className="h-12" required disabled={isLoading} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="rep_cedula" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Cédula *</Label>
                            <Input id="rep_cedula" name="rep_cedula" defaultValue={estudiante.representantes?.cedula || ''} className="h-12" required disabled={isLoading} />
                        </div>
                         <div className="space-y-3">
                            <Label htmlFor="rep_parentesco" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Parentesco *</Label>
                            <Input id="rep_parentesco" name="rep_parentesco" defaultValue={estudiante.representantes?.parentesco || ''} className="h-12" required disabled={isLoading} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="rep_telefono" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Teléfono</Label>
                            <Input id="rep_telefono" name="rep_telefono" defaultValue={estudiante.representantes?.telefono || ''} className="h-12" disabled={isLoading} />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="rep_correo" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Correo Electrónico</Label>
                            <Input type="email" id="rep_correo" name="rep_correo" defaultValue={estudiante.representantes?.correo_electronico || ''} className="h-12" disabled={isLoading} />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="rep_ocupacion" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Ocupación</Label>
                        <Input id="rep_ocupacion" name="rep_ocupacion" defaultValue={estudiante.representantes?.ocupacion || ''} className="h-12" disabled={isLoading} />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="rep_direccion" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Dirección del Representante</Label>
                        <Textarea id="rep_direccion" name="rep_direccion" defaultValue={estudiante.representantes?.direccion || ''} className="min-h-[100px]" disabled={isLoading} />
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {/* Información Médica y Especial */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6">
                    <CardHeader className="p-0">
                        <CardTitle className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-white/20 rounded-lg"><Shield className="h-6 w-6" /></div>
                            Información Médica y Especial
                        </CardTitle>
                    </CardHeader>
                </div>
                <CardContent className="p-8">
                    <div className="space-y-3">
                        <Label htmlFor="condicion_especial" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Condición Especial</Label>
                        <Textarea
                            id="condicion_especial"
                            name="condicion_especial"
                            defaultValue={estudiante.condicion_especial || ""}
                            placeholder="Alergias, condiciones médicas, necesidades especiales, etc."
                            className="min-h-[120px]"
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {/* Botones de Acción */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
          <Button type="button" variant="outline" size="lg" disabled={isLoading} onClick={() => router.back()} className="h-12">
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} size="lg" className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30">
            {isLoading ? (
              <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Actualizando... </>
            ) : (
              <> <Save className="mr-2 h-5 w-5" /> Actualizar Estudiante </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}