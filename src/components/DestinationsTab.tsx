/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Users, ArrowRight, Quote, Check, Info } from "lucide-react";
import Carousel from "./Carousel";
import { motion } from "motion/react";
import CountUp from "./CountUp";
import ThreeDHoverGallery from "./ThreeDHoverGallery";
import { Room } from "../types";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import coolCottagesFrontview from "../public/images/coolcottages_frontview.png";

interface DestinationsTabProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
  onInitiateBooking: (search: { checkIn: string; checkOut: string; guests: string }) => void;
}

export default function DestinationsTab({
  rooms,
  onSelectRoom,
  onInitiateBooking,
}: DestinationsTabProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Adults, 0 Children");

  const [activeSubTab, setActiveSubTab] = useState<"rooms" | "visual">("rooms");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert("Please designate check-in and check-out intervals to query availability.");
      return;
    }
    onInitiateBooking({ checkIn, checkOut, guests });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-20">
        {/* Spectacular Hotlinked Background */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center select-none"
          style={{
            backgroundImage: `url(${coolCottagesFrontview})`,
          }}
        />
        {/* Soft Indigo / Royal Navy overlay masking */}
        <div className="absolute inset-0 bg-[#001a52]/50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#001a52]/40 to-[#f8f9ff]" />

        <div className="relative z-10 text-center px-6 md:px-16 max-w-5xl mx-auto flex flex-col items-center mt-12 md:mt-0">
          <h1 className="font-headline-lg text-4xl md:text-7xl text-white mb-6 text-glow leading-normal md:leading-tight">
            Escape Into Luxury, <br /> Where Nature Meets Comfort
          </h1>
          <p className="font-sans text-sm md:text-lg text-white/95 mb-10 max-w-2xl text-center leading-relaxed font-light">
            Discover a sanctuary of unparalleled elegance. Experience the perfect harmony of pristine coastal beauty and
            refined modern architecture.
          </p>

          {/* Floating Booking Widget */}
          <form
            onSubmit={handleSearchSubmit}
            className="glass-panel text-left rounded-2xl p-5 md:p-6 w-full max-w-5xl shadow-2xl mx-auto flex flex-col md:flex-row gap-4 items-end animate-fade-in-up bg-white/70"
          >
            <div className="w-full md:w-1/4">
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#001a52] mb-2">
                Check In
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#001a52]/60" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-white/60 border border-[#001a52]/10 rounded-lg py-2.5 pl-9 pr-3 text-xs md:text-sm text-slate-800 focus:outline-none focus:border-[#001a52]/40 focus:ring-1 focus:ring-[#001a52]/20 transition-all font-medium placeholder-slate-400"
                />
              </div>
            </div>

            <div className="w-full md:w-1/4">
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#001a52] mb-2">
                Check Out
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#001a52]/60" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-white/60 border border-[#001a52]/10 rounded-lg py-2.5 pl-9 pr-3 text-xs md:text-sm text-slate-800 focus:outline-none focus:border-[#001a52]/40 focus:ring-1 focus:ring-[#001a52]/20 transition-all font-medium placeholder-slate-400"
                />
              </div>
            </div>

            <div className="w-full md:w-1/4">
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#001a52] mb-2">
                Guests
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#001a52]/60" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-white/60 border border-[#001a52]/10 rounded-lg py-2.5 pl-9 pr-8 text-xs md:text-sm text-slate-800 focus:outline-none focus:border-[#001a52]/40 focus:ring-1 focus:ring-[#001a52]/20 transition-all font-medium appearance-none"
                >
                  <option>2 Adults, 0 Children</option>
                  <option>2 Adults, 1 Child</option>
                  <option>2 Adults, 2 Children</option>
                  <option>4 Adults, 0 Children</option>
                  <option>1 Adult, 0 Children</option>
                </select>
              </div>
            </div>

            <div className="w-full md:w-1/4">
              <button
                type="submit"
                className="w-full bg-[#001a52] text-white hover:bg-[#0e2f76] rounded-lg py-3 font-sans text-xs uppercase tracking-widest font-extrabold transition-all shadow-md btn-glow flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Check Availability</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section className="py-16 bg-[#e5eeff]/40 dark:bg-slate-900 border-y border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-[#001a52] dark:text-[#dbe1ff]"
          >
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="p-4 border-b md:border-b-0 md:border-r border-[#001a52]/5 dark:border-white/5 md:last:border-none cursor-default"
            >
              <div className="font-headline-lg text-4xl md:text-6xl font-bold mb-2 text-[#001a52] dark:text-[#819ae7]">
                <CountUp from={0} to={98} duration={2} decimals={0} />%
              </div>
              <div className="font-sans text-xs uppercase tracking-widest text-slate-500 font-bold">
                Happy Guests
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="p-4 border-b md:border-b-0 md:border-r border-[#001a52]/5 dark:border-white/5 md:last:border-none cursor-default"
            >
              <div className="font-headline-lg text-4xl md:text-6xl font-bold mb-2 text-[#001a52] dark:text-[#819ae7]">
                <CountUp from={0} to={150} duration={2.2} decimals={0} />+
              </div>
              <div className="font-sans text-xs uppercase tracking-widest text-slate-500 font-bold">
                Luxury Villas
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="p-4 md:last:border-none cursor-default"
            >
              <div className="font-headline-lg text-4xl md:text-6xl font-bold mb-2 text-[#001a52] dark:text-[#819ae7]">
                <CountUp from={0} to={4.9} duration={2.4} decimals={1} />
              </div>
              <div className="font-sans text-xs uppercase tracking-widest text-slate-500 font-bold">
                Average Rating
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sub-tab Navigation Selector */}
      <section className="bg-transparent py-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center px-4">
          <div className="flex bg-[#001a52]/5 dark:bg-white/5 p-1 rounded-full border border-slate-100 dark:border-white/5">
            <button
              onClick={() => setActiveSubTab("rooms")}
              className={`px-5 py-2.5 rounded-full text-[10px] md:text-xs font-sans tracking-widest uppercase font-extrabold transition-all cursor-pointer ${
                activeSubTab === "rooms"
                  ? "bg-[#001a52] text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Exquisite Accommodations
            </button>
            <button
              onClick={() => setActiveSubTab("visual")}
              className={`px-5 py-2.5 rounded-full text-[10px] md:text-xs font-sans tracking-widest uppercase font-extrabold transition-all cursor-pointer ${
                activeSubTab === "visual"
                  ? "bg-[#001a52] text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Visual Experience
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Content Rendering based on subtab selection */}
      {activeSubTab === "rooms" ? (
        <Carousel rooms={rooms} onSelectRoom={onSelectRoom} />
      ) : (
        <section className="py-12 bg-white dark:bg-[#00174a]/10 overflow-hidden border-t border-slate-100 dark:border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="font-sans text-[11px] uppercase tracking-widest text-[#819ae7] font-extrabold block mb-2">
              Virtual Lookbook
            </span>
            <h2 className="font-headline-lg text-3xl md:text-4xl text-[#001a52] dark:text-[#dbe1ff] mb-4">
              Immersive Resort Gallery
            </h2>
            <p className="font-sans text-sm md:text-base text-slate-500 max-w-2xl mx-auto mb-8">
              Explore custom timber designs, starlit campfire areas, and private shorelines in an interactive 3D space.
            </p>
            <ThreeDHoverGallery />
          </div>
        </section>
      )}

      {/* Brand Value Quote / Editorial Section */}
      <section className="py-20 bg-[#efe4d9]/25 dark:bg-slate-950/40 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote className="w-10 h-10 text-slate-300 dark:text-slate-800 mx-auto mb-6 opacity-80" />
          <h3 className="font-headline-lg text-2xl md:text-3xl italic text-[#001a52] mb-6">
            "A masterclass in quiet architectural luxury. Cool Cottages does not merely offer guest villas; it
            delves into spatial meditation, placing nature in majestic, silent dialogue with refined modern craftsmanship."
          </h3>
          <span className="font-sans text-xs uppercase tracking-widest text-[#4a607c] font-black block">
            — Elite Voyager Journal, June 2026
          </span>
        </div>
      </section>
    </div>
  );
}
