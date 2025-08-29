"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Building2,
  Users,
  Map,
  Plus,
  Menu,
  X,
  User,
  Lock,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const adminNavigation = [
  // {
  //   name: "Dashboard",
  //   href: "/dashboard",
  //   icon: Home,
  // },
  {
    name: "Proprietà e Mappa",
    href: "/dashboard/map",
    icon: Map,
  },
  {
    name: "Aggiungi Proprietà",
    href: "/dashboard/properties/new",
    icon: Plus,
  },
  {
    name: "Gestione Proprietà",
    href: "/dashboard/properties",
    icon: Building2,
  },
  {
    name: "Gestione Utenti",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    name: "Profilo",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "Impostazioni",
    href: "/auth/change-password",
    icon: Settings,
  },
];

const customerNavigation = [
  // {
  //   name: "Dashboard",
  //   href: "/dashboard",
  //   icon: Home,
  // },
  {
    name: "Proprietà",
    href: "/dashboard/properties",
    icon: Building2,
  },
  {
    name: "Proprietà e Mappa",
    href: "/dashboard/map",
    icon: Map,
  },
  {
    name: "Profilo",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "Cambia Password",
    href: "/auth/change-password",
    icon: Lock,
  },
];

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userRole = (session?.user as any)?.role || "CUSTOMER";
  const isAdmin = userRole === "ADMIN";

  const navigation = isAdmin ? adminNavigation : customerNavigation;

  // Dispatch custom event when sidebar collapses/expands
  const toggleSidebar = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    const event = new CustomEvent("sidebarToggle", {
      detail: { collapsed },
    });
    window.dispatchEvent(event);
  };

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full relative">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/5"></div>

      {/* Logo Section */}
      <div
        className={cn(
          "relative flex items-center border-b border-white/10 transition-all duration-300",
          collapsed ? "justify-center p-4" : "justify-between p-6"
        )}
      >
        <div
          className={cn(
            "flex items-center transition-all duration-300",
            collapsed ? "justify-center" : "space-x-3"
          )}
        >
          {collapsed && (
            <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-white/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          )}
          {!collapsed && (
            <div className="animate-fade-in">
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt="Professionista Immobiliare"
                  width={100}
                  height={20}
                  className="rounded-lg p-3 bg-white"
                />
              </Link>
            </div>
          )}
        </div>

        {/* Collapse Toggle - Desktop Only */}
        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex text-white/70 hover:text-white hover:bg-white/10 p-2"
            onClick={() => toggleSidebar(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* User Info Section */}
      {!collapsed && (
        <div className="relative p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/20">
                <span className="text-white font-bold text-lg">
                  {session?.user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800 shadow-sm animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-white truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-sm text-emerald-300/80 truncate">
                {session?.user?.email}
              </p>
              <Badge
                variant={userRole === "ADMIN" ? "default" : "secondary"}
                className={cn(
                  "text-xs mt-1 font-medium",
                  userRole === "ADMIN"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                    : "bg-blue-500/20 text-blue-300 border-blue-400/30"
                )}
              >
                {userRole}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        className={cn(
          "flex-1 space-y-2 relative overflow-y-auto",
          collapsed ? "p-2" : "p-4"
        )}
      >
        <TooltipProvider>
          {navigation.map((item, index) => {
            const isActive = pathname === item.href;

            const navItem = (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-xl text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden",
                  "hover:shadow-lg transform hover:scale-[1.02]",
                  collapsed ? "p-3 justify-center" : "space-x-3 px-4 py-3",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-xl ring-1 ring-white/20"
                    : "text-white/70 hover:bg-white/10 hover:text-white backdrop-blur-sm"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Background glow effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                )}

                <div
                  className={cn(
                    "relative z-10 p-2 rounded-lg transition-all duration-300 flex-shrink-0",
                    isActive
                      ? "bg-white/20 backdrop-blur-sm shadow-lg"
                      : "group-hover:bg-white/10"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive
                        ? "text-white"
                        : "text-emerald-300 group-hover:text-white"
                    )}
                  />
                </div>

                {!collapsed && (
                  <>
                    <span className="relative z-10 font-medium truncate flex-1">
                      {item.name}
                    </span>
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-3 w-2 h-2 bg-white rounded-full shadow-sm animate-pulse"></div>
                    )}
                  </>
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-slate-800 text-white border-slate-700"
                  >
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return navItem;
          })}
        </TooltipProvider>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="relative p-4 border-t border-white/10">
          <div className="text-center space-y-5">
            <div className="flex justify-center items-center bg-red-600 rounded-lg py-3 cursor-pointer"       onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut
                className="mr-2 h-4 w-4 text-white"
          
              />
              <p className="font-bold text-white">Esci</p>
            </div>

            <p className="text-xs text-white/50">
              © 2025 Immochat. Tutti i diritti riservati.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex md:flex-col md:fixed md:inset-y-0 z-30 transition-all duration-300",
          isCollapsed ? "md:w-20" : "md:w-72"
        )}
      >
        <div className="flex flex-col h-full bg-slate-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl relative overflow-hidden">
          <SidebarContent collapsed={isCollapsed} />
        </div>
      </div>

      {/* Expand Button for Collapsed Sidebar */}
      {isCollapsed && (
        <div className="hidden md:block fixed top-12 left-20 z-40 rounded">
          <Button
            variant="ghost"
            size="sm"
            className="bg-slate-800/90 rounded-full text-white/70 hover:text-white hover:bg-slate-700 border border-white/10 shadow-lg backdrop-blur-sm"
            onClick={() => toggleSidebar(false)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-8 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-emerald-200 text-emerald-700 hover:bg-emerald-50 shadow-lg"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-slate-900/98 backdrop-blur-xl shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
