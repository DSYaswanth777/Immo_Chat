"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
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

const setPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "La password deve contenere almeno 8 caratteri")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La password deve contenere almeno una lettera minuscola, una maiuscola e un numero"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Le password non corrispondono",
  path: ["confirmNewPassword"],
});

type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

interface SetPasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SetPasswordForm({ onSuccess, onCancel }: SetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
  });

  const onSubmit = async (data: SetPasswordFormData) => {
    try {
      setIsLoading(true);
      setSuccessMessage("");

      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmNewPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Errore durante l'impostazione della password");
      }

      setSuccessMessage(result.message);
      reset();
      
      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error: any) {
      setError("root", {
        message: error.message || "Si è verificato un errore durante l'impostazione della password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-8 w-8 text-[#10c03e]" />
        </div>
        <CardTitle className="text-2xl font-bold text-center text-[#203129]">
          Imposta Password
        </CardTitle>
        <CardDescription className="text-center">
          Aggiungi una password al tuo account per poter accedere anche con email e password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {errors.root && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{errors.root.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nuova password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Inserisci la nuova password"
                {...register("newPassword")}
                className={errors.newPassword ? "border-red-500 pr-10" : "pr-10"}
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
              <p className="text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Conferma nuova password</Label>
            <div className="relative">
              <Input
                id="confirmNewPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Conferma la nuova password"
                {...register("confirmNewPassword")}
                className={errors.confirmNewPassword ? "border-red-500 pr-10" : "pr-10"}
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
            {errors.confirmNewPassword && (
              <p className="text-sm text-red-600">{errors.confirmNewPassword.message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
                disabled={isLoading}
              >
                Annulla
              </Button>
            )}
            <Button
              type="submit"
              className={`${onCancel ? 'flex-1' : 'w-full'} bg-[#10c03e] hover:bg-[#0ea835] text-white`}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Impostazione..." : "Imposta Password"}
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Perché impostare una password?
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Potrai accedere sia con Google che con email e password</li>
            <li>• Maggiore sicurezza per il tuo account</li>
            <li>• Accesso alternativo se hai problemi con Google</li>
            <li>• Controllo completo delle tue credenziali</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h4 className="text-sm font-medium text-amber-800 mb-2">
            Requisiti password:
          </h4>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• Almeno 8 caratteri</li>
            <li>• Una lettera minuscola (a-z)</li>
            <li>• Una lettera maiuscola (A-Z)</li>
            <li>• Un numero (0-9)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
