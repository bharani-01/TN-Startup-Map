import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Navigation, 
  Layers, 
  Compass, 
  Building2, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  Maximize2, 
  RotateCcw,
  Sparkles,
  MapPin,
  Briefcase
} from 'lucide-react';
import { Startup, District } from '../../../types';

// Fix leaflet default icon asset paths in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Apple Sector color palette for map pins
const SECTOR_COLORS: Record<string, string> = {
  AI: '#5856D6',
  SaaS: '#0071E3',
  FinTech: '#34C759',
  HealthTech: '#FF2D55',
  EdTech: '#FF9500',
  DeepTech: '#AF52DE',
  IoT: '#06b6d4',
  EV: '#14b8a6',
  Mobility: '#0284c7',
  Agritech: '#30D158',
  ClimateTech: '#34C759',
  Manufacturing: '#f97316',
  SpaceTech: '#BF5AF2',
  Cybersecurity: '#dc2626',
  Robotics: '#ec4899',
  Consumer: '#e11d48',
  Other: '#86868B',
};

// Create custom Apple pin marker (with active selected pulse halo state)
const createCustomIcon = (sector: string, name: string, isSelected: boolean = false) => {
  const color = SECTOR_COLORS[sector] || '#0071E3';
  const initial = name ? name.charAt(0).toUpperCase() : 'S';

  const size = isSelected ? 42 : 34;
  const anchor = isSelected ? 21 : 17;

  const html = `
    <div class="marker-pin-inner ${isSelected ? 'marker-selected' : ''}" style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${size}px;
      height: ${size}px;
      background: ${isSelected ? color : 'white'};
      border: ${isSelected ? '3px solid white' : `2.5px solid ${color}`};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: ${isSelected 
        ? `0 0 0 6px ${color}40, 0 12px 28px rgba(0,0,0,0.35)` 
        : '0 6px 16px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.06)'};
      cursor: pointer;
      transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s ease;
    ">
      ${isSelected ? `
        <div style="
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          background: ${color}35;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          pointer-events: none;
        "></div>
      ` : ''}
      <div style="
        transform: rotate(45deg);
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
        font-weight: 800;
        font-size: ${isSelected ? '15px' : '13px'};
        color: ${isSelected ? 'white' : color};
      ">
        ${initial}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: `custom-startup-marker ${isSelected ? 'custom-startup-marker-selected' : ''}`,
    iconSize: [size, size],
    iconAnchor: [anchor, size],
    popupAnchor: [0, -size],
  });
};

// Subcomponent for individual startup marker with auto-popup on selection
const StartupMarker: React.FC<{
  startup: Startup & { displayLat: number; displayLng: number };
  isSelected: boolean;
  onSelect?: (s: Startup) => void;
}> = ({ startup, isSelected, onSelect }) => {
  const markerRef = useRef<L.Marker | null>(null);
  const icon = createCustomIcon(startup.sectors[0] || 'Other', startup.name, isSelected);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker
      ref={markerRef}
      position={[startup.displayLat, startup.displayLng]}
      icon={icon}
      zIndexOffset={isSelected ? 1000 : 0}
      eventHandlers={{
        click: () => {
          if (onSelect) onSelect(startup);
        },
      }}
    >
      {/* Apple Frosted Popup Card */}
      <Popup className="apple-map-popup">
        <div className="p-4 sm:p-5 w-64 sm:w-72 space-y-3 font-sans">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#1D1D1F] text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-apple-sm">
                {startup.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="font-bold text-sm text-[#1D1D1F] truncate">{startup.name}</h4>
                  {startup.verificationStatus === 'VERIFIED' && (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#34C759] fill-[#34C759]/10 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-[#86868B] font-medium truncate">
                  {startup.city || startup.district}, Tamil Nadu
                </p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/[0.04] text-[#86868B] shrink-0">
              {startup.stage}
            </span>
          </div>

          <p className="text-xs text-[#86868B] line-clamp-2 leading-relaxed">
            {startup.tagline || startup.description}
          </p>

          <div className="flex flex-wrap items-center gap-1">
            {startup.sectors.map((sec) => (
              <span
                key={sec}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0071E3]/10 text-[#0071E3]"
              >
                {sec}
              </span>
            ))}
            {startup.isHiring && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600">
                <Briefcase className="w-2.5 h-2.5" />
                HIRING
              </span>
            )}
          </div>

          <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#1D1D1F]">
              {startup.totalFundingInr || 'Bootstrapped'}
            </span>
            <Link
              to={`/startups/${startup.slug}`}
              className="text-xs font-semibold text-[#0071E3] hover:text-[#0077ED] flex items-center gap-0.5 apple-press"
            >
              <span>Product Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Map controller component for smooth programmatic zoom and pan to selected venture
const MapController: React.FC<{
  center?: [number, number];
  zoom?: number;
  selectedStartup?: Startup | null;
}> = ({ center, zoom, selectedStartup }) => {
  const map = useMap();
  const prevStartupIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (selectedStartup && selectedStartup.id !== prevStartupIdRef.current) {
      prevStartupIdRef.current = selectedStartup.id;
      if (selectedStartup.latitude && selectedStartup.longitude) {
        map.flyTo([selectedStartup.latitude, selectedStartup.longitude], 13, {
          animate: true,
          duration: 0.9,
        });
      }
    } else if (!selectedStartup) {
      prevStartupIdRef.current = null;
    }
  }, [selectedStartup, map]);

  return null;
};

interface StartupMapProps {
  startups: Startup[];
  districts?: District[];
  selectedStartup?: Startup | null;
  selectedDistrict?: string | null;
  onSelectStartup?: (startup: Startup | null) => void;
  onSelectDistrict?: (districtSlug: string | null) => void;
  height?: string;
  showDistrictLayer?: boolean;
}

export const StartupMap: React.FC<StartupMapProps> = ({
  startups = [],
  districts = [],
  selectedStartup,
  selectedDistrict,
  onSelectStartup,
  onSelectDistrict,
  height = '100%',
  showDistrictLayer = true,
}) => {
  const TN_CENTER: [number, number] = [11.1271, 78.6569];
  const DEFAULT_ZOOM = 7;
  const mapRef = useRef<L.Map | null>(null);

  const [mapCenter, setMapCenter] = useState<[number, number]>(TN_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_ZOOM);
  const [districtGeoJson, setDistrictGeoJson] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Load Tamil Nadu District GeoJSON Boundaries
  useEffect(() => {
    if (showDistrictLayer) {
      fetch('/tamilnadu-districts.geojson')
        .then((res) => {
          if (!res.ok) throw new Error('GeoJSON load error');
          return res.json();
        })
        .then((data) => setDistrictGeoJson(data))
        .catch((err) => console.warn('Could not load GeoJSON district boundaries:', err));
    }
  }, [showDistrictLayer]);

  // Jitter overlapping startup coordinates
  const positionedStartups = React.useMemo(() => {
    const coordCounts: Record<string, number> = {};
    return startups
      .filter((s) => s.latitude && s.longitude)
      .map((s) => {
        const key = `${s.latitude.toFixed(3)},${s.longitude.toFixed(3)}`;
        const count = coordCounts[key] || 0;
        coordCounts[key] = count + 1;

        let displayLat = s.latitude;
        let displayLng = s.longitude;

        if (count > 0) {
          const angle = (count * 2 * Math.PI) / 6;
          const radius = 0.005 * Math.ceil(count / 6);
          displayLat += radius * Math.cos(angle);
          displayLng += radius * Math.sin(angle);
        }

        return {
          ...s,
          displayLat,
          displayLng,
        };
      });
  }, [startups]);

  // Direct geolocation trigger
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        if (mapRef.current) {
          mapRef.current.flyTo(coords, 12, { duration: 1.5 });
        }
        setIsLocating(false);
      },
      (err) => {
        console.warn(err);
        setLocationError('Location permission denied or unavailable');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.flyTo(TN_CENTER, DEFAULT_ZOOM, { duration: 1.2 });
    }
    if (onSelectStartup) onSelectStartup(null);
    if (onSelectDistrict) onSelectDistrict(null);
  };

  // Check if district polygon is selected
  const isDistrictActive = (feature: any) => {
    const dName = (feature.properties?.district || feature.properties?.NAME_2 || feature.properties?.name || '').toLowerCase();
    const target = (selectedDistrict || '').toLowerCase();
    if (!target || target === 'all') return false;
    return dName === target || dName.includes(target) || target.includes(dName);
  };

  // District GeoJSON Polygon Styling (with dynamic active highlight)
  const districtStyle = (feature: any) => {
    const isSelected = isDistrictActive(feature);
    const hasAnySelection = Boolean(selectedDistrict && selectedDistrict !== 'all');

    if (isSelected) {
      return {
        fillColor: '#0071E3',
        weight: 3.5,
        opacity: 1,
        color: '#0071E3',
        dashArray: '',
        fillOpacity: 0.24,
        transition: 'all 200ms ease',
      };
    }

    return {
      fillColor: '#0071E3',
      weight: 1.2,
      opacity: hasAnySelection ? 0.3 : 0.8,
      color: '#0071E3',
      dashArray: '2',
      fillOpacity: hasAnySelection ? 0.01 : 0.03,
      transition: 'all 200ms ease',
    };
  };

  const onEachDistrict = (feature: any, layer: L.Layer) => {
    const districtName = feature.properties?.district || feature.properties?.NAME_2 || feature.properties?.name || 'District';
    
    layer.bindTooltip(
      `<div class="font-display font-semibold text-xs text-[#1D1D1F]">${districtName} District</div>`,
      { sticky: true, className: 'district-map-tooltip' }
    );

    layer.on({
      click: (e) => {
        const targetLayer = e.target;
        if (targetLayer && typeof targetLayer.getBounds === 'function') {
          const bounds = targetLayer.getBounds();
          if (bounds && bounds.isValid()) {
            if (mapRef.current) {
              mapRef.current.fitBounds(bounds, {
                padding: [60, 60],
                maxZoom: 12,
                animate: true,
                duration: 1.0,
              });
            }
          }
        }
        if (onSelectDistrict) onSelectDistrict(districtName);
      },
      mouseover: (e) => {
        const l = e.target;
        if (!isDistrictActive(feature)) {
          l.setStyle({
            fillOpacity: 0.16,
            weight: 2.2,
            color: '#0071E3',
          });
        }
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(districtStyle(feature));
      },
    });
  };

  return (
    <div className="relative w-full h-full" style={{ height }}>
      {/* Floating Apple Controls Pill */}
      <div className="absolute top-4 right-4 z-[400] flex items-center gap-2">
        <button
          onClick={handleLocateMe}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full apple-glass-elevated border border-black/[0.08] shadow-apple-card text-xs font-semibold text-[#1D1D1F] hover:bg-white transition-all apple-press"
          title="Locate my position on map"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-[#0071E3]' : 'text-[#0071E3]'}`} />
          <span className="hidden sm:inline">Near Me</span>
        </button>

        <button
          onClick={handleResetView}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full apple-glass-elevated border border-black/[0.08] shadow-apple-card text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] hover:bg-white transition-all apple-press"
          title="Reset map view"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {locationError && (
        <div className="absolute top-16 right-4 z-[400] px-3.5 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs shadow-apple-sm animate-in fade-in">
          {locationError}
        </div>
      )}

      {/* Main Leaflet Map View */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full z-10"
        ref={mapRef}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <MapController center={mapCenter} zoom={mapZoom} selectedStartup={selectedStartup} />

        {/* Clean Apple-style Light CartoDB Voyager / OSM Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* District Boundaries Layer */}
        {showDistrictLayer && districtGeoJson && (
          <GeoJSON
            key={`districts-${selectedDistrict || 'all'}`}
            data={districtGeoJson}
            style={districtStyle}
            onEachFeature={onEachDistrict}
          />
        )}

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              html: `
                <div style="position: relative; width: 22px; height: 22px;">
                  <div style="position: absolute; width: 100%; height: 100%; background: rgba(0, 113, 227, 0.25); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                  <div style="position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; background: #0071E3; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
                </div>
              `,
              className: 'user-loc-marker',
              iconSize: [22, 22],
              iconAnchor: [11, 11],
            })}
          >
            <Popup>
              <div className="p-2 text-xs font-semibold text-[#1D1D1F]">Your Current Location</div>
            </Popup>
          </Marker>
        )}

        {/* Startup Pins */}
        {positionedStartups.map((s) => (
          <StartupMarker
            key={s.id}
            startup={s}
            isSelected={selectedStartup?.id === s.id}
            onSelect={onSelectStartup}
          />
        ))}
      </MapContainer>
    </div>
  );
};
