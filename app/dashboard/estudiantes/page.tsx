"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { obtenerEstudiantesPaginados } from "@/actions/estudiantes.actions";

// UI Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import { PlusCircle, Search, MoreHorizontal, ListFilter, Users2, AlertTriangle, UserX, UserCheck as UserCheckIcon, GraduationCap, Sparkles, TrendingUp, Eye, Edit, Trash2 } from "lucide-react";

// Hook Debounce
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}

// Tipos de datos explícitos para el Frontend
type Grado = {
  nombre: string | null;
};

type Matricula = {
  estatus: string | null;
  grados: Grado | null;
};

type Estudiante = {
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  email: string | null;
  matriculas: Matricula[];
};

type Stats = {
  total: number;
  inscritos: number;
  retirados: number;
  egresados: number;
};

// Componente StatCard (sin cambios)
type StatCardProps = {
  title: string;
  value: React.ReactNode;
  icon: React.ElementType;
  colorClass: string;
  trend?: number | null;
};

const StatCard = ({ title, value, icon: Icon, colorClass, trend = null }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
  >
    <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${colorClass} group`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/10" />
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
            {title}
          </CardTitle>
          {typeof trend === "number" && (
            <div className="flex items-center gap-1 text-xs text-white/70">
              <TrendingUp className="w-3 h-3" />
              <span>{trend > 0 ? '+' : ''}{trend}% vs mes anterior</span>
            </div>
          )}
        </div>
        <div className="relative">
          <Icon className="h-6 w-6 text-white/80 group-hover:text-white transition-colors group-hover:scale-110 transform duration-300" />
          <div className="absolute inset-0 bg-white/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold text-white group-hover:scale-105 transform transition-transform duration-300">
          {value}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function EstudiantesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  // --- CAMBIO 1: Se inicializan las stats en 0. Se llenarán si la API las devuelve. ---
  const [stats, setStats] = useState<Stats>({ total: 0, inscritos: 0, retirados: 0, egresados: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // --- CAMBIO 2: Se añade el estado para totalPages que faltaba ---
  const [totalPages, setTotalPages] = useState(1);

  const page = Number(searchParams.get("page")) || 1;
  const filtroInput = searchParams.get("filtro") || "";
  const estatus = searchParams.get("estatus") || "";
  
  const debouncedFiltro = useDebounce(filtroInput, 400);

  // useEffect para obtener el rol del usuario
  useEffect(() => {
    fetch('/api/auth/role')
      .then(res => res.json())
      .then(data => setUserRole(data.rol || null))
      .catch(() => setUserRole(null));
  }, []);

  // useEffect para obtener los datos de los estudiantes
  useEffect(() => {
    const fetchEstudiantes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const currentPage = Number(searchParams.get("page")) || 1;
        const currentFiltro = searchParams.get("filtro") || "";
        const currentEstatus = searchParams.get("estatus") || "";

        const result = await obtenerEstudiantesPaginados({ 
            page: currentPage, 
            filtro: currentFiltro, 
            estatus: currentEstatus, 
            limite: 8 
        });

        // --- CAMBIO 3: Manejo seguro de los datos recibidos ---
        // Se le dice a TypeScript que confíe en que `result.estudiantes` son del tipo `Estudiante[]`
        setEstudiantes(result.estudiantes as Estudiante[]);
        setTotalPages(result.totalPaginas);

        // Si el objeto 'stats' existe en la respuesta de la API, se actualiza el estado.
        // Si no, el estado 'stats' conserva su valor inicial (todo en 0).
        if (result.stats) {
          setStats(result.stats);
        }

      } catch (err) {
        console.error("Error completo:", err);
        setError("No se pudieron cargar los estudiantes. Intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstudiantes();
  }, [searchParams]);

  // Funciones para manejar cambios en filtros y paginación
  const handleFilterChange = useCallback((key: 'filtro' | 'estatus' | 'page', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key !== 'page') {
        params.set('page', '1'); // Reset page number on filter change
    }
    
    if (value) {
        params.set(key, value);
    } else {
        params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  // Efecto para el debounced search
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentDebouncedFiltro = params.get('filtro');
    if (debouncedFiltro !== currentDebouncedFiltro) {
        handleFilterChange('filtro', debouncedFiltro);
    }
  }, [debouncedFiltro, handleFilterChange, searchParams]);

  const getBadgeClassName = (status: string | null): string => {
    switch (status) {
      case "inscrito": return "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg shadow-emerald-500/30";
      case "retirado": return "bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-lg shadow-red-500/30";
      case "egresado": return "bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0 shadow-lg shadow-purple-500/30";
      case "pre-inscrito": return "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg shadow-amber-500/30";
      default: return "bg-gradient-to-r from-slate-500 to-gray-600 text-white border-0 shadow-lg shadow-slate-500/30";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
                <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                    Gestión de Estudiantes
                </h1>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                    Centro de control de la comunidad estudiantil
                </p>
            </div>
        </div>
        {userRole === "administrador" && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30">
              <Link href="/dashboard/estudiantes/nuevo">
                <PlusCircle className="mr-2 h-5 w-5" /> Registrar Estudiante
              </Link>
            </Button>
          </motion.div>
        )}
      </motion.header>

      {/* Stats Section */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Estudiantes" value={isLoading ? <Skeleton className="h-8 w-16 bg-white/20"/> : stats.total} icon={Users2} colorClass="bg-gradient-to-br from-blue-500 to-blue-600" trend={12} />
        <StatCard title="Inscritos Activos" value={isLoading ? <Skeleton className="h-8 w-12 bg-white/20"/> : stats.inscritos} icon={UserCheckIcon} colorClass="bg-gradient-to-br from-emerald-500 to-green-600" trend={8} />
        <StatCard title="Retirados" value={isLoading ? <Skeleton className="h-8 w-10 bg-white/20"/> : stats.retirados} icon={UserX} colorClass="bg-gradient-to-br from-red-500 to-rose-600" trend={-2} />
        <StatCard title="Egresados" value={isLoading ? <Skeleton className="h-8 w-12 bg-white/20"/> : stats.egresados} icon={GraduationCap} colorClass="bg-gradient-to-br from-purple-500 to-violet-600" trend={15} />
      </section>

      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl overflow-hidden"
      >
        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nombre, apellido..." 
              className="pl-11 h-11 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 rounded-xl" 
              defaultValue={filtroInput}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('filtro', e.target.value);
                // We don't push router here, debounced effect will handle it
              }}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto h-11 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 rounded-xl">
                <ListFilter className="mr-2 h-4 w-4" />
                {estatus ? `Estatus: ${estatus.charAt(0).toUpperCase() + estatus.slice(1)}` : "Filtrar por estatus"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 rounded-xl">
              <DropdownMenuLabel>Filtrar por estatus</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleFilterChange("estatus", "")}>Todos</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleFilterChange("estatus", "inscrito")}>Inscrito</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleFilterChange("estatus", "retirado")}>Retirado</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleFilterChange("estatus", "egresado")}>Egresado</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="min-h-[500px] overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200/50 dark:border-slate-700/50">
                <TableHead className="min-w-[300px] font-semibold text-slate-700 dark:text-slate-300">Nombre</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Estatus</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Grado Actual</TableHead>
                <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300 pr-6">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`} className="border-b-0">
                      <TableCell className="py-2 px-6" colSpan={4}>
                        <Skeleton className="h-16 w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-xl" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-96 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
                          <AlertTriangle className="h-16 w-16 text-red-500" />
                        </div>
                        <h3 className="text-xl font-semibold">Error al Cargar</h3>
                        <p className="text-slate-600">{error}</p>
                        <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">Reintentar</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : estudiantes.length === 0 ? (
                   <TableRow>
                    <TableCell colSpan={4} className="h-96 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Users2 className="h-16 w-16 text-slate-400" />
                        <h3 className="text-xl font-semibold">No se encontraron estudiantes</h3>
                        <p className="text-slate-600">Prueba con otro término de búsqueda o filtro.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  estudiantes.map((estudiante, index) => (
                    <motion.tr 
                      key={estudiante.id_estudiante}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-slate-200/30 dark:border-slate-700/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-700 shadow-lg">
                            <AvatarFallback className="font-semibold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                              {estudiante.nombres[0]}{estudiante.apellidos[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{estudiante.nombres} {estudiante.apellidos}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{estudiante.email || "Sin correo"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize font-semibold ${getBadgeClassName(estudiante.matriculas?.[0]?.estatus)}`}>
                          {estudiante.matriculas?.[0]?.estatus?.replace('-', ' ') || "Sin Matrícula"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                        {estudiante.matriculas?.[0]?.grados?.nombre || "N/A"}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 rounded-xl">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem asChild className="cursor-pointer"><Link href={`/dashboard/estudiantes/${estudiante.id_estudiante}`} className="flex items-center gap-2"><Eye className="h-4 w-4" /> Ver Detalles</Link></DropdownMenuItem>
                            {userRole === "administrador" && (
                              <>
                                <DropdownMenuItem asChild className="cursor-pointer"><Link href={`/dashboard/estudiantes/${estudiante.id_estudiante}/editar`} className="flex items-center gap-2"><Edit className="h-4 w-4" /> Editar</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 dark:text-red-400 flex items-center gap-2 cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/50">
                                  <Trash2 className="h-4 w-4" /> Eliminar
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Página <strong className="text-slate-900 dark:text-slate-100">{page}</strong> de <strong className="text-slate-900 dark:text-slate-100">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleFilterChange('page', String(page - 1))} disabled={page <= 1 || isLoading}>Anterior</Button>
            <Button variant="outline" size="sm" onClick={() => handleFilterChange('page', String(page + 1))} disabled={page >= totalPages || isLoading}>Siguiente</Button>
          </div>
        </div>
      </motion.main>
    </div>
  );
}