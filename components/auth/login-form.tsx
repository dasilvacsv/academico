"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Eye, EyeOff, Loader2, ShieldAlert, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { login } from "@/actions/auth.actions"

const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Por favor, introduce un correo electrónico válido." }),
  password: z
    .string()
    .min(1, { message: "La contraseña no puede estar vacía." }),
})

type LoginValues = z.infer<typeof LoginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "admin@escuela.edu",
      password: "password123",
    },
  })

  async function onSubmit(values: LoginValues) {
    setError("")

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("email", values.email)
        formData.append("password", values.password)

        const result = await login(formData)

        if (result?.error) {
          setError(result.error)
        } else if (result?.redirect) {
          // Redirigir según el rol
          router.push(result.redirect)
          router.refresh()
        } else {
          // Redirección por defecto
          router.push("/dashboard")
          router.refresh()
        }
      } catch (err) {
        setError("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.")
      }
    })
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-3xl blur-3xl"></div>
      
      <Card className="relative border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-black/5 dark:shadow-black/20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-900/30 rounded-3xl"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 rounded-t-3xl"></div>
        
        <CardHeader className="relative text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-20"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ¡Bienvenido de Nuevo!
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Ingresa tus credenciales para acceder a tu panel de control
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="relative space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/50">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle className="text-red-800 dark:text-red-200">Error de Autenticación</AlertTitle>
                  <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Correo Electrónico
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="tu.correo@ejemplo.com"
                          disabled={isPending}
                          className="h-12 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Contraseña
                        </FormLabel>
                        <Link
                          href="/olvide-mi-contrasena"
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            disabled={isPending}
                            className="h-12 pr-12 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isPending}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02]" 
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        {/* Pie de página sin opción de registro */}
        <CardFooter className="relative flex flex-col items-center justify-center text-sm space-y-2 pt-4">
          <p className="text-slate-600 dark:text-slate-400">Sistema de gestión escolar</p>
        </CardFooter>
      </Card>
    </div>
  )
}