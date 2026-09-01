import React, { useState } from 'react';
import { BMSMovie, BMS_FALLBACK_POSTER } from '../../data/bmsData';
import { Star, Ticket, Filter, Play, Sparkles, Check, Heart } from 'lucide-react';

interface BMSMovieGridProps {
  movies: BMSMovie[];
  onSelectMovie: (movie: BMSMovie) => void;
  onWatchTrailer: (movie: BMSMovie) => void;
  searchQuery: string;
  watchlistMovieIds?: string[];
  onToggleWatchlist?: (movie: BMSMovie) => void;
}

export function BMSMovieGrid({
  movies,
  onSelectMovie,
  onWatchTrailer,
  searchQuery,
  watchlistMovieIds = [],
  onToggleWatchlist
}: BMSMovieGridProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  // Filter lists
  const languages = ['All', 'Telugu', 'Tamil', 'Hindi', 'English', 'Malayalam', 'Kannada'];
  const formats = ['All', 'IMAX 3D', 'IMAX 2D', '4DX 3D', '4DX', 'Dolby Atmos 2D', '2D'];
  const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Crime', 'Thriller', 'Horror', 'Comedy', 'Mythology', 'History', 'Adventure'];

  const filteredMovies = movies.filter((m) => {
    // Search query match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchGenre = m.genres.some((g) => g.toLowerCase().includes(q));
      const matchCast = m.cast.some((c) => c.name.toLowerCase().includes(q));
      if (!matchTitle && !matchGenre && !matchCast) return false;
    }
    // Language filter
    if (selectedLanguage !== 'All' && !m.languages.includes(selectedLanguage)) {
      return false;
    }
    // Format filter
    if (selectedFormat !== 'All' && !m.formats.includes(selectedFormat)) {
      return false;
    }
    // Genre filter
    if (selectedGenre !== 'All' && !m.genres.includes(selectedGenre)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Section Header */}
      <div className="bg-[#111726]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Now Showing in Cinemas</h2>
              <p className="text-xs text-slate-400">Showing {filteredMovies.length} movies available for immediate seat booking</p>
            </div>
          </div>

          {/* Active Filter Reset */}
          {(selectedLanguage !== 'All' || selectedFormat !== 'All' || selectedGenre !== 'All') && (
            <button
              onClick={() => {
                setSelectedLanguage('All');
                setSelectedFormat('All');
                setSelectedGenre('All');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Pills Rows */}
        <div className="space-y-3">
          {/* Languages */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Language:
            </span>
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedLanguage === lang
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-[#182234] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Formats */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Format:
            </span>
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFormat === fmt
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-[#182234] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Genres */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Genre:
            </span>
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedGenre === g
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-[#182234] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length === 0 ? (
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <p className="text-slate-300 font-bold text-base">No movies match your current search/filters.</p>
          <p className="text-xs text-slate-500">Try adjusting your language, genre, or format preferences.</p>
          <button
            onClick={() => {
              setSelectedLanguage('All');
              setSelectedFormat('All');
              setSelectedGenre('All');
            }}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-rose-500"
          >
            Show All Movies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-[#111726] border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col group"
            >
              {/* Poster Container with BMS Overlay */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
                <img
                  src={movie.posterUrl || BMS_FALLBACK_POSTER}
                  alt={movie.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = BMS_FALLBACK_POSTER;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Rating Banner on Bottom of Poster (Signature BMS style) */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Star className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <span className="text-xs font-bold text-white">{movie.ratingScore} / 10</span>
                    <span className="text-[10px] text-slate-300">({movie.voteCount})</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {movie.ratingPercent}% Liked
                  </span>
                </div>

                {/* Top Certificate & Trending Pill */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-bold text-white border border-slate-700">
                    {movie.certificate}
                  </span>
                </div>

                {/* Top Right Heart/Watchlist Button */}
                {onToggleWatchlist && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(movie);
                    }}
                    className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-md ${
                      watchlistMovieIds.includes(movie.id)
                        ? 'bg-rose-600 text-white shadow-rose-600/40'
                        : 'bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white border border-white/20'
                    }`}
                    title={watchlistMovieIds.includes(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        watchlistMovieIds.includes(movie.id) ? 'fill-white text-white' : ''
                      }`}
                    />
                  </button>
                )}

                {/* Trailer Play Button overlay */}
                <button
                  onClick={() => onWatchTrailer(movie)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 cursor-pointer shadow-xl z-10"
                  title="Watch Trailer"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>
              </div>

              {/* Movie Info Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3
                    onClick={() => onSelectMovie(movie)}
                    className="text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1 cursor-pointer tracking-tight"
                  >
                    {movie.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 font-medium">
                    {movie.genres.join(', ')}
                  </p>
                  
                  {/* Languages & Formats Badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                      {movie.languages.slice(0, 2).join(', ')}{movie.languages.length > 2 ? ` +${movie.languages.length - 2}` : ''}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono">
                      {movie.formats[0]}
                    </span>
                  </div>
                </div>

                {/* Book Tickets CTA Button */}
                <button
                  onClick={() => onSelectMovie(movie)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/20 flex items-center justify-center space-x-1.5 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5 fill-white" />
                  <span>Book Tickets</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
