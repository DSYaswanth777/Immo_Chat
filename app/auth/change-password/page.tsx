"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Eye, EyeOff, Loader2, ArrowLeft, Shield } from "lucide-react";
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

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password attuale richiesta"),
    newPassword: z
      .string()
      .min(8, "La nuova password deve contenere almeno 8 caratteri")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La password deve contenere almeno una lettera minuscola, una maiuscola e un numero"
      ),
    confirmPassword: z.string().min(1, "Conferma password richiesta"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Le password non corrispondono",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true);
      setSuccessMessage("");

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "Current password is incorrect") {
          setError("currentPassword", {
            message: "Password attuale non corretta",
          });
        } else {
          throw new Error(result.error || "Errore durante il cambio password");
        }
        return;
      }

      setSuccessMessage("Password cambiata con successo!");
      reset();
    } catch (error: any) {
      setError("root", {
        message:
          error.message ||
          "Si è verificato un errore durante il cambio password",
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
              id="smallGridChange"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="30" cy="30" r="4" fill="#10c03e" fillOpacity="0.03" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGridChange)" />
        </svg>
      </div>

      {/* Main change password container */}
      <div className="w-full max-w-4xl relative z-10">
        {/* Back navigation */}
        <div className="flex items-center justify-center mb-8">
          <Link
            href="/dashboard/properties"
            className="flex items-center text-[#10c03e] hover:text-[#0ea835] transition-colors font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alla dashboard
          </Link>
        </div>

        {/* Main card with glassmorphism */}
        <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-emerald-50/30 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#203129] mb-2">
                Cambia Password
              </h1>
              <p className="text-gray-600 text-lg">
                Inserisci la password attuale e la nuova password per aggiornare
                le tue credenziali
              </p>
            </div>
            {successMessage && (
              <div className="p-6 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-2xl">
                <p className="text-sm text-green-800 mb-4">{successMessage}</p>
                <Link href="/dashboard/properties">
                  <Button className="bg-[#10c03e] hover:bg-[#0ea835] rounded-xl font-semibold transition-all duration-300">
                    Torna alla Dashboard
                  </Button>
                </Link>
              </div>
            )}

            {errors.root && (
              <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl">
                <p className="text-sm text-red-800">{errors.root.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-gray-700 font-medium"
                >
                  Password Attuale
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Inserisci la password attuale"
                    {...register("currentPassword")}
                    className={`bg-white/50 backdrop-blur-sm border-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl h-12 pr-12 ${
                      errors.currentPassword ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCurrentPassword(!showCurrentPassword);
                    }}
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-600">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

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
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Inserisci la nuova password"
                    {...register("newPassword")}
                    className={`bg-white/50 backdrop-blur-sm border-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl h-12 pr-12 ${
                      errors.newPassword ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowNewPassword(!showNewPassword);
                    }}
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
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
                  Conferma Nuova Password
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

              <div className="flex space-x-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl h-12 border-gray-200 hover:bg-gray-50 transition-all duration-300"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Annulla
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#10c03e] to-[#0ea835] hover:from-[#0ea835] hover:to-[#0c8a2e] text-white font-semibold rounded-xl h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  )}
                  {isLoading ? "Aggiornamento..." : "Aggiorna Password"}
                </Button>
              </div>
            </form>

            <div className="mt-8 p-6 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl">
              <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
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
                Consigli per una password sicura:
              </h4>
              <ul className="text-xs text-blue-700 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                  Usa almeno 8 caratteri
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                  Includi lettere maiuscole e minuscole
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                  Aggiungi numeri e caratteri speciali
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                  Evita informazioni personali facilmente indovinabili
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                  Non riutilizzare password di altri account
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
