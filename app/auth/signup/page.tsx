"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Card components not needed for new design
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { signupSchema, type SignupFormData, signupUser } from "@/lib/auth";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setSuccessMessage("");

      const result = await signupUser(data);

      if (result.success) {
        setSuccessMessage(result.message);
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (error: any) {
      setError("root", {
        message:
          error.message || "Si è verificato un errore durante la registrazione",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-50">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 60 60"
        >
          <defs>
            <pattern
              id="smallGridSignup"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="30" cy="30" r="4" fill="#10c03e" fillOpacity="0.03" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGridSignup)" />
        </svg>
      </div>

      {/* Main signup container with bento grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left side - Benefits section with glassmorphism */}
        <div className="lg:col-span-7 relative bg-white/70 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/30 to-blue-50/30 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Unisciti a{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Immochat
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Inizia la tua trasformazione digitale nel settore immobiliare
                con la piattaforma WhatsApp Business più avanzata
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Automazione WhatsApp
                    </h3>
                    <p className="text-sm text-gray-600">
                      Risposte automatiche, invio documenti e gestione lead
                      completamente automatizzata
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Analytics Avanzate
                    </h3>
                    <p className="text-sm text-gray-600">
                      Monitora performance, conversioni e ROI con dashboard
                      dettagliate e insights
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Setup Immediato
                    </h3>
                    <p className="text-sm text-gray-600">
                      Configurazione in 5 minuti, integrazione WhatsApp Business
                      automatica
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Signup form with glassmorphism */}
        <div className="lg:col-span-5 relative bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-emerald-50/30 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#203129] mb-2">
                Crea il tuo account
              </h2>
              <p className="text-gray-600">
                Registrati per iniziare a utilizzare Immochat
              </p>
            </div>
            {successMessage && (
              <div className="p-4 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-2xl">
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            )}

            {errors.root && (
              <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl">
                <p className="text-sm text-red-800">{errors.root.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Inserisci il tuo nome completo"
                  {...register("name")}
                  className={`bg-white/50 backdrop-blur-sm border-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl h-12 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@esempio.com"
                  {...register("email")}
                  className={`bg-white/50 backdrop-blur-sm border-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl h-12 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crea una password sicura"
                    {...register("password")}
                    className={`bg-white/50 backdrop-blur-sm border-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl h-12 pr-12 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-700 font-medium"
                >
                  Conferma password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Conferma la tua password"
                    {...register("confirmPassword")}
                    className={`bg-white/50 backdrop-blur-sm border-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl h-12 pr-12 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowConfirmPassword(!showConfirmPassword);
                    }}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#10c03e] to-[#0ea835] hover:from-[#0ea835] hover:to-[#0c8a2e] text-white font-semibold rounded-xl h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading ? "Creazione account..." : "Crea account"}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 backdrop-blur-sm px-4 py-1 text-gray-500 font-medium rounded-full">
                  Oppure
                </span>
              </div>
            </div>

            <GoogleAuthButton text="Registrati con Google" />

            <div className="text-center text-sm mt-8">
              <span className="text-gray-600">Hai già un account? </span>
              <Link
                href="/auth/login"
                className="text-[#10c03e] hover:text-[#0ea835] font-semibold transition-colors"
              >
                Accedi
              </Link>
            </div>

            <div className="text-xs text-gray-500 text-center mt-6 p-4 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-100">
              Registrandoti accetti i nostri{" "}
              <Link
                href="/terms"
                className="text-[#10c03e] hover:underline font-medium"
              >
                Termini di Servizio
              </Link>{" "}
              e la{" "}
              <Link
                href="/privacy"
                className="text-[#10c03e] hover:underline font-medium"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
