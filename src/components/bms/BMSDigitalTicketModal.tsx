import React, { useState } from 'react';
import { BookingTicketRecord, BMS_FALLBACK_POSTER } from '../../data/bmsData';
import {
  X,
  QrCode,
  CheckCircle2,
  Share2,
  Download,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  UtensilsCrossed,
  Sparkles,
  Smartphone,
  AlertTriangle
} from 'lucide-react';

interface BMSDigitalTicketModalProps {
  ticket: BookingTicketRecord | null;
  currencySymbol?: string;
  onClose: () => void;
  onCancelBooking?: (bookingId: string) => void;
}

export function BMSDigitalTicketModal({
  ticket,
  currencySymbol = '₹',
  onClose,
  onCancelBooking
}: BMSDigitalTicketModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!ticket) return null;

  const isRupees = currencySymbol === '₹';

  const formatPrice = (amount: number) => {
    return isRupees ? `${currencySymbol}${Math.round(amount)}` : `${currencySymbol}${amount.toFixed(2)}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Movie: ${ticket.movieTitle}\nVenue: ${ticket.cinemaName}\nShowtime: ${ticket.showDate} at ${ticket.showTime}\nSeats: ${ticket.seats.join(', ')}\nBooking ID: ${ticket.bookingId}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative my-6">
        
        {/* Ticket Container with Notch Cutouts */}
        <div className="bg-[#111726] border border-slate-800 text-slate-100 rounded-3xl shadow-2xl relative overflow-hidden">
          
          {/* Confirmed Success Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 px-6 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-6 h-6 fill-white text-emerald-600" />
              <div>
                <h3 className="text-sm font-black tracking-wide uppercase">Booking Confirmed!</h3>
                <p className="text-[11px] text-emerald-100 font-mono">Ref: {ticket.bookingId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Movie Banner & Info Card */}
          <div className="p-6 space-y-4">
            <div className="flex gap-4 items-start">
              <img
                src={ticket.moviePoster || BMS_FALLBACK_POSTER}
                alt={ticket.movieTitle}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = BMS_FALLBACK_POSTER;
                }}
                className="w-20 h-28 rounded-xl object-cover shadow-lg border border-slate-700 shrink-0"
                referrerPolicy="no-referrer"
              />

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono">
                    {ticket.movieFormat}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {ticket.movieLanguage}
                  </span>
                </div>

                <h2 className="text-lg font-black text-white tracking-tight leading-tight">
                  {ticket.movieTitle}
                </h2>

                <p className="text-xs text-rose-400 font-bold">
                  {ticket.cinemaName}
                </p>
                <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>{ticket.cinemaLocation}</span>
                </p>
                <p className="text-[11px] text-purple-300 font-medium font-mono">
                  {ticket.audiNumber}
                </p>
              </div>
            </div>

            {/* Time & Seat Information Card */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#0B0F19] border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Date & Show</span>
                <strong className="text-white font-bold block">{ticket.showDate}</strong>
                <span className="text-rose-400 font-bold font-mono text-sm">{ticket.showTime}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Seats ({ticket.ticketCount})</span>
                <strong className="text-emerald-400 font-mono text-base font-black block">
                  {ticket.seats.join(', ')}
                </strong>
                <span className="text-[10px] text-slate-400 font-medium">{ticket.seatTier}</span>
              </div>
            </div>
          </div>

          {/* Perforated Divider Strip with Circular Cutouts */}
          <div className="relative py-2 flex items-center justify-center">
            {/* Left Circular Cutout */}
            <div className="absolute -left-4 w-8 h-8 rounded-full bg-black border-r border-slate-800" />
            
            {/* Dashed Line */}
            <div className="w-full border-t-2 border-dashed border-slate-700/80 mx-6" />

            {/* Right Circular Cutout */}
            <div className="absolute -right-4 w-8 h-8 rounded-full bg-black border-l border-slate-800" />
          </div>

          {/* QR Code & Scan Instructions */}
          <div className="p-6 pt-2 space-y-4 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-2xl bg-white shadow-xl">
                <img
                  src={ticket.qrCodeUrl}
                  alt="M-Ticket Scannable QR"
                  className="w-36 h-36 object-contain"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Scan this M-Ticket QR at the cinema turnstile for instant contactless entry.
              </p>
            </div>

            {/* F&B Inclusions if any */}
            {ticket.foodItems && ticket.foodItems.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left text-xs space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Pre-Ordered Concessions (Collect at Express Counter)</span>
                </span>
                <div className="space-y-1 text-slate-300">
                  {ticket.foodItems.map((f, i) => (
                    <div key={i} className="flex justify-between text-[11px]">
                      <span>{f.quantity}x {f.name}</span>
                      <span className="font-mono text-slate-400">{formatPrice(f.price * f.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Paid Pill */}
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs">
              <span className="text-slate-400">Total Amount Paid</span>
              <strong className="text-emerald-400 font-mono text-base">{formatPrice(ticket.totalPaid)}</strong>
            </div>

            {/* Actions: Share, Download, Add to Wallet */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleShare}
                className="p-3 rounded-xl bg-[#182234] hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-rose-400" />
                <span>{copied ? 'Details Copied!' : 'Share M-Ticket'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="p-3 rounded-xl bg-[#182234] hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>{downloadSuccess ? 'Ticket Saved!' : 'Download PDF'}</span>
              </button>
            </div>

            {/* Free Cancellation Option */}
            {onCancelBooking && (
              <div className="pt-2 border-t border-slate-800/80">
                {!showCancelConfirm ? (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                  >
                    Need to cancel? Free cancellation available up to 2 hours before showtime
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-2">
                    <p className="text-rose-300 text-[11px]">
                      Are you sure you want to cancel this booking? A 100% refund of {formatPrice(ticket.totalPaid)} will be initiated to your source payment account.
                    </p>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowCancelConfirm(false)}
                        className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs cursor-pointer"
                      >
                        Keep Booking
                      </button>
                      <button
                        onClick={() => {
                          onCancelBooking(ticket.bookingId);
                          onClose();
                        }}
                        className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Confirm Cancellation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
