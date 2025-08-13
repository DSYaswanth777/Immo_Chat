'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Building2,
  Users,
  Settings,
  Map,
  Plus,
  Menu,
  X,
  User,
  Lock,
  KeyRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const adminNavigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Proprietà e Mappa',
    href: '/dashboard/map',
    icon: Map,
  },
  {
    name: 'Aggiungi Proprietà',
    href: '/dashboard/properties/new',
    icon: Plus,
  },
  {
    name: 'Gestione Proprietà',
    href: '/dashboard/properties',
    icon: Building2,
  },
  {
    name: 'Google Maps Usage',
    href: '/dashboard/analytics/google-maps',
    icon: Map,
  },
  {
    name: 'Gestione Utenti',
    href: '/dashboard/admin/users',
    icon: Users,
  },
]

const customerNavigation = [
  {
    name: 'Proprietà e Mappa',
    href: '/dashboard/map',
    icon: Map,
  },
  {
    name: 'Profilo',
    href: '/dashboard/profile',
    icon: User,
  },
  {
    name: 'Cambia Password',
    href: '/auth/change-password',
    icon: Lock,
  },
  {
    name: 'Password Dimenticata',
    href: '/auth/forgot-password',
    icon: KeyRound,
  },
]

export function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const userRole = (session?.user as any)?.role || 'CUSTOMER'
  const isAdmin = userRole === 'ADMIN'

  const navigation = isAdmin ? adminNavigation : customerNavigation

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-[#10c03e]" />
          <span className="text-xl font-bold text-[#203129]">
            IMMO<span className="text-[#10c03e]">CHAT</span>
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* User Info */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#10c03e] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {session?.user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session?.user?.name || 'User'}
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-gray-500 truncate">
                {session?.user?.email}
              </p>
              <Badge 
                variant={userRole === 'ADMIN' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {userRole}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#10c03e] text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#10c03e]'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t">
        <p className="text-xs text-gray-500 text-center">
          © 2025 Immochat. Tutti i diritti riservati.
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r">
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}