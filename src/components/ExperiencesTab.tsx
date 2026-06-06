/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Clock, DollarSign, Gem, ShieldCheck, HelpCircle } from "lucide-react";
import { Experience } from "../types";

interface ExperiencesTabProps {
  experiences: Experience[];
  onSelectExperience?: (exp: Experience) => void;
  selectedExpIds: string[];
}

export default function ExperiencesTab({
  experiences,
  onSelectExperience,
  selectedExpIds,
}: ExperiencesTabProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "adventure" | "wellness" | "dining">("all");

  const categories = [
    { id: "all", label: "All Curations" },
    { id: "adventure", label: "High Adventure" },
    { id: "wellness", label: "Somatic Wellness" },
    { id: "dining", label: "Private Dining" },
  ];

  const filteredExperiences = experiences.filter((exp) => {
    if (activeCategory === "all") return true;
    return exp.category === activeCategory;
  });

  return (
    <div className="py-24 bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Module Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-extrabold bg-[#001a52]/10 text-[#001a52] dark:text-[#dbe1ff] rounded-full inline-block mb-3">
            Bespoke Curation
          </span>
          <h2 className="font-headline-lg text-3xl md:text-5xl text-[#001a52] mb-4">
            Hand-Crafted Island curations
          </h2>
          <p className="font-sans text-sm md:text-base text-slate-500 leading-relaxed">
            The South Pacific island experience stretches far beyond your villa patio. We design tailored masterworks of
            gastronomy, deep oceanic exploration, and high-altitude relaxation.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center flex-wrap gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-5 py-2.5 rounded-lg font-sans text-xs uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#001a52] text-white border-transparent shadow shadow-lg"
                  : "bg-white text-slate-600 border-slate-200/60 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredExperiences.map((exp) => {
            const isAdded = selectedExpIds.includes(exp.id);
            return (
              <div
                key={exp.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row border border-slate-100 hover:shadow-xl transition-all duration-300"
              >
                {/* Left Card Illustration */}
                <div className="relative w-full md:w-[45%] h-56 md:h-auto overflow-hidden">
                  <img
                    src={exp.imageUrl}
                    alt={exp.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none absolute hover:scale-105 transition-transform duration-500 duration-500"
                  />
                  <span className="absolute top-4 left-4 px-2.5 py-1 text-[9px] uppercase tracking-widest font-black bg-white/90 text-[#001a52] rounded shadow-sm">
                    {exp.category}
                  </span>
                </div>

                {/* Right Card Spec */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-sans text-[10px] uppercase font-extrabold tracking-widest text-[#819ae7] block mb-1">
                      {exp.highlight}
                    </span>
                    <h3 className="font-headline-lg text-lg md:text-xl text-[#001a52] font-semibold mb-3">
                      {exp.name}
                    </h3>
                    <p className="font-sans text-xs text-slate-500 leading-relaxed mb-6">
                      {exp.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100/80">
                    {/* Time or custom cost items */}
                    <main className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{exp.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 font-sans font-bold text-slate-700">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        <span>${exp.cost.toLocaleString()}</span>
                      </div>
                    </main>

                    {onSelectExperience && (
                      <button
                        onClick={() => onSelectExperience(exp)}
                        className={`w-full py-2.5 rounded-lg font-sans text-xs uppercase tracking-widest border font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isAdded
                            ? "bg-slate-100 text-slate-500 hover:bg-slate-200 border-transparent"
                            : "bg-[#e5eeff] text-[#001a52] hover:bg-[#c5dcfd] border-[#abbbde]"
                        }`}
                      >
                        <Gem className="w-3.5 h-3.5 text-amber-500" />
                        <span>{isAdded ? "Selected for Stay" : "Add to Stay Curation"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Curation Guarantee Footer */}
        <div className="mt-16 bg-[#efe4d9]/15 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto border border-amber-800/10 text-slate-600">
          <ShieldCheck className="w-12 h-12 text-[#819ae7] flex-shrink-0" />
          <div className="text-left text-xs md:text-sm">
            <h4 className="font-headline-md text-slate-800 font-bold mb-1.5">
              Personalized Curation Security Guarantee
            </h4>
            <p className="font-sans text-slate-500 leading-relaxed">
              All selected curations can be seamlessly coordinated by your dedicated Cool Cottages private butler, Aurelia. In
              the event of unfavorable meteorological patterns or itinerary deviations, alternate high-end arrangements or
              direct reservation adjustments are secured fully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
