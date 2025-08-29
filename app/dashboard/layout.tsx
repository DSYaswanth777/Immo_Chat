"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Debug session state
  console.log("DashboardLayout Session Debug:", { status, session });

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("Redirecting to login due to unauthenticated status");
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    // Listen for sidebar collapse state changes
    const handleSidebarToggle = (event: CustomEvent) => {
      setIsSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener(
      "sidebarToggle",
      handleSidebarToggle as EventListener
    );
    return () => {
      window.removeEventListener(
        "sidebarToggle",
        handleSidebarToggle as EventListener
      );
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-white/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-white/70">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-white relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-emerald-400/8 to-blue-400/8 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/8 to-purple-400/8 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-75"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-emerald-300/5 to-green-300/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-150"></div>
      </div>

      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300 relative z-10 ",
          isSidebarCollapsed ? "md:ml-20" : "md:ml-72"
        )}
      >
        <div className="sticky top-0 z-30 backdrop-blur-xl">
          <Header />
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
