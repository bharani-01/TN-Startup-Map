import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, MapPin, Building2, Briefcase, Award, Loader2, ArrowRight } from 'lucide-react';
import { Startup } from '../../../types';
import { StartupCard } from './StartupCard';

export const NearMeSection: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [nearbyStartups, setNearbyStartups] = useState<Array<Startup & { distanceKm: number }>>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);

  const fetchNearby = (lat: number, lng: number, rad: number) => {
    setLoading(true);
    setError(null);
    fetch(`/api/startups/nearby?lat=${lat}&lng=${lng}&radius=${rad}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNearbyStartups(data.data);
        } else {
          setError(data.message || 'Failed to fetch nearby startups');
        }
      })
      .catch((err) => {
        setError('Network error while querying nearby startups');
      })
      .finally(() => setLoading(false));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        fetchNearby(coords.lat, coords.lng, radius);
      },
      (err) => {
        console.warn(err);
        setError('Please allow location permissions in your browser to find startups near you.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (userLocation) {
      fetchNearby(userLocation.lat, userLocation.lng, newRadius);
    }
  };

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
      <div className="apple-glass-card rounded-3xl border border-white/80 shadow-apple-card p-6 sm:p-12 relative overflow-hidden">
        
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-apple-blue/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-apple-blue/10 text-apple-blue text-xs sm:text-sm font-semibold mb-2">
                <Navigation className="w-4 h-4" />
                <span>Hyperlocal Discovery</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-apple-text tracking-tight">
                Startups Near You
              </h2>
              <p className="text-apple-secondary text-sm sm:text-base mt-1 max-w-2xl">
                Find ventures, innovation hubs, and hiring teams located within your immediate radius across Tamil Nadu.
              </p>
            </div>

            {/* GPS Trigger / Segmented Radius Pill */}
            <div className="flex flex-wrap items-center gap-3">
              {userLocation ? (
                <div className="flex items-center gap-2.5 bg-white/90 px-4 py-2 rounded-full border border-black/[0.08] shadow-apple-sm text-xs sm:text-sm">
                  <span className="text-apple-secondary font-medium">Radius:</span>
                  {[15, 30, 60, 100].map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRadiusChange(r)}
                      className={`px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold transition-all apple-press ${
                        radius === r ? 'bg-apple-blue text-white shadow-apple-sm' : 'text-apple-text hover:bg-black/[0.04]'
                      }`}
                    >
                      {r}km
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={handleGetLocation}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-apple-blue hover:bg-apple-blueHover text-white font-semibold text-xs sm:text-sm transition-all shadow-apple-sm apple-press"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  <span>Allow Location & Find Startups</span>
                </button>
              )}
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={handleGetLocation}
                className="underline font-semibold ml-2 text-rose-800 hover:text-rose-950"
              >
                Retry
              </button>
            </div>
          )}

          {/* Results Grid */}
          {userLocation && (
            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between text-xs sm:text-sm text-apple-secondary">
                <span className="font-bold text-apple-blue flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-apple-blue" />
                  Found {nearbyStartups.length} startups within {radius}km of your coordinates
                </span>
                <Link
                  to="/map"
                  className="text-apple-blue hover:text-apple-blueHover font-semibold flex items-center gap-1 apple-press"
                >
                  <span>Explore on Full Spatial Map</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {nearbyStartups.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-black/[0.06] text-sm text-apple-secondary">
                  No startups discovered within {radius}km. Try expanding your search radius to 60km or 100km!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {nearbyStartups.slice(0, 4).map((startup) => (
                    <StartupCard key={startup.id} startup={startup} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
