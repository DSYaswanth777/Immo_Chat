"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface SessionErrorHandlerProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SessionErrorHandler({
  children,
  fallback,
}: SessionErrorHandlerProps) {
  const { status } = useSession();

  // Show fallback while session is loading
  if (status === "loading") {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10c03e]"></div>
        </div>
      )
    );
  }

  // Show children when session is ready
  return <>{children}</>;
}
