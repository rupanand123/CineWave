import React, { useState, useEffect, useRef } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import {
  auth,
  googleProvider,
  syncUserProfile,
  BMSUserProfile,
  authenticateWithGoogle,
  authenticateWithPhoneOTP,
  authenticateWithDemoProfile
} from '../../lib/firebase';
import { BMSMovie, BMS_MOVIES, CityData, CITIES_LIST } from '../../data/bmsData';
import {
  Film,
  Ticket,
  Sparkles,
  Zap,
  Gift,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  Mail,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Play,
  Star,
  MapPin,
  Flame,
  Award,
  ChevronRight,
  Compass
} from 'lucide-react';

interface BMSCinematicIntroPageProps {
  onLoginSuccess: (profile: BMSUserProfile) => void;
  onContinueAsGuest: (selectedCity?: CityData) => void;
  selectedCity: CityData;
  onSelectCity: (city: CityData) => void;
}

// Cinematic backdrop posters
const BACKDROP_MOVIES = BMS_MOVIES.slice(0, 6);

const CINEMA_QUOTES = [
  { quote: "Every ticket tells a story.", author: "CineWave Experiences" },
  { quote: "Cinema is the most beautiful fraud in the world.", author: "Jean-Luc Godard" },
  { quote: "Experience the magic of 70mm, Dolby Atmos & IMAX.", author: "PVR INOX & Cinepolis" },
  { quote: "Big Screen. Epic Sound. Unforgettable Memories.", author: "CineWave Premiere" }
];

