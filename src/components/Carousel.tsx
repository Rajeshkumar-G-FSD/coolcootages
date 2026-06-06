/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Eye, Grid, Maximize, UserCheck, Waves } from "lucide-react";
import { Room } from "../types";

interface CarouselProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
}

export default function Carousel({ rooms, onSelectRoom }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isHovered) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % rooms.length);
      }, 2000); // Changed to 2 seconds auto play
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isHovered, rooms.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % rooms.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + rooms.length) % rooms.length);
  };

  const currentRoom = rooms[activeIndex];
  const angleInterval = 360 / rooms.length;

  return (
    <div className="py-16 bg-white dark:bg-[#00174a]/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-headline-lg text-3xl md:text-4xl text-[#001a52] dark:text-[#dbe1ff] mb-4">
          Exquisite Accommodations
        </h2>
        <p className="font-sans text-sm md:text-base text-slate-500 max-w-2xl mx-auto mb-12">
          Immerse yourself in hand-crafted spaces designed to elevate your senses and provide ultimate peace of mind.
        </p>

        {/* 3D Container */}
        <div
          className="relative max-w-3xl mx-auto flex flex-col items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Carousel Stage */}
          <div className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center perspective-[1000px]">
            {/* Carousel Inner Ring */}
            <div
              className="relative w-[280px] md:w-[360px] h-[200px] md:h-[260px] transform-style-3d transition-transform duration-1000 cubic-bezier(0.25, 0.1, 0.25, 1)"
              style={{
                transform: `rotateY(${-activeIndex * angleInterval}deg)`,
              }}
            >
              {rooms.map((room, idx) => {
                const angle = idx * angleInterval;
                const isSelected = activeIndex === idx;
                
                // Dynamically calculate radius (translateZValue) based on slide count to prevent overlaps
                const widthFactor = window.innerWidth < 768 ? 200 : 360;
                const translateZValue = Math.round(widthFactor / (2 * Math.sin(Math.PI / rooms.length)));

                return (
                  <div
                    key={room.id}
                    className={`absolute inset-0 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 transform-style-3d cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-[#001a52]/45 dark:ring-white/30"
                        : "opacity-60 saturate-50 hover:opacity-150"
                    }`}
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(${translateZValue}px)`,
                      backfaceVisibility: "hidden",
                    }}
                    onClick={() => setActiveIndex(idx)}
                  >
                    <img
                      src={room.imageUrl}
                      alt={room.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {/* Glass Overlay Title */}
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end text-left text-white h-24">
                      <span className="font-sans text-[10px] uppercase tracking-widest text-[#d2e4ff] font-bold">
                        Villa Portfolio
                      </span>
                      <h4 className="font-headline-md text-base md:text-lg font-medium leading-tight">
                        {room.name}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-6 mt-6">
            <button
              onClick={handlePrev}
              className="p-3 border border-[#001a52]/10 dark:border-white/10 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm focus:outline-none"
              aria-label="Previous room"
            >
              <ChevronLeft className="w-5 h-5 text-[#001a52] dark:text-[#dbe1ff]" />
            </button>

            {/* Pagination Indicators */}
            <div className="flex gap-2">
              {rooms.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? "w-6 bg-[#001a52] dark:bg-[#dbe1ff]" : "w-1.5 bg-slate-300 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 border border-[#001a52]/10 dark:border-white/10 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm focus:outline-none"
              aria-label="Next room"
            >
              <ChevronRight className="w-5 h-5 text-[#001a52] dark:text-[#dbe1ff]" />
            </button>
          </div>
        </div>

        {/* Selected Room Specifications (Fades and updates with state index) */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="glass-panel rounded-2xl p-6 md:p-8 text-left grid md:grid-cols-5 gap-8 shadow-lg bg-[#f8f9ff]/80">
            {/* Spec details - Left span */}
            <div className="md:col-span-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-extrabold bg-[#001a52]/10 text-[#001a52] dark:text-[#d2e4ff] rounded-full">
                    Exclusive Selection
                  </span>
                  <span className="text-sm font-sans tracking-tight text-slate-500 flex items-center gap-1">
                    <Maximize className="w-3.5 h-3.5" />
                    {currentRoom.sizeSquareMeter} sqm
                  </span>
                </div>
                <h3 className="font-headline-lg text-2xl md:text-3xl text-[#001a52] mb-3">
                  {currentRoom.name}
                </h3>
                <p className="font-sans text-xs md:text-sm text-slate-600 leading-relaxed leading-relaxed mb-6">
                  {currentRoom.description}
                </p>
              </div>

              {/* Pricing & select action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-slate-200/50">
                <main className="mb-4 sm:mb-0">
                  <span className="text-slate-400 font-sans text-xs uppercase tracking-wider block">
                    Starting luxury rate
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-headline-lg text-3xl font-bold text-[#001a52]">
                      ${currentRoom.ratePerNight.toLocaleString()}
                    </span>
                    <span className="font-sans text-xs text-slate-500 font-medium">
                      / Night
                    </span>
                  </div>
                </main>
                <button
                  onClick={() => onSelectRoom(currentRoom)}
                  className="w-full sm:w-auto bg-[#001a52] hover:bg-[#0e2f76] text-white px-6 py-3 rounded-lg font-sans text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-md transition-all uppercase cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Reserve This Category</span>
                </button>
              </div>
            </div>

            {/* Amenities breakdown - Right span */}
            <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-slate-250 md:pl-8 pt-6 md:pt-0">
              <h5 className="font-sans text-xs uppercase tracking-widest text-[#4a607c] font-bold mb-4 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5" />
                <span>Premium Specs</span>
              </h5>
              <ul className="space-y-2.5">
                {currentRoom.amenities.map((amenity, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 font-sans text-[11px] md:text-xs text-slate-600 font-medium"
                  >
                    <span className="text-[#819ae7] flex-shrink-0 mt-0.5 font-bold">✔</span>
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
