"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { registrarEstudiante } from "@/actions/estudiantes.actions";

// UI Components & Icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Users, 
  Calendar,
  Heart,
  Globe,
  MapPin,
  Phone,
  Mail,
  Shield,
  Award,
  Sparkles,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

// Validation Schema
const formSchema = z.object({
  est_nombres: z.string().min(2, "El nombre es muy corto"),
  est_apellidos: z.string().min(2, "El apellido es muy corto"),
  est_fecha_nacimiento: z.string().min(1, "La fecha es requerida"),
  est_genero: z.string().min(1, "Selecciona un género"),
  est_nacionalidad: z.string().min(1, "Selecciona una nacionalidad"),
  est_estado_nacimiento: z.string().optional(),
  est_direccion: z.string().min(5, "La dirección es muy corta"),
  est_telefono: z.string().optional(),
  est_correo: z.string().email("Correo no válido").optional().or(z.literal('')),
  est_condicion_especial: z.string().optional(),
  rep_nombres: z.string().min(2, "El nombre es muy corto"),
  rep_apellidos: z.string().min(2, "El apellido es muy corto"),
  rep_cedula: z.string().min(6, "La cédula debe tener al menos 6 dígitos"),
  rep_telefono: z.string().min(7, "El teléfono no es válido"),
  rep_correo: z.string().email("Correo no válido"),
  rep_direccion: z.string().min(5, "La dirección es muy corta"),
  rep_parentesco: z.string().min(1, "Selecciona un parentesco"),
  rep_ocupacion: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface FormProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  steps: any[];
}

// Step field mappings
const stepFields = {
  0: ["est_nombres", "est_apellidos", "est_fecha_nacimiento", "est_genero", "est_nacionalidad", "est_estado_nacimiento", "est_direccion", "est_telefono", "est_correo", "est_condicion_especial"],
  1: ["rep_nombres", "rep_apellidos", "rep_cedula", "rep_telefono", "rep_correo", "rep_direccion", "rep_parentesco", "rep_ocupacion"],
  2: []
};

export function RegistroEstudianteForm({ currentStep, setCurrentStep, steps }: FormProps) {
  const [isPending, startTransition] = useTransition();
  const [formResult, setFormResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  
  const processForm = async (data: FormData) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        formData.append(key, data[key as keyof FormData] || '');
    });

    startTransition(async () => {
      const result = await registrarEstudiante(formData);
      if (result?.error) setFormResult({ type: "error", text: result.error });
      if (result?.success) setFormResult({ type: "success", text: result.success });
    });
  };

  const nextStep = async () => {
    const fields = stepFields[currentStep as keyof typeof stepFields];
    const output = await form.trigger(fields as (keyof FormData)[], { shouldFocus: true });
    if (!output) return;
    setCurrentStep(step => step + 1);
  };

  const prevStep = () => setCurrentStep(step => step - 1);

  if (formResult?.type === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="flex flex-col items-center justify-center text-center p-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20"
      >
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full blur-2xl opacity-30 animate-pulse" />
          <div className="relative p-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full">
            <Award className="h-16 w-16 text-white" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mt-8"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            ¡Registro Exitoso!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md">
            {formResult.text}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mt-10 w-full max-w-md"
        >
          <Button 
            size="lg" 
            onClick={() => { form.reset(); setFormResult(null); setCurrentStep(0); }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 border-0"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Registrar Otro
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            asChild
            className="bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-200"
          >
            <Link href="/dashboard/estudiantes">
              <Users className="mr-2 h-5 w-5" />
              Ver Lista
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  if (formResult?.type === 'error') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="p-8"
      >
        <Alert variant="destructive" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 shadow-lg shadow-red-500/10 backdrop-blur-sm">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            {formResult.text}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button 
            onClick={() => setFormResult(null)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Intentar Nuevamente
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <motion.div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                currentStep === index 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-110' 
                  : currentStep > index 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}
              whileHover={{ scale: currentStep >= index ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep > index ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </motion.div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                currentStep > index 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                  : 'bg-slate-200 dark:bg-slate-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
        <div className={`p-6 ${
          currentStep === 0 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
          currentStep === 1 ? 'bg-gradient-to-r from-purple-500 to-violet-600' :
          'bg-gradient-to-r from-emerald-500 to-green-600'
        }`}>
          <CardHeader className="p-0">
            <CardTitle className="text-2xl text-white flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {(() => {
                  const Icon = steps[currentStep].icon;
                  return <Icon className="h-6 w-6" />;
                })()}
              </div>
              {steps[currentStep].name}
            </CardTitle>
            <CardDescription className="text-white/90 font-medium">
              {currentStep === 0 && "Información personal y de contacto del estudiante."}
              {currentStep === 1 && "Datos de la persona responsable legalmente del estudiante."}
              {currentStep === 2 && "Verifica que todos los datos sean correctos antes de finalizar."}
            </CardDescription>
          </CardHeader>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(processForm)}>
            <CardContent className="min-h-[500px] p-8">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentStep} 
                  initial={{ x: 50, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  exit={{ x: -50, opacity: 0 }} 
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 0 && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField 
                          control={form.control} 
                          name="est_nombres" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Nombres *
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                  <Input 
                                    {...field} 
                                    className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    placeholder="Ingrese los nombres"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                        <FormField 
                          control={form.control} 
                          name="est_apellidos" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Apellidos *
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                  <Input 
                                    {...field} 
                                    className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    placeholder="Ingrese los apellidos"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField 
                          control={form.control} 
                          name="est_fecha_nacimiento" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Fecha de Nacimiento *
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                  <Input 
                                    type="date" 
                                    {...field} 
                                    className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                        <FormField 
                          control={form.control} 
                          name="est_genero" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Género *
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <div className="relative">
                                    <Heart className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 z-10" />
                                    <SelectTrigger className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                                      <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                  </div>
                                </FormControl>
                                <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 rounded-xl">
                                  <SelectItem value="Masculino">Masculino</SelectItem>
                                  <SelectItem value="Femenino">Femenino</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                        <FormField 
                          control={form.control} 
                          name="est_nacionalidad" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Nacionalidad *
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 z-10" />
                                    <SelectTrigger className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                                      <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                  </div>
                                </FormControl>
                                <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 rounded-xl">
                                  <SelectItem value="Venezolana">Venezolana</SelectItem>
                                  <SelectItem value="Extranjera">Extranjera</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField 
                          control={form.control} 
                          name="est_estado_nacimiento" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Estado de Nacimiento
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                  <Input 
                                    {...field} 
                                    className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    placeholder="Ej: Miranda, Caracas"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                        <FormField 
                          control={form.control} 
                          name="est_telefono" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Teléfono
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                  <Input 
                                    {...field} 
                                    className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    placeholder="Ej: +58 414 123 4567"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                      </div>

                      <FormField 
                        control={form.control} 
                        name="est_direccion" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                              Dirección *
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                <Textarea 
                                  {...field} 
                                  className="min-h-[100px] pl-12 pt-4 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                                  placeholder="Dirección completa del estudiante"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField 
                          control={form.control} 
                          name="est_correo" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Correo Electrónico
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                  <Input 
                                    type="email"
                                    {...field} 
                                    className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    placeholder="estudiante@email.com"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                        <FormField 
                          control={form.control} 
                          name="est_condicion_especial" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Condición Especial
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Shield className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                  <Textarea 
                                    {...field} 
                                    className="min-h-[100px] pl-12 pt-4 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                                    placeholder="Alergias, condiciones médicas, etc."
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                      </div>
                    </div>
                  )}
                  
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField 
                          control={form.control} 
                          name="rep_nombres" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Nombres del Representante *
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Users className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                  <Input 
                                    {...field} 
                                    className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                                    placeholder="Nombres del representante"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                        <FormField 
                          control={form.control} 
                          name="rep_apellidos" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Apellidos del Representante *
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Users className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                  <Input 
                                    {...field} 
                                    className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                                    placeholder="Apellidos del representante"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField 
                          control={form.control} 
                          name="rep_cedula" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Cédula *
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Shield className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                  <Input 
                                    {...field} 
                                    className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                                    placeholder="Ej: 12345678"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                        <FormField 
                          control={form.control} 
                          name="rep_telefono" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Teléfono *
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                  <Input 
                                    {...field} 
                                    className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                                    placeholder="Ej: +58 414 123 4567"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                      </div>
                      
                      <FormField 
                        control={form.control} 
                        name="rep_correo" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                              Correo Electrónico *
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <Input 
                                  type="email" 
                                  {...field} 
                                  className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                                  placeholder="representante@email.com"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField 
                          control={form.control} 
                          name="rep_parentesco" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Parentesco *
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <div className="relative">
                                    <Heart className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 z-10" />
                                    <SelectTrigger className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all duration-200">
                                      <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                  </div>
                                </FormControl>
                                <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 rounded-xl">
                                  <SelectItem value="Padre">Padre</SelectItem>
                                  <SelectItem value="Madre">Madre</SelectItem>
                                  <SelectItem value="Tutor Legal">Tutor Legal</SelectItem>
                                  <SelectItem value="Abuelo/a">Abuelo/a</SelectItem>
                                  <SelectItem value="Tío/a">Tío/a</SelectItem>
                                  <SelectItem value="Otro">Otro</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                        <FormField 
                          control={form.control} 
                          name="rep_ocupacion" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Ocupación
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                  <Input 
                                    {...field} 
                                    className="h-12 pl-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                                    placeholder="Ej: Ingeniero, Docente, Comerciante"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} 
                        />
                      </div>
                      
                      <FormField 
                        control={form.control} 
                        name="rep_direccion" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                              Dirección *
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                <Textarea 
                                  {...field} 
                                  className="min-h-[100px] pl-12 pt-4 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                                  placeholder="Dirección completa del representante"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                    </div>
                  )}
                  
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                          Confirmar Información
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          Revisa cuidadosamente todos los datos antes de finalizar el registro
                        </p>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Student Info */}
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                Datos del Estudiante
                              </h4>
                              <p className="text-blue-700 dark:text-blue-300 font-medium">
                                {form.getValues("est_nombres")} {form.getValues("est_apellidos")}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-600 dark:text-blue-400 font-medium">Fecha Nac.:</span>
                              <span className="text-blue-900 dark:text-blue-100">{form.getValues("est_fecha_nacimiento")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-600 dark:text-blue-400 font-medium">Género:</span>
                              <span className="text-blue-900 dark:text-blue-100">{form.getValues("est_genero")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-600 dark:text-blue-400 font-medium">Nacionalidad:</span>
                              <span className="text-blue-900 dark:text-blue-100">{form.getValues("est_nacionalidad")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Representative Info */}
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-800/50 rounded-2xl">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl">
                              <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100">
                                Datos del Representante
                              </h4>
                              <p className="text-purple-700 dark:text-purple-300 font-medium">
                                {form.getValues("rep_nombres")} {form.getValues("rep_apellidos")}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-purple-600 dark:text-purple-400 font-medium">Cédula:</span>
                              <span className="text-purple-900 dark:text-purple-100">{form.getValues("rep_cedula")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-600 dark:text-purple-400 font-medium">Parentesco:</span>
                              <span className="text-purple-900 dark:text-purple-100">{form.getValues("rep_parentesco")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-600 dark:text-purple-400 font-medium">Teléfono:</span>
                              <span className="text-purple-900 dark:text-purple-100">{form.getValues("rep_telefono")}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">
                              Información Verificada
                            </h4>
                            <p className="text-sm text-emerald-700 dark:text-emerald-200 leading-relaxed">
                              Al confirmar el registro, toda la información será guardada de forma segura en el sistema. 
                              Podrás editarla posteriormente si es necesario.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-slate-200/50 dark:border-slate-700/50 pt-6 px-8 pb-8">
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep} 
                className={`${currentStep === 0 ? "invisible" : "visible"} h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-200`}
                size="lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> 
                Anterior
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button 
                  type="button" 
                  size="lg" 
                  onClick={nextStep}
                  className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 border-0"
                >
                  Siguiente 
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isPending}
                  className="h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-300 border-0"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                      Finalizando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Finalizar Registro
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}