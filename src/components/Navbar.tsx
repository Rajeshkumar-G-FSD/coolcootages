/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Menu, X, Sparkles, Compass, Gift, Calendar, HelpCircle, Info, Lock } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openConcierge: () => void;
  bookingCount: number;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  openConcierge,
  bookingCount,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "destinations", label: "Destinations", icon: Compass },
    { id: "experiences", label: "Experiences", icon: Sparkles },
    { id: "packages", label: "Offers", icon: Gift },
    { id: "about", label: "Cottage Guide", icon: Info },
    { id: "bookings", label: "Reservations", icon: Calendar, badge: bookingCount },
    { id: "admin", label: "Admin Panel", icon: Lock },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        id="main-nav"
        className={`fixed top-0 left-0 w-full z-45 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/90 dark:bg-[#001a52]/90 backdrop-blur-xl border-[#001a52]/10 dark:border-white/10 shadow-md py-4"
            : "bg-white/10 dark:bg-white/5 backdrop-blur-md border-white/20 dark:border-white/5 shadow-sm py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick("destinations")}
            className="flex flex-col items-start focus:outline-none group text-left cursor-pointer"
          >
            <span className="font-headline-md text-xl md:text-2xl italic font-bold tracking-tight group-hover:opacity-80 transition-opacity flex gap-1">
              <span className="text-[#001a52] dark:text-white">Cool</span>
              <span className="text-amber-500 dark:text-amber-400">Cottages</span>
            </span>
            <span className="font-sans text-[9px] uppercase tracking-widest text-[#4a607c] dark:text-white/60 -mt-1 font-semibold">
              Bespoke Luxury Cottage Retreat
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`nav-item flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest transition-all pb-1 border-b-2 relative ${
                      isActive
                        ? "text-[#001a52] dark:text-[#dbe1ff] font-bold border-[#001a52] dark:border-[#dbe1ff] scale-95"
                        : "text-[#4a607c]/80 dark:text-white/70 font-medium border-transparent hover:text-[#001a52] dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-2.5 -right-3 px-1.5 py-0.5 text-[9px] font-bold bg-[#ba1a1a] text-white rounded-full leading-none animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={openConcierge}
                className="flex items-center gap-1.5 px-4 py-2 border border-[#001a52]/40 dark:border-white/30 hover:border-[#001a52] dark:hover:border-white rounded font-sans text-xs uppercase tracking-widest text-[#001a52] dark:text-[#dbe1ff] hover:bg-[#001a52]/5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#819ae7]" />
                <span>AI Butler</span>
              </button>

              <button
                onClick={() => handleNavClick("destinations")}
                className="bg-[#001a52] text-white hover:bg-[#0e2f76] dark:bg-[#dbe1ff] dark:text-[#00174a] dark:hover:bg-[#b3c5ff] px-5 py-2 rounded font-sans text-xs uppercase tracking-widest transition-all btn-glow shadow-sm cursor-pointer"
              >
                Book Room
              </button>
            </div>
          </div>

          {/* Mobile Action Controls */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={openConcierge}
              className="p-2 text-[#001a52] dark:text-[#dbe1ff] hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
              title="AI Concierge"
            >
              <Sparkles className="w-5 h-5 text-amber-500" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#001a52] dark:text-[#dbe1ff] hover:bg-black/5 dark:hover:bg-white/5 rounded"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#001a52]/80 backdrop-blur-md md:hidden transition-all duration-300">
          <div className="bg-white dark:bg-[#213145] h-full w-4/5 max-w-xs shadow-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-8 border-b pb-4 border-[#001a52]/10 dark:border-white/10">
                <div className="flex flex-col">
                  <span className="font-headline-md text-lg italic font-bold flex gap-1">
                    <span className="text-[#001a52] dark:text-white">Cool</span>
                    <span className="text-amber-500 dark:text-amber-400">Cottages</span>
                  </span>
                  <span className="font-sans text-[8px] uppercase tracking-wider text-[#4a607c] dark:text-white/60 font-semibold">
                    Luxury Cottage Retreat
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex flex-col space-y-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center justify-between w-full p-3 rounded-lg font-sans text-xs uppercase tracking-widest border transition-all ${
                        isActive
                          ? "bg-[#e5eeff] text-[#001a52] border-[#abbbde] font-bold"
                          : "text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-[#ba1a1a] text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#001a52]/10 dark:border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openConcierge();
                }}
                className="w-full py-3 bg-[#e5eeff] dark:bg-white/10 text-[#001a52] dark:text-white rounded-lg font-sans text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 border border-[#bec8c9]/50"
              >
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>AI Butler Chat</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveTab("destinations");
                }}
                className="w-full py-3 bg-[#001a52] hover:bg-[#0e2f76] text-white rounded-lg font-sans text-xs uppercase tracking-widest font-semibold text-center block"
              >
                Book Your Villa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
