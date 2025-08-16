"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import SetPasswordForm from "@/components/auth/set-password-form";
import { Button } from "@/components/ui/button";

export default function SetPasswordPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkPasswordStatus = async () => {
      if (status === "loading") return;

      if (!session) {
        router.push("/auth/login");
        return;
      }

      try {
        const response = await fetch("/api/auth/set-password");
        const result = await response.json();

        if (response.ok) {
          setHasPassword(result.hasPassword);
        }
      } catch (error) {
        console.error("Error checking password status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPasswordStatus();
  }, [session, status, router]);

  const handleSuccess = () => {
    // Redirect to dashboard after successful password setup
    setTimeout(() => {
      router.push("/dashboard/properties");
    }, 1000);
  };

  const handleCancel = () => {
    router.push("/dashboard/properties");
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#10c03e]" />
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  if (hasPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-[#203129] mb-4">
              Password già impostata
            </h2>
            <p className="text-gray-600 mb-6">
              Il tuo account ha già una password configurata. Puoi cambiarla
              dalla pagina di cambio password.
            </p>
            <div className="flex space-x-4">
              <Link href="/dashboard/properties" className="flex-1">
                <Button variant="outline" className="w-full">
                  Torna alla Dashboard
                </Button>
              </Link>
              <Link href="/auth/change-password" className="flex-1">
                <Button className="w-full bg-[#10c03e] hover:bg-[#0ea835]">
                  Cambia Password
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
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

        <SetPasswordForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
}
