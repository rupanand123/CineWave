import React, { useState, useEffect } from 'react';
import { BMSNavbar } from './components/bms/BMSNavbar';
import { BMSCityModal } from './components/bms/BMSCityModal';
import { BMSHeroCarousel } from './components/bms/BMSHeroCarousel';
import { BMSMovieGrid } from './components/bms/BMSMovieGrid';
import { BMSMovieDetailModal } from './components/bms/BMSMovieDetailModal';
import { BMSTrailerModal } from './components/bms/BMSTrailerModal';
import { BMSShowtimeMatrix } from './components/bms/BMSShowtimeMatrix';
import { BMSSeatLayoutEngine } from './components/bms/BMSSeatLayoutEngine';
import { BMSFoodConcessions } from './components/bms/BMSFoodConcessions';
import { BMSCheckoutModal } from './components/bms/BMSCheckoutModal';
import { BMSDigitalTicketModal } from './components/bms/BMSDigitalTicketModal';
import { BMSEventsSection } from './components/bms/BMSEventsSection';
import { BMSMyBookingsModal } from './components/bms/BMSMyBookingsModal';
import { BMSAuthModal } from './components/bms/BMSAuthModal';
import { BMSUserProfileModal } from './components/bms/BMSUserProfileModal';
import { BMSCinematicIntroPage } from './components/bms/BMSCinematicIntroPage';

