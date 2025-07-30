"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Eye, EyeOff, Loader2, ShieldAlert, Sparkles, ShieldQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { verifyPasswordAndGetQuestions, verifyAnswersAndLogin } from "@/actions/auth.actions"

// Esquema de validación para ambos pasos
const LoginSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
  password: z.string().min(1, { message: "La contraseña no puede estar vacía." }),
  answer1: z.string().optional(),
  answer2: z.string().optional(),
  answer3: z.string().optional(),
})

type LoginValues = z.infer<typeof LoginSchema>
type LoginStep = 'credentials' | 'questions';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()
  const [loginStep, setLoginStep] = useState<LoginStep>('credentials');
  const [questions, setQuestions] = useState<string[]>([]);
  const router = useRouter()

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "admin@escuela.edu",
      password: "password123",
      answer1: "",
      answer2: "",
      answer3: "",
    },
  })

  async function onSubmit(values: LoginValues) {
    setError("")
    startTransition(async () => {
      try {
        if (loginStep === 'credentials') {
          // --- PASO 1: VERIFICAR CONTRASEÑA ---
          const formData = new FormData();
          formData.append("email", values.email);
          formData.append("password", values.password);

          const result = await verifyPasswordAndGetQuestions(formData);

          if (result?.error) {
            setError(result.error);
          } else if (result?.success && result.questions) {
            setQuestions(result.questions);
            setLoginStep('questions'); // Cambiamos al siguiente paso
          }
        } else {
          // --- PASO 2: VERIFICAR PREGUNTAS Y LOGUEAR ---
          const formData = new FormData();
          formData.append("email", values.email); // Usamos el email ya validado
          formData.append("answer1", values.answer1 || "");
          formData.append("answer2", values.answer2 || "");
          formData.append("answer3", values.answer3 || "");

          const result = await verifyAnswersAndLogin(formData);

          if (result?.error) {
            setError(result.error);
          } else if (result?.redirect) {
            router.push(result.redirect);
            router.refresh();
          }
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
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                    {loginStep === 'credentials' ? <Sparkles className="h-6 w-6 text-white" /> : <ShieldQuestion className="h-6 w-6 text-white" />}
                </div>
            </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {loginStep === 'credentials' ? '¡Bienvenido!' : 'Verificación de Seguridad'}
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {loginStep === 'credentials' ? 'Ingresa tus credenciales para continuar.' : 'Responde tus preguntas para completar el inicio de sesión.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Error de Autenticación</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loginStep === 'credentials' ? (
                // --- CAMPOS DE EMAIL Y CONTRASEÑA ---
                <div className="space-y-5">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Correo Electrónico</FormLabel><FormControl><Input {...field} type="email" disabled={isPending} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between"><FormLabel>Contraseña</FormLabel><Link href="/olvide-mi-contrasena" className="text-sm font-medium text-blue-600 hover:underline">¿Olvidaste tu contraseña?</Link></div>
                      <FormControl><div className="relative"><Input {...field} type={showPassword ? "text" : "password"} disabled={isPending} /><Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div></FormControl><FormMessage />
                    </FormItem>
                  )} />
                </div>
              ) : (
                // --- CAMPOS DE PREGUNTAS DE SEGURIDAD ---
                <div className="space-y-5">
                    {questions.map((q, i) => (
                        <FormField key={i} control={form.control} name={`answer${i+1}` as 'answer1' | 'answer2' | 'answer3'} render={({ field }) => (
                            <FormItem>
                                <FormLabel>{q}</FormLabel>
                                <FormControl><Input {...field} type="text" disabled={isPending} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    ))}
                </div>
              )}

              <Button type="submit" className="w-full h-12" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {loginStep === 'credentials' ? 'Siguiente' : 'Iniciar Sesión'}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="relative flex flex-col items-center justify-center text-sm space-y-2 pt-4">
        </CardFooter>
      </Card>
    </div>
  )
}