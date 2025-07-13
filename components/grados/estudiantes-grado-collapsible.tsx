"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible"
import { 
  ChevronDown, 
  ChevronUp, 
  Users, 
  Phone, 
  UserMinus,
  Calendar,
  User,
  Loader2
} from "lucide-react"
import { obtenerEstudiantesPorGrado } from "@/actions/academicos.actions"
import { DesasignarEstudianteButton } from "./desasignar-estudiante-button"

interface EstudiantesGradoCollapsibleProps {
  gradoId: string
  userRole: string // Nuevo prop para el rol
}

type Estudiante = {
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  estatus?: string;
  representante?: {
    nombres: string;
    apellidos: string;
    telefono?: string;
  } | null;
}

export function EstudiantesGradoCollapsible({ 
  gradoId, 
  userRole 
}: EstudiantesGradoCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const cargarEstudiantes = async () => {
    setIsLoading(true)
    try {
      const data = await obtenerEstudiantesPorGrado(gradoId)
      setEstudiantes(data)
    } catch (error) {
      console.error("Error cargando estudiantes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && estudiantes.length === 0) {
      cargarEstudiantes()
    }
  }, [isOpen, gradoId])

  const handleDesasignar = (estudianteId: string) => {
    setEstudiantes(prev => prev.filter(est => est.id_estudiante !== estudianteId))
  }

  // Verificar si el usuario es administrador
  const isAdmin = userRole === "administrador"

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-between hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
        >
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Ver Estudiantes
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {isLoading ? (
            <div className="text-center py-8 text-sm text-slate-600 dark:text-slate-400">
              <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin" />
              Cargando estudiantes...
            </div>
          ) : estudiantes.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">No hay estudiantes asignados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Tabla para pantallas grandes */}
              <table className="hidden md:table w-full">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Estudiante</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Fecha Nacimiento</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Representante</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Teléfono</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Estatus</th>
                    {isAdmin && ( // Solo mostrar columna de acciones para administradores
                      <th className="py-3 px-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Acciones</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((estudiante) => (
                    <tr 
                      key={estudiante.id_estudiante}
                      className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                              {estudiante.nombres.charAt(0)}{estudiante.apellidos.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                              {estudiante.nombres} {estudiante.apellidos}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(estudiante.fecha_nacimiento).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                        {estudiante.representante ? (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate max-w-[120px]">
                              {estudiante.representante.nombres} {estudiante.representante.apellidos}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                        {estudiante.representante?.telefono ? (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span>{estudiante.representante.telefono}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="text-xs">
                          {estudiante.estatus || 'Inscrito'}
                        </Badge>
                      </td>
                      {isAdmin && ( // Solo mostrar acciones para administradores
                        <td className="py-3 px-4 text-right">
                          <DesasignarEstudianteButton
                            estudianteId={estudiante.id_estudiante}
                            nombreEstudiante={`${estudiante.nombres} ${estudiante.apellidos}`}
                            onDesasignar={() => handleDesasignar(estudiante.id_estudiante)}
                          >
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50">
                              <UserMinus className="h-4 w-4" />
                              <span className="sr-only">Desasignar Estudiante</span>
                            </Button>
                          </DesasignarEstudianteButton>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Tarjetas para móviles */}
              <div className="md:hidden space-y-3 p-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 pb-2">
                  Estudiantes Asignados ({estudiantes.length})
                </h4>
                {estudiantes.map((estudiante) => (
                  <div 
                    key={estudiante.id_estudiante}
                    className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                            {estudiante.nombres.charAt(0)}{estudiante.apellidos.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {estudiante.nombres} {estudiante.apellidos}
                          </p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {estudiante.estatus || 'Inscrito'}
                          </Badge>
                        </div>
                      </div>
                      {isAdmin && ( // Solo mostrar botón para administradores
                        <DesasignarEstudianteButton
                          estudianteId={estudiante.id_estudiante}
                          nombreEstudiante={`${estudiante.nombres} ${estudiante.apellidos}`}
                          onDesasignar={() => handleDesasignar(estudiante.id_estudiante)}
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50">
                            <UserMinus className="h-4 w-4" />
                            <span className="sr-only">Desasignar Estudiante</span>
                          </Button>
                        </DesasignarEstudianteButton>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-slate-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Fecha Nacimiento</p>
                          <p className="text-slate-700 dark:text-slate-300">
                            {new Date(estudiante.fecha_nacimiento).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {estudiante.representante && (
                        <div className="flex items-center gap-3 text-sm">
                          <User className="h-4 w-4 text-slate-500 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Representante</p>
                            <p className="text-slate-700 dark:text-slate-300">
                              {estudiante.representante.nombres} {estudiante.representante.apellidos}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {estudiante.representante?.telefono && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="h-4 w-4 text-slate-500 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Teléfono</p>
                            <p className="text-slate-700 dark:text-slate-300">
                              {estudiante.representante.telefono}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}