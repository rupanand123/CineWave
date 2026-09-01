import React, { useState } from 'react';
import { CityData } from '../../data/bmsData';
import { BMSUserProfile, WatchlistMovie } from '../../lib/firebase';
import {
  Film,
  Search,
  MapPin,
  ChevronDown,
  Ticket,
  Tv,
  Calendar,
  Theater,
  Trophy,
  Flame,
  User,
  Heart,
  Wallet,
  LogOut,
  Sparkles
} from 'lucide-react';

interface BMSNavbarProps {
  selectedCity: CityData;
  onOpenCityModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: 'movies' | 'stream' | 'events' | 'plays' | 'sports';
  onSelectCategory: (cat: 'movies' | 'stream' | 'events' | 'plays' | 'sports') => void;
  onOpenMyBookings: () => void;
  bookingCount: number;
  userProfile: BMSUserProfile | null;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  watchlistCount: number;
  onOpenCinematicIntro?: () => void;
}

export function BMSNavbar({
  selectedCity,
  onOpenCityModal,
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  onOpenMyBookings,
  bookingCount,
  userProfile,
  onOpenAuthModal,
  onOpenProfileModal,
  watchlistCount,
  onOpenCinematicIntro
}: BMSNavbarProps) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800 shadow-xl transition-all">
      {/* Top Main Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-6 shrink-0">
            <button
              onClick={() => onSelectCategory('movies')}
              className="flex items-center space-x-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 via-rose-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-all">
                <Ticket className="w-5 h-5 fill-white stroke-none" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-black tracking-tight text-white font-sans">
                    book<span className="text-rose-500">my</span>show
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Cinemas • Live Events • Premieres
                </p>
              </div>
            </button>
          </div>

          {/* Center Search Input */}
          <div className="flex-1 max-w-xl mx-2 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search for Movies, Events, Plays, Sports and Activities..."
                className="w-full pl-10 pr-4 py-2 bg-[#141B2D] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2.5">
            
            {/* City Selector Button */}
            <button
              onClick={onOpenCityModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#141B2D] hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-white transition-all cursor-pointer shadow-sm hover:border-slate-600"
            >
              <span>{selectedCity.flagEmoji || '📍'}</span>
              <span className="max-w-[100px] truncate">{selectedCity.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* My Bookings Pill */}
            <button
              onClick={onOpenMyBookings}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer relative shadow-sm"
            >
              <Ticket className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">My Bookings</span>
              {bookingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center shadow-md shadow-rose-600/30">
                  {bookingCount}
                </span>
              )}
            </button>

            {/* Cinema Intro Replay Button */}
            {onOpenCinematicIntro && (
              <button
                id="bms-cinema-intro-trigger-btn"
                onClick={onOpenCinematicIntro}
                className="hidden xl:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/80 text-xs font-semibold text-rose-300 hover:text-white transition-all cursor-pointer shadow-sm hover:border-rose-500/40"
                title="Cinematic Intro & Experience"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Cinema Intro</span>
              </button>
            )}

            {/* Interactive User Auth / Profile Badge */}
            {userProfile ? (
              <div className="relative">
                <button
                  id="bms-user-profile-button"
                  onClick={onOpenProfileModal}
                  className="flex items-center space-x-2 p-1.5 pr-3 rounded-xl bg-[#161F33] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition-all cursor-pointer group shadow-sm hover:border-rose-500/40"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-md overflow-hidden">
                    {userProfile.photoURL ? (
                      <img
                        src={userProfile.photoURL}
                        alt="User"
                        className="w-full h-full rounded-lg object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      userProfile.displayName?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-[11px] font-bold text-white max-w-[110px] truncate leading-tight">
                      {userProfile.displayName?.split(' ')[0] || 'Member'}
                    </div>
                    <div className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
                      <Wallet className="w-2.5 h-2.5" />
                      ₹{userProfile.quikPayBalance ?? 500}
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              <button
                id="bms-signin-button"
                onClick={onOpenAuthModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-rose-600/25 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navbar / Categories Strip */}
      <div className="bg-[#0e1422] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2 text-xs font-medium no-scrollbar">
            {/* Main Categories */}
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              <button
                onClick={() => onSelectCategory('movies')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeCategory === 'movies'
                    ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Movies</span>
              </button>

              <button
                onClick={() => onSelectCategory('stream')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeCategory === 'stream'
                    ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Stream</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-bold">4K HDR</span>
              </button>

              <button
                onClick={() => onSelectCategory('events')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeCategory === 'events'
                    ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Events & Concerts</span>
              </button>

              <button
                onClick={() => onSelectCategory('plays')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeCategory === 'plays'
                    ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Theater className="w-3.5 h-3.5" />
                <span>Plays & Theatre</span>
              </button>

              <button
                onClick={() => onSelectCategory('sports')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeCategory === 'sports'
                    ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Sports</span>
              </button>
            </div>

            {/* Quick Offers / Offers banner link */}
            <div className="hidden md:flex items-center space-x-3 text-xs text-slate-400">
              <span className="flex items-center space-x-1 text-amber-400">
                <Flame className="w-3.5 h-3.5" />
                <span className="font-semibold">Offer: 50% Off with Code BMS50</span>
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Free Cancellation on All Tickets</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
