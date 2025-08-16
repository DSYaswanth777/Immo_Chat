"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { ErrorBoundary } from "@/components/error-boundary";

interface GoogleAuthButtonProps {
  text?: string;
  className?: string;
}

function GoogleAuthButtonContent({
  text = "Continua con Google",
  className,
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);

  const safeSetLoading = useCallback((loading: boolean) => {
    if (mountedRef.current) {
      setIsLoading(loading);
    }
  }, []);

  const safeToast = useCallback(
    (type: "success" | "error", message: string) => {
      if (mountedRef.current && typeof window !== "undefined") {
        try {
          if (type === "success") {
            toast.success(message);
          } else {
            toast.error(message);
          }
        } catch (error) {
          console.error("Toast error:", error);
          // Fallback to console if toast fails
          console.log(`${type.toUpperCase()}: ${message}`);
        }
      }
    },
    []
  );

  const handleGoogleSignIn = useCallback(async () => {
    if (isLoading || !mountedRef.current) return;

    try {
      safeSetLoading(true);

      console.log("Initiating Google sign-in...");

      const result = await signIn("google", {
        callbackUrl: "/dashboard/properties",
        redirect: false,
      });

      console.log("Google sign-in result:", result);

      if (!mountedRef.current) return;

      if (result?.error) {
        console.error("Google sign-in error:", result.error);

        // Handle specific error cases
        switch (result.error) {
          case "OAuthSignin":
            safeToast(
              "error",
              "Errore durante l'autenticazione con Google. Riprova."
            );
            break;
          case "OAuthCallback":
            safeToast(
              "error",
              "Errore nel callback di Google. Verifica la configurazione."
            );
            break;
          case "OAuthCreateAccount":
            safeToast("error", "Errore nella creazione dell'account. Riprova.");
            break;
          case "EmailCreateAccount":
            safeToast("error", "Errore con l'email dell'account Google.");
            break;
          case "Callback":
            safeToast("error", "Errore nel processo di autenticazione.");
            break;
          default:
            safeToast("error", `Errore di autenticazione: ${result.error}`);
        }
      } else if (result?.ok) {
        console.log("Google sign-in successful, redirecting...");
        safeToast("success", "Accesso con Google completato!");

        // Use a small delay to ensure toast is shown before redirect
        setTimeout(() => {
          if (mountedRef.current) {
            window.location.href = result.url || "/dashboard/properties";
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      if (mountedRef.current) {
        safeToast(
          "error",
          "Errore imprevisto durante l'accesso con Google. Riprova."
        );
      }
    } finally {
      safeSetLoading(false);
    }
  }, [isLoading, safeSetLoading, safeToast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`w-full ${className}`}
    >
      <svg
        className="w-5 h-5 mr-2"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      {isLoading ? "Caricamento..." : text}
    </Button>
  );
}

function AuthButtonFallback() {
  return (
    <Button variant="outline" disabled className="w-full">
      <svg
        className="w-5 h-5 mr-2"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      Continua con Google
    </Button>
  );
}

export function GoogleAuthButton(props: GoogleAuthButtonProps) {
  return (
    <ErrorBoundary fallback={AuthButtonFallback}>
      <GoogleAuthButtonContent {...props} />
    </ErrorBoundary>
  );
}
