/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Gift, Sparkles, Check, ArrowRight, ShieldAlert, Award } from "lucide-react";
import { SpecialPackage, Room, Experience } from "../types";

interface PackagesTabProps {
  packages: SpecialPackage[];
  rooms: Room[];
  experiences: Experience[];
  onSelectPackage: (pkg: SpecialPackage) => void;
}

export default function PackagesTab({
  packages,
  rooms,
  experiences,
  onSelectPackage,
}: PackagesTabProps) {
  return (
    <div className="py-24 bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-extrabold bg-[#001a52]/10 text-[#001a52] dark:text-[#dbe1ff] rounded-full inline-block mb-3">
            Seasonal Portfolios
          </span>
          <h2 className="font-headline-lg text-3xl md:text-5xl text-[#001a52] mb-4">
            Exclusive Packages & Offers
          </h2>
          <p className="font-sans text-sm md:text-base text-slate-500 leading-relaxed">
            By coordinating our masterworks with extended luxury stays, we present exclusive curated itineraries with matching
            complimentary inclusions and special rate reductions.
          </p>
        </div>

        {/* Packages Collection card lists */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {packages.map((pkg) => {
            // Find target room
            let targetRoom: Room | undefined;
            if (pkg.id === "honeymoon-escape") {
              targetRoom = rooms.find((r) => r.id === "private-villa");
            } else {
              targetRoom = rooms.find((r) => r.id === "lumina-penthouse");
            }

            // Map included experiences
            const includedExps = experiences.filter((exp) => pkg.includedExperiences.includes(exp.id));

            // Cost calculation
            const rawRoomCost = (targetRoom?.ratePerNight || 0) * pkg.durationDays;
            const rawExpsCost = includedExps.reduce((acc, curr) => acc + curr.cost, 0);
            const totalValue = rawRoomCost + rawExpsCost;
            const packagedPrice = Math.round(totalValue * pkg.costMultiplier);

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300 grid md:grid-cols-3 gap-8"
              >
                {/* Visual specs - Col 1 */}
                <div className="md:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-extrabold bg-amber-50 rounded bg-[#efe4d9]/70 text-[#001a52] inline-block">
                        {pkg.durationDays} Nights Package
                      </span>
                      <span className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-extrabold bg-[#ba1a1a]/10 text-[#ba1a1a] rounded inline-block">
                        Save {pkg.discountPercentage}%
                      </span>
                    </div>

                    <h3 className="font-headline-lg text-xl md:text-2xl text-[#001a52] font-semibold mb-1">
                      {pkg.name}
                    </h3>
                    <span className="font-sans text-[11px] italic text-[#4a607c] font-black block mb-4">
                      {pkg.tagline}
                    </span>

                    <p className="font-sans text-xs md:text-sm text-slate-500 leading-relaxed mb-6">
                      {pkg.description}
                    </p>

                    {/* Included experiences badge map */}
                    <div className="space-y-2.5">
                      <h4 className="font-sans text-[10px] uppercase font-extrabold tracking-widest text-[#4a607c]">
                        Complimentary Included Curations
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {includedExps.map((exp) => (
                          <div
                            key={exp.id}
                            className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100"
                          >
                            <span className="text-amber-500 text-xs font-bold flex-shrink-0">✦</span>
                            <span className="font-sans text-[11px] text-slate-600 font-medium truncate">
                              {exp.name}
                            </span>
                          </div>
                        ))}
                        {targetRoom && (
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-indigo-500 text-xs font-bold flex-shrink-0">✦</span>
                            <span className="font-sans text-[11px] text-slate-600 font-medium truncate">
                              {pkg.durationDays} nights: {targetRoom.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & select triggers - Col 2 */}
                <div className="bg-[#e5eeff]/40 rounded-xl p-6 flex flex-col justify-between border border-[#001a52]/5 text-center md:text-left h-full">
                  <div>
                    <h4 className="font-sans text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">
                      Package Stay Value
                    </h4>
                    
                    {/* Raw vs discounted price */}
                    <main className="space-y-1 mb-6">
                      <span className="font-sans text-xs text-slate-400 line-through block">
                        Estimated Value: ${totalValue.toLocaleString()}
                      </span>
                      <div className="flex items-baseline md:justify-start justify-center gap-1">
                        <span className="font-headline-lg text-3xl md:text-4xl font-extrabold text-[#001a52]">
                          ${packagedPrice.toLocaleString()}
                        </span>
                        <span className="font-sans text-xs text-slate-500 font-semibold">
                          / Stay
                        </span>
                      </div>
                      <span className="font-sans text-[10px] text-emerald-500 font-bold block">
                        Full bundle discount applied
                      </span>
                    </main>

                    {/* Quick highlight specs list */}
                    <ul className="text-left space-y-2 mb-6 border-t border-slate-200/50 pt-4">
                      <li className="flex items-center gap-2 text-slate-500 text-[11px] font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>All meals inclusive</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-500 text-[11px] font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Seamless yacht transfers</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-500 text-[11px] font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>24/7 Butler Support</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="w-full bg-[#001a52] hover:bg-[#0e2f76] text-white py-3 rounded-lg font-sans text-xs uppercase tracking-widest font-black flex items-center justify-center gap-2 shadow btn-glow cursor-pointer"
                  >
                    <span>Pre-configure Program</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom request section block */}
        <div className="mt-16 text-center max-w-2xl mx-auto border-t border-slate-200/60 pt-10">
          <Award className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="font-headline-md text-lg text-slate-800 font-bold mb-2">
            Desire a Completely Bespoke Program?
          </h3>
          <p className="font-sans text-xs md:text-sm text-slate-500 leading-relaxed mb-6">
            Cool Cottages is committed to realizing your absolute lifestyle dreams. Our planning advisors are ready to
            curate any specific high-altitude flights, custom tasting menus, or custom local stays.
          </p>
          <button
            onClick={() => {
              // Open concierge natively!
              const aiButlerButton = document.querySelector('button[title="AI Concierge"]') as HTMLButtonElement | null;
              if (aiButlerButton) aiButlerButton.click();
            }}
            className="px-6 py-2.5 border border-[#4a607c] text-[#4a607c] hover:bg-slate-50 rounded-lg font-sans text-xs uppercase tracking-wider font-bold transition-all cursor-pointer"
          >
            Coordinate With Aurelia AI Concierge
          </button>
        </div>
      </div>
    </div>
  );
}
