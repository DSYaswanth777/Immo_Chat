"use client";

import { useSession, signOut } from "next-auth/react";
import { Search, LogOut, User, Lock, Loader2 } from "lucide-react";
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
      isGoogleUser: user.image?.includes("googleusercontent.com") || false
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
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar - Only for Admin */}
        {isAdmin && (
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Cerca proprietà, utenti..."
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={userData.image}
                    alt={userData.name}
                    loading="lazy"
                  />
                  <AvatarFallback className="bg-emerald-600 text-white font-semibold">
                    {userData.initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userData.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userData.email}
                  </p>
                  <Badge
                    variant={userData.role === "ADMIN" ? "default" : "secondary"}
                    className="text-xs w-fit mt-1"
                  >
                    {userData.role}
                  </Badge>
                  {/* Show if user signed in with Google */}
                  {userData.isGoogleUser && (
                    <div className="flex items-center mt-1">
                      <img
                        src={userData.image}
                        alt="Google Profile"
                        className="w-4 h-4 rounded-full mr-1"
                        loading="lazy"
                      />
                      <span className="text-xs text-gray-500">
                        Google Account
                      </span>
                    </div>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Profile and Settings for all users */}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profilo</span>
                </Link>
              </DropdownMenuItem>

              {/* Change Password for all users */}
              <DropdownMenuItem asChild>
                <Link
                  href="/auth/change-password"
                  className="flex items-center"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Cambia Password</span>
                </Link>
              </DropdownMenuItem>

              {/* Admin-specific menu items */}
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/admin/users"
                    className="flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Gestione Utenti</span>
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Esci</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
