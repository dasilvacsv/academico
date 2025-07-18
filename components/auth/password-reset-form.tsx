// components/auth/password-reset-form.tsx

"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { getSecurityQuestionsForUser, verifyAnswersAndGetPassword } from "@/actions/auth.actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, ShieldQuestion, KeyRound, Copy } from "lucide-react"

type Step = "identifier" | "questions" | "result";

export function PasswordResetForm() {
  const [step, setStep] = useState<Step>("identifier");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: string, password?: string } | null>(null);

  const [identifier, setIdentifier] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  
  const { register, handleSubmit, getValues } = useForm();
  
  const handleIdentifierSubmit = async (data: any) => {
    setError(null);
    setIdentifier(data.identifier);
    startTransition(async () => {
      const res = await getSecurityQuestionsForUser(data.identifier);
      if (res.error) {
        setError(res.error);
      } else if (res.questions) {
        setQuestions(res.questions);
        setStep("questions");
      }
    });
  }

  const handleAnswersSubmit = async (data: any) => {
    setError(null);
    const formData = new FormData();
    formData.append("identifier", identifier);
    formData.append("answer1", data.answer1);
    formData.append("answer2", data.answer2);
    formData.append("answer3", data.answer3);

    startTransition(async () => {
      const res = await verifyAnswersAndGetPassword(formData);
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        setResult({ success: res.success, password: res.password });
        setStep("result");
      }
    });
  }
  
  const copyToClipboard = () => {
      if (result?.password) {
        navigator.clipboard.writeText(result.password);
        alert("¡Contraseña copiada al portapapeles!");
      }
  }

  return (
    <div className="space-y-6">
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        {step === "identifier" && (
            <form onSubmit={handleSubmit(handleIdentifierSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="identifier">Correo Electrónico o Cédula</Label>
                    <Input id="identifier" {...register("identifier", { required: true })} placeholder="tu@email.com o V-12345678" disabled={isPending} />
                </div>
                <Button type="submit" className="w-full h-12" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldQuestion className="mr-2 h-5 w-5" />}
                    {isPending ? "Buscando..." : "Buscar Cuenta"}
                </Button>
            </form>
        )}

        {step === "questions" && (
            <form onSubmit={handleSubmit(handleAnswersSubmit)} className="space-y-5">
                <h3 className="text-center font-semibold">Responde tus preguntas de seguridad</h3>
                {questions.map((q, index) => (
                    <div key={index} className="space-y-2">
                        <Label htmlFor={`answer${index + 1}`}>{q}</Label>
                        <Input id={`answer${index + 1}`} type="text" {...register(`answer${index + 1}`, { required: true })} disabled={isPending} />
                    </div>
                ))}
                <Button type="submit" className="w-full h-12" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
                    {isPending ? "Verificando..." : "Verificar Respuestas"}
                </Button>
            </form>
        )}

        {step === "result" && result?.success && (
            <Alert variant="default" className="bg-emerald-50 dark:bg-emerald-950/50">
                <KeyRound className="h-4 w-4" />
                <AlertTitle>{result.success}</AlertTitle>
                <AlertDescription>
                    {result.password?.startsWith("Tu contraseña está encriptada") ? (
                        <p>{result.password}</p>
                    ) : (
                        <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-between">
                            <span className="font-mono text-lg">{result.password}</span>
                            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                                <Copy className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                     <p className="mt-4 text-xs">
                        **ADVERTENCIA:** Por tu seguridad, nunca compartas tu contraseña. Te recomendamos iniciar sesión y cambiarla inmediatamente.
                    </p>
                </AlertDescription>
            </Alert>
        )}
    </div>
  )
}