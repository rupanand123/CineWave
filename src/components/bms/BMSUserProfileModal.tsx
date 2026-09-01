import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth, BMSUserProfile, WatchlistMovie, updateQuikPayBalance } from '../../lib/firebase';
import { BookingTicketRecord, BMSMovie } from '../../data/bmsData';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Ticket,
  Heart,
  Wallet,
  Award,
  Sparkles,
  LogOut,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  Film,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface BMSUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: BMSUserProfile;
  watchlist: WatchlistMovie[];
  bookings: BookingTicketRecord[];
  onOpenTicket: (ticket: BookingTicketRecord) => void;
  onSelectMovieById: (movieId: string) => void;
  onRemoveFromWatchlist: (movie: WatchlistMovie) => void;
  onUpdateProfile: (updated: BMSUserProfile) => void;
  onSignOut?: () => void;
}

export function BMSUserProfileModal({
  isOpen,
  onClose,
  userProfile,
  watchlist,
  bookings,
  onOpenTicket,
  onSelectMovieById,
  onRemoveFromWatchlist,
  onUpdateProfile,
  onSignOut
}: BMSUserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'quikpay' | 'watchlist' | 'rewards'>('profile');
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState<string | null>(null);

  // Editable Profile fields
  const [displayName, setDisplayName] = useState(userProfile.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile.phoneNumber || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onClose();
      if (onSignOut) onSignOut();
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  const handleTopUp = async (amount: number) => {
    setIsAddingMoney(true);
    const newBal = (userProfile.quikPayBalance || 0) + amount;
    await updateQuikPayBalance(userProfile.uid, newBal);
    const updated = { ...userProfile, quikPayBalance: newBal };
    onUpdateProfile(updated);
    setIsAddingMoney(false);
    setTopUpSuccess(`₹${amount} added successfully to your QuikPay wallet!`);
    setTimeout(() => setTopUpSuccess(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BMSUserProfile = {
      ...userProfile,
      displayName,
      phoneNumber
    };
    onUpdateProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div
      id="bms-user-profile-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="bms-user-profile-modal-card"
        className="relative w-full max-w-2xl bg-[#0F1524] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-200 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#141B2D] to-slate-900 p-6 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-rose-600/30 overflow-hidden">
                {userProfile.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName || 'User'}
                    className="w-full h-full rounded-2xl object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  userProfile.displayName?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0F1524] flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-white">{userProfile.displayName || 'Movie Buff'}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  SuperStar VIP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{userProfile.email || userProfile.phoneNumber || 'BookMyShow Member'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex border-b border-slate-800 bg-[#0B0F19] px-6 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('quikpay')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'quikpay'
                ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>QuikPay Wallet</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded-full border border-emerald-500/30">
              ₹{userProfile.quikPayBalance ?? 500}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'watchlist'
                ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Watchlist</span>
            {watchlist.length > 0 && (
              <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-1.5 py-0.2 rounded-full">
                {watchlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'rewards'
                ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>SuperStar Perks</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* TAB 1: Profile Details */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {isSaved && (
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#161F33] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      disabled
                      value={userProfile.email || 'None registered'}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-4 py-2.5 bg-[#161F33] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current City</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      disabled
                      value={userProfile.city || 'Mumbai (Maharashtra)'}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Genres & Languages */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">Movie Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {['Action', 'Sci-Fi', 'Thriller', 'Drama', 'Comedy', 'Hindi', 'English', 'Telugu', 'Tamil'].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] font-medium text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: QuikPay Wallet */}
          {activeTab === 'quikpay' && (
            <div className="space-y-6">
              {topUpSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{topUpSuccess}</span>
                </div>
              )}

              {/* Wallet Card */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] border border-slate-700 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Wallet className="w-32 h-32 text-rose-500" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                      BookMyShow QuikPay Balance
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                      ACTIVE
                    </span>
                  </div>

                  <div className="text-3xl font-black text-white tracking-tight mb-2">
                    ₹{(userProfile.quikPayBalance ?? 500).toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-slate-400">
                    Enjoy seamless 1-click booking without entering CVV or waiting for bank OTPs!
                  </p>
                </div>
              </div>

              {/* Top Up Fast Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Quick Add Money</label>
                <div className="grid grid-cols-3 gap-3">
                  {[500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleTopUp(amt)}
                      disabled={isAddingMoney}
                      className="py-3 px-4 rounded-xl bg-[#161F33] hover:bg-rose-600/20 border border-slate-700 hover:border-rose-500/50 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5 text-rose-400" />
                      <span>Add +₹{amt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security guarantee */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-semibold">RBI-Compliant & Instant Refund Guarantee: </span>
                  Any canceled booking is instantly refunded directly back to your QuikPay balance within 15 seconds.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Watchlist */}
          {activeTab === 'watchlist' && (
            <div className="space-y-4">
              {watchlist.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 mx-auto flex items-center justify-center text-slate-500">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-200">Your Watchlist is empty</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Click the heart icon on any movie poster to save it here and get showtime notifications!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {watchlist.map((movie) => (
                    <div
                      key={movie.id}
                      className="p-3 rounded-xl bg-[#161F33] border border-slate-700/80 flex items-center space-x-3 group hover:border-rose-500/40 transition-all"
                    >
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-14 h-20 rounded-lg object-cover shadow-md shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{movie.title}</h4>
                        <div className="flex items-center space-x-1 text-[11px] text-amber-400 font-bold mt-0.5">
                          <span>★ {movie.ratingScore}/10</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {movie.genres?.join(', ') || 'Feature Film'}
                        </p>

                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => {
                              onSelectMovieById(movie.movieId || movie.id);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Book Now
                          </button>
                          <button
                            onClick={() => onRemoveFromWatchlist(movie)}
                            className="text-[10px] text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SuperStar Perks */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Tier Status: SuperStar Silver
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">
                    {userProfile.bmsRewardsPoints ?? 250} BMS Reward Points
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Earn 10 points for every ₹100 spent across tickets & snacks.
                  </p>
                </div>
                <Award className="w-10 h-10 text-amber-400" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#161F33] border border-slate-700">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Zero Convenience Fee Voucher</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Valid on your next 2 IMAX/4DX bookings this month.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#161F33] border border-slate-700">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold mb-1">
                    <Film className="w-4 h-4" />
                    <span>Free Jumbo Caramel Popcorn</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Applicable on orders above ₹400 at PVR INOX & Cinepolis.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
