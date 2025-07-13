"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { requestPasswordReset } from "@/actions/auth.actions"
import { Loader2, CheckCircle, Mail } from "lucide-react"

export function PasswordResetForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setMessage("")

    try {
      const result = await requestPasswordReset(formData)
      if (result?.error) {
        setMessage(result.error)
        setIsSuccess(false)
      } else if (result?.success) {
        setMessage(result.success)
        setIsSuccess(true)
      }
    } catch (err) {
      setMessage("Error inesperado. Intenta nuevamente.")
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert 
          variant={isSuccess ? "default" : "destructive"} 
          className={`border-0 ${
            isSuccess 
              ? "bg-emerald-50/50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200" 
              : "bg-red-50/50 dark:bg-red-950/50 text-red-800 dark:text-red-200"
          }`}
        >
          {isSuccess && <CheckCircle className="h-4 w-4" />}
          <AlertDescription className="font-medium">{message}</AlertDescription>
        </Alert>
      )}

      <form action={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Correo Electrónico
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="usuario@escuela.edu"
              required
              disabled={isLoading || isSuccess}
              className="h-12 pl-11 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02]" 
          disabled={isLoading || isSuccess}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-5 w-5" />
              Enviar Enlace de Recuperación
            </>
          )}
        </Button>
      </form>
    </div>
  )
}