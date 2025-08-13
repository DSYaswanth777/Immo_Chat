"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
  Heart,
  MessageSquare,
  TrendingUp,
  Eye,
  Plus,
  MapPin,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalProperties: number;
  totalUsers: number;
  totalFavorites: number;
  totalInquiries: number;
  recentProperties: any[];
  recentInquiries: any[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const userRole = (session?.user as any)?.role || "CUSTOMER";
  const isAdmin = userRole === "ADMIN";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // For now, we'll use mock data since we haven't implemented the dashboard stats API
        // In a real implementation, you would fetch this from your API
        const mockStats: DashboardStats = {
          totalProperties: isAdmin ? 156 : 8,
          totalUsers: isAdmin ? 1247 : 0,
          totalFavorites: 23,
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

    fetchDashboardData();
  }, [isAdmin]);

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

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#203129]">
            Benvenuto, {session?.user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Ecco una panoramica della tua attività immobiliare
          </p>
        </div>
        <div className="flex space-x-3">
          {isAdmin ? (
            <Link href="/dashboard/properties/new">
              <Button className="bg-[#10c03e] hover:bg-[#0ea835]">
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Proprietà
              </Button>
            </Link>
          ) : (
            ""
          )}

          <Link href="/dashboard/map">
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Visualizza Mappa
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isAdmin ? "Totale Proprietà" : "Le Mie Proprietà"}
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalProperties || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% dal mese scorso
            </p>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Utenti Totali
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +8% dal mese scorso
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preferiti</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalFavorites || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +5% dal mese scorso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Richieste</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalInquiries || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +23% dal mese scorso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Proprietà Recenti
              <Link href="/dashboard/properties">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Vedi Tutte
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>
              Le tue proprietà aggiunte di recente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.recentProperties.map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{property.title}</h4>
                  <p className="text-sm text-gray-600">{property.city}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline">{property.type}</Badge>
                    <Badge
                      variant={
                        property.status === "FOR_SALE" ? "default" : "secondary"
                      }
                    >
                      {property.status === "FOR_SALE"
                        ? "In Vendita"
                        : "In Affitto"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#10c03e]">
                    €{property.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Richieste Recenti
              <Link href="/dashboard/inquiries">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Vedi Tutte
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>
              Nuove richieste per le tue proprietà
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{inquiry.name}</h4>
                    <p className="text-sm text-gray-600">{inquiry.email}</p>
                    <p className="text-sm mt-1">{inquiry.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Per: {inquiry.property.title}
                    </p>
                  </div>
                  <Badge variant="outline">Nuovo</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
