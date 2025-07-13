"use client"

import { useTransition } from "react"
import { LogOut, Loader2 } from "lucide-react"
import { logout } from "@/actions/auth.actions"
import { Slot } from "@radix-ui/react-slot"

interface LogoutButtonProps {
  asChild?: boolean
  children?: React.ReactNode
  className?: string
}

export function LogoutButton({ asChild = false, children, ...props }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(() => {
      logout()
    })
  }
  
  if (asChild) {
    return (
      <Slot onClick={handleClick} {...props}>
        {children}
      </Slot>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors disabled:opacity-50"
      {...props}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      <span>{isPending ? "Cerrando sesión..." : "Cerrar Sesión"}</span>
    </button>
  )
}