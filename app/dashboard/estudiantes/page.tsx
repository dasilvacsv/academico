"use client";

import React, { useState, useEffect } from "react";
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
import { PlusCircle, Search, MoreHorizontal, ListFilter, Users2, AlertTriangle, UserX, UserCheck as UserCheckIcon, GraduationCap, Sparkles, TrendingUp, Eye } from "lucide-react";

// Hook Debounce
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}

type Estudiante = Awaited<ReturnType<typeof obtenerEstudiantesPaginados>>["estudiantes"][0];
type Stats = Awaited<ReturnType<typeof obtenerEstudiantesPaginados>>["stats"];

// Enhanced StatCard with beautiful animations and gradients
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
              <span>+{trend}% vs mes anterior</span>
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

function EstudiantesPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, inscritos: 0, retirados: 0, egresados: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState("");
  
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtro, setFiltro] = useState(searchParams.get("filtro") || "");
  const [estatus, setEstatus] = useState(searchParams.get("estatus") || "");

  const debouncedFiltro = useDebounce(filtro, 400);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    params.set("filtro", debouncedFiltro);
    if (estatus) params.set("estatus", estatus); 
    else params.delete("estatus");
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    const fetchEstudiantes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await obtenerEstudiantesPaginados({ page, filtro: debouncedFiltro, estatus, limite: 8 });
        setEstudiantes(result.estudiantes);
        setTotalPages(result.totalPaginas);
        setStats(result.stats);
      } catch (err) {
        setError("No se pudieron cargar los estudiantes.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEstudiantes();
  }, [page, debouncedFiltro, estatus, router, pathname, searchParams]);

  useEffect(() => {
    const getRoleFromCookie = async () => {
      try {
        const response = await fetch('/api/auth/role', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.rol);
        }
      } catch (error) {
        console.error('Error obteniendo rol del usuario:', error);
      }
    };

    getRoleFromCookie();
  }, []);

  const handleStatusFilterChange = (newStatus: string) => {
    setPage(1);
    setEstatus(newStatus);
  };

  const getBadgeClassName = (status: string | null): string => {
    switch (status) {
      case "inscrito": return "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-200";
      case "retirado": return "bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-lg shadow-red-500/30 hover:shadow-red-500/40 hover:scale-105 transition-all duration-200";
      case "egresado": return "bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-200";
      case "pre-inscrito": return "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-200";
      default: return "bg-gradient-to-r from-slate-500 to-gray-600 text-white border-0 shadow-lg shadow-slate-500/30";
    }
  };

  return (
    <div className="space-y-8">
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-2">
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
          </div>
          {userRole === "administrador" && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                asChild 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 border-0"
              >
                <Link href="/dashboard/estudiantes/nuevo">
                  <PlusCircle className="mr-2 h-5 w-5" /> 
                  Registrar Estudiante
                </Link>
              </Button>
            </motion.div>
          )}
        </motion.header>

        {/* Stats Section */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Estudiantes" 
            value={isLoading ? <Skeleton className="h-8 w-16 bg-white/20"/> : stats.total} 
            icon={Users2} 
            colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
            trend={12}
          />
          <StatCard 
            title="Inscritos" 
            value={isLoading ? <Skeleton className="h-8 w-12 bg-white/20"/> : stats.inscritos} 
            icon={UserCheckIcon} 
            colorClass="bg-gradient-to-br from-emerald-500 to-green-600"
            trend={8}
          />
          <StatCard 
            title="Retirados" 
            value={isLoading ? <Skeleton className="h-8 w-10 bg-white/20"/> : stats.retirados} 
            icon={UserX} 
            colorClass="bg-gradient-to-br from-red-500 to-rose-600"
            trend={-2}
          />
          <StatCard 
            title="Egresados" 
            value={isLoading ? <Skeleton className="h-8 w-12 bg-white/20"/> : stats.egresados} 
            icon={GraduationCap} 
            colorClass="bg-gradient-to-br from-purple-500 to-violet-600"
            trend={15}
          />
        </section>

        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden"
        >
          {/* Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Buscar estudiante..." 
                className="pl-11 h-11 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200" 
                value={filtro} 
                onChange={(e) => setFiltro(e.target.value)} 
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto h-11 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-200">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 rounded-xl">
                <DropdownMenuLabel>Filtrar por estatus</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => handleStatusFilterChange("")}>Todos</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleStatusFilterChange("inscrito")}>Inscrito</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleStatusFilterChange("retirado")}>Retirado</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleStatusFilterChange("egresado")}>Egresado</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <div className="min-h-[500px] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <TableHead className="w-[350px] font-semibold text-slate-700 dark:text-slate-300">Nombre</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Estatus</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Grado Actual</TableHead>
                  <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <TableRow key={`skeleton-${i}`} className="border-b border-slate-200/30 dark:border-slate-700/30">
                        <TableCell colSpan={4}>
                          <Skeleton className="h-16 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-xl" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-60 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
                            <AlertTriangle className="h-16 w-16 text-red-500" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Error al Cargar</h3>
                            <p className="text-slate-600 dark:text-slate-400">{error}</p>
                          </div>
                          <Button 
                            onClick={() => window.location.reload()}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          >
                            Reintentar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : estudiantes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-60 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                            <Users2 className="h-16 w-16 text-slate-400" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">No se encontraron estudiantes</h3>
                            <p className="text-slate-600 dark:text-slate-400">Prueba con otro término de búsqueda o filtro.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    estudiantes.map((estudiante, index) => (
                      <motion.tr 
                        key={estudiante.id_estudiante}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-slate-200/30 dark:border-slate-700/30 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-slate-800/50 dark:hover:to-slate-700/50 transition-all duration-200 group"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-700 shadow-lg shadow-black/10 group-hover:shadow-xl transition-all duration-300">
                                <AvatarFallback className="font-semibold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                  {estudiante.nombres[0]}{estudiante.apellidos[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {estudiante.nombres} {estudiante.apellidos}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {estudiante.email || "Sin correo"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`capitalize font-semibold ${getBadgeClassName(estudiante.matriculas?.[0]?.estatus)}`}>
                            {estudiante.matriculas?.[0]?.estatus || "Sin Matrícula"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                          {estudiante.matriculas?.[0]?.grados?.nombre || "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 rounded-xl">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/estudiantes/${estudiante.id_estudiante}`} className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  Ver Detalles
                                </Link>
                              </DropdownMenuItem>
                              
                              {/* Mostrar opciones de editar y eliminar solo para administradores */}
                              {userRole === "administrador" && (
                                <>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/estudiantes/${estudiante.id_estudiante}/editar`} className="flex items-center gap-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                      </svg>
                                      Editar
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Eliminar
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
          <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-700/50 px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50">
            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Página <strong className="text-slate-900 dark:text-slate-100">{page}</strong> de <strong className="text-slate-900 dark:text-slate-100">{totalPages}</strong>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => p - 1)} 
                disabled={page <= 1 || isLoading}
                className="bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-200"
              >
                Anterior
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => p + 1)} 
                disabled={page >= totalPages || isLoading}
                className="bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-200"
              >
                Siguiente
              </Button>
            </div>
          </div>
        </motion.main>
      </div>
  );
}

export default function EstudiantesPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return <EstudiantesPageContent />;
}