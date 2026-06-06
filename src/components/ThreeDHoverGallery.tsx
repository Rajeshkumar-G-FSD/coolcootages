import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, Maximize2 } from "lucide-react";

// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgBedroom from "../public/images/coolcottage_bedroom.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgBedrooms from "../public/images/coolcottage_bedrooms.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgCampfire from "../public/images/coolcottage_campfirearea.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgLivingroom from "../public/images/coolcottage_livingroom.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgPlayingArea from "../public/images/coolcottage_playing area.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgRestroom from "../public/images/coolcottage_restroom.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgRoomsview from "../public/images/coolcottage_roomsview.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgSingleBed from "../public/images/coolcottage_single bed.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgCottagesFrontview from "../public/images/coolcottages_frontview.png";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgFrontview from "../public/images/frontview.jpg";

const cn = (...classes: (string | undefined | null | boolean)[]) => classes.filter(Boolean).join(" ");

interface ImageDetail {
  title: string;
  desc: string;
  img: string;
}

const LOOKBOOK_DETAILS: ImageDetail[] = [
  { title: "Grand Entrance Canopy", desc: "Towering South Pacific palms and volcanic stone entryways.", img: imgFrontview },
  { title: "Beach Cottage Frontview", desc: "Absolute coastal serenity on a powdery white private cove.", img: imgCottagesFrontview },
  { title: "Hardwood Timber Living", desc: "Open airy timber architecture welcoming ocean breezes.", img: imgLivingroom },
  { title: "Somatic Master Suite", desc: "A cozy sleeping sanctuary with linen finishes.", img: imgBedroom },
  { title: "Traditional Secluded Bedroom", desc: "Elegant tropical woodwork with serene framing layout.", img: imgBedrooms },
  { title: "Starlit Campfire Hearth", desc: "Bespoke stone charcoal pit situated in a quiet forest clearing.", img: imgCampfire },
  { title: "Garden Play & Leisure", desc: "Lush verdant lawn tailored for recreation and yoga.", img: imgPlayingArea },
  { title: "The Sovereign Stone Tub", desc: "Deep soaking spa bath framed by natural therapeutic ferns.", img: imgRestroom },
  { title: "Scenic Archways Overlook", desc: "Perfect harmony between master carpentry and natural beauty.", img: imgRoomsview },
  { title: "Botanical Daybed Studio", desc: "Sun-drenched studio library featuring a cozy reading layout.", img: imgSingleBed },
];

