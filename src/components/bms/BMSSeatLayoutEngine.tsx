import React, { useState, useEffect } from 'react';
import { BMSMovie, CinemaVenue, CinemaShowtime, CityData } from '../../data/bmsData';
import {
  ChevronLeft,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Armchair,
  Check,
  Sparkles,
  ArrowRight,
  Eye,
  Zap,
  Sliders
} from 'lucide-react';

interface BMSSeatLayoutEngineProps {
  movie: BMSMovie;
  venue: CinemaVenue;
  showtime: CinemaShowtime;
  selectedDate: string;
  selectedCity?: CityData;
  onBackToShowtimes: () => void;
  onProceedToFood: (selectedSeats: string[], tier: string, basePrice: number) => void;
}

interface SeatInfo {
  code: string;
  row: string;
  col: number;
  tier: 'ROYAL_RECLINER' | 'PRIME_CLUB' | 'CLASSIC_EXECUTIVE';
  price: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'SELECTED';
  isWheelchair?: boolean;
}

type TierFilter = 'ALL' | 'ROYAL_RECLINER' | 'PRIME_CLUB' | 'CLASSIC_EXECUTIVE';

export function BMSSeatLayoutEngine({
  movie,
  venue,
  showtime,
  selectedDate,
  selectedCity,
  onBackToShowtimes,
  onProceedToFood
}: BMSSeatLayoutEngineProps) {
  const currencySymbol = selectedCity?.currencySymbol || '₹';
  const isRupees = currencySymbol === '₹' || selectedCity?.currency === 'INR';

  // 8-minute Real-Time Seat Hold Countdown (BMS Lock Engine)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(480);
  const [selectedSeatCodes, setSelectedSeatCodes] = useState<string[]>([]);
  const [maxSeatsError, setMaxSeatsError] = useState<string | null>(null);
  
  // Interactive Tier Highlighting and Pulse State
  const [activeTierFilter, setActiveTierFilter] = useState<TierFilter>('ALL');
  const [hoveredTier, setHoveredTier] = useState<TierFilter | null>(null);
  const [isPulseHighlightEnabled, setIsPulseHighlightEnabled] = useState<boolean>(true);

  // Pre-seed occupied seats based on showtime
  const initialOccupied = ['A3', 'A4', 'B5', 'B6', 'C7', 'C8', 'C9', 'D4', 'D5', 'D6', 'E8', 'E9', 'F3', 'F4', 'G6', 'G7', 'H5', 'H6'];

  // Base pricing based on showtime & currency
  const baseStart = showtime.priceStart || (isRupees ? 250 : 18.00);
  const reclinerPrice = isRupees ? Math.round(baseStart * 1.5) : Number((baseStart * 1.35).toFixed(2));
  const primePrice = isRupees ? Math.round(baseStart * 1.1) : Number((baseStart * 1.0).toFixed(2));
  const classicPrice = isRupees ? Math.round(baseStart * 0.8) : Number((baseStart * 0.75).toFixed(2));

  // Generate seating grid
  const rows = [
    { letter: 'A', tier: 'ROYAL_RECLINER' as const, price: reclinerPrice, cols: 8 },
    { letter: 'B', tier: 'ROYAL_RECLINER' as const, price: reclinerPrice, cols: 8 },
    { letter: 'C', tier: 'PRIME_CLUB' as const, price: primePrice, cols: 12 },
    { letter: 'D', tier: 'PRIME_CLUB' as const, price: primePrice, cols: 12 },
    { letter: 'E', tier: 'PRIME_CLUB' as const, price: primePrice, cols: 12 },
    { letter: 'F', tier: 'CLASSIC_EXECUTIVE' as const, price: classicPrice, cols: 12 },
    { letter: 'G', tier: 'CLASSIC_EXECUTIVE' as const, price: classicPrice, cols: 12 },
    { letter: 'H', tier: 'CLASSIC_EXECUTIVE' as const, price: classicPrice, cols: 12 }
  ];

  // Calculate available counts per tier
  const calculateTierAvailability = (tierName: 'ROYAL_RECLINER' | 'PRIME_CLUB' | 'CLASSIC_EXECUTIVE') => {
    const tierRows = rows.filter(r => r.tier === tierName);
    let total = 0;
    let occupied = 0;
    tierRows.forEach(r => {
      total += r.cols;
      for (let i = 1; i <= r.cols; i++) {
        if (initialOccupied.includes(`${r.letter}${i}`)) {
          occupied += 1;
        }
      }
    });
    return { total, available: total - occupied };
  };

  const reclinerAvailability = calculateTierAvailability('ROYAL_RECLINER');
  const primeAvailability = calculateTierAvailability('PRIME_CLUB');
  const classicAvailability = calculateTierAvailability('CLASSIC_EXECUTIVE');
  const totalAvailable = reclinerAvailability.available + primeAvailability.available + classicAvailability.available;

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleSeat = (code: string, isOccupied: boolean) => {
    if (isOccupied) return;

    if (selectedSeatCodes.includes(code)) {
      setSelectedSeatCodes((prev) => prev.filter((s) => s !== code));
      setMaxSeatsError(null);
    } else {
      if (selectedSeatCodes.length >= 10) {
        setMaxSeatsError('You can select a maximum of 10 seats per booking.');
        return;
      }
      setSelectedSeatCodes((prev) => [...prev, code]);
      setMaxSeatsError(null);
    }
  };

  // Calculate total base price for selected seats
  const calculateTotalBase = () => {
    return selectedSeatCodes.reduce((total, code) => {
      const rowLetter = code.charAt(0);
      const rowConfig = rows.find((r) => r.letter === rowLetter);
      return total + (rowConfig ? rowConfig.price : (isRupees ? 300 : 18.00));
    }, 0);
  };

  // Determine dominant tier
  const getPrimaryTierName = () => {
    if (selectedSeatCodes.length === 0) return 'CLASSIC_EXECUTIVE';
    const firstRowLetter = selectedSeatCodes[0].charAt(0);
    const rowConfig = rows.find((r) => r.letter === firstRowLetter);
    return rowConfig ? rowConfig.tier : 'PRIME_CLUB';
  };

  const primaryTier = getPrimaryTierName();

  // Helper function to check if a tier is active/highlighted
  const isTierHighlighted = (tier: 'ROYAL_RECLINER' | 'PRIME_CLUB' | 'CLASSIC_EXECUTIVE') => {
    if (hoveredTier) {
      return hoveredTier === tier;
    }
    if (activeTierFilter === 'ALL') {
      return true;
    }
    return activeTierFilter === tier;
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Live Timer Status Bar */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToShowtimes}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center justify-center cursor-pointer group"
            title="Back to Cinemas & Timings"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-black text-white">{movie.title}</h2>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase">
                {showtime.format}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {venue.name} • {selectedDate} • <strong className="text-slate-200">{showtime.time}</strong> ({showtime.audioLanguage})
            </p>
          </div>
        </div>

        {/* Real-time Hold Timer & Pulse Mode Toggle */}
        <div className="flex items-center space-x-3 self-end md:self-auto flex-wrap gap-2">
          {/* Subtle Pulse Animation Toggle */}
          <button
            type="button"
            onClick={() => setIsPulseHighlightEnabled(!isPulseHighlightEnabled)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isPulseHighlightEnabled
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle interactive seat pulse animation"
          >
            <Zap className={`w-3.5 h-3.5 ${isPulseHighlightEnabled ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Seat Pulse: <strong className={isPulseHighlightEnabled ? 'text-rose-300' : 'text-slate-400'}>{isPulseHighlightEnabled ? 'ON' : 'OFF'}</strong></span>
          </button>

          {/* Reserved Hold Timer */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Seats Reserved for:</span>
            <span className={`font-mono font-black ${
              secondsRemaining < 120 ? 'text-rose-400 animate-bounce' : 'text-amber-300'
            }`}>
              {formatTimer(secondsRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Tier Quick-Filter & Available Seat Highlights Bar */}
      <div className="bg-[#111726]/80 backdrop-blur-md rounded-2xl border border-slate-800 p-3 sm:p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 shrink-0">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Interactive Tier Focus:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* ALL TIERS */}
          <button
            type="button"
            onClick={() => setActiveTierFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 border ${
              activeTierFilter === 'ALL'
                ? 'bg-slate-700/90 text-white border-slate-500 shadow-md ring-1 ring-slate-400/40'
                : 'bg-slate-800/50 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span>All Tiers</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-900/60 text-[10px] font-mono text-slate-300">
              {totalAvailable} Avail
            </span>
          </button>

          {/* ROYAL RECLINER */}
          <button
            type="button"
            onClick={() => setActiveTierFilter('ROYAL_RECLINER')}
            onMouseEnter={() => setHoveredTier('ROYAL_RECLINER')}
            onMouseLeave={() => setHoveredTier(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 border ${
              activeTierFilter === 'ROYAL_RECLINER'
                ? 'bg-purple-950/70 text-purple-200 border-purple-500 shadow-lg shadow-purple-900/30 ring-1 ring-purple-400/50'
                : 'bg-purple-950/20 text-purple-300/80 border-purple-900/40 hover:bg-purple-900/40 hover:text-purple-200'
            }`}
          >
            <Armchair className="w-3.5 h-3.5 text-purple-400" />
            <span>Royal Recliner ({currencySymbol}{reclinerPrice})</span>
            <span className="px-1.5 py-0.2 rounded-full bg-purple-900/60 text-[10px] font-mono text-purple-300">
              {reclinerAvailability.available} Avail
            </span>
            {isPulseHighlightEnabled && (activeTierFilter === 'ROYAL_RECLINER' || activeTierFilter === 'ALL') && (
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping inline-block" />
            )}
          </button>

          {/* PRIME CLUB */}
          <button
            type="button"
            onClick={() => setActiveTierFilter('PRIME_CLUB')}
            onMouseEnter={() => setHoveredTier('PRIME_CLUB')}
            onMouseLeave={() => setHoveredTier(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 border ${
              activeTierFilter === 'PRIME_CLUB'
                ? 'bg-blue-950/70 text-blue-200 border-blue-500 shadow-lg shadow-blue-900/30 ring-1 ring-blue-400/50'
                : 'bg-blue-950/20 text-blue-300/80 border-blue-900/40 hover:bg-blue-900/40 hover:text-blue-200'
            }`}
          >
            <span>Prime Club ({currencySymbol}{primePrice})</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-900/60 text-[10px] font-mono text-blue-300">
              {primeAvailability.available} Avail
            </span>
            {isPulseHighlightEnabled && (activeTierFilter === 'PRIME_CLUB' || activeTierFilter === 'ALL') && (
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping inline-block" />
            )}
          </button>

          {/* CLASSIC EXECUTIVE */}
          <button
            type="button"
            onClick={() => setActiveTierFilter('CLASSIC_EXECUTIVE')}
            onMouseEnter={() => setHoveredTier('CLASSIC_EXECUTIVE')}
            onMouseLeave={() => setHoveredTier(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 border ${
              activeTierFilter === 'CLASSIC_EXECUTIVE'
                ? 'bg-slate-800 text-slate-100 border-slate-400 shadow-md ring-1 ring-slate-400/50'
                : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span>Classic ({currencySymbol}{classicPrice})</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
              {classicAvailability.available} Avail
            </span>
            {isPulseHighlightEnabled && (activeTierFilter === 'CLASSIC_EXECUTIVE' || activeTierFilter === 'ALL') && (
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping inline-block" />
            )}
          </button>
        </div>
      </div>

      {/* Main Seat Map Container */}
      <div className="bg-[#111726]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-8 overflow-hidden">
        
        {/* Curved Screen Graphic with subtle projector glow */}
        <div className="flex flex-col items-center justify-center space-y-2 pt-2">
          <div className="relative w-3/4 max-w-xl h-6 flex items-center justify-center">
            {/* SVG Arc for curved cinema screen */}
            <svg viewBox="0 0 500 40" className="w-full h-full text-blue-500/40">
              <path
                d="M 20 35 Q 250 5 480 35"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/15 to-transparent blur-md pointer-events-none" />
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
            <span>All Eyes This Way Please (CINEMA PROJECTION SCREEN)</span>
          </p>
        </div>

        {/* Error Alert if >10 seats */}
        {maxSeatsError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{maxSeatsError}</span>
          </div>
        )}

        {/* Seating Tiers Grid */}
        <div className="space-y-8 overflow-x-auto pb-4 no-scrollbar">
          
          {/* TIER 1: ROYAL RECLINER */}
          <div
            className={`space-y-3 transition-all duration-300 p-3 rounded-2xl ${
              isTierHighlighted('ROYAL_RECLINER')
                ? 'bg-purple-950/15 border border-purple-500/20'
                : 'opacity-50 hover:opacity-100 border border-transparent'
            }`}
            onMouseEnter={() => setHoveredTier('ROYAL_RECLINER')}
            onMouseLeave={() => setHoveredTier(null)}
          >
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-black text-purple-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Armchair className="w-4 h-4 text-purple-400" />
                  <span>Royal VIP Recliner - {currencySymbol}{reclinerPrice}</span>
                </span>
                {isTierHighlighted('ROYAL_RECLINER') && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/40 animate-pulse">
                    Active Tier • {reclinerAvailability.available} Seats Available
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">Plush wide motorized lounger with food call service</span>
            </div>

            <div className="flex flex-col items-center space-y-2.5 pt-1">
              {rows.filter(r => r.tier === 'ROYAL_RECLINER').map((row) => (
                <div key={row.letter} className="flex items-center space-x-3">
                  <span className="w-5 text-center text-xs font-mono font-bold text-slate-400">{row.letter}</span>
                  
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: row.cols }, (_, i) => i + 1).map((col) => {
                      const code = `${row.letter}${col}`;
                      const isOccupied = initialOccupied.includes(code);
                      const isSelected = selectedSeatCodes.includes(code);
                      const shouldPulse = isPulseHighlightEnabled && !isOccupied && !isSelected && isTierHighlighted('ROYAL_RECLINER');

                      // Aisle gap in middle
                      const isAisle = col === 4;

                      return (
                        <React.Fragment key={code}>
                          <div className="relative group/seat hover:z-40">
                            <button
                              type="button"
                              onClick={() => handleToggleSeat(code, isOccupied)}
                              disabled={isOccupied}
                              className={`w-9 h-8 rounded-lg text-xs font-mono font-bold transition-all duration-200 flex items-center justify-center cursor-pointer relative ${
                                isOccupied
                                  ? 'bg-slate-800/40 text-slate-600 border border-slate-800/80 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/50 border border-emerald-300 scale-105 animate-seat-selected-glow'
                                  : shouldPulse
                                  ? 'bg-[#1a1730] border border-purple-400 text-purple-100 hover:border-purple-300 hover:bg-purple-900/60 hover:scale-110 animate-seat-pulse-purple'
                                  : 'bg-[#182234] border border-purple-500/30 text-purple-200 hover:border-purple-400 hover:bg-purple-950/40 hover:scale-105'
                              }`}
                              aria-label={`Seat ${code}, Royal VIP Recliner, ${currencySymbol}${row.price}`}
                            >
                              {col}
                              {shouldPulse && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-400 shadow-sm opacity-80" />
                              )}
                            </button>

                            {/* Interactive Hover Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 invisible group-hover/seat:opacity-100 group-hover/seat:visible transition-all duration-200 ease-out transform translate-y-1 group-hover/seat:translate-y-0 z-50">
                              <div className="bg-slate-950/95 backdrop-blur-md border border-purple-500/40 rounded-xl px-2.5 py-1.5 shadow-2xl shadow-black/90 text-center whitespace-nowrap min-w-[95px] flex flex-col items-center gap-0.5 ring-1 ring-white/10">
                                <div className="flex items-center justify-center space-x-1 text-[11px] font-mono font-black">
                                  <span className={isOccupied ? 'text-slate-400' : isSelected ? 'text-emerald-400' : 'text-purple-300'}>
                                    Seat {code}
                                  </span>
                                  {isSelected && <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />}
                                </div>
                                <div className="text-[10px] font-semibold text-slate-300">
                                  Royal VIP Recliner
                                </div>
                                <div className="text-[11px] font-mono font-bold text-emerald-400">
                                  {currencySymbol}{isRupees ? row.price : row.price.toFixed(2)}
                                </div>
                                <div className="mt-0.5">
                                  {isOccupied ? (
                                    <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                                      Booked
                                    </span>
                                  ) : isSelected ? (
                                    <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                      Selected
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                      Available
                                    </span>
                                  )}
                                </div>
                                {/* Downward Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-purple-500/60" />
                              </div>
                            </div>
                          </div>
                          {isAisle && <div className="w-6" />}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <span className="w-5 text-center text-xs font-mono font-bold text-slate-400">{row.letter}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TIER 2: PRIME CLUB */}
          <div
            className={`space-y-3 transition-all duration-300 p-3 rounded-2xl ${
              isTierHighlighted('PRIME_CLUB')
                ? 'bg-blue-950/15 border border-blue-500/20'
                : 'opacity-50 hover:opacity-100 border border-transparent'
            }`}
            onMouseEnter={() => setHoveredTier('PRIME_CLUB')}
            onMouseLeave={() => setHoveredTier(null)}
          >
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-black text-blue-300 uppercase tracking-wider">
                  Prime Club - {currencySymbol}{primePrice}
                </span>
                {isTierHighlighted('PRIME_CLUB') && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/40 animate-pulse">
                    Active Tier • {primeAvailability.available} Seats Available
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">Optimum acoustic and sightline positioning</span>
            </div>

            <div className="flex flex-col items-center space-y-2 pt-1">
              {rows.filter(r => r.tier === 'PRIME_CLUB').map((row) => (
                <div key={row.letter} className="flex items-center space-x-3">
                  <span className="w-5 text-center text-xs font-mono font-bold text-slate-400">{row.letter}</span>
                  
                  <div className="flex items-center space-x-1.5">
                    {Array.from({ length: row.cols }, (_, i) => i + 1).map((col) => {
                      const code = `${row.letter}${col}`;
                      const isOccupied = initialOccupied.includes(code);
                      const isSelected = selectedSeatCodes.includes(code);
                      const shouldPulse = isPulseHighlightEnabled && !isOccupied && !isSelected && isTierHighlighted('PRIME_CLUB');

                      // Aisle gap in middle
                      const isAisleLeft = col === 3;
                      const isAisleRight = col === 9;

                      return (
                        <React.Fragment key={code}>
                          <div className="relative group/seat hover:z-40">
                            <button
                              type="button"
                              onClick={() => handleToggleSeat(code, isOccupied)}
                              disabled={isOccupied}
                              className={`w-7 h-7 rounded-md text-[11px] font-mono font-semibold transition-all duration-200 flex items-center justify-center cursor-pointer relative ${
                                isOccupied
                                  ? 'bg-slate-800/40 text-slate-600 border border-slate-800/80 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/50 border border-emerald-300 scale-105 animate-seat-selected-glow'
                                  : shouldPulse
                                  ? 'bg-[#132238] border border-blue-400 text-blue-100 hover:border-blue-300 hover:bg-blue-900/60 hover:scale-110 animate-seat-pulse-blue'
                                  : 'bg-[#182234] border border-blue-500/30 text-blue-200 hover:border-blue-400 hover:bg-blue-950/40 hover:scale-105'
                              }`}
                              aria-label={`Seat ${code}, Prime Club, ${currencySymbol}${row.price}`}
                            >
                              {col}
                              {shouldPulse && (
                                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-sm opacity-80" />
                              )}
                            </button>

                            {/* Interactive Hover Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 invisible group-hover/seat:opacity-100 group-hover/seat:visible transition-all duration-200 ease-out transform translate-y-1 group-hover/seat:translate-y-0 z-50">
                              <div className="bg-slate-950/95 backdrop-blur-md border border-blue-500/40 rounded-xl px-2.5 py-1.5 shadow-2xl shadow-black/90 text-center whitespace-nowrap min-w-[90px] flex flex-col items-center gap-0.5 ring-1 ring-white/10">
                                <div className="flex items-center justify-center space-x-1 text-[11px] font-mono font-black">
                                  <span className={isOccupied ? 'text-slate-400' : isSelected ? 'text-emerald-400' : 'text-blue-300'}>
                                    Seat {code}
                                  </span>
                                  {isSelected && <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />}
                                </div>
                                <div className="text-[10px] font-semibold text-slate-300">
                                  Prime Club
                                </div>
                                <div className="text-[11px] font-mono font-bold text-emerald-400">
                                  {currencySymbol}{isRupees ? row.price : row.price.toFixed(2)}
                                </div>
                                <div className="mt-0.5">
                                  {isOccupied ? (
                                    <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                                      Booked
                                    </span>
                                  ) : isSelected ? (
                                    <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                      Selected
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                      Available
                                    </span>
                                  )}
                                </div>
                                {/* Downward Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-blue-500/60" />
                              </div>
                            </div>
                          </div>
                          {(isAisleLeft || isAisleRight) && <div className="w-4" />}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <span className="w-5 text-center text-xs font-mono font-bold text-slate-400">{row.letter}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TIER 3: CLASSIC EXECUTIVE */}
          <div
            className={`space-y-3 transition-all duration-300 p-3 rounded-2xl ${
              isTierHighlighted('CLASSIC_EXECUTIVE')
                ? 'bg-slate-800/20 border border-slate-700/50'
                : 'opacity-50 hover:opacity-100 border border-transparent'
            }`}
            onMouseEnter={() => setHoveredTier('CLASSIC_EXECUTIVE')}
            onMouseLeave={() => setHoveredTier(null)}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-black text-slate-300 uppercase tracking-wider">
                  Classic Executive - {currencySymbol}{classicPrice}
                </span>
                {isTierHighlighted('CLASSIC_EXECUTIVE') && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-200 text-[10px] font-bold border border-slate-600 animate-pulse">
                    Active Tier • {classicAvailability.available} Seats Available
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">Comfortable tiered cinema stadium seating</span>
            </div>

            <div className="flex flex-col items-center space-y-2 pt-1">
              {rows.filter(r => r.tier === 'CLASSIC_EXECUTIVE').map((row) => (
                <div key={row.letter} className="flex items-center space-x-3">
                  <span className="w-5 text-center text-xs font-mono font-bold text-slate-400">{row.letter}</span>
                  
                  <div className="flex items-center space-x-1.5">
                    {Array.from({ length: row.cols }, (_, i) => i + 1).map((col) => {
                      const code = `${row.letter}${col}`;
                      const isOccupied = initialOccupied.includes(code);
                      const isSelected = selectedSeatCodes.includes(code);
                      const shouldPulse = isPulseHighlightEnabled && !isOccupied && !isSelected && isTierHighlighted('CLASSIC_EXECUTIVE');

                      const isAisleLeft = col === 3;
                      const isAisleRight = col === 9;

                      return (
                        <React.Fragment key={code}>
                          <div className="relative group/seat hover:z-40">
                            <button
                              type="button"
                              onClick={() => handleToggleSeat(code, isOccupied)}
                              disabled={isOccupied}
                              className={`w-7 h-7 rounded-md text-[11px] font-mono font-semibold transition-all duration-200 flex items-center justify-center cursor-pointer relative ${
                                isOccupied
                                  ? 'bg-slate-800/40 text-slate-600 border border-slate-800/80 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/50 border border-emerald-300 scale-105 animate-seat-selected-glow'
                                  : shouldPulse
                                  ? 'bg-[#1c2738] border border-slate-400 text-slate-100 hover:border-slate-300 hover:bg-slate-700/80 hover:scale-110 animate-seat-pulse-classic'
                                  : 'bg-[#182234] border border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:scale-105'
                              }`}
                              aria-label={`Seat ${code}, Classic Executive, ${currencySymbol}${row.price}`}
                            >
                              {col}
                              {shouldPulse && (
                                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-slate-300 shadow-sm opacity-80" />
                              )}
                            </button>

                            {/* Interactive Hover Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 invisible group-hover/seat:opacity-100 group-hover/seat:visible transition-all duration-200 ease-out transform translate-y-1 group-hover/seat:translate-y-0 z-50">
                              <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-xl px-2.5 py-1.5 shadow-2xl shadow-black/90 text-center whitespace-nowrap min-w-[90px] flex flex-col items-center gap-0.5 ring-1 ring-white/10">
                                <div className="flex items-center justify-center space-x-1 text-[11px] font-mono font-black">
                                  <span className={isOccupied ? 'text-slate-400' : isSelected ? 'text-emerald-400' : 'text-slate-200'}>
                                    Seat {code}
                                  </span>
                                  {isSelected && <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />}
                                </div>
                                <div className="text-[10px] font-semibold text-slate-300">
                                  Classic Executive
                                </div>
                                <div className="text-[11px] font-mono font-bold text-emerald-400">
                                  {currencySymbol}{isRupees ? row.price : row.price.toFixed(2)}
                                </div>
                                <div className="mt-0.5">
                                  {isOccupied ? (
                                    <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                                      Booked
                                    </span>
                                  ) : isSelected ? (
                                    <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                      Selected
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider bg-slate-800/80 text-slate-300 border border-slate-700">
                                      Available
                                    </span>
                                  )}
                                </div>
                                {/* Downward Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-700/90" />
                              </div>
                            </div>
                          </div>
                          {(isAisleLeft || isAisleRight) && <div className="w-4" />}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <span className="w-5 text-center text-xs font-mono font-bold text-slate-400">{row.letter}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Legend Bar with Interactive Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-[#182234] border border-slate-600" />
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-purple-950/60 border border-purple-400 animate-seat-pulse-purple" />
            <span className="text-purple-300 font-semibold">Tier Highlight (Pulsing)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-emerald-500 border border-emerald-300 shadow-sm animate-seat-selected-glow" />
            <span className="text-emerald-400 font-bold">Selected ({selectedSeatCodes.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-slate-800 text-slate-600 border border-slate-800" />
            <span>Occupied / Sold</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-[#182234] border border-purple-500/40" />
            <span className="text-purple-300">VIP Recliner</span>
          </div>
        </div>

      </div>

      {/* Floating Bottom Action Bar */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-30">
        <div className="space-y-1 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Selected Seats:</span>
            {selectedSeatCodes.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedSeatCodes.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">No seats selected yet (tap seats above)</span>
            )}
          </div>

          {selectedSeatCodes.length > 0 && (
            <p className="text-xs text-slate-400">
              {selectedSeatCodes.length} Ticket(s) • Total Base: <strong className="text-emerald-400 font-mono font-bold text-sm">{currencySymbol}{isRupees ? calculateTotalBase() : calculateTotalBase().toFixed(2)}</strong>
            </p>
          )}
        </div>

        <button
          onClick={() => onProceedToFood(selectedSeatCodes, primaryTier, calculateTotalBase())}
          disabled={selectedSeatCodes.length === 0}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
            selectedSeatCodes.length > 0
              ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/30 hover:scale-[1.02] cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <span>Proceed to Food & Beverages</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
