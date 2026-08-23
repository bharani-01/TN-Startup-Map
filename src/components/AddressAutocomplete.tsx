import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X, Building2, Sparkles } from 'lucide-react';
import { searchFreeAddressSuggestions, GeoSuggestion } from '../utils/freeGeocoding';

export type AddressSuggestion = GeoSuggestion;

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelectSuggestion: (suggestion: AddressSuggestion) => void;
  placeholder?: string;
  districtContext?: string;
  className?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onSelectSuggestion,
  placeholder = 'e.g. IIT Madras Research Park, Kanagam Road',
  districtContext = 'Tamil Nadu',
  className = '',
}) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Multi-Provider Free Query (Photon + Nominatim + Open-Meteo + Local)
  const fetchSuggestions = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const results = await searchFreeAddressSuggestions(query, districtContext);
      setSuggestions(results);
      setIsOpen(results.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    onChange(text);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (text.trim().length >= 2) {
      setLoading(true);
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(text);
      }, 200);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setLoading(false);
    }
  };

  const handleSelect = (item: AddressSuggestion) => {
    const formattedAddress = item.road ? `${item.name}, ${item.road}` : item.name;
    onChange(formattedAddress);
    onSelectSuggestion(item);
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 rounded-xl border border-black/[0.08] bg-black/[0.02] focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 text-xs outline-none transition-all pr-8 ${className}`}
        />

        <div className="absolute right-2.5 top-3 flex items-center gap-1">
          {loading && <Loader2 className="w-3.5 h-3.5 text-[#0071E3] animate-spin" />}
          {value && !loading && (
            <button
              type="button"
              onClick={() => { onChange(''); setSuggestions([]); setIsOpen(false); }}
              className="text-[#86868B] hover:text-[#1D1D1F] p-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Free Multi-Provider Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-[2500] p-1.5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-black/[0.1] shadow-apple-card space-y-0.5 animate-in fade-in">
          {suggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#0071E3]/10 hover:text-[#0071E3] transition-colors text-xs flex items-start gap-2.5 text-[#1D1D1F] cursor-pointer group"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div className="truncate flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-[#1D1D1F] truncate group-hover:text-[#0071E3]">
                    {item.name}
                  </span>
                  {item.city && (
                    <span className="text-[10px] text-[#86868B] bg-black/[0.04] px-1.5 py-0.2 rounded font-normal shrink-0">
                      {item.city}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#86868B] block truncate mt-0.5">
                  {item.displayName}
                </span>
              </div>
              {item.pincode && (
                <span className="text-[10px] font-mono text-[#86868B] bg-black/[0.03] px-1.5 py-0.5 rounded shrink-0 self-center">
                  {item.pincode}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
