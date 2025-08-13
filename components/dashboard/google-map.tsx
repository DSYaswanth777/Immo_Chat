"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { googleMapsLoader } from "@/lib/google-maps-loader";
import { googleMapsUsageTracker } from "@/lib/google-maps-usage-tracker";

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

interface GoogleMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onMarkerClick: (property: Property) => void;
}

export function GoogleMap({
  properties,
  selectedProperty,
  onMarkerClick,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);

  // Debounced marker update to reduce API calls
  const updateMarkersDebounced = useCallback(
    debounce((newProperties: Property[]) => {
      if (!map || !google?.maps) return;

      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null));

      const newMarkers: google.maps.Marker[] = [];

      newProperties.forEach((property) => {
        if (property.latitude && property.longitude) {
          const marker = new google.maps.Marker({
            position: { lat: property.latitude, lng: property.longitude },
            map: map,
            title: property.title,
            icon: {
              url:
                selectedProperty?.id === property.id
                  ? "data:image/svg+xml;charset=UTF-8," +
                    encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#10c03e" stroke="white" stroke-width="4"/>
                    <text x="20" y="26" text-anchor="middle" fill="white" font-size="12" font-weight="bold">€</text>
                  </svg>
                `)
                  : "data:image/svg+xml;charset=UTF-8," +
                    encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="14" fill="#203129" stroke="white" stroke-width="3"/>
                    <text x="16" y="21" text-anchor="middle" fill="white" font-size="10" font-weight="bold">€</text>
                  </svg>
                `),
              scaledSize:
                selectedProperty?.id === property.id
                  ? new google.maps.Size(40, 40)
                  : new google.maps.Size(32, 32),
              anchor:
                selectedProperty?.id === property.id
                  ? new google.maps.Point(20, 20)
                  : new google.maps.Point(16, 16),
            },
          });

          marker.addListener("click", () => {
            onMarkerClick(property);
            googleMapsUsageTracker.trackMarkerClick();

            if (infoWindow) {
              googleMapsUsageTracker.trackInfoWindowOpen();
              const getStatusLabel = (status: string) => {
                const statuses: { [key: string]: string } = {
                  FOR_SALE: "In Vendita",
                  FOR_RENT: "In Affitto",
                  SOLD: "Venduto",
                  RENTED: "Affittato",
                };
                return statuses[status] || status;
              };

              const getTypeLabel = (type: string) => {
                const types: { [key: string]: string } = {
                  APARTMENT: "Appartamento",
                  HOUSE: "Casa",
                  VILLA: "Villa",
                  COMMERCIAL: "Commerciale",
                };
                return types[type] || type;
              };

              const content = `
                <div style="max-width: 300px; padding: 10px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #203129;">
                    ${property.title}
                  </h3>
                  <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
                    ${property.address}, ${property.city}
                  </p>
                  <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                    <span style="background: #10c03e; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                      ${getStatusLabel(property.status)}
                    </span>
                    <span style="background: #f3f4f6; color: #374151; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                      ${getTypeLabel(property.type)}
                    </span>
                  </div>
                  <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #10c03e;">
                    €${property.price.toLocaleString()}${
                property.status === "FOR_RENT" ? "/mese" : ""
              }
                  </p>
                  <div style="display: flex; gap: 12px; margin-bottom: 8px; font-size: 14px; color: #666;">
                    ${
                      property.bedrooms
                        ? `<span>🛏️ ${property.bedrooms}</span>`
                        : ""
                    }
                    ${
                      property.bathrooms
                        ? `<span>🚿 ${property.bathrooms}</span>`
                        : ""
                    }
                    ${property.area ? `<span>📐 ${property.area}m²</span>` : ""}
                  </div>
                  <p style="margin: 0 0 12px 0; color: #666; font-size: 13px; line-height: 1.4;">
                    ${property.description ? property.description.substring(0, 100) : ""}${
                property.description && property.description.length > 100 ? "..." : ""
              }
                  </p>
                  <div style="border-top: 1px solid #e5e7eb; padding-top: 8px;">
                    <p style="margin: 0; font-size: 12px; color: #666;">
                      <strong>${property.owner.name}</strong>
                      ${
                        property.owner.company
                          ? ` - ${property.owner.company}`
                          : ""
                      }
                    </p>
                  </div>
                </div>
              `;

              infoWindow.setContent(content);
              infoWindow.open(map, marker);
            }
          });

          newMarkers.push(marker);
        }
      });

      setMarkers(newMarkers);

      // Optimize bounds fitting - only if we have markers and map is visible
      if (newMarkers.length > 0 && isMapVisible) {
        const bounds = new google.maps.LatLngBounds();
        newMarkers.forEach((marker) => {
          const position = marker.getPosition();
          if (position) bounds.extend(position);
        });
        
        // Use fitBounds with padding to reduce API calls
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });

        // Ensure minimum zoom level with a single listener
        const listener = google.maps.event.addListenerOnce(map, "idle", () => {
          if (map.getZoom() && map.getZoom()! > 15) {
            map.setZoom(15);
          }
        });
      }
    }, 300), // 300ms debounce
    [map, selectedProperty, onMarkerClick, infoWindow, isMapVisible]
  );

  // Initialize Google Maps with optimization
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !googleMapsLoader.isGoogleMapsLoaded()) return;

      try {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 41.9028, lng: 12.4964 }, // Rome center
          zoom: 6,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          // Optimize map options to reduce API calls
          gestureHandling: 'cooperative',
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
        });

        const infoWindowInstance = new google.maps.InfoWindow({
          maxWidth: 300,
        });

        // Register map instance for tracking
        googleMapsLoader.registerMapInstance(mapInstance);

        setMap(mapInstance);
        setInfoWindow(infoWindowInstance);
        setIsMapVisible(true);
        
        // Track map load for usage monitoring
        googleMapsUsageTracker.trackMapLoad();

        // Cleanup on unmount
        return () => {
          googleMapsLoader.unregisterMapInstance(mapInstance);
        };
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
      }
    };

    // Load Google Maps using the singleton loader
    googleMapsLoader
      .load()
      .then(() => {
        initMap();
      })
      .catch((error) => {
        console.error("Failed to load Google Maps:", error);
      });

    // Cleanup on component unmount
    return () => {
      if (map) {
        googleMapsLoader.unregisterMapInstance(map);
      }
    };
  }, []);

  // Update markers when properties change (debounced)
  useEffect(() => {
    updateMarkersDebounced(properties);
  }, [properties, updateMarkersDebounced]);

  // Center map on selected property (optimized)
  useEffect(() => {
    if (
      map &&
      selectedProperty &&
      selectedProperty.latitude &&
      selectedProperty.longitude &&
      isMapVisible
    ) {
      // Use panTo instead of setCenter for smoother animation
      map.panTo({
        lat: selectedProperty.latitude,
        lng: selectedProperty.longitude,
      });
      
      // Only adjust zoom if necessary
      const currentZoom = map.getZoom();
      if (!currentZoom || currentZoom < 14) {
        map.setZoom(14);
      }
    }
  }, [map, selectedProperty, isMapVisible]);

  return (
    <div className="relative h-full">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Loading State */}
      {!map && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10c03e] mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento mappa ottimizzata...</p>
            <p className="text-sm text-gray-500 mt-2">
              Riducendo i costi API con caricamento intelligente
            </p>
          </div>
        </div>
      )}

      {/* Optimized Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-white shadow-md"
          onClick={() => {
            if (map && properties.length > 0) {
              const bounds = new google.maps.LatLngBounds();
              properties.forEach((property) => {
                if (property.latitude && property.longitude) {
                  bounds.extend({
                    lat: property.latitude,
                    lng: property.longitude,
                  });
                }
              });
              map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
            }
          }}
        >
          Mostra Tutte
        </Button>
      </div>

      {/* Property Count and API Usage */}
      <div className="absolute bottom-4 left-4 space-y-2">
        <Card className="shadow-md">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-[#10c03e]" />
              <span className="text-sm font-medium">
                {properties.length} proprietà
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardContent className="p-2">
            <div className="text-xs text-gray-600">
              <div>API Usage: {googleMapsUsageTracker.getTodayUsage()}</div>
              <div>Maps Attive: {googleMapsLoader.getActiveMapCount()}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}