// Firebase & Auth / Firestore Service Layer
import {
  auth,
  BMSUserProfile,
  WatchlistMovie,
  syncUserProfile,
  subscribeToUserBookings,
  subscribeToWatchlist,
  saveBookingToFirestore,
  toggleWatchlistMovie,
  getStoredUserProfile,
  clearStoredUserProfile
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// BMS Sample Data
import {
  CITIES_LIST,
  CityData,
  BMSMovie,
  BMS_MOVIES,
  CinemaVenue,
  CinemaShowtime,
  FoodItem,
  BookingTicketRecord,
  SAMPLE_BOOKINGS,
  BMSEvent
} from './data/bmsData';

import {
  Ticket,
  Sparkles,
  ShieldCheck,
  Flame,
  Award,
  Play
} from 'lucide-react';

export default function App() {
  // Navigation & Location States
  const [selectedCity, setSelectedCity] = useState<CityData>(CITIES_LIST[0]); // Mumbai (₹)
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'movies' | 'stream' | 'events' | 'plays' | 'sports'>('movies');

  // Firebase User & Auth States
  const [userProfile, setUserProfile] = useState<BMSUserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
  const [showCinematicIntro, setShowCinematicIntro] = useState<boolean>(true);

  // Booking Flow States
  const [activeFlowStep, setActiveFlowStep] = useState<'HOME' | 'SHOWTIMES' | 'SEATS' | 'FOOD'>('HOME');
  const [selectedMovie, setSelectedMovie] = useState<BMSMovie | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<CinemaVenue | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<CinemaShowtime | null>(null);
  const [selectedShowDate, setSelectedShowDate] = useState<string>('Sun, 31 Aug 2026');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatTier, setSeatTier] = useState<string>('PRIME CLUB');
  const [baseSeatAmount, setBaseSeatAmount] = useState<number>(0);
  const [cartFoodItems, setCartFoodItems] = useState<{ item: FoodItem; quantity: number }[]>([]);
  const [foodTotal, setFoodTotal] = useState<number>(0);

  // Modals
  const [detailModalMovie, setDetailModalMovie] = useState<BMSMovie | null>(null);
  const [trailerModalMovie, setTrailerModalMovie] = useState<BMSMovie | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [activeDigitalTicket, setActiveDigitalTicket] = useState<BookingTicketRecord | null>(null);

  // User Bookings Persistence
  const [userBookings, setUserBookings] = useState<BookingTicketRecord[]>(SAMPLE_BOOKINGS);

  // 1. Listen to Firebase Auth State Changes & Sync Firestore
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await syncUserProfile(firebaseUser);
        setUserProfile(profile);
      } else {
        const stored = getStoredUserProfile();
        if (stored) {
          setUserProfile(stored);
        } else {
          setUserProfile(null);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time Firestore Subscriptions for Bookings & Watchlist when user logged in
  useEffect(() => {
    if (!userProfile?.uid) return;

    const unsubscribeBookings = subscribeToUserBookings(userProfile.uid, (firestoreBookings) => {
      if (firestoreBookings && firestoreBookings.length > 0) {
        // Merge with existing sample bookings, avoiding duplicates
        setUserBookings((prev) => {
          const ids = new Set(firestoreBookings.map((b) => b.bookingId));
          const filteredPrev = prev.filter((b) => !ids.has(b.bookingId));
          return [...firestoreBookings, ...filteredPrev];
        });
      }
    });

    const unsubscribeWatchlist = subscribeToWatchlist(userProfile.uid, (firestoreWatchlist) => {
      setWatchlist(firestoreWatchlist);
    });

    return () => {
      unsubscribeBookings();
      unsubscribeWatchlist();
    };
  }, [userProfile?.uid]);

  // Handler: Select Movie from Grid or Carousel
  const handleSelectMovie = (movie: BMSMovie) => {
    setSelectedMovie(movie);
    setActiveFlowStep('SHOWTIMES');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Watch Trailer
  const handleWatchTrailer = (movie: BMSMovie) => {
    setTrailerModalMovie(movie);
  };

  // Handler: Select Showtime from Matrix
  const handleSelectShowtime = (venue: CinemaVenue, showtime: CinemaShowtime, dateStr: string) => {
    setSelectedVenue(venue);
    setSelectedShowtime(showtime);
    setSelectedShowDate(dateStr);
    setActiveFlowStep('SEATS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Select Seats & Proceed to Food
  const handleProceedToFood = (seats: string[], tier: string, basePrice: number) => {
    setSelectedSeats(seats);
    setSeatTier(tier);
    setBaseSeatAmount(basePrice);
    setActiveFlowStep('FOOD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Concessions Proceed to Checkout
  const handleProceedToCheckout = (items: { item: FoodItem; quantity: number }[], fTotal: number) => {
    setCartFoodItems(items);
    setFoodTotal(fTotal);
    setIsCheckoutModalOpen(true);
  };

  // Handler: Payment Succeeded -> Record Ticket in State & Firestore
  const handlePaymentSuccess = async (bookingRecord: BookingTicketRecord) => {
    setIsCheckoutModalOpen(false);
    setUserBookings((prev) => [bookingRecord, ...prev]);
    setActiveDigitalTicket(bookingRecord);

    // Save to Firestore if user logged in
    if (userProfile?.uid) {
      await saveBookingToFirestore(userProfile.uid, bookingRecord);
    }

    // Reset flow back to Home
    setActiveFlowStep('HOME');
    setSelectedMovie(null);
    setSelectedSeats([]);
    setCartFoodItems([]);
  };

  // Handler: Toggle Watchlist
  const handleToggleWatchlist = async (movie: BMSMovie) => {
    if (!userProfile) {
      // Prompt user to sign in
      setIsAuthModalOpen(true);
      return;
    }

    await toggleWatchlistMovie(userProfile.uid, {
      id: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl,
      genres: movie.genres,
      ratingScore: movie.ratingScore,
      languages: movie.languages,
      releaseDate: movie.releaseDate
    });
  };

  // Handler: Book Live Event directly
  const handleBookEvent = async (event: BMSEvent) => {
    const isRupees = selectedCity.currencySymbol === '₹';
    const fee = isRupees ? 68 : 4.80;
    const base = event.startingPrice * 2;
    const newBookingId = `BMS-EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const eventTicket: BookingTicketRecord = {
      bookingId: newBookingId,
      bookingTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      movieTitle: event.title,
      moviePoster: event.bannerUrl,
      movieLanguage: 'English / Live',
      movieFormat: event.category,
      cinemaName: event.venue,
      cinemaLocation: `${event.city}, India`,
      audiNumber: 'VIP Arena / GA Standing',
      showDate: event.dateTime.split('•')[0]?.trim() || 'Upcoming Weekend',
      showTime: event.dateTime.split('•')[1]?.trim() || '8:00 PM',
      seats: ['GA-P1', 'GA-P2'],
      seatTier: 'FAN PIT PASS',
      ticketCount: 2,
      baseAmount: base,
      convenienceFee: fee,
      foodAmount: 0,
      foodItems: [],
      discountAmount: 0,
      totalPaid: base + fee,
      customerName: userProfile?.displayName || 'Jane Doe',
      customerEmail: userProfile?.email || 'jane.doe@example.com',
      customerPhone: userProfile?.phoneNumber || '+91 98765 43210',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${newBookingId}-${event.title.replace(/\s+/g, '')}`,
      status: 'CONFIRMED'
    };

    setUserBookings((prev) => [eventTicket, ...prev]);
    setActiveDigitalTicket(eventTicket);

    if (userProfile?.uid) {
      await saveBookingToFirestore(userProfile.uid, eventTicket);
    }
  };

  // Handler: Cancel Booking with 100% refund simulation
  const handleCancelBooking = (bookingId: string) => {
    setUserBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
  };

  // Select movie by ID (e.g. from watchlist)
  const handleSelectMovieById = (movieId: string) => {
    const movie = BMS_MOVIES.find((m) => m.id === movieId);
    if (movie) {
      handleSelectMovie(movie);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white relative bg-grid-pattern overflow-x-hidden">
      {/* Ambient background lighting */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[300px] bg-rose-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-[500px] h-[300px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main BookMyShow Navbar */}
      <BMSNavbar
        selectedCity={selectedCity}
        onOpenCityModal={() => setIsCityModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveFlowStep('HOME');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        bookingCount={userBookings.length}
        userProfile={userProfile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        watchlistCount={watchlist.length}
        onOpenCinematicIntro={() => setShowCinematicIntro(true)}
      />

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300">
        
        {/* Step 1: Active Showtimes Matrix Step */}
        {activeFlowStep === 'SHOWTIMES' && selectedMovie && (
          <BMSShowtimeMatrix
            movie={selectedMovie}
            selectedCity={selectedCity}
            onBackToMovies={() => setActiveFlowStep('HOME')}
            onSelectShowtime={handleSelectShowtime}
          />
        )}

        {/* Step 2: Interactive Cinema Hall & Seat Layout Engine */}
        {activeFlowStep === 'SEATS' && selectedMovie && selectedVenue && selectedShowtime && (
          <BMSSeatLayoutEngine
            movie={selectedMovie}
            venue={selectedVenue}
            showtime={selectedShowtime}
            selectedDate={selectedShowDate}
            selectedCity={selectedCity}
            onBackToShowtimes={() => setActiveFlowStep('SHOWTIMES')}
            onProceedToFood={handleProceedToFood}
          />
        )}

        {/* Step 3: Food & Beverage Concession Picker */}
        {activeFlowStep === 'FOOD' && selectedMovie && selectedVenue && selectedShowtime && (
          <BMSFoodConcessions
            movie={selectedMovie}
            venue={selectedVenue}
            showtime={selectedShowtime}
            selectedSeats={selectedSeats}
            seatTier={seatTier}
            baseAmount={baseSeatAmount}
            selectedCity={selectedCity}
            onBackToSeats={() => setActiveFlowStep('SEATS')}
            onProceedToCheckout={handleProceedToCheckout}
          />
        )}

        {/* Step 0: Category / Home Explore Views */}
        {activeFlowStep === 'HOME' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 1. MOVIES CATEGORY */}
            {activeCategory === 'movies' && (
              <div className="space-y-8">
                {/* Cinematic Hero Carousel Banner with Real Posters */}
                <BMSHeroCarousel
                  movies={BMS_MOVIES}
                  onSelectMovie={handleSelectMovie}
                  onWatchTrailer={handleWatchTrailer}
                />

                {/* Movie Grid with Real Posters, Watchlist & Filters */}
                <BMSMovieGrid
                  movies={BMS_MOVIES}
                  onSelectMovie={(movie) => setDetailModalMovie(movie)}
                  onWatchTrailer={handleWatchTrailer}
                  searchQuery={searchQuery}
                  watchlistMovieIds={watchlist.map((w) => w.movieId)}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              </div>
            )}

            {/* 2. STREAM CATEGORY */}
            {activeCategory === 'stream' && (
              <div className="space-y-6">
                <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                  <div className="max-w-xl space-y-3">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 w-fit">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>BOOKMYSHOW STREAM PREMIERE</span>
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                      Rent or Buy Handpicked Cinema Masterpieces
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Stream award-winning international cinema, Hollywood 4K HDR releases, and festival exclusives directly to your TV and mobile with zero subscription needed.
                    </p>
                    <div className="pt-2 flex gap-3">
                      <button
                        onClick={() => handleWatchTrailer(BMS_MOVIES[0])}
                        className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center space-x-2 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Watch Dune 2 Stream Premiere</span>
                      </button>
                    </div>
                  </div>
                </div>

                <BMSMovieGrid
                  movies={BMS_MOVIES.slice(0, 6)}
                  onSelectMovie={(movie) => setDetailModalMovie(movie)}
                  onWatchTrailer={handleWatchTrailer}
                  searchQuery={searchQuery}
                  watchlistMovieIds={watchlist.map((w) => w.movieId)}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              </div>
            )}

            {/* 3. EVENTS, PLAYS & SPORTS */}
            {(activeCategory === 'events' || activeCategory === 'plays' || activeCategory === 'sports') && (
              <BMSEventsSection
                onBookEvent={handleBookEvent}
                categoryFilter={activeCategory === 'plays' ? 'Plays' : activeCategory === 'sports' ? 'Sports' : 'ALL'}
                selectedCity={selectedCity}
              />
            )}
          </div>
        )}

      </main>

      {/* Global Modals */}
      {/* 1. City Selector Modal */}
      <BMSCityModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
      />

      {/* 2. Movie Detail Backdrop Modal */}
      <BMSMovieDetailModal
        movie={detailModalMovie}
        onClose={() => setDetailModalMovie(null)}
        onProceedToBooking={(movie) => {
          setDetailModalMovie(null);
          handleSelectMovie(movie);
        }}
        onWatchTrailer={handleWatchTrailer}
      />

      {/* 3. Trailer Video Player Modal */}
      <BMSTrailerModal
        movie={trailerModalMovie}
        onClose={() => setTrailerModalMovie(null)}
        onBookTickets={(movie) => {
          setTrailerModalMovie(null);
          handleSelectMovie(movie);
        }}
      />

      {/* 4. Checkout & Payment Modal */}
      {selectedMovie && selectedVenue && selectedShowtime && (
        <BMSCheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          movie={selectedMovie}
          venue={selectedVenue}
          showtime={selectedShowtime}
          selectedDate={selectedShowDate}
          selectedSeats={selectedSeats}
          seatTier={seatTier}
          baseAmount={baseSeatAmount}
          foodItems={cartFoodItems}
          foodTotal={foodTotal}
          selectedCity={selectedCity}
          userProfile={userProfile}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* 5. Scannable Digital M-Ticket Modal */}
      <BMSDigitalTicketModal
        ticket={activeDigitalTicket}
        currencySymbol={selectedCity.currencySymbol}
        onClose={() => setActiveDigitalTicket(null)}
        onCancelBooking={handleCancelBooking}
      />

      {/* 6. My Bookings Drawer / Modal */}
      <BMSMyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        bookings={userBookings}
        currencySymbol={selectedCity.currencySymbol}
        onOpenTicketDetails={(ticket) => {
          setIsMyBookingsOpen(false);
          setActiveDigitalTicket(ticket);
        }}
      />

      {/* 7. Interactive BookMyShow Login & Auth Modal */}
      <BMSAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(profile) => {
          setUserProfile(profile);
        }}
      />

      {/* 8. User Profile, QuikPay Wallet & Watchlist Modal */}
      {userProfile && (
        <BMSUserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          userProfile={userProfile}
          watchlist={watchlist}
          bookings={userBookings}
          onOpenTicket={(ticket) => {
            setIsProfileModalOpen(false);
            setActiveDigitalTicket(ticket);
          }}
          onSelectMovieById={handleSelectMovieById}
          onRemoveFromWatchlist={(watchItem) => {
            const movie = BMS_MOVIES.find((m) => m.id === watchItem.movieId);
            if (movie) handleToggleWatchlist(movie);
          }}
          onUpdateProfile={(updated) => setUserProfile(updated)}
          onSignOut={() => {
            clearStoredUserProfile();
            setUserProfile(null);
            setShowCinematicIntro(true);
          }}
        />
      )}

      {/* 9. Cinematic Intro & Multi-Mode Login Overlay (Displayed on App Launch) */}
      {showCinematicIntro && (
        <BMSCinematicIntroPage
          onLoginSuccess={(profile) => {
            setUserProfile(profile);
            setShowCinematicIntro(false);
          }}
          onContinueAsGuest={(guestCity) => {
            if (guestCity) setSelectedCity(guestCity);
            setShowCinematicIntro(false);
          }}
          selectedCity={selectedCity}
          onSelectCity={(city) => setSelectedCity(city)}
        />
      )}

      {/* Platform Signature Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F19]/95 backdrop-blur-md py-8 text-xs text-slate-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-red-600 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
                <Ticket className="w-5 h-5 fill-white stroke-none" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white">
                  book<span className="text-rose-500">my</span>show
                </span>
                <p className="text-[11px] text-slate-500">
                  Global Movie & Entertainment Ticketing Engine
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center space-x-6 text-xs">
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Genuine Tickets</span>
              </span>
              <span className="flex items-center space-x-1.5 text-rose-400">
                <Flame className="w-4 h-4" />
                <span>Instant Confirmation</span>
              </span>
              <span className="flex items-center space-x-1.5 text-blue-400">
                <Award className="w-4 h-4" />
                <span>4,500+ Partner Cinema Screens</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© 2026 Bigtree Entertainment Pvt. Ltd. All Rights Reserved.</p>
            <div className="flex items-center space-x-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Security Audits</span>
              <span>•</span>
              <span>24x7 Customer Helpdesk</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
