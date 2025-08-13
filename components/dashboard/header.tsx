"use client";

import { useSession, signOut } from "next-auth/react";
import { Search, LogOut, User, Lock } from "lucide-react";
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
import Link from "next/link";

export function Header() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "CUSTOMER";
  const isAdmin = userRole === "ADMIN";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

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
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback className="bg-[#10c03e] text-white">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email}
                  </p>
                  <Badge
                    variant={userRole === "ADMIN" ? "default" : "secondary"}
                    className="text-xs w-fit mt-1"
                  >
                    {userRole}
                  </Badge>
                  {/* Show if user signed in with Google */}
                  {session?.user?.image &&
                    session.user.image.includes("googleusercontent.com") && (
                      <div className="flex items-center mt-1">
                        <img
                          src={session.user.image}
                          alt="Google Profile"
                          className="w-4 h-4 rounded-full mr-1"
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