export interface ThreeDHoverGalleryProps {
  images?: string[];
  backgroundColor?: string;
  enableKeyboardNavigation?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ThreeDHoverGallery: React.FC<ThreeDHoverGalleryProps> = ({
  backgroundColor,
  enableKeyboardNavigation = true,
  autoPlay = true,
  autoPlayDelay = 2000, // Fixed at 2 seconds
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [galleryMode, setGalleryMode] = useState<"compact" | "expanded">("compact");
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive window query check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay handler with hover pause
  useEffect(() => {
    if (autoPlay && !isHovered) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % LOOKBOOK_DETAILS.length);
      }, autoPlayDelay);

      return () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      };
    }
  }, [autoPlay, autoPlayDelay, isHovered]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % LOOKBOOK_DETAILS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + LOOKBOOK_DETAILS.length) % LOOKBOOK_DETAILS.length);
  };

  const selectImage = (index: number) => {
    setActiveIndex(index);
  };

  // Gallery dynamic properties
  const perspectiveVal = isMobile ? "120vw" : "100vw";
  const gapVal = isMobile ? (galleryMode === "compact" ? "0.3rem" : "0.5rem") : "1.2rem";

  // Single Item Style Calculator
  const getItemStyle = (index: number): React.CSSProperties => {
    const isActive = activeIndex === index;
    
    if (isMobile) {
      if (galleryMode === "compact") {
        // Compact mobile view: side-by-side slim cards (larger dimensions)
        const width = isActive ? "60vw" : "6vw";
        const height = "48vh";
        return {
          width,
          height,
          backgroundImage: `url(${LOOKBOOK_DETAILS[index].img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: isActive ? "brightness(1) saturate(1)" : "brightness(0.3) grayscale(0.8)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          borderRadius: "0.5rem",
          cursor: "pointer",
          flexShrink: 0,
        };
      } else {
        // Expanded mobile view: fuller cards (larger dimensions)
        const width = isActive ? "82vw" : "9vw";
        const height = "56vh";
        return {
          width,
          height,
          backgroundImage: `url(${LOOKBOOK_DETAILS[index].img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: isActive ? "brightness(1) saturate(1)" : "brightness(0.25) grayscale(0.9)",
          transform: isActive ? "translateZ(30px)" : "none",
          transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          borderRadius: "0.75rem",
          cursor: "pointer",
          flexShrink: 0,
        };
      }
    } else {
      // Desktop: Ultra gorgeous 3D spaces
      const width = isActive ? "42vw" : "5vw";
      const height = "52vh";
      const hoverZ = isActive ? "translateZ(45px)" : "none";
      return {
        width,
        height,
        backgroundImage: `url(${LOOKBOOK_DETAILS[index].img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: isActive ? "brightness(1) saturate(1.05)" : "brightness(0.4) saturate(0.6) grayscale(0.3)",
        transform: hoverZ,
        transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
        borderRadius: "0.75rem",
        cursor: "pointer",
        flexShrink: 0,
      };
    }
  };

  const activeSlideInfo = LOOKBOOK_DETAILS[activeIndex] || LOOKBOOK_DETAILS[0];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full overflow-hidden bg-transparent py-4 text-[#001a52] dark:text-[#dbe1ff]",
        className
      )}
      style={backgroundColor ? { backgroundColor, ...style } : style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic View Selector Panel (Mobile/Web Option) */}
      <div className="flex items-center justify-between w-full max-w-5xl px-4 mb-6">
        <div className="flex items-center gap-1.5 bg-[#001a52]/5 dark:bg-white/5 rounded-full p-1 border border-slate-100 dark:border-white/5">
          <button
            onClick={() => setGalleryMode("compact")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-[10px] md:text-xs tracking-wider uppercase font-black transition-all flex items-center gap-2 cursor-pointer",
              galleryMode === "compact"
                ? "bg-[#001a52] text-white shadow-md"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Compact</span>
          </button>
          <button
            onClick={() => setGalleryMode("expanded")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-[10px] md:text-xs tracking-wider uppercase font-black transition-all flex items-center gap-2 cursor-pointer",
              galleryMode === "expanded"
                ? "bg-[#001a52] text-white shadow-md"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Immersive</span>
          </button>
        </div>

        {/* Quick Navigation Dot Overlay Indicators */}
        <div className="hidden sm:flex items-center gap-1">
          {LOOKBOOK_DETAILS.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => selectImage(dotIdx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                activeIndex === dotIdx ? "w-6 bg-[#001a52] dark:bg-[#819ae7]" : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
              )}
            />
          ))}
        </div>
      </div>

      {/* 3D Immersive Frame Stage */}
      <div className="relative w-full max-w-[100vw] flex flex-col items-center">
        <div
          ref={containerRef}
          className="flex justify-center items-center w-full px-2"
          style={{
            perspective: perspectiveVal,
            gap: gapVal,
          }}
        >
          {LOOKBOOK_DETAILS.map((slide, index) => (
            <div
              key={index}
              className="relative select-none will-change-transform shadow-xl hover:shadow-2xl transition-shadow duration-700 border border-slate-200/5 dark:border-white/5 flex items-end"
              style={getItemStyle(index)}
              onClick={() => selectImage(index)}
              role="button"
              aria-label={`Slide ${index + 1}`}
            >
              {/* Subtle dynamic border glow for active element */}
              {activeIndex === index && (
                <div className="absolute inset-0 rounded-[inherit] border border-[#d2e4ff] pointer-events-none opacity-40 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live Active Slide Description Card */}
      <div className="mt-8 w-full max-w-xl px-6 text-center animate-fade-in duration-500">
        <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#819ae7] dark:text-[#a0b5f5] font-extrabold mb-1">
          Cool Cottages Lookbook ({activeIndex + 1} / {LOOKBOOK_DETAILS.length})
        </p>
        <h3 className="font-headline-lg text-xl md:text-2xl text-[#001a52] dark:text-[#dbe1ff] font-medium mb-2.5 transition-all">
          {activeSlideInfo.title}
        </h3>
        <p className="font-sans text-xs md:text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-md mx-auto">
          {activeSlideInfo.desc}
        </p>

        {/* Mini Manual Nav Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            className="p-2.5 border border-[#001a52]/10 dark:border-white/10 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4 text-[#001a52] dark:text-[#819ae7]" />
          </button>
          <span className="font-mono text-xs text-slate-400 font-black tracking-widest min-w-[36px]">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <button
            onClick={handleNext}
            className="p-2.5 border border-[#001a52]/10 dark:border-white/10 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4 text-[#001a52] dark:text-[#819ae7]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreeDHoverGallery;
