import React, { useState } from 'react';
import { CITIES_LIST, CityData } from '../../data/bmsData';
import { detectUserLiveLocation } from '../../utils/locationService';
import { Search, MapPin, Check, Navigation, X, Globe, Building2, Compass, Plus, Sparkles } from 'lucide-react';

interface BMSCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: CityData;
  onSelectCity: (city: CityData) => void;
}

type RegionFilter = 'ALL' | 'India' | 'North America' | 'Europe & UK' | 'Asia-Pacific' | 'Middle East' | 'Latin America & Africa';

export function BMSCityModal({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity
}: BMSCityModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>('ALL');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [detectionMessage, setDetectionMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter cities by Region & Search query
  const filteredCities = CITIES_LIST.filter((c) => {
    const matchesRegion = selectedRegion === 'ALL' || c.region === selectedRegion;
    const query = searchTerm.toLowerCase().trim();
    if (!query) return matchesRegion;

    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.state.toLowerCase().includes(query) ||
      c.country.toLowerCase().includes(query) ||
      c.region.toLowerCase().includes(query);

    return matchesRegion && matchesSearch;
  });

  const popularCities = CITIES_LIST.filter((c) => c.isPopular);

  const regionTabs: { label: string; value: RegionFilter; count: number }[] = [
    { label: 'All World', value: 'ALL', count: CITIES_LIST.length },
    { label: 'India', value: 'India', count: CITIES_LIST.filter(c => c.region === 'India').length },
    { label: 'North America', value: 'North America', count: CITIES_LIST.filter(c => c.region === 'North America').length },
    { label: 'Europe & UK', value: 'Europe & UK', count: CITIES_LIST.filter(c => c.region === 'Europe & UK').length },
    { label: 'Asia-Pacific', value: 'Asia-Pacific', count: CITIES_LIST.filter(c => c.region === 'Asia-Pacific').length },
    { label: 'Middle East', value: 'Middle East', count: CITIES_LIST.filter(c => c.region === 'Middle East').length },
    { label: 'Latin America & Africa', value: 'Latin America & Africa', count: CITIES_LIST.filter(c => c.region === 'Latin America & Africa').length }
  ];

  const handleAutoDetect = async () => {
    setDetectingLocation(true);
    setDetectionMessage('Pinpointing live GPS coordinates...');

    try {
      const result = await detectUserLiveLocation();
      setDetectionMessage(result.message);
      
      setTimeout(() => {
        onSelectCity(result.city);
        setDetectingLocation(false);
        setDetectionMessage(null);
        onClose();
      }, 1000);
    } catch {
      setDetectionMessage('Falling back to Mumbai cinema hub...');
      setTimeout(() => {
        onSelectCity(CITIES_LIST[0]);
        setDetectingLocation(false);
        setDetectionMessage(null);
        onClose();
      }, 800);
    }
  };

  const handleSelectCustomCity = (name: string) => {
    const customCity: CityData = {
      id: `city-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: name.trim(),
      state: 'International',
      country: 'Global',
      region: 'North America',
      isPopular: false,
      currency: 'USD',
      currencySymbol: '$',
      flagEmoji: '🌐'
    };
    onSelectCity(customCity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111726] border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#0E1422]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-indigo-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">Select City & Location</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 uppercase tracking-wide">
                  Global Network
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Over 120+ worldwide cinema hubs & entertainment destinations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Location Detection */}
        <div className="p-4 sm:p-5 border-b border-slate-800 space-y-3 shrink-0 bg-[#0B0F19]">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search any city, state, or country worldwide (e.g., Tokyo, London, Mumbai, New York)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-[#141B2D] border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={handleAutoDetect}
              disabled={detectingLocation}
              className="py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
            >
              <Navigation className={`w-3.5 h-3.5 ${detectingLocation ? 'animate-spin text-rose-400' : 'text-rose-400'}`} />
              <span>{detectingLocation ? (detectionMessage || 'Detecting Location...') : 'Auto-Detect My Location'}</span>
            </button>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1">
            {regionTabs.map((tab) => {
              const isActive = selectedRegion === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setSelectedRegion(tab.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-900 text-slate-400'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Popular Worldwide Metros Strip (shown when no search query) */}
          {!searchTerm && selectedRegion === 'ALL' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Compass className="w-3.5 h-3.5 text-rose-400" />
                <span>Popular Worldwide Entertainment Metros</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {popularCities.slice(0, 12).map((city) => {
                  const isSelected = selectedCity.id === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => {
                        onSelectCity(city);
                        onClose();
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 relative group ${
                        isSelected
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-500/10 font-bold ring-1 ring-rose-500'
                          : 'bg-[#141B2D] border-slate-800 hover:border-slate-600 text-slate-200 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <span className="text-xl">{city.flagEmoji || '📍'}</span>
                      <span className="text-xs font-bold leading-tight line-clamp-1">{city.name}</span>
                      <span className="text-[10px] text-slate-400 line-clamp-1">{city.country}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filtered Cities List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {searchTerm
                    ? `Matching Locations (${filteredCities.length})`
                    : selectedRegion === 'ALL'
                    ? `All Global Locations (${filteredCities.length})`
                    : `${selectedRegion} Destinations (${filteredCities.length})`}
                </span>
              </span>
            </div>

            {filteredCities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {filteredCities.map((city) => {
                  const isSelected = selectedCity.id === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => {
                        onSelectCity(city);
                        onClose();
                      }}
                      className={`p-3 rounded-xl text-left text-xs transition-all cursor-pointer flex items-center justify-between border ${
                        isSelected
                          ? 'bg-rose-500/20 text-rose-300 font-bold border-rose-500/50 shadow-sm'
                          : 'bg-[#141B2D]/70 hover:bg-[#182238] border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                        <span className="text-base shrink-0">{city.flagEmoji || '📍'}</span>
                        <div className="min-w-0">
                          <span className="font-semibold text-white block truncate">{city.name}</span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {city.state}, {city.country}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center text-white shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded shrink-0">
                          {city.currencySymbol}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Custom City Fallback */
              <div className="text-center py-8 bg-[#141B2D]/50 border border-dashed border-slate-800 rounded-2xl p-6 space-y-3">
                <MapPin className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-semibold text-white">No listed cinema hub found for "{searchTerm}"</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  You can still select "{searchTerm}" as your custom city to browse showtimes and events!
                </p>
                <button
                  onClick={() => handleSelectCustomCity(searchTerm)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 mx-auto cursor-pointer shadow-lg shadow-rose-600/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Set Location to "{searchTerm}"</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with Global Guarantee */}
        <div className="p-3.5 sm:p-4 bg-[#0B0F19] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 shrink-0 gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Currently showing cinema venues in <strong>{selectedCity.name}, {selectedCity.country} ({selectedCity.flagEmoji || '📍'})</strong></span>
          </div>
          <span>Currency: <strong>{selectedCity.currency} ({selectedCity.currencySymbol})</strong></span>
        </div>
      </div>
    </div>
  );
}
