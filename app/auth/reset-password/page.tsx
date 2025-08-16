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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const otpSchema = z.object({
  otp: z.string().min(6, "Il codice OTP deve essere di 6 cifre").max(6, "Il codice OTP deve essere di 6 cifre"),
});

const passwordSchema = z.object({
  newPassword: z.string().min(8, "La password deve essere di almeno 8 caratteri"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
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

  const verifyOTP = useCallback(async (otp: string) => {
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
      console.error('OTP verification error:', error);
      setError("otp", {
        message: error.message || "Errore durante la verifica del codice OTP",
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, setError]);

  const resetPassword = useCallback(async (newPassword: string) => {
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
        throw new Error(result.error || "Errore durante il reset della password");
      }

      toast.success("Password reimpostata con successo!");
      router.push("/auth/login");
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError("root", {
        message: error.message || "Errore durante il reset della password",
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, verifiedOtpId, router, setError]);

  const onSubmit = useCallback(async (data: ResetPasswordFormData) => {
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
          confirmPassword: data.confirmPassword 
        });
        if (!passwordResult.success) {
          const error = passwordResult.error.errors[0];
          setError(error.path[0] as keyof ResetPasswordFormData, { message: error.message });
          return;
        }
        await resetPassword(passwordResult.data.newPassword);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError("root", { message: "Si è verificato un errore imprevisto" });
    }
  }, [step, setError, verifyOTP, resetPassword]);

  if (!email) {
    return null;
  }

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex items-center justify-center mb-6">
        <Link
          href="/auth/forgot-password"
          className="flex items-center text-[#10c03e] hover:text-[#0ea835] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna indietro
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-[#203129] flex items-center justify-center">
              {step === "otp" ? (
                <>
                  <Shield className="w-6 h-6 mr-2" />
                  Verifica Codice OTP
                </>
              ) : (
                <>
                  <Eye className="w-6 h-6 mr-2" />
                  Nuova Password
                </>
              )}
            </CardTitle>
            <CardDescription className="text-center">
              {step === "otp" 
                ? `Inserisci il codice OTP inviato a ${email}`
                : "Imposta la tua nuova password"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.root && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{errors.root.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {step === "otp" ? (
                <div className="space-y-2">
                  <Label htmlFor="otp">Codice OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    {...register("otp")}
                    className={`text-center text-lg font-mono tracking-widest ${errors.otp ? "border-red-500" : ""}`}
                  />
                  {errors.otp && (
                    <p className="text-sm text-red-600">{errors.otp.message}</p>
                  )}
                  <p className="text-xs text-gray-500 text-center">
                    Il codice è valido per 10 minuti
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nuova Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Inserisci la nuova password"
                        {...register("newPassword")}
                        className={errors.newPassword ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-red-600">{errors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Conferma Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Conferma la nuova password"
                        {...register("confirmPassword")}
                        className={errors.confirmPassword ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-[#10c03e] hover:bg-[#0ea835] text-white"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading 
                  ? "Verifica in corso..." 
                  : step === "otp" 
                    ? "Verifica Codice" 
                    : "Reimposta Password"
                }
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-600">
                Non hai ricevuto il codice?{" "}
              </span>
              <Link
                href="/auth/forgot-password"
                className="text-[#10c03e] hover:text-[#0ea835] font-medium"
              >
                Richiedi nuovo codice
              </Link>
            </div>

            {step === "otp" && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  💡 Suggerimenti
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Controlla anche la cartella spam</li>
                  <li>• Il codice è composto da 6 cifre</li>
                  <li>• Scade dopo 10 minuti dall'invio</li>
                </ul>
              </div>
            )}

            {step === "password" && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <h4 className="text-sm font-medium text-green-800 mb-2">
                  🔒 Password sicura
                </h4>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Almeno 8 caratteri</li>
                  <li>• Combina lettere, numeri e simboli</li>
                  <li>• Evita informazioni personali</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading fallback component
function ResetPasswordLoading() {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex items-center justify-center mb-6">
        <Link
          href="/auth/forgot-password"
          className="flex items-center text-[#10c03e] hover:text-[#0ea835] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna indietro
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-[#203129] flex items-center justify-center">
              <Shield className="w-6 h-6 mr-2" />
              Caricamento...
            </CardTitle>
            <CardDescription className="text-center">
              Preparazione della pagina di reset password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#10c03e]" />
            </div>
          </CardContent>
        </Card>
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
    console.error('Reset password page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center justify-center mb-6">
            <Link
              href="/auth/forgot-password"
              className="flex items-center text-[#10c03e] hover:text-[#0ea835] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Link>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-red-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 mr-2" />
                  Errore
                </CardTitle>
                <CardDescription className="text-center">
                  Si è verificato un errore durante il caricamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-red-600 mb-4">⚠️ Si è verificato un errore imprevisto</p>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="outline" 
                      className="w-full"
                    >
                      Ricarica Pagina
                    </Button>
                    <Link href="/auth/forgot-password">
                      <Button variant="ghost" className="w-full">
                        Torna alla pagina precedente
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
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
