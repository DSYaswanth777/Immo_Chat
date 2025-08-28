"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  MessageSquare,
  TrendingUp,
  Plus,
  MapPin,
  User,
  BarChart3,
  Activity,
  Eye,
  Star,
  Clock,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalProperties: number;
  totalUsers: number;
  totalInquiries: number;
  recentProperties: any[];
  recentInquiries: any[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  const userRole = (session?.user as any)?.role || "CUSTOMER";
  const isAdmin = userRole === "ADMIN";

  useEffect(() => {
    // Handle redirects after session is loaded
    if (status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    if (!isAdmin && userRole === "CUSTOMER") {
      setRedirecting(true);
      router.push("/dashboard/properties");
      return;
    }

    // Only fetch data if we're not redirecting
    if (!redirecting) {
      fetchDashboardData();
    }
  }, [session, status, isAdmin, userRole, redirecting, router]);

  const fetchDashboardData = async () => {
    try {
      // Mock data based on user role
      const mockStats: DashboardStats = {
        totalProperties: isAdmin ? 156 : 8,
        totalUsers: isAdmin ? 1247 : 0,
        totalInquiries: isAdmin ? 89 : 12,
        recentProperties: [
          {
            id: "1",
            title: "Appartamento Moderno Milano",
            city: "Milano",
            price: 450000,
            type: "APARTMENT",
            status: "FOR_SALE",
          },
          {
            id: "2",
            title: "Villa con Giardino Roma",
            city: "Roma",
            price: 750000,
            type: "VILLA",
            status: "FOR_SALE",
          },
        ],
        recentInquiries: [
          {
            id: "1",
            name: "Marco Rossi",
            email: "marco@example.com",
            message: "Interessato a visitare l'appartamento",
            property: { title: "Appartamento Centro Storico" },
            createdAt: new Date().toISOString(),
          },
        ],
      };
      setStats(mockStats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while session is loading or redirecting
  if (status === "loading" || redirecting) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if no session or redirecting
  if (!session || redirecting) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Modern Welcome Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/10 to-purple-500/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-400/10 to-purple-400/10 rounded-full translate-y-36 -translate-x-36 blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-start space-x-6 mb-6 lg:mb-0">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white/20 backdrop-blur-sm">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                  Benvenuto, {session?.user?.name}!
                </h1>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 px-3 py-1">
                  {userRole}
                </Badge>
              </div>
              <p className="text-slate-300 text-lg mb-4">
                {isAdmin
                  ? "Dashboard amministratore - Gestisci la piattaforma immobiliare"
                  : "Dashboard utente - Esplora proprietà e trova la casa perfetta"}
              </p>

              {/* Enhanced quick stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center space-x-2 text-emerald-300">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Sistema Attivo</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    Ultimo accesso: {new Date().toLocaleString("it-IT")}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-blue-300">
                  <Activity className="w-4 h-4" />
                  <span>Connessione stabile</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            {isAdmin && (
              <>
                <Link href="/dashboard/properties/new">
                  <Button className="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25">
                    <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                    Aggiungi Proprietà
                  </Button>
                </Link>
                <Link href="/dashboard/admin/users">
                  <Button
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Gestisci Utenti
                  </Button>
                </Link>
              </>
            )}
            {!isAdmin && (
              <>
                <Link href="/dashboard/properties">
                  <Button className="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-xl transition-all duration-300 hover:scale-105">
                    <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Esplora Proprietà
                  </Button>
                </Link>
                <Link href="/dashboard/map">
                  <Button
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Mappa Proprietà
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:scale-105">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-blue-900">
              {isAdmin ? "Totale Proprietà" : "Proprietà Disponibili"}
            </CardTitle>
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-2">
              {stats?.totalProperties || 0}
            </div>
            <div className="flex items-center text-sm text-blue-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="font-medium">+12%</span>
              <span className="ml-1 text-blue-500">dal mese scorso</span>
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:scale-105">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-emerald-900">
                Utenti Attivi
              </CardTitle>
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900 mb-2">
                {stats?.totalUsers || 0}
              </div>
              <div className="flex items-center text-sm text-emerald-600">
                <Activity className="h-4 w-4 mr-1" />
                <span className="font-medium">+8%</span>
                <span className="ml-1 text-emerald-500">dal mese scorso</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:scale-105">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-purple-900">
              {isAdmin ? "Richieste Totali" : "Le Mie Richieste"}
            </CardTitle>
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-2">
              {stats?.totalInquiries || 0}
            </div>
            <div className="flex items-center text-sm text-purple-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span className="font-medium">+23%</span>
              <span className="ml-1 text-purple-500">dal mese scorso</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100/50 hover:scale-105">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-orange-900">
              Visite Oggi
            </CardTitle>
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 mb-2">2,847</div>
            <div className="flex items-center text-sm text-orange-600">
              <Star className="h-4 w-4 mr-1" />
              <span className="font-medium">+15%</span>
              <span className="ml-1 text-orange-500">rispetto a ieri</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Activity Sections */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Properties */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">
                      Proprietà Recenti
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Le proprietà aggiunte di recente
                    </CardDescription>
                  </div>
                </div>
                <Link href="/dashboard/properties">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-emerald-600 hover:bg-emerald-50"
                  >
                    Vedi Tutte
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {stats?.recentProperties.map((property, index) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {property.title}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {property.city}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {property.type}
                        </Badge>
                        <Badge
                          variant={
                            property.status === "FOR_SALE"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {property.status === "FOR_SALE"
                            ? "In Vendita"
                            : "In Affitto"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-emerald-600">
                      €{property.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">prezzo</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Inquiries */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">
                      Richieste Recenti
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Nuove richieste per le proprietà
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {stats?.recentInquiries.map((inquiry, index) => (
                <div
                  key={inquiry.id}
                  className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {inquiry.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">
                            {inquiry.name}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            Nuovo
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{inquiry.email}</p>
                        <p className="text-sm mt-2 text-gray-700">
                          {inquiry.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Per: {inquiry.property.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customer Welcome Section */}
      {!isAdmin && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-gray-900 mb-2">
              Benvenuto su Immochat
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Esplora le proprietà disponibili e trova la casa dei tuoi sogni
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/dashboard/map" className="group">
                <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Esplora Mappa
                  </h3>
                  <p className="text-gray-600">
                    Visualizza tutte le proprietà sulla mappa interattiva
                  </p>
                </div>
              </Link>

              <Link href="/dashboard/profile" className="group">
                <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Gestisci Profilo
                  </h3>
                  <p className="text-gray-600">
                    Aggiorna le tue informazioni e preferenze
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
