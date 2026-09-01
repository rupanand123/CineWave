import React from 'react';
import { BMSMovie } from '../../data/bmsData';
import { X, Play, Volume2, Film } from 'lucide-react';

interface BMSTrailerModalProps {
  movie: BMSMovie | null;
  onClose: () => void;
  onBookTickets: (movie: BMSMovie) => void;
}

export function BMSTrailerModal({
  movie,
  onClose,
  onBookTickets
}: BMSTrailerModalProps) {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#0B0F19] border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden text-slate-100 relative">
        
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{movie.title} • Official Trailer</h3>
              <p className="text-[11px] text-slate-400 font-mono">4K Ultra HD • Dolby 5.1 Surround Sound Preview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Embed */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${movie.trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${movie.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Action bar */}
        <div className="p-4 px-6 bg-[#111726] border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Enjoying the preview? Secure your favorite seats before shows fill up!
          </div>
          <button
            onClick={() => {
              onClose();
              onBookTickets(movie);
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            Book Tickets Now
          </button>
        </div>

      </div>
    </div>
  );
}
