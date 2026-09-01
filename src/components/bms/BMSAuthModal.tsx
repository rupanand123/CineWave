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
import {
  X,
  Smartphone,
  Mail,
  Lock,
  User,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Ticket,
  Film,
  Zap,
  Gift,
  Eye,
  EyeOff
} from 'lucide-react';

interface BMSAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: BMSUserProfile) => void;
  initialMode?: 'phone' | 'email' | 'google';
}

export function BMSAuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'phone'
}: BMSAuthModalProps) {
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

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpSent && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, otpCountdown]);

  if (!isOpen) return null;

  // Handle Google Sign-in with Firebase
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const profile = await authenticateWithGoogle();
      setSuccessMessage(`Welcome back, ${profile.displayName || 'Movie Buff'}!`);
      setTimeout(() => {
        onAuthSuccess(profile);
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.message?.includes('closed')) {
        setErrorMessage('Sign-in cancelled. Please try again.');
      } else {
        setErrorMessage(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Send Phone OTP
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
      // Auto fill first box
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }, 600);
  };

  // Handle OTP digit input
  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Pasted full OTP
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

  // Verify Phone OTP & Sign in
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setErrorMessage('Please enter the 6-digit OTP sent to your phone.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const profile = await authenticateWithPhoneOTP(phoneNumber);
      setSuccessMessage('Mobile number verified successfully!');
      setTimeout(() => {
        onAuthSuccess(profile);
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('OTP Verification Error:', err);
      setErrorMessage('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Email & Password Auth
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in all email and password fields.');
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
        setSuccessMessage('Account created successfully! Welcome to BookMyShow.');
        setTimeout(() => {
          onAuthSuccess(profile);
          onClose();
        }, 700);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const profile = await syncUserProfile(cred.user);
        setSuccessMessage(`Welcome back, ${profile.displayName || 'Movie Buff'}!`);
        setTimeout(() => {
          onAuthSuccess(profile);
          onClose();
        }, 700);
      }
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setErrorMessage('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('An account already exists with this email. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('Password should be at least 6 characters long.');
      } else {
        setErrorMessage(err.message || 'Authentication failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Demo Fast Login
  const handleDemoLogin = async (role: 'VIP' | 'Regular') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const profile = await authenticateWithDemoProfile(role);
      setSuccessMessage(`Signed in as ${profile.displayName}!`);
      setTimeout(() => {
        onAuthSuccess(profile);
        onClose();
      }, 600);
    } catch (err: any) {
      console.error('Demo Login Error:', err);
      setErrorMessage('Could not initialize demo session.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="bms-auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="bms-auth-modal-card"
        className="relative w-full max-w-md bg-[#0F1524] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-rose-900/40 via-red-900/30 to-[#0F1524] p-6 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
              <Ticket className="w-5 h-5 fill-white stroke-none" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Cine<span className="text-rose-500">Wave</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  Passport
                </span>
              </h2>
              <p className="text-xs text-slate-400">Your single ticket to entertainment</p>
            </div>
          </div>

          {/* Benefits Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px]">
            <div className="flex items-center space-x-1 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>QuikPay 1-Click</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-300">
              <Film className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>M-Tickets</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-300">
              <Gift className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>₹500 Bonus</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 pt-5 space-y-5">
          {/* Notifications / Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          {/* Primary Action 1: Google Sign-in */}
          <button
            id="bms-google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center justify-center space-x-3 transition-all cursor-pointer shadow-md shadow-white/5 active:scale-[0.99] disabled:opacity-50"
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
            <span className="bg-[#0F1524] px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              or continue with
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          {/* Method Selector Tabs */}
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
              <span>Email / Password</span>
            </button>
          </div>

          {/* Form Content: Mobile OTP Flow */}
          {authMethod === 'phone' && (
            <div className="space-y-4">
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
                        id="bms-phone-input"
                        type="tel"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 10-digit number"
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
                <form onSubmit={handleVerifyOtp} className="space-y-4">
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
                  <div className="flex items-center justify-between gap-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-12 text-center text-lg font-black bg-[#161F33] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {otpCountdown > 0 ? (
                        <>Resend OTP in <span className="text-rose-400 font-bold">{otpCountdown}s</span></>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setOtpCountdown(30);
                            setSuccessMessage('A fresh OTP has been sent!');
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
                    <span>{isLoading ? 'Verifying...' : 'Verify & Continue'}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Form Content: Email & Password */}
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
                    ? 'Create Free BMS Account'
                    : 'Sign In to BookMyShow'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMessage(null);
                  }}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                >
                  {isSignUp ? (
                    <>Already have an account? <span className="text-rose-400 font-bold underline">Sign In</span></>
                  ) : (
                    <>Don't have an account? <span className="text-rose-400 font-bold underline">Register Free</span></>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Access Bar */}
          <div className="pt-2 border-t border-slate-800">
            <p className="text-[11px] text-slate-400 font-medium mb-2 text-center">
              Quick 1-Click Instant Preview:
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

          {/* Footer Terms */}
          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            I agree to the <span className="text-slate-400 underline">Terms & Conditions</span> &{' '}
            <span className="text-slate-400 underline">Privacy Policy</span>. Protected with 256-bit encryption.
          </p>
        </div>
      </div>
    </div>
  );
}
