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
import // Card components not needed for new design
// CardContent,
// CardDescription,
// CardHeader,
// CardTitle,
"@/components/ui/card";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { loginSchema, type LoginFormData } from "@/lib/auth";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setSuccessMessage("");

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("root", {
          message: "Credenziali non valide. Riprova.",
        });
      } else {
        setSuccessMessage("Accesso effettuato con successo!");
        // Redirect to properties page after 1 second
        setTimeout(() => {
          router.push("/dashboard/properties");
        }, 1000);
      }
    } catch (error: any) {
      setError("root", {
        message: error.message || "Credenziali non valide. Riprova.",
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
              id="smallGrid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="30" cy="30" r="4" fill="#10c03e" fillOpacity="0.03" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
      </div>

      {/* Main login container with bento grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left side - Brand section with glassmorphism */}
        <div className="lg:col-span-7 relative bg-white/70 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/30 to-blue-50/30 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Benvenuto in{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Immochat
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                La piattaforma più avanzata per gestire la tua attività
                immobiliare attraverso WhatsApp Business
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Veloce & Efficiente
                </h3>
                <p className="text-sm text-gray-600">
                  Automatizza le tue comunicazioni con i clienti
                </p>
              </div>

              <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Sicuro & Affidabile
                </h3>
                <p className="text-sm text-gray-600">
                  I tuoi dati sono protetti e sempre sincronizzati
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form with glassmorphism */}
        <div className="lg:col-span-5 relative bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-emerald-50/30 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#203129] mb-2">
                Accedi al tuo account
              </h2>
              <p className="text-gray-600">
                Inserisci le tue credenziali per accedere
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
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-[#10c03e] hover:text-[#0ea835] font-medium transition-colors"
                  >
                    Password dimenticata?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Inserisci la tua password"
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

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#10c03e] to-[#0ea835] hover:from-[#0ea835] hover:to-[#0c8a2e] text-white font-semibold rounded-xl h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading ? "Accesso in corso..." : "Accedi"}
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

            <GoogleAuthButton text="Accedi con Google" />

            <div className="text-center text-sm mt-8">
              <span className="text-gray-600">Non hai un account? </span>
              <Link
                href="/auth/signup"
                className="text-[#10c03e] hover:text-[#0ea835] font-semibold transition-colors"
              >
                Registrati
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
