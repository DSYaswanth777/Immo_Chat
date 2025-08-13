"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function HomepageHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b bg-white sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Professionista Immobiliare"
              width={100}
              height={20}
              className="rounded-lg"
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#servizi"
            className="text-[#203129] hover:text-[#10c03e] transition-colors"
          >
            Servizi
          </Link>
          <Link
            href="#caratteristiche"
            className="text-[#203129] hover:text-[#10c03e] transition-colors"
          >
            Caratteristiche
          </Link>
          <Link
            href="#come-funziona"
            className="text-[#203129] hover:text-[#10c03e] transition-colors"
          >
            Come Funziona
          </Link>
          <Link
            href="#contatti"
            className="text-[#203129] hover:text-[#10c03e] transition-colors"
          >
            Contatti
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {status === "loading" ? (
            // Loading state
            <div className="flex items-center space-x-4">
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : session ? (
            // Authenticated state - show profile and dashboard
            <>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-[#10c03e] text-[#10c03e] hover:bg-[#10c03e] hover:text-white"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback className="bg-[#10c03e] text-white">
                        {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profilo</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Impostazioni</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Esci</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // Unauthenticated state - show login/register
            <>
              <Link
                href="/auth/login"
                className="text-[#203129] hover:text-[#10c03e] transition-colors font-medium"
              >
                Accedi
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-[#10c03e] hover:bg-[#0ea835] text-white">
                  Registrati
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
