"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { User } from "@/lib/auth"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Award,
} from "lucide-react"
import { LogoutButton } from "./logout-button"

const menuItemsAdmin = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Estudiantes", href: "/dashboard/estudiantes", icon: Users },
  { title: "Docentes", href: "/dashboard/docentes", icon: GraduationCap },
  { title: "Grados", href: "/dashboard/grados", icon: BookOpen },
  { title: "Cupos", href: "/dashboard/cupos", icon: UserCheck },
  { title: "Reportes", href: "/dashboard/reportes", icon: FileText },
]

const menuItemsNonAdmin = [
  { title: "Estudiantes", href: "/dashboard/estudiantes", icon: Users },
  { title: "Grados", href: "/dashboard/grados", icon: BookOpen },
]

export function AppSidebar({ user }: { user: User | null }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const toggleSidebar = () => setIsCollapsed(!isCollapsed)
  
  // Filtrar elementos del menú según el rol del usuario
  const menuItems = useMemo(() => {
    return user?.rol === "administrador" ? menuItemsAdmin : menuItemsNonAdmin
  }, [user?.rol])

  return (
    <aside className={`
      relative hidden md:flex flex-col h-full border-r border-slate-200/60 dark:border-slate-700/60
      transition-all duration-300 ease-in-out backdrop-blur-xl
      bg-white/80 dark:bg-slate-900/80
      ${isCollapsed ? "w-20" : "w-72"}
    `}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white/50 dark:from-slate-900/50 dark:to-slate-950/50"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/5 rounded-full blur-2xl"></div>
      
      {/* Header */}
      <div className="relative flex items-center h-16 border-b border-slate-200/60 dark:border-slate-700/60 px-4 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 font-semibold group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="space-y-0.5">
              <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sistema Escolar
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Gestión Inteligente
              </div>
            </div>
          )}
        </Link>
      </div>
      
      {/* Collapse Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-20 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/90 rounded-full shadow-lg transition-all duration-300"
        onClick={toggleSidebar}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Navigation */}
      <nav className="relative flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavItem item={item} isCollapsed={isCollapsed} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="relative mt-auto p-3 border-t border-slate-200/60 dark:border-slate-700/60">
        <UserMenu user={user} isCollapsed={isCollapsed} />
      </div>
    </aside>
  )
}

type MenuItem = {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

function NavItem({ item, isCollapsed }: { item: MenuItem; isCollapsed: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === item.href

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              className={`
                relative flex items-center justify-center h-12 w-12 rounded-xl mx-auto
                group transition-all duration-300
                ${isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                }
              `}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-20"></div>
              )}
              <item.icon className={`h-5 w-5 relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
              <span className="sr-only">{item.title}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Link
      href={item.href}
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl group
        transition-all duration-300 font-medium
        ${isActive
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
        }
      `}
    >
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-20"></div>
      )}
      <item.icon className={`h-5 w-5 relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
      <span className="relative z-10">{item.title}</span>
      {isActive && (
        <div className="ml-auto">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      )}
    </Link>
  )
}

export function UserMenu({ user, isCollapsed }: { user: User | null, isCollapsed: boolean }) {
  if (isCollapsed) {
    return (
      <DropdownMenu>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
                    <UserCheck className="h-5 w-5 text-white"/>
                  </div>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">
              {user?.nombre_completo || "Usuario"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent side="right" align="end" className="w-56">
          <DropdownMenuLabel>{user?.nombre_completo}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/configuracion" className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4"/> Configuración
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <LogoutButton asChild>
             <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50">
               <LogOut className="h-4 w-4"/> Cerrar Sesión
             </DropdownMenuItem>
          </LogoutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start items-center gap-3 px-3 py-3 text-left h-auto group rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur-sm opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg">
              <UserCheck className="h-5 w-5 text-white"/>
            </div>
          </div>
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="font-semibold text-sm truncate text-slate-900 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white">
              {user?.nombre_completo}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Award className="h-3 w-3" />
              <span>{user?.rol ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1) : "Usuario"}</span>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
       <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
             <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.nombre_completo}</p>
                <p className="text-xs leading-none text-slate-500 dark:text-slate-400">{user?.email}</p>
             </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/configuracion" className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4"/> Configuración
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
           <LogoutButton asChild>
             <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50">
               <LogOut className="h-4 w-4"/> Cerrar Sesión
             </DropdownMenuItem>
          </LogoutButton>
       </DropdownMenuContent>
    </DropdownMenu>
  )
}