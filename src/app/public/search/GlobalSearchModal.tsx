import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Building2, 
  MapPin, 
  Layers, 
  User, 
  X, 
  ArrowRight, 
  Loader2,
  Sparkles,
  Compass
} from 'lucide-react';
import { SearchResultItem } from '../../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    startups: SearchResultItem[];
    districts: SearchResultItem[];
    sectors: SearchResultItem[];
    founders: SearchResultItem[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setQuery('');
      setResults(null);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success && data.data) {
          setResults(data.data.results || data.data);
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Flattened items for keyboard navigation
  const flatItems: SearchResultItem[] = React.useMemo(() => {
    if (!results) return [];
    return [
      ...(results.startups || []),
      ...(results.districts || []),
      ...(results.sectors || []),
      ...(results.founders || []),
    ];
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (flatItems.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % flatItems.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (flatItems.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatItems[selectedIndex]) {
        handleSelect(flatItems[selectedIndex]);
      }
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    navigate(item.url);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-apple-modal border border-white/80 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Apple Spotlight Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-black/[0.06] bg-transparent">
          <Search className="w-5 h-5 text-[#86868B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search startups, districts, sectors, founders (e.g. 'AgniKul', 'Chennai SaaS', 'EV')..."
            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm sm:text-base text-[#1D1D1F] placeholder:text-[#86868B] p-0 font-normal"
          />
          {loading ? (
            <Loader2 className="w-4 h-4 text-[#0071E3] animate-spin shrink-0" />
          ) : query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#86868B] hover:text-[#1D1D1F] rounded-full hover:bg-black/[0.05] apple-press"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-[#86868B] bg-black/[0.04] rounded-md border border-black/[0.06] shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-black/[0.04]">
          {query.trim() === '' ? (
            // Default Suggestions
            <div className="p-4 text-xs text-[#86868B] space-y-3">
              <p className="font-semibold text-apple-secondary uppercase tracking-wider text-[10px]">
                Quick Ecosystem Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Chennai AI', 'Hosur EV', 'Coimbatore Robotics', 'Tenkasi SaaS', 'Agritech', 'IIT Madras'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 rounded-full bg-black/[0.03] hover:bg-[#0071E3]/10 hover:text-[#0071E3] text-[#1D1D1F] transition-all text-xs font-semibold apple-press"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : flatItems.length === 0 && !loading ? (
            <div className="p-10 text-center text-xs sm:text-sm text-[#86868B]">
              No matching startups, districts, or founders found for "{query}".
            </div>
          ) : (
            <div className="space-y-4 p-2">
              {/* Startups section */}
              {results?.startups && results.startups.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-[#86868B] uppercase flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>Startups ({results.startups.length})</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {results.startups.map((item) => {
                      const itemIndex = flatItems.findIndex((fi) => fi.id === item.id);
                      const isSelected = itemIndex === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs cursor-pointer transition-all apple-press-subtle ${
                            isSelected ? 'bg-[#0071E3]/10 text-[#1D1D1F] shadow-2xs' : 'text-[#1D1D1F] hover:bg-black/[0.03]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-[#1D1D1F] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                              {item.title.charAt(0)}
                            </div>
                            <div className="truncate">
                              <p className="font-bold text-[#1D1D1F] truncate">{item.title}</p>
                              <p className="text-[11px] text-[#86868B] truncate">{item.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {item.badge && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/[0.04] text-[#86868B]">
                                {item.badge}
                              </span>
                            )}
                            <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#0071E3]' : 'text-apple-tertiary'}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Districts section */}
              {results?.districts && results.districts.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-[#86868B] uppercase flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#34C759]" />
                    <span>Districts ({results.districts.length})</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {results.districts.map((item) => {
                      const itemIndex = flatItems.findIndex((fi) => fi.id === item.id);
                      const isSelected = itemIndex === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs cursor-pointer transition-all apple-press-subtle ${
                            isSelected ? 'bg-[#34C759]/10 text-[#1D1D1F] shadow-2xs' : 'text-[#1D1D1F] hover:bg-black/[0.03]'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-[#1D1D1F]">{item.title} District</p>
                            <p className="text-[11px] text-[#86868B]">{item.subtitle}</p>
                          </div>
                          <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#34C759]' : 'text-apple-tertiary'}`} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sectors section */}
              {results?.sectors && results.sectors.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-[#86868B] uppercase flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#5856D6]" />
                    <span>Sectors</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {results.sectors.map((item) => {
                      const itemIndex = flatItems.findIndex((fi) => fi.id === item.id);
                      const isSelected = itemIndex === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs cursor-pointer transition-all apple-press-subtle ${
                            isSelected ? 'bg-[#5856D6]/10 text-[#1D1D1F] shadow-2xs' : 'text-[#1D1D1F] hover:bg-black/[0.03]'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-[#1D1D1F]">{item.title} Sector</p>
                            <p className="text-[11px] text-[#86868B]">{item.subtitle}</p>
                          </div>
                          <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#5856D6]' : 'text-apple-tertiary'}`} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Founders section */}
              {results?.founders && results.founders.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-[#86868B] uppercase flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#AF52DE]" />
                    <span>Founders</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {results.founders.map((item) => {
                      const itemIndex = flatItems.findIndex((fi) => fi.id === item.id);
                      const isSelected = itemIndex === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs cursor-pointer transition-all apple-press-subtle ${
                            isSelected ? 'bg-[#AF52DE]/10 text-[#1D1D1F] shadow-2xs' : 'text-[#1D1D1F] hover:bg-black/[0.03]'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-[#1D1D1F]">{item.title}</p>
                            <p className="text-[11px] text-[#86868B]">{item.subtitle}</p>
                          </div>
                          <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#AF52DE]' : 'text-apple-tertiary'}`} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Info */}
        <div className="px-5 py-3 bg-black/[0.02] border-t border-black/[0.05] flex items-center justify-between text-[11px] text-[#86868B]">
          <span>Navigate with <kbd className="font-mono bg-white px-1.5 py-0.5 border border-black/[0.08] rounded shadow-2xs">↑</kbd> <kbd className="font-mono bg-white px-1.5 py-0.5 border border-black/[0.08] rounded shadow-2xs">↓</kbd></span>
          <span>Select with <kbd className="font-mono bg-white px-1.5 py-0.5 border border-black/[0.08] rounded shadow-2xs">↵</kbd></span>
        </div>
      </div>
    </div>
  );
};
