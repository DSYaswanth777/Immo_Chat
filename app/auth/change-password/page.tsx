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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex items-center justify-center mb-6">
        <Link
          href="/dashboard/properties"
          className="flex items-center text-[#10c03e] hover:text-[#0ea835] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna alla dashboard
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-[#203129] flex items-center justify-center">
              <Shield className="w-6 h-6 mr-2" />
              Cambia Password
            </CardTitle>
            <CardDescription className="text-center">
              Inserisci la password attuale e la nuova password per aggiornare
              le tue credenziali
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800 mb-3">{successMessage}</p>
                <Link href="/dashboard/properties">
                  <Button size="sm" className="bg-[#10c03e] hover:bg-[#0ea835]">
                    Torna alla Dashboard
                  </Button>
                </Link>
              </div>
            )}

            {errors.root && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{errors.root.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Password Attuale</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Inserisci la password attuale"
                    {...register("currentPassword")}
                    className={
                      errors.currentPassword ? "border-red-500 pr-10" : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCurrentPassword(!showCurrentPassword);
                    }}
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
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
                <Label htmlFor="newPassword">Nuova Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Inserisci la nuova password"
                    {...register("newPassword")}
                    className={
                      errors.newPassword ? "border-red-500 pr-10" : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowNewPassword(!showNewPassword);
                    }}
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
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
                <Label htmlFor="confirmPassword">Conferma Nuova Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Conferma la nuova password"
                    {...register("confirmPassword")}
                    className={
                      errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowConfirmPassword(!showConfirmPassword);
                    }}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Annulla
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#10c03e] hover:bg-[#0ea835] text-white"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "Aggiornamento..." : "Aggiorna Password"}
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Consigli per una password sicura:
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Usa almeno 8 caratteri</li>
                <li>• Includi lettere maiuscole e minuscole</li>
                <li>• Aggiungi numeri e caratteri speciali</li>
                <li>• Evita informazioni personali facilmente indovinabili</li>
                <li>• Non riutilizzare password di altri account</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
