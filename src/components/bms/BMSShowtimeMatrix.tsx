import React, { useState } from 'react';
import { BMSMovie, BMS_FALLBACK_POSTER, CinemaVenue, CinemaShowtime, CityData, getCinemaVenuesForCity } from '../../data/bmsData';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Smartphone,
  UtensilsCrossed,
  Armchair,
  Accessibility,
  ChevronLeft,
  Info,
  Filter,
  Globe
} from 'lucide-react';

interface BMSShowtimeMatrixProps {
  movie: BMSMovie;
  selectedCity: CityData;
  onBackToMovies: () => void;
  onSelectShowtime: (venue: CinemaVenue, showtime: CinemaShowtime, selectedDate: string) => void;
}

export function BMSShowtimeMatrix({
  movie,
  selectedCity,
  onBackToMovies,
  onSelectShowtime
}: BMSShowtimeMatrixProps) {
  // Generate next 6 dates
  const dates = [
    { label: 'TODAY', day: '31', month: 'AUG', fullDate: 'Sun, 31 Aug 2026' },
    { label: 'TOMORROW', day: '01', month: 'SEP', fullDate: 'Mon, 01 Sep 2026' },
    { label: 'TUE', day: '02', month: 'SEP', fullDate: 'Tue, 02 Sep 2026' },
    { label: 'WED', day: '03', month: 'SEP', fullDate: 'Wed, 03 Sep 2026' },
    { label: 'THU', day: '04', month: 'SEP', fullDate: 'Thu, 04 Sep 2026' },
    { label: 'FRI', day: '05', month: 'SEP', fullDate: 'Fri, 05 Sep 2026' }
  ];

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'ALL' | 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT'>('ALL');

  const selectedDate = dates[selectedDateIndex];
  const venues = getCinemaVenuesForCity(selectedCity);

  // Helper to check time category
  const matchesTimeFilter = (timeStr: string) => {
    if (selectedTimeFilter === 'ALL') return true;
    const hour = parseInt(timeStr.split(':')[0], 10);
    const isPM = timeStr.includes('PM');
    const adjustedHour = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);

    if (selectedTimeFilter === 'MORNING') return adjustedHour >= 6 && adjustedHour < 12;
    if (selectedTimeFilter === 'AFTERNOON') return adjustedHour >= 12 && adjustedHour < 16;
    if (selectedTimeFilter === 'EVENING') return adjustedHour >= 16 && adjustedHour < 20;
    if (selectedTimeFilter === 'NIGHT') return adjustedHour >= 20 || adjustedHour < 6;
    return true;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Movie & Location Context Header Bar */}
      <div className="bg-[#111726]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToMovies}
              className="p-2.5 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Back to All Movies"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="w-14 h-20 rounded-xl overflow-hidden shadow-lg border border-slate-700 shrink-0 bg-slate-900 hidden sm:block">
              <img
                src={movie.posterUrl || BMS_FALLBACK_POSTER}
                alt={movie.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = BMS_FALLBACK_POSTER;
                }}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{movie.title}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  {movie.certificate}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {movie.languages.join(', ')} • {movie.genres.join(', ')} • {Math.floor(movie.durationMinutes / 60)}h {movie.durationMinutes % 60}m
              </p>
              <div className="flex items-center space-x-2 text-xs text-slate-300 pt-0.5">
                <span className="text-sm">{selectedCity.flagEmoji || '📍'}</span>
                <span>Cinema screens in <strong>{selectedCity.name}, {selectedCity.country}</strong></span>
              </div>
            </div>
          </div>

          {/* Formats Pills */}
          <div className="flex flex-wrap gap-1.5 self-start sm:self-center">
            {movie.formats.map((fmt) => (
              <span key={fmt} className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold font-mono">
                {fmt}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Date Ribbon & Filter Bar */}
      <div className="bg-[#111726]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl space-y-4">
        
        {/* Date Selector Row */}
        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar pb-2">
          {dates.map((d, idx) => {
            const isSelected = selectedDateIndex === idx;
            return (
              <button
                key={d.fullDate}
                onClick={() => setSelectedDateIndex(idx)}
                className={`flex flex-col items-center justify-center p-3 px-5 rounded-xl border transition-all cursor-pointer shrink-0 min-w-[80px] ${
                  isSelected
                    ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30 font-bold scale-[1.03]'
                    : 'bg-[#182234] border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">{d.label}</span>
                <span className="text-lg font-black leading-tight my-0.5">{d.day}</span>
                <span className="text-[10px] uppercase font-mono">{d.month}</span>
              </button>
            );
          })}
        </div>

        {/* Time of Day Filters & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          
          {/* Time Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Time:</span>
            {[
              { id: 'ALL', label: 'All Times' },
              { id: 'MORNING', label: 'Morning (12am-12pm)' },
              { id: 'AFTERNOON', label: 'Afternoon (12pm-4pm)' },
              { id: 'EVENING', label: 'Evening (4pm-8pm)' },
              { id: 'NIGHT', label: 'Night (8pm-12am)' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTimeFilter(t.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTimeFilter === t.id
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-[#0B0F19] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Legend Strip */}
          <div className="flex items-center space-x-3 text-[11px] text-slate-400 shrink-0">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Available</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Fast Filling</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Almost Full</span>
            </span>
          </div>

        </div>

      </div>

      {/* Cinema Venues & Showtimes List */}
      <div className="space-y-4">
        {venues.map((venue) => {
          const visibleShowtimes = venue.showtimes.filter((st) => matchesTimeFilter(st.time));

          if (visibleShowtimes.length === 0) return null;

          return (
            <div
              key={venue.id}
              className="bg-[#111726] border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700/80 transition-all space-y-4"
            >
              {/* Venue Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white tracking-tight">{venue.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {venue.distance}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{venue.location}</span>
                  </p>
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  {venue.amenities.map((am) => (
                    <span key={am} className="px-2.5 py-0.5 rounded-md bg-[#0B0F19] text-slate-300 border border-slate-800 text-[11px] font-medium flex items-center space-x-1">
                      {am.includes('M-Ticket') && <Smartphone className="w-3 h-3 text-emerald-400" />}
                      {am.includes('F&B') && <UtensilsCrossed className="w-3 h-3 text-amber-400" />}
                      {am.includes('Recliner') && <Armchair className="w-3 h-3 text-purple-400" />}
                      {am.includes('Wheelchair') && <Accessibility className="w-3 h-3 text-blue-400" />}
                      <span>{am}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Showtimes Pills Matrix */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {visibleShowtimes.map((st) => {
                  return (
                    <div key={st.showId} className="relative group/pill">
                      <button
                        onClick={() => onSelectShowtime(venue, st, selectedDate.fullDate)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-w-[120px] ${
                          st.status === 'AVAILABLE'
                            ? 'bg-[#182234] border-emerald-500/40 text-white hover:border-emerald-400 hover:bg-emerald-950/20'
                            : st.status === 'FILLING_FAST'
                            ? 'bg-[#182234] border-amber-500/40 text-white hover:border-amber-400 hover:bg-amber-950/20'
                            : 'bg-[#182234] border-rose-500/40 text-white hover:border-rose-400 hover:bg-rose-950/20'
                        }`}
                      >
                        <div className="flex items-center justify-between space-x-2">
                          <span className="text-sm font-black font-mono tracking-tight">{st.time}</span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              st.status === 'AVAILABLE'
                                ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                                : st.status === 'FILLING_FAST'
                                ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                                : 'bg-rose-500 shadow-sm shadow-rose-500/50'
                            }`}
                          />
                        </div>
                        
                        <div className="pt-2 text-[10px] flex items-center justify-between text-slate-400">
                          <span className="font-semibold text-slate-300">{st.format}</span>
                          <span className="font-mono font-bold text-rose-400">
                            {selectedCity.currencySymbol}{st.priceStart}
                          </span>
                        </div>
                      </button>

                      {/* Tooltip on hover showing availability % */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/pill:flex flex-col items-center bg-[#070A12] border border-slate-700 text-slate-200 text-[10px] p-2 rounded-lg shadow-2xl z-20 whitespace-nowrap pointer-events-none">
                        <span className="font-bold">{st.availablePercent}% seats remaining</span>
                        <span className="text-slate-400">{st.cancellationAvailable ? 'Free Cancellation' : 'Non-refundable'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cancellation policy banner note */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>M-Ticket available. Cancellation available up to 20 minutes before showtime.</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
