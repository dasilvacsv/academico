import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Mail, Phone, Edit, Search, GraduationCap, Users, MapPin, Calendar, Trash2 } from "lucide-react"
import Link from "next/link"
import { obtenerDocentes } from "@/actions/docentes.actions"
import { requireRole } from "@/lib/auth"
import { EliminarDocenteButton } from "@/components/docentes/eliminar-docente-button"

export default async function DocentesPage() {
  await requireRole(["administrador", "director"])

  const docentes = await obtenerDocentes()

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-700 dark:via-purple-700 dark:to-indigo-800 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-white/20 dark:bg-white/30 p-4 backdrop-blur-sm border border-white/20">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Personal Docente</h1>
                  <p className="text-blue-100 dark:text-blue-200 text-lg">Gestiona y administra el equipo educativo</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="rounded-xl bg-white/10 dark:bg-white/20 p-4 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-5 w-5 text-blue-200 dark:text-blue-300" />
                  <span className="text-sm text-blue-200 dark:text-blue-300">Total Docentes</span>
                </div>
                <p className="text-3xl font-bold">{docentes.length}</p>
              </div>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-white dark:text-blue-700 dark:hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" asChild>
                <Link href="/dashboard/docentes/nuevo">
                  <Plus className="mr-2 h-5 w-5" />
                  Registrar Docente
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar docentes..."
            className="pl-10 bg-background shadow-sm border-border dark:bg-card dark:border-border h-12"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="border-border dark:border-border h-12 px-6">
            <Calendar className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {docentes.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-dashed border-2 border-muted-foreground/25 dark:border-muted-foreground/40 bg-white dark:bg-slate-900">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-6 mb-4">
                  <GraduationCap className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No hay docentes registrados</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Comienza agregando el primer docente a tu institución educativa
                </p>
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Link href="/dashboard/docentes/nuevo">
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Primer Docente
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          docentes.map((docente: any) => (
            <Card key={docente.id_docente} className="group hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-500 border-border hover:border-primary/20 dark:hover:border-primary/30 bg-white dark:bg-slate-900 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14 border-2 border-gradient-to-br from-blue-500 to-purple-600">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white font-semibold text-lg">
                        {docente.nombres.charAt(0)}{docente.apellidos.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {docente.nombres} {docente.apellidos}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {docente.especialidad}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                      asChild
                    >
                      <Link href={`/dashboard/docentes/${docente.id_docente}/editar`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <EliminarDocenteButton 
                      docenteId={docente.id_docente} 
                      nombreDocente={`${docente.nombres} ${docente.apellidos}`}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1.5">
                      <Mail className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="truncate flex-1">{docente.correo_institucional}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1.5">
                      <Phone className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    </div>
                    <span>{docente.telefono}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1.5">
                      <MapPin className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span>Cédula: {docente.cedula}</span>
                  </div>
                </div>

                {docente.grado_docente?.[0] && (
                  <div className="pt-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    >
                      {docente.grado_docente[0].grados.nombre} - {docente.grado_docente[0].grados.seccion}
                    </Badge>
                  </div>
                )}

                <div className="pt-3 border-t border-border">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-200 dark:hover:border-blue-800 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300"
                    asChild
                  >
                    <Link href={`/dashboard/docentes/${docente.id_docente}/editar`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Información
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}