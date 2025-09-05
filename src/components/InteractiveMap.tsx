"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";

interface InteractiveMapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  className?: string;
}

// Dynamic imports to prevent SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

// Custom Marker Component
const CustomMarker = ({ position, icon, children }: { position: [number, number], icon: L.DivIcon, children: React.ReactNode }) => {
  const [MarkerComponent, setMarkerComponent] = useState<any>(null);

  useEffect(() => {
    import("react-leaflet").then((mod) => {
      setMarkerComponent(() => mod.Marker);
    });
  }, []);

  if (!MarkerComponent) return null;

  return <MarkerComponent position={position} icon={icon}>{children}</MarkerComponent>;
};

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const InteractiveMap = ({ center, zoom, className = "w-full h-96" }: InteractiveMapProps) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Create custom marker icon
  const createCustomIcon = () => {
    return L.divIcon({
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background: #f97316;
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  };

  if (!isClient) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری نقشه...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Map Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">دفتر کیمیاگر فارما</h3>
              <p className="text-orange-100 text-sm">هرات، جاده عیدگاه</p>
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="h-96">
          <MapContainer
            center={[center.lat, center.lng]}
            zoom={zoom}
            className="h-full w-full"
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            dragging={true}
            touchZoom={true}
            boxZoom={true}
            keyboard={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CustomMarker position={[center.lat, center.lng]} icon={createCustomIcon()}>
              <Popup>
                <div className="text-right p-2">
                  <h3 className="font-bold text-orange-600 mb-2 text-center">دفتر کیمیاگر فارما</h3>
                  <p className="text-gray-700 mb-2">هرات، جاده عیدگاه</p>
                  <p className="text-sm text-gray-500 mb-3">
                    📍 مختصات: {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
                  </p>
                  <div className="space-y-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm text-center transition-colors duration-200"
                    >
                      مسیریابی در گوگل مپس
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm text-center transition-colors duration-200"
                    >
                      مشاهده در نقشه
                    </a>
                  </div>
                </div>
              </Popup>
            </CustomMarker>
          </MapContainer>
        </div>

        {/* Map Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>مختصات: {center.lat.toFixed(6)}, {center.lng.toFixed(6)}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>OpenStreetMap</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
