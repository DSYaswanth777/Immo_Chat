"use client";

import { useEffect, useRef, useState } from "react";
import { googleMapsLoader } from "@/lib/google-maps-loader";
import { googleMapsUsageTracker } from "@/lib/google-maps-usage-tracker";

interface LocationPickerMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  onClick?: (lat: number, lng: number) => void;
  markers?: { lat: number; lng: number; address?: string }[];
  className?: string;
}

export function LocationPickerMap({
  center = { lat: 45.4642, lng: 9.1900 }, // Milan center
  zoom = 12,
  onClick,
  markers = [],
  className = "w-full h-full",
}: LocationPickerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !googleMapsLoader.isGoogleMapsLoaded()) return;

      try {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        // Add click listener for location selection
        if (onClick) {
          mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();
              onClick(lat, lng);
              googleMapsUsageTracker.trackMarkerClick();
            }
          });
        }

        setMap(mapInstance);
        googleMapsUsageTracker.trackMapLoad();
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
  }, [center, zoom, onClick]);

  // Update markers when markers prop changes
  useEffect(() => {
    if (!map || !google?.maps) return;

    // Clear existing markers
    mapMarkers.forEach((marker) => marker.setMap(null));

    const newMarkers: google.maps.Marker[] = [];

    markers.forEach((markerData) => {
      const marker = new google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: map,
        title: markerData.address || `${markerData.lat.toFixed(6)}, ${markerData.lng.toFixed(6)}`,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#10c03e" stroke="white" stroke-width="3"/>
                <circle cx="16" cy="16" r="6" fill="white"/>
              </svg>
            `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16),
        },
      });

      newMarkers.push(marker);
    });

    setMapMarkers(newMarkers);

    // Center map on the first marker if available
    if (newMarkers.length > 0 && markers.length === 1) {
      map.setCenter({ lat: markers[0].lat, lng: markers[0].lng });
      if (map.getZoom()! < 15) {
        map.setZoom(15);
      }
    }
  }, [map, markers]);

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* Loading State */}
      {!map && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10c03e] mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Caricamento mappa...</p>
          </div>
        </div>
      )}

      {/* Instructions overlay */}
      {map && markers.length === 0 && (
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
            <p className="text-sm text-gray-700 text-center">
              📍 Clicca sulla mappa per selezionare una posizione
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
