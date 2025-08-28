"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Phone,
  Mail,
  Heart,
  MessageSquare,
  Euro,
  Calendar,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface PropertyCardProps {
  property: Property;
  isSelected?: boolean;
  onClick?: () => void;
}

export function PropertyCard({
  property,
  isSelected,
  onClick,
}: PropertyCardProps) {
  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      APARTMENT: "Appartamento",
      HOUSE: "Casa",
      VILLA: "Villa",
      COMMERCIAL: "Commerciale",
      OFFICE: "Ufficio",
      LAND: "Terreno",
      GARAGE: "Garage",
    };
    return types[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const statuses: { [key: string]: string } = {
      FOR_SALE: "In Vendita",
      FOR_RENT: "In Affitto",
      SOLD: "Venduto",
      RENTED: "Affittato",
      DRAFT: "Bozza",
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FOR_SALE":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "FOR_RENT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "SOLD":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "RENTED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card
      className={cn(
        "mx-2 mb-3 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white/95 backdrop-blur-md overflow-hidden group relative",
        isSelected
          ? "shadow-2xl ring-2 ring-emerald-500 ring-opacity-60 bg-gradient-to-br from-emerald-50/80 to-white transform scale-[1.02]"
          : "shadow-lg hover:shadow-2xl"
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Modern gradient header with floating badge */}
        <div className="relative h-3 w-full overflow-hidden">
          <div
            className={cn(
              "absolute inset-0 transition-all duration-500",
              isSelected
                ? "bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500"
                : "bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 group-hover:from-emerald-400 group-hover:via-emerald-500 group-hover:to-emerald-400"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>

        <div className="p-6">
          {/* Header with title and status badge */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-900 line-clamp-2 pr-3 leading-tight group-hover:text-emerald-700 transition-colors duration-300">
              {property.title}
            </h3>
            <Badge
              className={cn(
                "text-xs px-3 py-1 font-semibold shrink-0 shadow-md border-0",
                getStatusColor(property.status)
              )}
            >
              {getStatusLabel(property.status)}
            </Badge>
          </div>

          {/* Location with enhanced styling */}
          <div className="flex items-center text-slate-600 text-sm mb-4 bg-slate-50 rounded-lg p-3 group-hover:bg-emerald-50 transition-colors duration-300">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-emerald-200 transition-colors">
              <MapPin className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="truncate font-medium text-slate-700">
              {property.address}, {property.city}
            </span>
          </div>

          {/* Enhanced price display */}
          <div className="mb-5 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-center">
              <div className="flex items-baseline space-x-1">
                <Euro className="h-5 w-5 text-emerald-600" />
                <span className="text-3xl font-bold text-emerald-600">
                  {property.price.toLocaleString()}
                </span>
                {property.status === "FOR_RENT" && (
                  <span className="text-sm text-slate-500 font-medium">
                    /mese
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced property stats */}
          <div className="flex items-center justify-center mb-5">
            <div className="flex items-center space-x-3">
              {property.bedrooms && (
                <div className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-2 rounded-xl border border-blue-200 shadow-sm">
                  <Bed className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="font-semibold text-blue-700">
                    {property.bedrooms}
                  </span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center bg-gradient-to-r from-purple-50 to-purple-100 px-3 py-2 rounded-xl border border-purple-200 shadow-sm">
                  <Bath className="h-4 w-4 mr-2 text-purple-600" />
                  <span className="font-semibold text-purple-700">
                    {property.bathrooms}
                  </span>
                </div>
              )}
              {property.area && (
                <div className="flex items-center bg-gradient-to-r from-emerald-50 to-emerald-100 px-3 py-2 rounded-xl border border-emerald-200 shadow-sm">
                  <Square className="h-4 w-4 mr-2 text-emerald-600" />
                  <span className="font-semibold text-emerald-700">
                    {property.area}m²
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced bottom section with better layout */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className="text-xs font-semibold bg-white/80 backdrop-blur-sm border-slate-300 text-slate-700"
              >
                <Building2 className="h-3 w-3 mr-1" />
                {getTypeLabel(property.type)}
              </Badge>
              <div className="flex items-center text-xs text-slate-500">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(property.createdAt).toLocaleDateString("it-IT")}
              </div>
            </div>

            {/* Enhanced stats and actions */}
            <div className="flex items-center space-x-3">
              {property._count && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-xs text-slate-500 bg-red-50 px-2 py-1 rounded-lg border border-red-200">
                    <Heart className="h-3 w-3 mr-1 text-red-500" />
                    <span className="font-semibold">
                      {property._count.favorites || 0}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                    <MessageSquare className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="font-semibold">
                      {property._count.inquiries || 0}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-1">
                {property.owner.phone && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-emerald-100 hover:text-emerald-600 transition-colors rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`tel:${property.owner.phone}`);
                    }}
                  >
                    <Phone className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-emerald-100 hover:text-emerald-600 transition-colors rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`mailto:${property.owner.email}`);
                  }}
                >
                  <Mail className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
