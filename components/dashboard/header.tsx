"use client";

import { useSession, signOut } from "next-auth/react";
import {
  Search,
  LogOut,
  User,
  Lock,
  Loader2,
  MessageSquare,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const { data: session, status } = useSession();

  // Memoize user data to prevent unnecessary re-renders
  const userData = useMemo(() => {
    if (!session?.user) return null;

    const user = session.user as any;
    return {
      name: user.name || "User",
      email: user.email || "",
      image: user.image || "",
      role: user.role || "CUSTOMER",
      initials: user.name?.charAt(0)?.toUpperCase() || "U",
      isGoogleUser: user.image?.includes("googleusercontent.com") || false,
    };
  }, [session?.user]);

  const isAdmin = userData?.role === "ADMIN";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  // Loading state
  if (status === "loading") {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </header>
    );
  }

  // Not authenticated
  if (!session || !userData) {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 ml-auto">
            <Link href="/auth/login">
              <Button variant="outline">Accedi</Button>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/70 backdrop-blur-xl border-b border-emerald-200/50 shadow-lg px-6 py-4 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/30 via-transparent to-blue-50/30 pointer-events-none"></div>

      <div className="flex items-center justify-between relative z-10">
        {/* Search Bar - Enhanced for Admin */}
        {isAdmin && (
          <div className="flex-1 max-w-lg">
            <div className="relative group">
              <Search className="absolute left-4 z-10 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
       
              <Input
                type="search"
                placeholder="Cerca proprietà, utenti, richieste..."
                className="pl-12 pr-4 py-3 w-full bg-white/80 backdrop-blur-sm border-emerald-200/50 rounded-2xl shadow-sm transition-all duration-300 focus:shadow-lg focus:bg-white focus:border-emerald-400 hover:shadow-md"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <kbd className="px-2 py-1 text-xs text-emerald-600 bg-emerald-50 rounded border border-emerald-200">
                  ⌘
                </kbd>
                <kbd className="px-2 py-1 text-xs text-emerald-600 bg-emerald-50 rounded border border-emerald-200">
                  K
                </kbd>
              </div>
            </div>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center space-x-6 ml-auto">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative h-10 w-10 rounded-xl bg-white/50 hover:bg-emerald-50 border border-emerald-200/50 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="relative">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-auto px-3 rounded-2xl bg-white/50 hover:bg-emerald-50 border border-emerald-200/50 shadow-sm transition-all duration-300 hover:shadow-md group"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 ring-2 ring-emerald-200 ring-offset-2 ring-offset-white/50">
                    <AvatarImage
                      src={userData.image}
                      alt={userData.name}
                      loading="lazy"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-lg">
                      {userData.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-gray-900 leading-none">
                      {userData.name}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      {userData.role}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-76 bg-white/95 backdrop-blur-xl border-emerald-200/50 shadow-2xl rounded-2xl "
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 ring-2 ring-emerald-200">
                    <AvatarImage
                      src={userData.image}
                      alt={userData.name}
                      loading="lazy"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold">
                      {userData.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-base font-semibold leading-none text-gray-900">
                      {userData.name}
                    </p>
                    <p className="text-sm text-emerald-600 ">{userData.email}</p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          userData.role === "ADMIN" ? "default" : "secondary"
                        }
                        className={cn(
                          "text-xs font-medium",
                          userData.role === "ADMIN"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-blue-100 text-blue-800 border-blue-200"
                        )}
                      >
                        {userData.role}
                      </Badge>
                      {userData.isGoogleUser && (
                        <Badge variant="outline" className="text-xs">
                          Google
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-emerald-200/30" />

              {/* Profile and Settings */}
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center px-4 py-3 rounded-xl mx-2 hover:bg-emerald-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Profilo</p>
                    <p className="text-xs text-gray-500">
                      Gestisci il tuo account
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/auth/change-password"
                  className="flex items-center px-4 py-3 rounded-xl mx-2 hover:bg-emerald-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Lock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cambia Password</p>
                    <p className="text-xs text-gray-500">
                      Aggiorna la sicurezza
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>

              {/* Admin-specific items */}
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/admin/users"
                    className="flex items-center px-4 py-3 rounded-xl mx-2 hover:bg-emerald-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Gestione Utenti
                      </p>
                      <p className="text-xs text-gray-500">
                        Amministra gli utenti
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="bg-emerald-200/30" />

              <DropdownMenuItem
                onClick={handleSignOut}
                className="mx-2 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Esci</p>
                  <p className="text-xs text-red-500">Termina la sessione</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
