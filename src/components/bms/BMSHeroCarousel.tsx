import React, { useState, useEffect } from 'react';
import { BMSMovie, BMS_FALLBACK_BACKDROP, BMS_FALLBACK_POSTER } from '../../data/bmsData';
import { Star, Play, Ticket, ChevronLeft, ChevronRight, Clock, Sparkles, Layers } from 'lucide-react';

interface BMSHeroCarouselProps {
  movies: BMSMovie[];
  onSelectMovie: (movie: BMSMovie) => void;
  onWatchTrailer: (movie: BMSMovie) => void;
}

export function BMSHeroCarousel({
  movies,
  onSelectMovie,
  onWatchTrailer
}: BMSHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  // Auto-rotate every 6 seconds if not paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [movies.length, isPaused]);

  const current = movies[currentIndex] || movies[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const handleImageError = (key: string) => {
    setImageErrorMap((prev) => ({ ...prev, [key]: true }));
  };

  const backdropSrc = imageErrorMap[`backdrop-${current.id}`]
    ? BMS_FALLBACK_BACKDROP
    : current.backdropUrl || BMS_FALLBACK_BACKDROP;

  const posterSrc = imageErrorMap[`poster-${current.id}`]
    ? BMS_FALLBACK_POSTER
    : current.posterUrl || BMS_FALLBACK_POSTER;

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-[#111726] group transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Backdrop with Gradient Overlay */}
      <div className="relative min-h-[420px] sm:min-h-[460px] lg:min-h-[480px] w-full overflow-hidden flex flex-col justify-end">
        <img
          key={`bg-${current.id}`}
          src={backdropSrc}
          alt={current.title}
          onError={() => handleImageError(`backdrop-${current.id}`)}
          className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-1000 scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/90 md:via-[#0B0F19]/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" />

        {/* Content Box */}
        <div className="relative z-20 flex flex-col md:flex-row items-center md:items-end justify-between p-6 sm:p-8 lg:p-10 gap-6">
          
          {/* Left Column: Movie Details */}
          <div className="flex-1 max-w-2xl space-y-3.5">
            
            {/* Badges Strip */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/30 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>#{current.trendingRank || (currentIndex + 1)} TRENDING</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 text-xs font-semibold">
                {current.certificate}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{Math.floor(current.durationMinutes / 60)}h {current.durationMinutes % 60}m</span>
              </span>
              {current.formats.slice(0, 3).map((fmt) => (
                <span key={fmt} className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold">
                  {fmt}
                </span>
              ))}
            </div>

            {/* Movie Title & Tagline */}
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {current.title}
              </h1>
              <p className="text-xs sm:text-sm text-rose-300/90 font-medium italic mt-1 drop-shadow">
                "{current.tagline}"
              </p>
            </div>

            {/* Rating Banner */}
            <div className="flex items-center space-x-3 bg-slate-950/75 backdrop-blur-md border border-slate-800/90 px-3.5 py-2 rounded-xl w-fit shadow-md">
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{current.ratingScore} / 10</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="text-xs text-slate-300">
                <strong className="text-white font-bold">{current.ratingPercent}%</strong> ({current.voteCount} Votes)
              </div>
            </div>

            {/* Synopsis Excerpt */}
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-xl leading-relaxed">
              {current.synopsis}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectMovie(current)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30 flex items-center space-x-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Ticket className="w-4 h-4 fill-white" />
                <span>Book Tickets</span>
              </button>

              <button
                onClick={() => onWatchTrailer(current)}
                className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-white text-xs font-semibold tracking-wider flex items-center space-x-2 transition-all cursor-pointer hover:border-slate-500"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Watch Trailer</span>
              </button>
            </div>

          </div>

          {/* Right Column: Featured Poster Card in Slide */}
          <div
            onClick={() => onSelectMovie(current)}
            className="hidden md:flex flex-col items-center shrink-0 group/poster cursor-pointer"
          >
            <div className="relative w-36 lg:w-44 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/80 group-hover/poster:border-rose-500 transition-all duration-300 group-hover/poster:scale-105 bg-slate-900">
              <img
                key={`poster-${current.id}`}
                src={posterSrc}
                alt={current.title}
                onError={() => handleImageError(`poster-${current.id}`)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity flex items-end p-2.5">
                <span className="text-[11px] font-bold text-white flex items-center space-x-1">
                  <Ticket className="w-3 h-3 text-rose-400" />
                  <span>Quick Book</span>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Slide Thumbnails Strip along Bottom */}
        <div className="relative z-20 px-6 sm:px-8 pb-4 pt-2 border-t border-slate-800/60 bg-black/40 backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold uppercase tracking-wider hidden sm:flex shrink-0">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            <span>Featured Movies ({movies.length})</span>
          </div>

          {/* Thumbnails Row */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 flex-1 sm:justify-end">
            {movies.map((m, idx) => {
              const isSelected = idx === currentIndex;
              const thumbSrc = imageErrorMap[`thumb-${m.id}`]
                ? BMS_FALLBACK_POSTER
                : m.posterUrl || BMS_FALLBACK_POSTER;

              return (
                <button
                  key={m.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex items-center space-x-2 p-1.5 pr-3 rounded-xl border transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-rose-600/30 border-rose-500 text-white shadow-md shadow-rose-600/20 ring-1 ring-rose-500 scale-[1.03]'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title={m.title}
                >
                  <div className="w-6 h-8 rounded-lg overflow-hidden shrink-0 bg-slate-800 border border-slate-700/50">
                    <img
                      src={thumbSrc}
                      alt={m.title}
                      onError={() => handleImageError(`thumb-${m.id}`)}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left hidden lg:block max-w-[100px]">
                    <span className="text-[11px] font-bold block truncate leading-tight">{m.title}</span>
                    <span className="text-[9px] text-rose-300/80 font-mono block">★ {m.ratingScore}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center space-x-1 shrink-0">
            {movies.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex ? 'w-5 bg-rose-500' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Prev / Next Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-rose-600 backdrop-blur-md border border-slate-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-30 shadow-xl"
        title="Previous Movie"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-rose-600 backdrop-blur-md border border-slate-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-30 shadow-xl"
        title="Next Movie"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

