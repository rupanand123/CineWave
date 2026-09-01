import React, { useState, useEffect } from 'react';
import { BMSMovie, CinemaVenue, CinemaShowtime, FoodItem, BookingTicketRecord, CityData } from '../../data/bmsData';
import { BMSUserProfile } from '../../lib/firebase';
import {
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Wallet
} from 'lucide-react';

interface BMSCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: BMSMovie;
  venue: CinemaVenue;
  showtime: CinemaShowtime;
  selectedDate: string;
  selectedSeats: string[];
  seatTier: string;
  baseAmount: number;
  foodItems: { item: FoodItem; quantity: number }[];
  foodTotal: number;
  selectedCity?: CityData;
  userProfile?: BMSUserProfile | null;
  onPaymentSuccess: (bookingRecord: BookingTicketRecord) => void;
}

export function BMSCheckoutModal({
  isOpen,
  onClose,
  movie,
  venue,
  showtime,
  selectedDate,
  selectedSeats,
  seatTier,
  baseAmount,
  foodItems,
  foodTotal,
  selectedCity,
  userProfile,
  onPaymentSuccess
}: BMSCheckoutModalProps) {
  const currencySymbol = selectedCity?.currencySymbol || '₹';
  const isRupees = currencySymbol === '₹' || selectedCity?.currency === 'INR';

  // Form states initialized with userProfile if logged in
  const [customerName, setCustomerName] = useState(userProfile?.displayName || 'Priya Sharma');
  const [customerEmail, setCustomerEmail] = useState(userProfile?.email || 'priya.sharma@bms.vip');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phoneNumber || '+91 98200 12345');

  useEffect(() => {
    if (userProfile) {
      if (userProfile.displayName) setCustomerName(userProfile.displayName);
      if (userProfile.email) setCustomerEmail(userProfile.email);
      if (userProfile.phoneNumber) setCustomerPhone(userProfile.phoneNumber);
    }
  }, [userProfile]);

  // Coupon state
  const initialDiscount = isRupees ? 150 : 5.00;
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; desc: string } | null>({
    code: 'BMS50',
    discount: initialDiscount,
    desc: isRupees ? '₹150 Off on Tickets (BMS Welcome Offer)' : '50% Off on Tickets (BMS Welcome Offer)'
  });
  const [couponError, setCouponError] = useState<string | null>(null);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'WALLET' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('janedoe@oksbi');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Convenience Fee
  const convenienceFeePerTicket = isRupees ? 34 : 2.40;
  const totalConvenienceFee = convenienceFeePerTicket * selectedSeats.length;

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, baseAmount + foodTotal + totalConvenienceFee - discountAmount);

  const formatPrice = (amount: number) => {
    return isRupees ? `${currencySymbol}${Math.round(amount)}` : `${currencySymbol}${amount.toFixed(2)}`;
  };

  const handleApplyCoupon = () => {
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();

    if (code === 'BMS50' || code === 'BMSBOGO') {
      const discount = isRupees ? 200 : 6.00;
      setAppliedCoupon({ code, discount, desc: 'Buy 1 Get 1 / 50% Special Discount Applied' });
    } else if (code === 'SUPERSTAR') {
      setAppliedCoupon({ code, discount: totalConvenienceFee, desc: 'Superstar Member: 100% Free Convenience Fee' });
    } else if (code === 'ICICIFEST') {
      const discount = isRupees ? 120 : 4.50;
      setAppliedCoupon({ code, discount, desc: 'ICICI Bank 20% Weekend Cashback' });
    } else if (code === 'CINEPASS') {
      const discount = isRupees ? 100 : 3.00;
      setAppliedCoupon({ code, discount, desc: `CinePass ${currencySymbol}${discount} Instant Discount` });
    } else {
      setCouponError('Invalid coupon code. Try BMS50, SUPERSTAR, or ICICIFEST');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const newBookingId = `BMS-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newBookingRecord: BookingTicketRecord = {
        bookingId: newBookingId,
        bookingTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
        movieTitle: movie.title,
        moviePoster: movie.posterUrl,
        movieLanguage: movie.languages[0],
        movieFormat: showtime.format,
        cinemaName: venue.name,
        cinemaLocation: venue.location,
        audiNumber: 'Audi 2 (Dolby Atmos & Laser)',
        showDate: selectedDate,
        showTime: showtime.time,
        seats: selectedSeats,
        seatTier: seatTier,
        ticketCount: selectedSeats.length,
        baseAmount: baseAmount,
        convenienceFee: totalConvenienceFee,
        foodAmount: foodTotal,
        discountAmount: discountAmount,
        totalPaid: grandTotal,
        foodItems: foodItems.map((f) => ({
          name: f.item.name,
          quantity: f.quantity,
          price: f.item.price
        })),
        customerName: customerName || 'Jane Doe',
        customerEmail: customerEmail || 'jane.doe@example.com',
        customerPhone: customerPhone || '+91 98765 43210',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${newBookingId}-${movie.title.replace(/\s+/g, '')}-${selectedSeats.join('')}`,
        status: 'CONFIRMED'
      };

      onPaymentSuccess(newBookingRecord);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#111726] border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden text-slate-100 relative my-6">
        
        {/* Header */}
        <div className="p-5 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Order Summary & Instant Checkout</h3>
              <p className="text-xs text-slate-400">256-bit SSL Encrypted Booking Session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* Left Column: Customer Details & Payment Options (7 cols) */}
          <div className="lg:col-span-7 p-6 space-y-6">
            
            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Contact Details (For M-Ticket Delivery)</span>
                <span className="text-[10px] text-emerald-400 font-mono">SMS & WhatsApp Active</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 bg-[#0B0F19] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2.5 bg-[#0B0F19] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">Mobile Phone Number</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#0B0F19] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Choose Payment Method
              </h4>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: 'UPI (GPay/PhonePe)', icon: Smartphone },
                  { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
                  { id: 'WALLET', label: 'BMS Wallet', icon: Tag },
                  { id: 'NETBANKING', label: 'Net Banking', icon: ShieldCheck }
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${
                        isSelected
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-md shadow-rose-500/10 font-bold'
                          : 'bg-[#0B0F19] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] leading-tight">{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Payment Fields according to choice */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Enter UPI ID / VPA</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Instant QR or Collect Request</span>
                  </div>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobileNumber@upi or username@okaxis"
                    className="w-full p-2.5 bg-[#141B2D] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
                  />
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Supports Google Pay, PhonePe, Paytm, BHIM & All Major Indian Banks</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2.5 bg-[#141B2D] border border-slate-700 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2.5 bg-[#141B2D] border border-slate-700 rounded-xl text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-2.5 bg-[#141B2D] border border-slate-700 rounded-xl text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'WALLET' && (
                <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      BookMyShow QuikPay Wallet:
                    </span>
                    <strong className="text-emerald-400 font-mono text-sm">
                      {formatPrice(userProfile?.quikPayBalance ?? (isRupees ? 500 : 25.00))}
                    </strong>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {(userProfile?.quikPayBalance ?? 500) >= grandTotal
                      ? '✓ Sufficient QuikPay funds available. Instant 1-click booking without bank OTP delays.'
                      : '⚠️ QuikPay balance is less than total. Balance will be applied, remaining via UPI/Card.'}
                  </p>
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs space-y-2">
                  <span className="text-[11px] text-slate-400 block">Popular Banks:</span>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <button className="p-2 rounded-lg bg-[#141B2D] border border-slate-700 text-slate-200">HDFC Bank</button>
                    <button className="p-2 rounded-lg bg-[#141B2D] border border-slate-700 text-slate-200">ICICI Bank</button>
                    <button className="p-2 rounded-lg bg-[#141B2D] border border-slate-700 text-slate-200">SBI</button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Bill Breakdown & Promo Code (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-[#0E1422] space-y-6 flex flex-col justify-between">
            
            <div className="space-y-4">
              {/* Movie & Cinema Capsule */}
              <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800 space-y-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-12 h-16 rounded-lg object-cover border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{movie.title}</h4>
                    <p className="text-[11px] text-slate-400">{showtime.format} • {movie.languages[0]}</p>
                    <p className="text-[11px] text-rose-400 font-medium truncate">{venue.name}</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 font-mono bg-[#0B0F19] p-2 rounded-lg border border-slate-800 flex justify-between">
                  <span>{selectedDate}</span>
                  <span className="text-amber-400 font-bold">{showtime.time}</span>
                </div>
              </div>

              {/* Promo / Coupon Box */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Have a Promo Code / Voucher?
                </label>

                {appliedCoupon ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-400 uppercase tracking-wider font-mono">{appliedCoupon.code}</span>
                      <p className="text-[10px] text-slate-300">{appliedCoupon.desc}</p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try BMS50 or SUPERSTAR"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 p-2 bg-[#0B0F19] border border-slate-700 rounded-xl text-white text-xs font-mono uppercase focus:outline-none focus:border-rose-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-[10px] text-rose-400 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{couponError}</span>
                  </p>
                )}
              </div>

              {/* Price Calculation Bill */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Tickets ({selectedSeats.length}x • {selectedSeats.join(', ')})</span>
                  <span className="font-mono">{formatPrice(baseAmount)}</span>
                </div>

                {foodTotal > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Food & Beverage ({foodItems.length} items)</span>
                    <span className="font-mono">{formatPrice(foodTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Convenience Fee & GST (18%)</span>
                  <span className="font-mono">{formatPrice(totalConvenienceFee)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon Discount</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                  <span>Total Payable Amount</span>
                  <span className="text-emerald-400 font-mono text-base">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div className="space-y-2 pt-4">
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-xl shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] cursor-pointer"
              >
                {isProcessing ? (
                  <span>Securing Tickets & Authorizing Payment...</span>
                ) : (
                  <>
                    <span>Pay {formatPrice(grandTotal)} & Get M-Ticket</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Safe & Secure Transaction • Guaranteed Cinema Entry</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