export function BMSCinematicIntroPage({
  onLoginSuccess,
  onContinueAsGuest,
  selectedCity,
  onSelectCity
}: BMSCinematicIntroPageProps) {
  // Slideshow & Backdrop State
  const [activeSlide, setActiveSlide] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isCurtainOpening, setIsCurtainOpening] = useState(false);

  // Auth Mode: 'phone' | 'email'
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Phone OTP Flow States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpCountdown, setOtpCountdown] = useState(30);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Email Flow States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Audio Context ref for subtle cinematic chord synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Auto rotate backdrop slides
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % BACKDROP_MOVIES.length);
    }, 6000);

    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % CINEMA_QUOTES.length);
    }, 8000);

    return () => {
      clearInterval(slideInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  // Phone countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpSent && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, otpCountdown]);

  // Play subtle cinematic audio chord when sound toggled
  const playCinematicChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create rich cinema chord (sub bass + warm pad + sparkle)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, now); // Low A (sub rumble)
      osc1.frequency.exponentialRampToValueAtTime(110, now + 1.5);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(220, now); // A3
      osc2.frequency.exponentialRampToValueAtTime(330, now + 2); // E4

      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(440, now); // A4
      osc3.frequency.exponentialRampToValueAtTime(554.37, now + 2.5); // C#5

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

      osc1.connect(gain);
      osc2.connect(gain);
      osc3.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + 3.2);
      osc2.stop(now + 3.2);
      osc3.stop(now + 3.2);
    } catch (e) {
      console.warn('Audio synthesis note:', e);
    }
  };

  const handleToggleSound = () => {
    if (!isSoundOn) {
      playCinematicChime();
      setIsSoundOn(true);
    } else {
      setIsSoundOn(false);
    }
  };

  // Entrance transition helper
  const triggerEntranceTransition = (callback: () => void) => {
    setIsCurtainOpening(true);
    if (isSoundOn) playCinematicChime();
    setTimeout(() => {
      callback();
    }, 600);
  };

  // 1. Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const profile = await authenticateWithGoogle();
      setSuccessMessage(`Welcome back, ${profile.displayName || 'Movie Buff'}!`);
      triggerEntranceTransition(() => {
        onLoginSuccess(profile);
      });
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.message?.includes('closed')) {
        setErrorMessage('Sign-in was cancelled. Please try again.');
      } else {
        setErrorMessage(err.message || 'Failed to authenticate with Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Phone OTP Flow
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      setOtpCountdown(30);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      const pasted = val.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      otpInputRefs.current[Math.min(pasted.length, 5)]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = val;
    setOtpDigits(newDigits);

    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setErrorMessage('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const profile = await authenticateWithPhoneOTP(phoneNumber);
      setSuccessMessage('Mobile verified! Entering cinema foyer...');
      triggerEntranceTransition(() => {
        onLoginSuccess(profile);
      });
    } catch (err: any) {
      console.error('OTP Verification Error:', err);
      setErrorMessage('OTP Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Email/Password Auth
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    if (isSignUp && !name) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        const profile = await syncUserProfile(cred.user, { displayName: name });
        setSuccessMessage('Account created! Entering BookMyShow...');
        triggerEntranceTransition(() => {
          onLoginSuccess(profile);
        });
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const profile = await syncUserProfile(cred.user);
        setSuccessMessage(`Welcome back, ${profile.displayName || 'Movie Buff'}!`);
        triggerEntranceTransition(() => {
          onLoginSuccess(profile);
        });
      }
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setErrorMessage('Invalid email or password. Please verify credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('An account already exists with this email.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('Password must be at least 6 characters long.');
      } else {
        setErrorMessage(err.message || 'Authentication failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Instant VIP / Demo Profile Login
  const handleDemoLogin = async (role: 'VIP' | 'Regular') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const profile = await authenticateWithDemoProfile(role);
      setSuccessMessage(`Welcome, ${profile.displayName || 'VIP Member'}!`);
      triggerEntranceTransition(() => {
        onLoginSuccess(profile);
      });
    } catch (err: any) {
      console.error('Demo Login Error:', err);
      setErrorMessage('Could not initialize demo login.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentMovie = BACKDROP_MOVIES[activeSlide] || BACKDROP_MOVIES[0];

  return (
    <div
      id="bms-cinematic-intro-root"
      className={`fixed inset-0 z-50 overflow-y-auto bg-[#070A12] text-slate-100 flex flex-col font-sans transition-all duration-700 ${
        isCurtainOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Dynamic Cinematic Backdrop Slideshow with Ken Burns Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {BACKDROP_MOVIES.map((movie, idx) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-40 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{
              transitionProperty: 'opacity, transform',
              transitionDuration: '1.4s'
            }}
          >
            <img
              src={movie.backdropUrl || movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover filter blur-[2px] brightness-75 scale-105 animate-pulse-slow"
            />
          </div>
        ))}

        {/* Cinematic Vignette, Projector Beam & Grain Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A12] via-[#070A12]/80 to-[#070A12]/60" />
        <div className="absolute inset-0 bg-radial-vignette" />

        {/* Projector Light Beam Simulation */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-rose-500/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none transform -rotate-12" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-500/15 via-rose-500/5 to-transparent blur-3xl pointer-events-none transform rotate-12" />
      </div>

      {/* 35mm Film Strip Left & Right Flanks (Desktop) */}
      <div className="hidden xl:flex flex-col justify-between fixed top-0 bottom-0 left-3 w-8 py-4 opacity-25 pointer-events-none z-10">
        <div className="flex flex-col space-y-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="w-4 h-6 border-2 border-slate-400 rounded-sm mx-auto" />
          ))}
        </div>
      </div>

      <div className="hidden xl:flex flex-col justify-between fixed top-0 bottom-0 right-3 w-8 py-4 opacity-25 pointer-events-none z-10">
        <div className="flex flex-col space-y-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="w-4 h-6 border-2 border-slate-400 rounded-sm mx-auto" />
          ))}
        </div>
      </div>

      {/* Top Floating Control Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        {/* Brand Logo with Glow */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 via-red-600 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-rose-600/40 ring-1 ring-white/20">
            <Ticket className="w-5 h-5 fill-white stroke-none" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              Cine<span className="text-rose-500">Wave</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm">
                Premiere
              </span>
            </span>
            <p className="text-[11px] text-slate-400 hidden sm:block">Cinematic Entertainment Hub</p>
          </div>
        </div>

        {/* Right Top Controls: Audio toggle & Guest Skip */}
        <div className="flex items-center space-x-3">
          {/* Sound Synthesizer Ambience Button */}
          <button
            onClick={handleToggleSound}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              isSoundOn
                ? 'bg-rose-600/20 border-rose-500/60 text-rose-300 shadow-lg shadow-rose-600/20'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
            }`}
            title={isSoundOn ? 'Mute Cinema Ambience' : 'Turn On Cinema Sound'}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{isSoundOn ? 'Ambience ON' : 'Sound FX'}</span>
          </button>

          {/* Quick Skip / Explore as Guest */}
          <button
            id="bms-guest-skip-btn"
            onClick={() => triggerEntranceTransition(() => onContinueAsGuest(selectedCity))}
            className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 hover:border-slate-500 text-xs font-bold text-slate-200 hover:text-white flex items-center space-x-1.5 transition-all cursor-pointer shadow-md group"
          >
            <span>Skip / Explore Guest</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Center Intro & Login Stage */}
      <main className="relative z-20 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column: Cinematic Showcase & Now Playing Billboard */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Tech Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Live in Theatres
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[10px] font-bold border border-slate-700">
                IMAX with Laser
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[10px] font-bold border border-slate-700">
                Dolby Atmos 7.1
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[10px] font-bold border border-slate-700">
                4DX Dynamic
              </span>
            </div>

            {/* Dynamic Animated Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
                Your Passport to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-400 to-amber-300">
                  Blockbuster Magic
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-medium max-w-lg leading-relaxed">
                Step into premier cinemas across India. Reserve prime club recliners, enjoy zero-convenience fee offers, and order hot gourmet snacks right to your seat.
              </p>
            </div>

            {/* Now Highlighting Active Movie Feature Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-2xl flex items-center space-x-4 group">
              <img
                src={currentMovie.posterUrl}
                alt={currentMovie.title}
                className="w-16 h-24 rounded-xl object-cover shadow-lg shrink-0 border border-slate-700 group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-black uppercase">
                    Now Trending #{currentMovie.trendingRank}
                  </span>
                  <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {currentMovie.ratingScore}/10 ({currentMovie.voteCount})
                  </span>
                </div>
                <h3 className="text-base font-black text-white truncate">{currentMovie.title}</h3>
                <p className="text-xs text-slate-400 truncate">{currentMovie.tagline || currentMovie.genres.join(', ')}</p>
                <div className="flex items-center space-x-2 pt-1 text-[11px] text-slate-300">
                  <span>{currentMovie.languages.join(' • ')}</span>
                  <span>•</span>
                  <span>{currentMovie.formats.join(' • ')}</span>
                </div>
              </div>
            </div>

            {/* Cinema Quote */}
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 italic flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                "{CINEMA_QUOTES[quoteIndex].quote}"
                <span className="block not-italic text-[10px] text-slate-500 font-medium mt-0.5">
                  — {CINEMA_QUOTES[quoteIndex].author}
                </span>
              </div>
            </div>

            {/* City Selector on Left */}
            <div className="pt-2 flex items-center space-x-3 text-xs">
              <span className="text-slate-400 font-medium">Selecting Shows in:</span>
              <div className="flex flex-wrap gap-1.5">
                {CITIES_LIST.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onSelectCity(c)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer text-xs ${
                      selectedCity.id === c.id
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login & Access Deck */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div
              id="bms-cinematic-login-card"
              className="w-full max-w-md bg-[#0F1524]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-200 ring-1 ring-white/10"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-rose-900/40 via-red-900/30 to-[#0F1524] p-6 pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-red-600 flex items-center justify-center text-white shadow-md">
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-white">Sign In to CineWave</h2>
                      <p className="text-[11px] text-slate-400">Unlock VIP perks & instant M-Tickets</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    +₹500 Bonus
                  </span>
                </div>

                {/* Micro Perks Strip */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px]">
                  <div className="flex items-center space-x-1 text-slate-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>QuikPay 1-Click</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-300">
                    <Ticket className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Live M-Ticket</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-300">
                    <Gift className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>₹0 Conv. Fee</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Error / Success Alerts */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start space-x-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1">{errorMessage}</div>
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-start space-x-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1 font-medium">{successMessage}</div>
                  </div>
                )}

                {/* Primary Option 1: Google Fast Sign-in */}
                <button
                  id="bms-cinematic-google-btn"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center space-x-3 transition-all cursor-pointer shadow-lg shadow-white/5 active:scale-[0.99] disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-[#0F1524] px-3 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    or continue with
                  </span>
                  <div className="border-t border-slate-800 w-full" />
                </div>

                {/* Method Tabs */}
                <div className="flex p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => {
                      setAuthMethod('phone');
                      setIsOtpSent(false);
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      authMethod === 'phone'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile OTP</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthMethod('email');
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      authMethod === 'email'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email ID</span>
                  </button>
                </div>

                {/* TAB 1: Mobile Phone Number OTP */}
                {authMethod === 'phone' && (
                  <div className="space-y-3">
                    {!isOtpSent ? (
                      <form onSubmit={handleSendOtp} className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            Mobile Number
                          </label>
                          <div className="relative flex items-center">
                            <div className="absolute left-3 flex items-center space-x-1 text-xs text-slate-400 font-medium border-r border-slate-700 pr-2">
                              <span>🇮🇳</span>
                              <span>+91</span>
                            </div>
                            <input
                              id="bms-cinematic-phone-input"
                              type="tel"
                              maxLength={10}
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                              placeholder="10-digit mobile number"
                              className="w-full pl-20 pr-4 py-2.5 bg-[#161F33] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50"
                              autoFocus
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading || phoneNumber.length < 10}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-rose-600/20 disabled:opacity-50"
                        >
                          <span>{isLoading ? 'Sending OTP...' : 'Send OTP'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">
                            OTP sent to <span className="text-white font-semibold">+91 {phoneNumber}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsOtpSent(false)}
                            className="text-rose-400 hover:underline cursor-pointer font-medium"
                          >
                            Change
                          </button>
                        </div>

                        {/* 6 Digit OTP Inputs */}
                        <div className="flex items-center justify-between gap-1.5">
                          {otpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              ref={(el) => (otpInputRefs.current[idx] = el)}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              className="w-10 h-11 text-center text-lg font-black bg-[#161F33] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50"
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>
                            {otpCountdown > 0 ? (
                              <>Resend in <span className="text-rose-400 font-bold">{otpCountdown}s</span></>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setOtpCountdown(30);
                                  setSuccessMessage('Fresh OTP dispatched!');
                                }}
                                className="text-rose-400 font-bold hover:underline cursor-pointer"
                              >
                                Resend OTP
                              </button>
                            )}
                          </span>
                          <span className="text-slate-400 italic">Hint: Any 6 digits</span>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading || otpDigits.some((d) => !d)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-rose-600/20 disabled:opacity-50"
                        >
                          <span>{isLoading ? 'Verifying...' : 'Verify & Enter Cinema'}</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* TAB 2: Email & Password */}
                {authMethod === 'email' && (
                  <form onSubmit={handleEmailAuth} className="space-y-3">
                    {isSignUp && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Priya Sharma"
                            className="w-full pl-9 pr-4 py-2 bg-[#161F33] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-9 pr-4 py-2 bg-[#161F33] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full pl-9 pr-9 py-2 bg-[#161F33] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-rose-600/20 disabled:opacity-50"
                    >
                      <span>
                        {isLoading
                          ? 'Authenticating...'
                          : isSignUp
                          ? 'Create Account & Enter'
                          : 'Sign In'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center pt-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(!isSignUp);
                          setErrorMessage(null);
                        }}
                        className="text-xs text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                      >
                        {isSignUp ? (
                          <>Have an account? <span className="text-rose-400 font-bold underline">Sign In</span></>
                        ) : (
                          <>New to BookMyShow? <span className="text-rose-400 font-bold underline">Register Free</span></>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* Instant VIP Demo Access Passes */}
                <div className="pt-2 border-t border-slate-800">
                  <p className="text-[11px] text-slate-400 font-medium mb-2 text-center">
                    Instant 1-Click Fast Preview Profiles:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('VIP')}
                      className="py-2 px-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer group text-left"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-[10px] font-black text-slate-950 shrink-0 shadow">
                        PS
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-amber-300 truncate flex items-center gap-1">
                          <span>Priya VIP</span>
                          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        </div>
                        <div className="text-[9px] text-slate-400">₹1,250 QuikPay</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('Regular')}
                      className="py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer group text-left"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow">
                        RV
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-white truncate">Rahul Verma</div>
                        <div className="text-[9px] text-slate-400">Movie Buff</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Bottom Disclaimer */}
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  Protected with 256-Bit SSL encryption. By continuing, you agree to BookMyShow's{' '}
                  <span className="text-slate-400 underline">Terms of Service</span>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Bottom Features Ticker */}
      <footer className="relative z-20 w-full border-t border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md py-3 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Guaranteed Official Tickets
            </span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Zero-Convenience Fee Vouchers
            </span>
            <span className="hidden md:flex items-center gap-1 text-slate-300 font-medium">
              <Ticket className="w-3.5 h-3.5 text-rose-400" />
              M-Ticket Instant Entry at Cinema Gate
            </span>
          </div>

          <div className="text-slate-400 text-[10px]">
            Cinematic Experience © 2026 BookMyShow Entertainment Pvt. Ltd.
          </div>
        </div>
      </footer>
    </div>
  );
}
