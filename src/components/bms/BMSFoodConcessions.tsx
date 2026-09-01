import React, { useState } from 'react';
import { FoodItem, FOOD_MENU, BMSMovie, CinemaVenue, CinemaShowtime, CityData } from '../../data/bmsData';
import {
  UtensilsCrossed,
  Plus,
  Minus,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Flame,
  Check,
  ShoppingBag
} from 'lucide-react';

interface BMSFoodConcessionsProps {
  movie: BMSMovie;
  venue: CinemaVenue;
  showtime: CinemaShowtime;
  selectedSeats: string[];
  seatTier: string;
  baseAmount: number;
  selectedCity?: CityData;
  onBackToSeats: () => void;
  onProceedToCheckout: (cartItems: { item: FoodItem; quantity: number }[], foodTotal: number) => void;
}

export function BMSFoodConcessions({
  movie,
  venue,
  showtime,
  selectedSeats,
  seatTier,
  baseAmount,
  selectedCity,
  onBackToSeats,
  onProceedToCheckout
}: BMSFoodConcessionsProps) {
  const currencySymbol = selectedCity?.currencySymbol || '₹';
  const isRupees = currencySymbol === '₹' || selectedCity?.currency === 'INR';

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<{ [id: string]: number }>({
    'fnb-combo-duo': 1 // Pre-suggest 1 combo
  });

  const categories = ['All', 'Combos', 'Popcorn', 'Snacks', 'Beverages'];

  const filteredItems = FOOD_MENU.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleAdd = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleRemove = (id: string) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  // Calculate totals
  const foodTotal = Object.entries(cart).reduce<number>((total, [id, qty]) => {
    const item = FOOD_MENU.find((f) => f.id === id);
    return total + (item ? item.price * Number(qty) : 0);
  }, 0);

  const cartItemCount = Object.values(cart).reduce<number>((a, b) => a + Number(b), 0);

  const handleContinue = () => {
    const cartItems = Object.entries(cart)
      .map(([id, quantity]) => {
        const item = FOOD_MENU.find((f) => f.id === id);
        return item ? { item, quantity } : null;
      })
      .filter((entry): entry is { item: FoodItem; quantity: number } => entry !== null);

    onProceedToCheckout(cartItems, foodTotal);
  };

  const formatPrice = (amount: number) => {
    return isRupees ? `${currencySymbol}${Math.round(amount)}` : `${currencySymbol}${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToSeats}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center justify-center cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-black text-white">Grab a Bite!</h2>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Save up to 15% with combos</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Fresh hot snacks delivered right to your seat • {venue.name}
            </p>
          </div>
        </div>

        {/* Selected Seats Badge */}
        <div className="flex items-center space-x-3 self-end md:self-auto bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400">Seats:</span>
          <span className="text-emerald-400 font-mono font-bold">{selectedSeats.join(', ')}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-mono">{formatPrice(baseAmount)}</span>
        </div>
      </div>

      {/* Food Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-[#111726] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Item Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const qty = cart[item.id] || 0;
          return (
            <div
              key={item.id}
              className="bg-[#111726] border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="p-4 flex gap-4 items-start">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <span className={`w-3 h-3 rounded-sm border flex items-center justify-center ${
                      item.isVeg ? 'border-emerald-500' : 'border-rose-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.calories} kcal</span>
                  </div>

                  <h3 className="text-xs font-bold text-white line-clamp-1">{item.name}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                  
                  <div className="text-sm font-bold text-white font-mono pt-1">
                    {formatPrice(item.price)}
                  </div>
                </div>
              </div>

              {/* Add / Modify Button Footer */}
              <div className="p-3 bg-[#0B0F19] border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Delivered to your seat</span>
                {qty === 0 ? (
                  <button
                    onClick={() => handleAdd(item.id)}
                    className="px-4 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    + Add
                  </button>
                ) : (
                  <div className="flex items-center space-x-2 bg-rose-600 text-white rounded-lg p-1 px-2 shadow-md">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="w-5 h-5 rounded flex items-center justify-center hover:bg-rose-700 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold font-mono px-1">{qty}</span>
                    <button
                      onClick={() => handleAdd(item.id)}
                      className="w-5 h-5 rounded flex items-center justify-center hover:bg-rose-700 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Order Bar */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-30">
        <div className="space-y-1 w-full sm:w-auto">
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-400">Seats ({selectedSeats.length}): <strong className="text-white">{selectedSeats.join(', ')}</strong></span>
            <span>•</span>
            <span className="text-slate-400">Food Items: <strong className="text-amber-400">{cartItemCount}</strong></span>
          </div>

          <p className="text-xs text-slate-300">
            Tickets ({formatPrice(baseAmount)}) + F&B ({formatPrice(foodTotal)}) = <strong className="text-emerald-400 font-mono font-bold text-sm">{formatPrice(baseAmount + foodTotal)}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => onProceedToCheckout([], 0)}
            className="w-1/2 sm:w-auto px-5 py-3 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold tracking-wider cursor-pointer"
          >
            Skip Food
          </button>

          <button
            onClick={handleContinue}
            className="w-1/2 sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
