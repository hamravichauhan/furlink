"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

interface LocationPickerProps {
  value: {
    location: string;
    latitude: number | null;
    longitude: number | null;
  };
  onChange: (value: {
    location: string;
    latitude: number | null;
    longitude: number | null;
  }) => void;
  disabled?: boolean;
}

const DEFAULT_CENTER: [number, number] = [15.4909, 73.8278]; // Panaji fallback
const DEFAULT_ZOOM = 13;

export default function LocationPicker({
  value,
  onChange,
  disabled = false,
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const [mode, setMode] = useState<"text" | "map">("text");
  const [mapReady, setMapReady] = useState(false);

  // Init map once when map mode is first opened
  useEffect(() => {
    if (mode !== "map" || mapInstance.current || !mapRef.current) return;

    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current) return;

      // Fix default marker icon URLs (Leaflet + bundlers issue)
      const iconDefault = L.Icon.Default.prototype as any;
      delete iconDefault._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const center: [number, number] =
        value.latitude !== null && value.longitude !== null
          ? [value.latitude, value.longitude]
          : DEFAULT_CENTER;

      const map = L.map(mapRef.current).setView(center, DEFAULT_ZOOM);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // If we already have coords, drop a marker
      if (value.latitude !== null && value.longitude !== null) {
        markerRef.current = L.marker([value.latitude, value.longitude]).addTo(
          map,
        );
      }

      map.on("click", async (e: any) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        }

        // Try reverse geocode via Nominatim (OSM)
        let address = value.location;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
              headers: {
                "Accept-Language": "en",
              },
            },
          );
          if (res.ok) {
            const data = await res.json();
            if (data.display_name) {
              address = data.display_name;
            }
          }
        } catch {
          // fall through — keep existing text
        }

        onChange({
          location: address,
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
        });
      });

      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Sync marker when coords change externally
  useEffect(() => {
    if (!mapInstance.current) return;
    (async () => {
      const L = (await import("leaflet")).default;
      if (value.latitude !== null && value.longitude !== null) {
        const pos: [number, number] = [value.latitude, value.longitude];
        if (markerRef.current) {
          markerRef.current.setLatLng(pos);
        } else {
          markerRef.current = L.marker(pos).addTo(mapInstance.current!);
        }
        mapInstance.current!.setView(pos, mapInstance.current!.getZoom());
      }
    })();
  }, [value.latitude, value.longitude]);

  const clearCoords = () => {
    if (markerRef.current && mapInstance.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    onChange({
      location: value.location,
      latitude: null,
      longitude: null,
    });
  };

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMode("text")}
          disabled={disabled}
          className={`px-3 py-1.5 rounded border transition ${
            mode === "text"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Type address
        </button>
        <button
          type="button"
          onClick={() => setMode("map")}
          disabled={disabled}
          className={`px-3 py-1.5 rounded border transition ${
            mode === "map"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Pick on map
        </button>
      </div>

      {/* Address text (always visible) */}
      <textarea
        value={value.location}
        onChange={(e) =>
          onChange({
            location: e.target.value,
            latitude: value.latitude,
            longitude: value.longitude,
          })
        }
        rows={2}
        required
        maxLength={200}
        disabled={disabled}
        placeholder="e.g., Behind Panaji fish market, near alley entrance"
        className="w-full border rounded-md p-2 text-sm disabled:bg-gray-100"
      />

      {/* Map */}
      {mode === "map" && (
        <div>
          <div
            ref={mapRef}
            className="w-full h-64 rounded-md border overflow-hidden"
            style={{ minHeight: 256 }}
          />
          {!mapReady && (
            <p className="text-xs text-gray-500 mt-1">Loading map…</p>
          )}
          {value.latitude !== null && value.longitude !== null ? (
            <div className="mt-2 flex items-center justify-between text-xs font-mono">
              <span className="text-gray-600">
                GPS: {value.latitude.toFixed(4)}°N, {value.longitude.toFixed(4)}°E
              </span>
              <button
                type="button"
                onClick={clearCoords}
                disabled={disabled}
                className="text-red-600 hover:underline"
              >
                Clear pin
              </button>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-2">
              Tap the map to drop a pin. The address above will be filled
              automatically.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
