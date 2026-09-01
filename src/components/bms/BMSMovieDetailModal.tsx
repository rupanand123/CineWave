import React from 'react';
import { BMSMovie, BMS_FALLBACK_BACKDROP, BMS_FALLBACK_POSTER } from '../../data/bmsData';
import { X, Star, Clock, Ticket, Play, Users, Film, CheckCircle2 } from 'lucide-react';

interface BMSMovieDetailModalProps {
  movie: BMSMovie | null;
  onClose: () => void;
  onProceedToBooking: (movie: BMSMovie) => void;
  onWatchTrailer: (movie: BMSMovie) => void;
}

export function BMSMovieDetailModal({
  movie,
  onClose,
  onProceedToBooking,
  onWatchTrailer
}: BMSMovieDetailModalProps) {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#111726] border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden text-slate-100 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-slate-700 transition-all cursor-pointer shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Backdrop Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
          <img
            src={movie.backdropUrl || BMS_FALLBACK_BACKDROP}
            alt={movie.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = BMS_FALLBACK_BACKDROP;
            }}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111726] via-[#111726]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111726] via-transparent to-transparent" />

          {/* Quick Trailer Play Button on Backdrop */}
          <button
            onClick={() => onWatchTrailer(movie)}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl shadow-rose-600/50 backdrop-blur-md border border-white/30 transform hover:scale-110 transition-all cursor-pointer"
          >
            <Play className="w-7 h-7 fill-white ml-1" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 sm:p-8 pt-0 relative -mt-20 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            
            {/* Poster Card Floating */}
            <div className="w-36 sm:w-44 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 shrink-0 bg-slate-900 hidden sm:block">
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

            {/* Movie Title & Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold">
                  {movie.certificate}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{Math.floor(movie.durationMinutes / 60)}h {movie.durationMinutes % 60}m</span>
                </span>
                <span className="text-xs text-slate-400">
                  {movie.genres.join(' • ')}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {movie.title}
              </h2>
              <p className="text-xs sm:text-sm text-rose-300 font-medium italic">
                "{movie.tagline}"
              </p>

              {/* Ratings Card */}
              <div className="flex items-center space-x-4 p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800 w-fit">
                <div className="flex items-center space-x-1.5">
                  <Star className="w-5 h-5 fill-rose-500 text-rose-500" />
                  <div>
                    <span className="text-base font-bold text-white leading-none">{movie.ratingScore}</span>
                    <span className="text-xs text-slate-400">/10</span>
                  </div>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div className="text-xs">
                  <span className="font-bold text-emerald-400">{movie.ratingPercent}% Liked</span>
                  <span className="text-slate-500 block text-[11px]">{movie.voteCount} Ratings</span>
                </div>
              </div>

              {/* Formats & Languages */}
              <div className="space-y-1.5 pt-1">
                <div className="flex flex-wrap gap-1.5">
                  {movie.formats.map((fmt) => (
                    <span key={fmt} className="text-xs px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold font-mono">
                      {fmt}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400">
                  Available in: <strong className="text-slate-200">{movie.languages.join(', ')}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-2 border-t border-slate-800 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About the Movie</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {movie.synopsis}
            </p>
          </div>

          {/* Cast Gallery */}
          <div className="space-y-3 border-t border-slate-800 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-rose-400" />
              <span>Leading Cast</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {movie.cast.map((c) => (
                <div key={c.name} className="flex items-center space-x-3 p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800">
                  <img
                    src={c.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={c.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                    }}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{c.name}</h5>
                    <p className="text-[11px] text-slate-400 truncate">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Director & Crew */}
          <div className="space-y-2 border-t border-slate-800 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Film className="w-4 h-4 text-rose-400" />
              <span>Director & Crew</span>
            </h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="p-2.5 px-4 rounded-xl bg-[#0B0F19] border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Director</span>
                <strong className="text-white font-bold">{movie.director}</strong>
              </div>
              {movie.crew.map((cr) => (
                <div key={cr.role} className="p-2.5 px-4 rounded-xl bg-[#0B0F19] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">{cr.role}</span>
                  <strong className="text-white font-bold">{cr.name}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => onWatchTrailer(movie)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Watch Official Trailer</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onProceedToBooking(movie);
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Ticket className="w-4 h-4 fill-white" />
              <span>Select Cinemas & Showtimes</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
