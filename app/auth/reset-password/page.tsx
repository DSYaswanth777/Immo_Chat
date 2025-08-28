"use client";

import { Suspense, Component } from "react";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, Loader2, Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Card components not needed for new glassmorphism design
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import { toast } from "sonner";

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "Il codice OTP deve essere di 6 cifre")
    .max(6, "Il codice OTP deve essere di 6 cifre"),
});

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "La password deve essere di almeno 8 caratteri"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Le password non corrispondono",
    path: ["confirmPassword"],
  });

const resetPasswordSchema = z.object({
  otp: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Component that uses useSearchParams - wrapped in Suspense
function ResetPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [verifiedOtpId, setVerifiedOtpId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Handle client-side hydration to prevent SSR mismatch
  useEffect(() => {
    setIsClient(true);
    const emailParam = searchParams.get("email");
    setEmail(emailParam);

    if (!emailParam) {
      router.push("/auth/forgot-password");
    }
  }, [searchParams, router]);

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return <ResetPasswordLoading />;
  }

  const verifyOTP = useCallback(
    async (otp: string) => {
      if (!email) return;

      try {
        setIsLoading(true);

        const response = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            type: "PASSWORD_RESET",
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Codice OTP non valido");
        }

        setVerifiedOtpId(result.otpId);
        setStep("password");
        toast.success("Codice OTP verificato con successo!");
      } catch (error: any) {
        console.error("OTP verification error:", error);
        setError("otp", {
          message: error.message || "Errore durante la verifica del codice OTP",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [email, setError]
  );

  const resetPassword = useCallback(
    async (newPassword: string) => {
      if (!email || !verifiedOtpId) return;

      try {
        setIsLoading(true);

        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword,
            otpId: verifiedOtpId,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Errore durante il reset della password"
          );
        }

        toast.success("Password reimpostata con successo!");
        router.push("/auth/login");
      } catch (error: any) {
        console.error("Password reset error:", error);
        setError("root", {
          message: error.message || "Errore durante il reset della password",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [email, verifiedOtpId, router, setError]
  );

  const onSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        if (step === "otp") {
          // Validate OTP step
          const otpResult = otpSchema.safeParse({ otp: data.otp });
          if (!otpResult.success) {
            setError("otp", { message: otpResult.error.errors[0].message });
            return;
          }
          await verifyOTP(otpResult.data.otp);
        } else {
          // Validate password step
          const passwordResult = passwordSchema.safeParse({
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
          });
          if (!passwordResult.success) {
            const error = passwordResult.error.errors[0];
            setError(error.path[0] as keyof ResetPasswordFormData, {
              message: error.message,
            });
            return;
          }
          await resetPassword(passwordResult.data.newPassword);
        }
      } catch (error) {
        console.error("Form submission error:", error);
        setError("root", { message: "Si è verificato un errore imprevisto" });
      }
    },
    [step, setError, verifyOTP, resetPassword]
  );

  if (!email) {
    return null;
  }

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
              id="smallGridReset"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="30" cy="30" r="4" fill="#10c03e" fillOpacity="0.03" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGridReset)" />
        </svg>
      </div>

      {/* Main reset container with improved layout */}
      <div className="w-full max-w-4xl relative z-10">
        {/* Back navigation */}
        <div className="flex items-center justify-center mb-8">
          <Link
            href="/auth/forgot-password"
            className="flex items-center text-[#10c03e] hover:text-[#0ea835] transition-colors font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna indietro
          </Link>
        </div>

        {/* Main card with glassmorphism */}
        <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-emerald-50/30 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                {step === "otp" ? (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#203129] mb-2">
                {step === "otp" ? "Verifica Codice OTP" : "Nuova Password"}
              </h1>
              <p className="text-gray-600 text-lg">
                {step === "otp"
                  ? `Inserisci il codice OTP inviato a ${email}`
                  : "Imposta la tua nuova password"}
              </p>
            </div>
            {errors.root && (
              <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl">
                <p className="text-sm text-red-800">{errors.root.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {step === "otp" ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <Label
                      htmlFor="otp"
                      className="text-gray-700 font-medium text-lg"
                    >
                      Codice OTP
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      {...register("otp")}
                      className={`text-center text-2xl font-mono tracking-[0.5em] mt-4 bg-white/50 backdrop-blur-sm border-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl h-16 ${
                        errors.otp ? "border-red-500" : ""
                      }`}
                    />
                    {errors.otp && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.otp.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-3">
                      Il codice è valido per 10 minuti
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-gray-700 font-medium"
                    >
                      Nuova Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Inserisci la nuova password"
                        {...register("newPassword")}
                        className={`bg-white/50 backdrop-blur-sm border-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl h-12 pr-12 ${
                          errors.newPassword ? "border-red-500" : ""
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-4 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-red-600">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-gray-700 font-medium"
                    >
                      Conferma Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Conferma la nuova password"
                        {...register("confirmPassword")}
                        className={`bg-white/50 backdrop-blur-sm border-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl h-12 pr-12 ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-4 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#10c03e] to-[#0ea835] hover:from-[#0ea835] hover:to-[#0c8a2e] text-white font-semibold rounded-xl h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading
                  ? "Verifica in corso..."
                  : step === "otp"
                  ? "Verifica Codice"
                  : "Reimposta Password"}
              </Button>
            </form>

            <div className="text-center text-sm mt-8">
              <span className="text-gray-600">
                Non hai ricevuto il codice?{" "}
              </span>
              <Link
                href="/auth/forgot-password"
                className="text-[#10c03e] hover:text-[#0ea835] font-semibold transition-colors"
              >
                Richiedi nuovo codice
              </Link>
            </div>

            {step === "otp" && (
              <div className="mt-8 p-6 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl">
                <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  💡 Suggerimenti
                </h4>
                <ul className="text-xs text-blue-700 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                    Controlla anche la cartella spam
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                    Il codice è composto da 6 cifre
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                    Scade dopo 10 minuti dall'invio
                  </li>
                </ul>
              </div>
            )}

            {step === "password" && (
              <div className="mt-8 p-6 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-2xl">
                <h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  🔒 Password sicura
                </h4>
                <ul className="text-xs text-green-700 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></span>
                    Almeno 8 caratteri
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></span>
                    Combina lettere, numeri e simboli
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></span>
                    Evita informazioni personali
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function ResetPasswordLoading() {
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
              id="smallGridResetLoading"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="30" cy="30" r="4" fill="#10c03e" fillOpacity="0.03" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGridResetLoading)" />
        </svg>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="flex items-center justify-center mb-8">
          <Link
            href="/auth/forgot-password"
            className="flex items-center text-[#10c03e] hover:text-[#0ea835] transition-colors font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna indietro
          </Link>
        </div>

        <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-emerald-50/30 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#203129] mb-2">
                Caricamento...
              </h1>
              <p className="text-gray-600 text-lg">
                Preparazione della pagina di reset password
              </p>
            </div>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-[#10c03e]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error boundary class component
class ResetPasswordErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Reset password page error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
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
                  id="smallGridError"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="30"
                    cy="30"
                    r="4"
                    fill="#10c03e"
                    fillOpacity="0.03"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#smallGridError)" />
            </svg>
          </div>

          <div className="w-full max-w-4xl relative z-10">
            <div className="flex items-center justify-center mb-8">
              <Link
                href="/auth/forgot-password"
                className="flex items-center text-[#10c03e] hover:text-[#0ea835] transition-colors font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Torna indietro
              </Link>
            </div>

            <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-red-50/30 rounded-3xl"></div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-red-600 mb-2">
                    Errore
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Si è verificato un errore durante il caricamento
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-red-600 mb-6 p-4 bg-red-50/80 backdrop-blur-sm rounded-xl border border-red-200/50">
                    ⚠️ Si è verificato un errore imprevisto
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => window.location.reload()}
                      className="w-full bg-gradient-to-r from-[#10c03e] to-[#0ea835] hover:from-[#0ea835] hover:to-[#0c8a2e] text-white font-semibold rounded-xl h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Ricarica Pagina
                    </Button>
                    <Link href="/auth/forgot-password">
                      <Button
                        variant="outline"
                        className="w-full rounded-xl h-12 border-gray-200 hover:bg-gray-50 transition-all duration-300"
                      >
                        Torna alla pagina precedente
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main page component with Suspense and Error boundaries
export default function ResetPasswordPage() {
  return (
    <ResetPasswordErrorBoundary>
      <Suspense fallback={<ResetPasswordLoading />}>
        <ResetPasswordContent />
      </Suspense>
    </ResetPasswordErrorBoundary>
  );
}
