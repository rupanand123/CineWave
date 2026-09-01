import React, { useState } from 'react';
import { BMSEvent, BMS_EVENTS, CityData } from '../../data/bmsData';
import { Calendar, MapPin, Ticket, Sparkles, Music, Laugh, Theater, Trophy } from 'lucide-react';

interface BMSEventsSectionProps {
  onBookEvent: (event: BMSEvent) => void;
  categoryFilter?: string;
  selectedCity?: CityData;
}

export function BMSEventsSection({
  onBookEvent,
  categoryFilter,
  selectedCity
}: BMSEventsSectionProps) {
  const currencySymbol = selectedCity?.currencySymbol || '₹';
  const isRupees = currencySymbol === '₹';

  const [activeTab, setActiveTab] = useState<string>(categoryFilter || 'ALL');

  const filteredEvents = BMS_EVENTS.filter((e) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'Concerts' && e.category === 'Concerts') return true;
    if (activeTab === 'Comedy' && e.category === 'Comedy') return true;
    if (activeTab === 'Plays' && e.category === 'Plays') return true;
    if (activeTab === 'Sports' && e.category === 'Sports') return true;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">Live Events, Concerts & Experiences</h2>
          </div>
          <p className="text-xs text-slate-400">
            From stadium music festivals to intimate comedy clubs and theatre productions.
          </p>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'ALL', label: 'All Live', icon: Sparkles },
            { id: 'Concerts', label: 'Music Concerts', icon: Music },
            { id: 'Comedy', label: 'Standup Comedy', icon: Laugh },
            { id: 'Plays', label: 'Theatre & Plays', icon: Theater },
            { id: 'Sports', label: 'Live Sports', icon: Trophy }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-[#182234] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-[#111726] border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Event Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Badge Category */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-rose-400 border border-slate-700">
                    {event.category}
                  </span>
                </div>

                {/* Date Chip */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-white font-bold">
                    <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{event.dateTime}</span>
                  </div>
                </div>
              </div>

              {/* Info Details */}
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1 font-medium flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>{event.venue}, {event.city}</span>
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-3 pt-3">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Starting From</span>
                <strong className="text-white font-mono text-sm">
                  {currencySymbol}{isRupees ? Math.round(event.startingPrice) : event.startingPrice.toFixed(2)}
                </strong>
              </div>

              <button
                onClick={() => onBookEvent(event)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Book Passes
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
