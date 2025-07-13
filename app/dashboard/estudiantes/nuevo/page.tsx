"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Users, Check, Sparkles, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegistroEstudianteForm } from "@/components/estudiantes/registro-estudiante-form";
import { motion } from "framer-motion";

const steps = [
  { 
    id: "01", 
    name: "Datos del Estudiante", 
    icon: User, 
    description: "Información personal básica",
    color: "from-blue-500 to-indigo-600"
  },
  { 
    id: "02", 
    name: "Datos del Representante", 
    icon: Users, 
    description: "Información del tutor legal",
    color: "from-purple-500 to-violet-600"
  },
  { 
    id: "03", 
    name: "Confirmación", 
    icon: Check, 
    description: "Revisar y confirmar datos",
    color: "from-emerald-500 to-green-600"
  },
];

export default function NuevoEstudiantePage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
     <div className="relative overflow-hidden"> 
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-r from-purple-300 to-blue-300 dark:from-purple-800 dark:to-blue-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gradient-to-r from-yellow-300 to-pink-300 dark:from-yellow-800 dark:to-pink-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-pink-300 to-indigo-300 dark:from-pink-800 dark:to-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 dark:bg-blue-300/20 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 p-6"
      >
        <Button 
          variant="outline" 
          size="sm" 
          asChild 
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-200 shadow-lg"
        >
          <Link href="/dashboard/estudiantes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto flex items-center justify-center p-4">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Left Panel: Enhanced Stepper */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex flex-col space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Registro de Estudiante
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Proceso guiado paso a paso
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex flex-col space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-center gap-4 group"
                >
                  <motion.div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 ${
                      currentStep === index 
                        ? `bg-gradient-to-br ${step.color} text-white shadow-lg scale-110` 
                        : currentStep > index 
                        ? `bg-gradient-to-br ${step.color} text-white shadow-md` 
                        : 'bg-white/80 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50'
                    }`}
                    whileHover={{ scale: currentStep >= index ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentStep > index ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </motion.div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        currentStep >= index 
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        Paso {step.id}
                      </span>
                      {currentStep === index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-blue-500 rounded-full"
                        />
                      )}
                    </div>
                    <h3 className={`text-lg font-semibold transition-colors ${
                      currentStep >= index 
                        ? 'text-slate-900 dark:text-slate-100' 
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {step.name}
                    </h3>
                    <p className={`text-sm transition-colors ${
                      currentStep >= index 
                        ? 'text-slate-600 dark:text-slate-300' 
                        : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </nav>

            {/* Progress Bar */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Progreso</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Información Importante
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Completa cada paso cuidadosamente. Toda la información se guarda automáticamente 
                    y puedes volver a pasos anteriores si necesitas hacer correcciones.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Panel: Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
              <RegistroEstudianteForm
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                steps={steps}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Animation */}
      {currentStep === steps.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center shadow-2xl max-w-md mx-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Award className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              ¡Registro Completado!
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              El estudiante ha sido registrado exitosamente en el sistema.
            </p>
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Link href="/dashboard/estudiantes">
                Ver Estudiantes
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}