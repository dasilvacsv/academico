// components/auth/register-form.tsx

"use client"

import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { getAvailableSecurityQuestions, registerUser } from "@/actions/auth.actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, ShieldCheck, ShieldX } from "lucide-react"

const RegisterSchema = z.object({
  nombre_completo: z.string().min(3, "El nombre es muy corto."),
  cedula: z.string().min(6, "La cédula debe ser válida.").regex(/^[VvEe]-\d+$/, "Formato de cédula inválido (ej: V-12345678)."),
  email: z.string().email("Correo electrónico inválido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  pregunta1: z.string().min(1, "Debes seleccionar una pregunta."),
  respuesta1: z.string().min(2, "La respuesta es requerida."),
  pregunta2: z.string().min(1, "Debes seleccionar una pregunta."),
  respuesta2: z.string().min(2, "La respuesta es requerida."),
  pregunta3: z.string().min(1, "Debes seleccionar una pregunta."),
  respuesta3: z.string().min(2, "La respuesta es requerida."),
}).refine(data => {
    const questions = [data.pregunta1, data.pregunta2, data.pregunta3];
    return new Set(questions).size === questions.length;
}, {
    message: "No puedes seleccionar la misma pregunta más de una vez.",
    path: ["pregunta1"], // Path to show error message
});

type RegisterValues = z.infer<typeof RegisterSchema>
type Question = { id: number; texto_pregunta: string };

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      nombre_completo: "",
      cedula: "",
      email: "",
      password: "",
      pregunta1: "",
      respuesta1: "",
      pregunta2: "",
      respuesta2: "",
      pregunta3: "",
      respuesta3: "",
    },
  });

  useEffect(() => {
    getAvailableSecurityQuestions().then(data => {
      if (data.questions) {
        setQuestions(data.questions);
      } else {
        setResult({ error: data.error });
      }
    });
  }, []);

  const onSubmit = (values: RegisterValues) => {
    setResult(null);
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const res = await registerUser(formData);
      setResult(res);
      if (res.success) {
        form.reset();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {result && (
           <Alert variant={result.error ? "destructive" : "default"} className={result.success ? "bg-emerald-50 dark:bg-emerald-950/50" : ""}>
             {result.error ? <ShieldX className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
             <AlertTitle>{result.error ? "Error" : "Éxito"}</AlertTitle>
             <AlertDescription>{result.error || result.success}</AlertDescription>
           </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="nombre_completo" render={({ field }) => (<FormItem><FormLabel>Nombre Completo</FormLabel><FormControl><Input {...field} disabled={isPending} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="cedula" render={({ field }) => (<FormItem><FormLabel>Cédula (Ej: V-12345678)</FormLabel><FormControl><Input {...field} disabled={isPending} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} disabled={isPending} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Contraseña</FormLabel><FormControl><Input type="password" {...field} disabled={isPending} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        
        <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-lg">Preguntas de Seguridad</h3>
            <p className="text-sm text-slate-500">Estas preguntas te ayudarán a recuperar tu cuenta si olvidas la contraseña.</p>

            <FormField control={form.control} name="pregunta1" render={({ field }) => (
                <FormItem><FormLabel>Pregunta 1</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona una pregunta" /></SelectTrigger></FormControl><SelectContent>{questions.map(q => <SelectItem key={q.id} value={q.id.toString()}>{q.texto_pregunta}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="respuesta1" render={({ field }) => (<FormItem><FormLabel className="sr-only">Respuesta 1</FormLabel><FormControl><Input {...field} placeholder="Tu respuesta secreta..." disabled={isPending} /></FormControl><FormMessage /></FormItem>)} />
            
            <FormField control={form.control} name="pregunta2" render={({ field }) => (
                <FormItem><FormLabel>Pregunta 2</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona una pregunta" /></SelectTrigger></FormControl><SelectContent>{questions.map(q => <SelectItem key={q.id} value={q.id.toString()}>{q.texto_pregunta}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="respuesta2" render={({ field }) => (<FormItem><FormLabel className="sr-only">Respuesta 2</FormLabel><FormControl><Input {...field} placeholder="Tu respuesta secreta..." disabled={isPending} /></FormControl><FormMessage /></FormItem>)} />

            <FormField control={form.control} name="pregunta3" render={({ field }) => (
                <FormItem><FormLabel>Pregunta 3</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona una pregunta" /></SelectTrigger></FormControl><SelectContent>{questions.map(q => <SelectItem key={q.id} value={q.id.toString()}>{q.texto_pregunta}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="respuesta3" render={({ field }) => (<FormItem><FormLabel className="sr-only">Respuesta 3</FormLabel><FormControl><Input {...field} placeholder="Tu respuesta secreta..." disabled={isPending} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        
        <Button type="submit" className="w-full h-12" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isPending ? "Registrando..." : "Crear Cuenta"}
        </Button>
      </form>
    </Form>
  )
}