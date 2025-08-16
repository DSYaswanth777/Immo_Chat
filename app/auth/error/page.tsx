"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const errorMessages: Record<string, string> = {
  Configuration: "Errore di configurazione del server. Contatta l'amministratore.",
  AccessDenied: "Accesso negato. Non hai i permessi per accedere.",
  Verification: "Il token di verifica è scaduto o non valido.",
  OAuthSignin: "Errore durante l'autenticazione con Google. Riprova.",
  OAuthCallback: "Errore nel callback OAuth. Verifica la configurazione.",
  OAuthCreateAccount: "Impossibile creare l'account con Google. Riprova.",
  EmailCreateAccount: "Problema con l'email dell'account Google.",
  Callback: "Errore nel processo di autenticazione.",
  OAuthAccountNotLinked:
    "L'account Google non è collegato. Prova ad accedere con email e password.",
  EmailSignin: "Impossibile inviare l'email di accesso.",
  CredentialsSignin: "Credenziali non valide. Verifica email e password.",
  SessionRequired: "Devi essere autenticato per accedere a questa pagina.",
  Default: "Si è verificato un errore durante l'autenticazione.",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mt-4">
              Errore di Autenticazione
            </CardTitle>
            <CardDescription>
              Si è verificato un problema durante l'accesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">{errorMessage}</p>
              {error !== "Default" && (
                <p className="text-xs text-red-600 mt-2">Codice errore: {error}</p>
              )}
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Torna al Login
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/signup">Crea un Nuovo Account</Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Problemi persistenti?{" "}
                <Link
                  href="/contact"
                  className="text-[#10c03e] hover:text-[#0ea835] font-medium"
                >
                  Contatta il supporto
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading error details...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
