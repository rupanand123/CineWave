import React from 'react';
import { BookingTicketRecord, BMS_FALLBACK_POSTER } from '../../data/bmsData';
import {
  X,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface BMSMyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingTicketRecord[];
  currencySymbol?: string;
  onOpenTicketDetails: (ticket: BookingTicketRecord) => void;
}

export function BMSMyBookingsModal({
  isOpen,
  onClose,
  bookings,
  currencySymbol = '₹',
  onOpenTicketDetails
}: BMSMyBookingsModalProps) {
  if (!isOpen) return null;

  const isRupees = currencySymbol === '₹';

  const formatPrice = (amount: number) => {
    return isRupees ? `${currencySymbol}${Math.round(amount)}` : `${currencySymbol}${amount.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#111726] border border-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden text-slate-100 relative my-6">
        
        {/* Header */}
        <div className="p-5 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">My Purchase History & M-Tickets</h3>
              <p className="text-xs text-slate-400">
                You have {bookings.length} confirmed booking{bookings.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bookings List */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {bookings.length === 0 ? (
            <div className="p-12 text-center space-y-3 bg-[#0B0F19] rounded-2xl border border-slate-800">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">No Tickets Booked Yet</h4>
              <p className="text-xs text-slate-500">
                Select any movie or live event to book your seats and generate your scannable M-Ticket.
              </p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.bookingId}
                className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={b.moviePoster || BMS_FALLBACK_POSTER}
                    alt={b.movieTitle}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = BMS_FALLBACK_POSTER;
                    }}
                    className="w-16 h-22 rounded-xl object-cover border border-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-white tracking-tight">{b.movieTitle}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {b.status}
                      </span>
                    </div>

                    <p className="text-xs text-rose-400 font-medium">
                      {b.cinemaName} • <span className="text-slate-400">{b.movieFormat}</span>
                    </p>

                    <p className="text-[11px] text-slate-400">
                      {b.showDate} at <strong className="text-white font-mono">{b.showTime}</strong>
                    </p>

                    <p className="text-xs text-slate-300">
                      Seats: <strong className="text-emerald-400 font-mono">{b.seats.join(', ')}</strong> ({b.seatTier})
                    </p>
                  </div>
                </div>

                {/* Right side CTA & QR preview */}
                <div className="flex flex-row sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto gap-3 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">Paid Amount</span>
                    <strong className="text-emerald-400 font-mono text-sm font-bold">{formatPrice(b.totalPaid)}</strong>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenTicketDetails(b);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View M-Ticket</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 px-6 bg-[#0E1422] border-t border-slate-800 text-center text-xs text-slate-400">
          Present your digital M-Ticket QR code at the theater turnstile for fast contactless check-in.
        </div>

      </div>
    </div>
  );
}
