import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Navigation, 
  Loader2, 
  Crosshair
} from 'lucide-react';

// Fix leaflet default icon asset paths in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Minimal Apple Pin with clean drop shadow & active state
const createPinIcon = () => {
  const html = `
    <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full cursor-grab active:cursor-grabbing">
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: #0071E3;
        color: #ffffff;
        border: 2.5px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 8px 20px rgba(0, 113, 227, 0.4), 0 2px 6px rgba(0,0,0,0.12);
        transition: transform 0.15s ease;
      ">
        <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
          </svg>
        </div>
      </div>
      <div style="
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 10px;
        height: 4px;
        background: rgba(0,0,0,0.25);
        border-radius: 50%;
        filter: blur(1px);
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'apple-map-pin',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

interface MapLocationPickerProps {
  latitude: number;
  longitude: number;
  districtName?: string;
  cityName?: string;
  onLocationChange: (lat: number, lng: number, placeName?: string) => void;
  height?: string;
  readOnly?: boolean;
}

const MapEventsHandler: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapPanController: React.FC<{
  center: [number, number];
  zoom?: number;
}> = ({ center, zoom = 14 }) => {
  const map = useMap();
  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, zoom, {
        duration: 1.0,
        easeLinearity: 0.25,
      });
    }
  }, [center[0], center[1], zoom, map]);

  return null;
};

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  latitude,
  longitude,
  districtName,
  cityName,
  onLocationChange,
  height = '300px',
  readOnly = false,
}) => {
  const [currentLat, setCurrentLat] = useState<number>(latitude || 13.0827);
  const [currentLng, setCurrentLng] = useState<number>(longitude || 80.2707);
  const [mapCenter, setMapCenter] = useState<[number, number]>([latitude || 13.0827, longitude || 80.2707]);
  const [mapZoom, setMapZoom] = useState<number>(14);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const markerRef = useRef<any>(null);

  // Sync external coordinates & fly directly to building pin
  useEffect(() => {
    if (latitude && longitude && (latitude !== currentLat || longitude !== currentLng)) {
      setCurrentLat(latitude);
      setCurrentLng(longitude);
      setMapCenter([latitude, longitude]);
      setMapZoom(16);
    }
  }, [latitude, longitude]);

  const handleMarkerDragEnd = (e: any) => {
    if (readOnly) return;
    const marker = e.target;
    if (marker) {
      const position = marker.getLatLng();
      const newLat = Number(position.lat.toFixed(6));
      const newLng = Number(position.lng.toFixed(6));
      setCurrentLat(newLat);
      setCurrentLng(newLng);
      onLocationChange(newLat, newLng);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (readOnly) return;
    const newLat = Number(lat.toFixed(6));
    const newLng = Number(lng.toFixed(6));
    setCurrentLat(newLat);
    setCurrentLng(newLng);
    setMapCenter([newLat, newLng]);
    onLocationChange(newLat, newLng);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = Number(pos.coords.latitude.toFixed(6));
        const newLng = Number(pos.coords.longitude.toFixed(6));
        setCurrentLat(newLat);
        setCurrentLng(newLng);
        setMapCenter([newLat, newLng]);
        setMapZoom(16);
        onLocationChange(newLat, newLng);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-black/[0.08] shadow-apple-card bg-slate-50">
      {/* Top Floating Controls: GPS button */}
      {!readOnly && (
        <div className="absolute top-3 right-3 z-[400] flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-xl hover:bg-white border border-black/[0.1] text-[#0071E3] text-xs font-semibold shadow-apple-sm transition-all apple-press disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            title="Use My Device GPS Location"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Crosshair className="w-3.5 h-3.5" />
            )}
            <span>GPS Locate</span>
          </button>
        </div>
      )}

      {/* Map Surface */}
      <div style={{ height }} className="w-full">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />

          <MapPanController center={mapCenter} zoom={mapZoom} />
          {!readOnly && <MapEventsHandler onLocationSelect={handleMapClick} />}

          <Marker
            position={[currentLat, currentLng]}
            icon={createPinIcon()}
            draggable={!readOnly}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            }}
            ref={markerRef}
          />
        </MapContainer>
      </div>

      {/* Bottom Floating Bar: Coordinates & Tap Instruction */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] flex items-center justify-between pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-xl border border-black/[0.08] text-[11px] font-medium text-[#1D1D1F] shadow-apple-sm flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-[#0071E3]" />
          <span>{readOnly ? 'Mapped Location' : 'Tap or drag pin to adjust'}</span>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-[#1D1D1F]/90 backdrop-blur-xl text-white text-[11px] font-mono shadow-apple-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
          <span>{currentLat.toFixed(4)}°, {currentLng.toFixed(4)}°</span>
        </div>
      </div>
    </div>
  );
};
