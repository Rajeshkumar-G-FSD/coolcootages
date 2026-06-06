/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Booking, Experience } from "../types";
import { Briefcase, Calendar, CheckCircle, Mail, MapPin, Receipt, Trash, User, Sparkles } from "lucide-react";

interface BookingsTabProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onExploreRooms: () => void;
}

export default function BookingsTab({
  bookings,
  onCancelBooking,
  onExploreRooms,
}: BookingsTabProps) {
  
  const handleCancelClick = (id: string) => {
    if (confirm("Are you absolutely sure you wish to cancel this stay reservation? Cancellations are immediate.")) {
      onCancelBooking(id);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="py-28 bg-[#f8f9ff]">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-[#e5eeff] dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-[#001a52] dark:text-[#dbe1ff]" />
          </div>
          <h3 className="font-headline-lg text-xl md:text-2xl text-[#001a52] mb-3">
            No Active Stay Reservations
          </h3>
          <p className="font-sans text-xs md:text-sm text-slate-500 leading-relaxed mb-8">
            Your personal reservation book is currently empty. Explore our exquisite private island villa portfolio or custom packages to reserve your South Pacific sanctuary.
          </p>
          <button
            onClick={onExploreRooms}
            className="w-full bg-[#001a52] hover:bg-[#0e2f76] text-white py-3 rounded-lg font-sans text-xs uppercase tracking-widest font-black transition-all btn-glow cursor-pointer"
          >
            Explore Villas Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-[#f8f9ff]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tab Intro */}
        <div className="text-center md:text-left mb-12 border-b pb-6 border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="font-headline-lg text-2xl md:text-4xl text-[#001a52] mb-2 font-medium">
              Stay Reservations Ledger
            </h2>
            <p className="font-sans text-xs md:text-sm text-slate-400">
              Review guest billing lists, pre-ordered butler curations, or coordinate program changes.
            </p>
          </div>
          <span className="px-3.5 py-1.5 text-[10px] uppercase tracking-widest bg-emerald-50 text-emerald-600 font-extrabold rounded-lg border border-emerald-100">
            {bookings.length} Active holds Secured
          </span>
        </div>

        {/* Bookings Stack */}
        <div className="space-y-10">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-slate-100 flex flex-col gap-6"
            >
              {/* Card Header stats */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 border-slate-200/40 gap-3">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-slate-100 text-[#001a52] font-mono text-[10px] font-bold rounded">
                    CODE: {booking.id}
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-sans font-bold text-slate-500 uppercase">
                    <Receipt className="w-3.5 h-3.5 text-slate-400" />
                    Confirmed Stay Reservation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span className="font-sans text-xs font-bold text-emerald-600">Reserved hold</span>
                </div>
              </div>

              {/* Card Core Details */}
              <div className="grid md:grid-cols-5 gap-6">
                
                {/* Visual thumbnail & title - Col 1 */}
                <div className="md:col-span-2">
                  <div className="h-36 md:h-full rounded-xl overflow-hidden relative shadow">
                    <img
                      src={booking.room.imageUrl}
                      alt={booking.room.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="font-sans text-[8px] uppercase tracking-widest text-slate-200 block">
                        Selected Suite
                      </span>
                      <h4 className="font-headline-md text-sm font-semibold">{booking.room.name}</h4>
                    </div>
                  </div>
                </div>

                {/* Stay metrics & contact specs - Col 2 */}
                <div className="md:col-span-3 text-left space-y-4">
                  
                  {/* Grid details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-sans text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                        Staying Span ({booking.nightsNum} Nights)
                      </span>
                      <p className="font-sans text-xs text-slate-700 font-semibold flex items-center gap-1.5 border p-2 bg-slate-50 rounded">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{booking.checkIn} — {booking.checkOut}</span>
                      </p>
                    </div>

                    <div>
                      <span className="font-sans text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                        Stay Capacity Holds
                      </span>
                      <p className="font-sans text-xs text-slate-700 font-semibold border p-2 bg-slate-50 rounded">
                        {booking.guestsText}
                      </p>
                    </div>
                  </div>

                  {/* Customer Registry list */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-sans text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                        Billing Registry Guest
                      </span>
                      <p className="font-sans text-xs text-slate-600 font-semibold flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.billingName}</span>
                      </p>
                    </div>
                    <div>
                      <span className="font-sans text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                        Contact Dispatcher Registry
                      </span>
                      <p className="font-sans text-xs text-slate-600 font-semibold flex items-center gap-1.5 truncate" title={booking.billingEmail}>
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.billingEmail}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customized active experiences lists */}
              {booking.selectedExperiences.length > 0 && (
                <div className="text-left border-t pt-4 border-slate-200/40">
                  <h5 className="font-sans text-[10px] uppercase font-extrabold tracking-widest text-[#4a607c] mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Included Bespoke Curations</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {booking.selectedExperiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600"
                      >
                        <div className="font-sans font-semibold pl-1">✦ {exp.name}</div>
                        <span className="font-sans font-extrabold text-slate-400">
                          ${exp.cost.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special instructions display */}
              {booking.specialRequests && (
                <div className="p-3 bg-[#efe4d9]/10 rounded-lg border border-[#efe4d9]/50 text-left text-xs font-sans text-slate-600 text-slate-500">
                  <span className="font-semibold block text-[10px] uppercase tracking-wider text-slate-400">Special requests:</span>
                  <p className="italic font-medium">"{booking.specialRequests}"</p>
                </div>
              )}

              {/* Card Footer actions holds invoice totals */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t pt-4 border-slate-200/40 gap-4 mt-2">
                <main className="text-left">
                  <span className="font-sans text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
                    Inclusive Stay Invoice
                  </span>
                  <div className="font-headline-lg text-2xl font-black text-[#001a52]">
                    ${booking.totalCost.toLocaleString()}
                  </div>
                </main>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleCancelClick(booking.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-500 rounded-lg font-sans text-xs uppercase tracking-wider font-extrabold transition-colors cursor-pointer"
                  >
                    <Trash className="w-3.5 h-3.5" />
                    <span>Cancel hold</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
