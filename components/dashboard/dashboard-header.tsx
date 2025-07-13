"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import type { User } from "@/lib/auth"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { 
  PanelLeft, 
  Search, 
  Home, 
  Users, 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  FileText,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react"

import { AppSidebar, UserMenu } from "./app-sidebar"

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

const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

export function DashboardHeader({ user }: { user: User | null }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isCommandMenuOpen, setCommandMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Filtrar elementos del menú según el rol del usuario
  const menuItems = useMemo(() => {
    return user?.rol === "administrador" ? menuItemsAdmin : menuItemsNonAdmin
  }, [user?.rol])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandMenuOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setCommandMenuOpen(false)
    command()
  }, [])

  const segments = pathname.split("/").filter(Boolean)

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20"></div>
        
        <div className="relative flex h-16 items-center gap-4 px-4 sm:px-6">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/70">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <AppSidebar user={user} />
            </SheetContent>
          </Sheet>

          {/* Breadcrumbs */}
          <div className="hidden flex-1 md:flex">
            <Breadcrumb>
              <BreadcrumbList className="flex items-center space-x-2">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                
                {segments.slice(1).map((segment, index) => (
                  <React.Fragment key={segment}>
                    <BreadcrumbSeparator className="text-slate-400 dark:text-slate-500">
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      {index === segments.length - 2 ? (
                        <BreadcrumbPage className="font-medium text-slate-900 dark:text-slate-100">
                          {capitalize(segment)}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink 
                          href={`/${segments.slice(0, index + 2).join("/")}`}
                          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                        >
                          {capitalize(segment)}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Header Actions */}
          <div className="flex flex-shrink-0 items-center gap-3 md:ml-auto">
            {/* Search Button */}
            <Button
              variant="outline"
              className="relative w-full justify-start text-slate-600 dark:text-slate-400 sm:w-auto border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/70 group"
              onClick={() => setCommandMenuOpen(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Search className="mr-2 h-4 w-4 relative z-10" />
              <span className="hidden lg:inline-block relative z-10">Buscar...</span>
              <kbd className="pointer-events-none ml-4 hidden h-5 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Theme Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleTheme}
                    className="border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/70 group"
                    disabled={!mounted}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {mounted && (
                      <>
                        <Sun className="h-5 w-5 relative z-10 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 z-10 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </>
                    )}
                    <span className="sr-only">Cambiar tema</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cambiar a tema {theme === 'dark' ? 'claro' : 'oscuro'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* User Menu */}
            <UserMenu user={user} isCollapsed={false} />
          </div>
        </div>
      </header>
      
      {/* Command Dialog */}
      <CommandDialog open={isCommandMenuOpen} onOpenChange={setCommandMenuOpen}>
        <VisuallyHidden>
          <DialogTitle>Buscar comandos y páginas</DialogTitle>
        </VisuallyHidden>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20"></div>
          <div className="relative">
            <CommandInput 
              placeholder="Escribe un comando o busca una página..." 
              className="border-0 bg-transparent focus:ring-0"
            />
            <CommandList className="bg-transparent">
              <CommandEmpty className="py-8 text-center text-slate-500 dark:text-slate-400">
                <div className="flex flex-col items-center gap-2">
                  <Search className="h-8 w-8 opacity-50" />
                  <p>No se encontraron resultados.</p>
                </div>
              </CommandEmpty>
              <CommandGroup heading="Páginas" className="p-2">
                {menuItems.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={item.title}
                    onSelect={() => runCommand(() => router.push(item.href))}
                    className="cursor-pointer rounded-lg px-3 py-2 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 group"
                  >
                    <div className="p-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all">
                      <item.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        </div>
      </CommandDialog>
    </>
  )
}