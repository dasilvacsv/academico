import { LoginForm } from "@/components/auth/login-form";
import { GraduationCap, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-800"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Panel - Branding */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-12 border border-white/20 dark:border-slate-700/30">
                  <div className="text-center">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-20"></div>
                      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl">
                        <GraduationCap className="h-16 w-16 text-white mx-auto" />
                      </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      Sistema de información para el  registro de matrícula escolar
                    </h1>
                    
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                      Innovación y eficiencia para la comunidad educativa moderna
                    </p>
                    
                    <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                      <Sparkles className="h-4 w-4" />
                      <span>Tecnología avanzada para el futuro de la educación</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full max-w-md mx-auto">
              <div className="lg:hidden text-center mb-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-20"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl inline-block">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Bienvenido
                </h2>
                <p className="text-slate-600 dark:text-slate-400">Accede a tu cuenta</p>
              </div>
              
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}