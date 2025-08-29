"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GoogleMap from "@/components/dashboard/google-map";
import { PropertyCard } from "@/components/dashboard/property-card";
import { useGoogleMapsUsage } from "@/lib/google-maps-usage-tracker";
import { useSession } from "next-auth/react";

interface Property {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  listingStatus: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  lotSize?: number;
  yearBuilt?: number;
  floors?: number;
  parking?: number;
  latitude?: number;
  longitude?: number;
  features: string[];
  amenities: string[];
  images: string[];
  virtualTour?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  owner: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    image?: string;
  };
  _count: {
    favorites: number;
    inquiries: number;
  };
}

export default function MapPage() {
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    city: "",
  });

  const { getTodayUsage } = useGoogleMapsUsage();
  const userRole =
    status === "loading"
      ? "CUSTOMER"
      : (session?.user as any)?.role || "CUSTOMER";
  const isAdmin = userRole === "ADMIN";

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/properties");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProperties(data.properties || []);
        setFilteredProperties(data.properties || []);
      } catch {
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = properties;
    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((property) => property.type === filters.type);
    }
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(
        (property) => property.status === filters.status
      );
    }
    if (filters.minPrice) {
      filtered = filtered.filter(
        (property) => property.price >= parseInt(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (property) => property.price <= parseInt(filters.maxPrice)
      );
    }
    if (filters.bedrooms) {
      filtered = filtered.filter(
        (property) =>
          property.bedrooms && property.bedrooms >= parseInt(filters.bedrooms)
      );
    }
    if (filters.city) {
      filtered = filtered.filter((property) =>
        property.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    setFilteredProperties(filtered);
  }, [properties, filters]);

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
  };

  if (loading || status === "loading") {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-200 rounded-full animate-spin animation-delay-150 mx-auto"></div>
          </div>
          <p className="text-slate-600 font-medium">Caricamento proprietà...</p>
        </div>
      </div>
    );
  }

  return (
    // ✨ Responsive container
    <div className="h-full flex flex-col md:flex-row bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Sidebar / Property List */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6 text-white block md:hidden">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Esplora Proprietà
              </h2>
              <p className="text-emerald-300 text-sm">
                Trova la tua casa ideale
              </p>
            </div>
          </div>
          <div className="relative z-10 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i tipi</SelectItem>
                  <SelectItem value="APARTMENT">Appartamento</SelectItem>
                  <SelectItem value="HOUSE">Casa</SelectItem>
                  <SelectItem value="VILLA">Villa</SelectItem>
                  <SelectItem value="COMMERCIAL">Commerciale</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti</SelectItem>
                  <SelectItem value="FOR_SALE">In Vendita</SelectItem>
                  <SelectItem value="FOR_RENT">In Affitto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Prezzo min"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
                className="bg-white/10 border-white/20 text-white"
              />
              <Input
                type="number"
                placeholder="Prezzo max"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
        </div>
      <div className="w-full md:w-1/3 bg-white/90 backdrop-blur-md border-r border-slate-200 flex flex-col shadow-xl order-2 md:order-2">
        {/* Filters */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6 text-white hidden md:block">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Esplora Proprietà
              </h2>
              <p className="text-emerald-300 text-sm">
                Trova la tua casa ideale
              </p>
            </div>
          </div>
          <div className="relative z-10 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i tipi</SelectItem>
                  <SelectItem value="APARTMENT">Appartamento</SelectItem>
                  <SelectItem value="HOUSE">Casa</SelectItem>
                  <SelectItem value="VILLA">Villa</SelectItem>
                  <SelectItem value="COMMERCIAL">Commerciale</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti</SelectItem>
                  <SelectItem value="FOR_SALE">In Vendita</SelectItem>
                  <SelectItem value="FOR_RENT">In Affitto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Prezzo min"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
                className="bg-white/10 border-white/20 text-white"
              />
              <Input
                type="number"
                placeholder="Prezzo max"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-3 bg-white/80 border-b border-slate-200 text-sm flex items-center justify-between">
          <span>{filteredProperties.length} proprietà trovate</span>
          {isAdmin && (
            <span className="text-emerald-700">
              API Today: {getTodayUsage()}
            </span>
          )}
        </div>

        {/* Property List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className={`mb-3 ${
                  selectedProperty?.id === property.id
                    ? "ring-2 ring-emerald-500 rounded-xl"
                    : ""
                }`}
              >
                <PropertyCard
                  property={property}
                  isSelected={selectedProperty?.id === property.id}
                  onClick={() => handleMarkerClick(property)}
                />
              </div>
            ))}
            {filteredProperties.length === 0 && (
              <div className="text-center text-slate-500 p-6">
                Nessuna proprietà trovata
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full md:flex-1 relative h-96 md:h-auto order-1 md:order-2">
        {/* ✨ On mobile, map has fixed height; on desktop, it fills remaining space */}
        <GoogleMap
          properties={filteredProperties}
          selectedProperty={selectedProperty}
          onMarkerClick={handleMarkerClick}
        />
      </div>
    </div>
  );
}
