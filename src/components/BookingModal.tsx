/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, Calendar, Users, Briefcase, Plus, Check, DollarSign, Sparkles, Send } from "lucide-react";
import { Room, Experience, Booking, SpecialPackage } from "../types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  experiences: Experience[];
  selectedRoom: Room;
  selectedExperiences: Experience[];
  prefilledCheckIn?: string;
  prefilledCheckOut?: string;
  prefilledGuests?: string;
  activePackage?: SpecialPackage | null;
  onConfirmBooking: (booking: Booking) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  rooms,
  experiences,
  selectedRoom,
  selectedExperiences,
  prefilledCheckIn = "",
  prefilledCheckOut = "",
  prefilledGuests = "2 Adults, 0 Children",
  activePackage = null,
  onConfirmBooking,
}: BookingModalProps) {
  const [room, setRoom] = useState<Room>(selectedRoom);
  const [checkIn, setCheckIn] = useState(prefilledCheckIn);
  const [checkOut, setCheckOut] = useState(prefilledCheckOut);
  const [guests, setGuests] = useState(prefilledGuests);
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [addedExps, setAddedExps] = useState<Experience[]>([]);

  // Sync state if props change when opening the modal
  useEffect(() => {
    setRoom(selectedRoom);
    setAddedExps(selectedExperiences);
  }, [selectedRoom, selectedExperiences, isOpen]);

  useEffect(() => {
    if (prefilledCheckIn) setCheckIn(prefilledCheckIn);
    if (prefilledCheckOut) setCheckOut(prefilledCheckOut);
    if (prefilledGuests) setGuests(prefilledGuests);
  }, [prefilledCheckIn, prefilledCheckOut, prefilledGuests]);

  if (!isOpen) return null;

  // Calculate nights
  let nights = 1;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    if (timeDiff > 0) {
      nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
  }

  // Cost estimates
  const baseRoomCost = room.ratePerNight * nights;
  const expsCost = addedExps.reduce((acc, curr) => acc + curr.cost, 0);
  const rawSubtotal = baseRoomCost + expsCost;

  // Packet discount
  let packageDiscount = 0;
  if (activePackage) {
    packageDiscount = Math.round(rawSubtotal * (1 - activePackage.costMultiplier));
  }
  const finalTotal = rawSubtotal - packageDiscount;

  const handleToggleExp = (exp: Experience) => {
    if (addedExps.some((e) => e.id === exp.id)) {
      setAddedExps((prev) => prev.filter((e) => e.id !== exp.id));
    } else {
      setAddedExps((prev) => [...prev, exp]);
    }
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billingName.trim() || !billingEmail.trim()) {
      alert("Please provide guest contact name and email address.");
      return;
    }
    if (!checkIn || !checkOut) {
      alert("Please designate reservation stay dates.");
      return;
    }

    const booking: Booking = {
      id: "LUM-" + Math.floor(100000 + Math.random() * 900000),
      room,
      checkIn,
      checkOut,
      guestsText: guests,
      nightsNum: nights,
      totalCost: finalTotal,
      createdTime: new Date().toLocaleDateString(),
      status: "Confirmed",
      selectedExperiences: addedExps,
      specialRequests: specialRequests.trim() || undefined,
      billingName: billingName.trim(),
      billingEmail: billingEmail.trim(),
    };

    onConfirmBooking(booking);
    onClose();

    // Small prompt success alerting
    alert(`Thank you! Stay Reservation secured successfully. Code: ${booking.id}`);
  };

  return (
    <div className="fixed inset-0 bg-[#001a52]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#213145] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col animate-fade-in-up border border-[#001a52]/10 dark:border-white/10">
        
        {/* Modal Header */}
        <header className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-[#f8f9ff] dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-headline-lg text-lg text-[#001a52] dark:text-[#dbe1ff] font-bold">
                Cool Cottages stay Reservation setup
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#4a607c]">
                Aspirational Quiet luxury
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#001a52]/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-[#001a52] dark:text-slate-400" />
          </button>
        </header>

        {/* Modal Form Content */}
        <form onSubmit={handleConfirm} className="flex-1 p-6 grid md:grid-cols-2 gap-8 text-left">
          
          {/* Column 1 - Staying Specifications */}
          <div className="space-y-5">
            <h4 className="font-sans text-[10px] uppercase tracking-widest text-slate-400 font-extrabold pb-1 border-b">
              Stay & Room Setup
            </h4>

            {/* Room Type Switcher Option */}
            <div>
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 mb-2">
                Preferred Villa Suite
              </label>
              <select
                value={room.id}
                onChange={(e) => {
                  const matched = rooms.find((r) => r.id === e.target.value);
                  if (matched) setRoom(matched);
                }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/65 dark:border-white/10 rounded-lg py-2.5 px-3 text-xs md:text-sm text-slate-700 dark:text-slate-200 font-medium"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — ${r.ratePerNight.toLocaleString()}/night
                  </option>
                ))}
              </select>
            </div>

            {/* Stay Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Check-In
                </label>
                <input
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/65 dark:border-white/10 rounded-lg py-2.5 px-3 text-xs md:text-sm text-slate-700 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Check-Out
                </label>
                <input
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/65 dark:border-white/10 rounded-lg py-2.5 px-3 text-xs md:text-sm text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Guests text */}
            <div>
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 mb-1">
                Guest Capacity details
              </label>
              <input
                type="text"
                required
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="e.g. 2 Adults, 0 Children"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/65 dark:border-white/10 rounded-lg py-2.5 px-3 text-xs md:text-sm text-slate-700 dark:text-slate-200 font-medium"
              />
            </div>

            {/* Bespoke experiences curation box */}
            <div>
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Include Elite Custom Curations
              </label>
              <div className="space-y-2">
                {experiences.map((exp) => {
                  const isChecked = addedExps.some((e) => e.id === exp.id);
                  return (
                    <div
                      key={exp.id}
                      onClick={() => handleToggleExp(exp)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? "bg-[#e5eeff] dark:bg-white/10 border-[#abbbde] font-bold text-[#001a52]"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200/65 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="rounded border-slate-300 text-[#001a52] focus:ring-[#001a52]/45 pointer-events-none"
                        />
                        <span>{exp.name}</span>
                      </div>
                      <span className="font-sans font-bold text-slate-500">
                        +${exp.cost.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2 - Billing & Estimates */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h4 className="font-sans text-[10px] uppercase tracking-widest text-slate-400 font-extrabold pb-1 border-b">
                Guest Registry billing details
              </h4>

              {/* Billing Contact Name */}
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Full Guest Name
                </label>
                <input
                  type="text"
                  required
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  placeholder="e.g. Jonathan Mercer"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/65 dark:border-white/10 rounded-lg py-2.5 px-3 text-xs md:text-sm text-slate-700 dark:text-slate-200"
                />
              </div>

              {/* Billing Contact Email */}
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Preferred Contact Email
                </label>
                <input
                  type="email"
                  required
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  placeholder="e.g. j.mercer@regalseas.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/65 dark:border-white/10 rounded-lg py-2.5 px-3 text-xs md:text-sm text-slate-700 dark:text-slate-200"
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#4a607c] mb-2">
                  Special Requests (dietary, private charter setups)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Inquire about custom room cooling, special diets, private jet arrival links..."
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/65 dark:border-white/10 rounded-lg py-2 px-3 text-xs md:text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Estimated Cost breakdown details invoices */}
            <div className="bg-[#f8f9ff] dark:bg-slate-900 rounded-xl p-4 md:p-5 border border-slate-200/40 text-xs text-slate-600 dark:text-slate-300 space-y-2.5 shadow-inner">
              <h5 className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#001a52]/80 mb-2">
                Stay Pricing breakdown
              </h5>

              <main className="flex justify-between">
                <span>
                  {room.name} ({nights} Nights)
                </span>
                <span className="font-sans font-bold">${baseRoomCost.toLocaleString()}</span>
              </main>

              {addedExps.length > 0 && (
                <main className="flex justify-between border-b pb-2 border-slate-200/40">
                  <span>Elite Curations Inclusions ({addedExps.length})</span>
                  <span className="font-sans font-bold">${expsCost.toLocaleString()}</span>
                </main>
              )}

              {packageDiscount > 0 && (
                <main className="flex justify-between text-emerald-500 font-semibold border-b pb-2 border-slate-200/40">
                  <span>Exclusive Bundle Reduction ({activePackage?.name})</span>
                  <span className="font-sans font-bold">-${packageDiscount.toLocaleString()}</span>
                </main>
              )}

              <footer className="flex justify-between items-baseline pt-2 text-[#001a52] dark:text-[#dbe1ff]">
                <span className="font-sans uppercase text-sm tracking-wide font-extrabold">Combined Total</span>
                <div className="font-headline-md text-2xl font-black">
                  ${finalTotal.toLocaleString()}
                </div>
              </footer>
            </div>

            {/* Action controls button triggers */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 border border-[#4a607c] hover:bg-slate-50 dark:hover:bg-slate-800 text-[#4a607c] rounded-lg font-sans text-xs uppercase tracking-widest font-bold text-center"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#001a52] hover:bg-[#0e2f76] text-white rounded-lg font-sans text-xs uppercase tracking-widest text-center font-extrabold shadow-md transform hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
              >
                Confirm Stay Reservation
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
