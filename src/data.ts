/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Room, Experience, SpecialPackage } from "./types";

// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgFrontview from "./public/images/frontview.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgCottagesFrontview from "./public/images/coolcottages_frontview.png";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgLivingroom from "./public/images/coolcottage_livingroom.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgCampfire from "./public/images/coolcottage_campfirearea.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgPlayingArea from "./public/images/coolcottage_playing area.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgRoomsview from "./public/images/coolcottage_roomsview.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgBedrooms from "./public/images/coolcottage_bedrooms.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgBedroom from "./public/images/coolcottage_bedroom.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgSingleBed from "./public/images/coolcottage_single bed.jpg";
// @ts-expect-error - Vite resolves image assets dynamically at build time
import imgRestroom from "./public/images/coolcottage_restroom.jpg";

export const VILLAS_DATA: Room[] = [
  {
    id: "ocean-view-suite", // Keep ID to maintain compatibility with booking models and packages
    name: "The CoolCottages Entrance Canopy",
    description: "The iconic architectural arrival pavilion. Hand-laid volcanic stone pathways welcome you to Cool Cottages.",
    ratePerNight: 1100,
    maxGuests: 2,
    sizeSquareMeter: 150,
    amenities: [
      "24/7 Greeting Concierge",
      "Valet Shuttle Access",
      "Welcome Champagne Lounge",
      "Pristine Landscaped Gardens",
      "Somatic Welcome Tea Ritual",
    ],
    imageUrl: imgFrontview,
  },
  {
    id: "private-villa", // Keep ID to maintain compatibility with booking models and packages
    name: "CoolCottage Beach Frontview",
    description: "Tucked inside absolute botanical solitude, featuring spectacular floor-to-ceiling timber framework and a direct gateway to the white sand private beach.",
    ratePerNight: 1650,
    maxGuests: 4,
    sizeSquareMeter: 180,
    amenities: [
      "Direct Beach Access",
      "Lush Botanical Privacy",
      "Sunset Viewing Platform",
      "Teak Loungers",
      "Enclosed Coral Sand Garden",
    ],
    imageUrl: imgCottagesFrontview,
  },
  {
    id: "lumina-penthouse", // Keep ID to maintain compatibility with booking models and packages
    name: "CoolCottage Timber Living Room",
    description: "An expansive, open-concept living pavilion crafted from fine tropical hardwood. Offers plush bespoke seating and grand archways framing ocean breezes.",
    ratePerNight: 1750,
    maxGuests: 6,
    sizeSquareMeter: 220,
    amenities: [
      "Curated Organic Furnishings",
      "B&O Surround Sound",
      "Private Beverage Bar",
      "Ambient Integrated Lighting",
      "Ventilated High-Ceiling Timber Decking",
    ],
    imageUrl: imgLivingroom,
  },
  {
    id: "cottage-campfire",
    name: "Starlit Hearth & Campfire Area",
    description: "Gather around the bespoke stone-carved fire hearth situated in a serene forest clearing. Enjoy cozy evenings under the brilliant starlit South Pacific sky.",
    ratePerNight: 1200,
    maxGuests: 6,
    sizeSquareMeter: 90,
    amenities: [
      "Bespoke Stone Charcoal Pit",
      "Complimentary S'mores Curation",
      "Plush Outdoor Seating",
      "Custom Solar Path Lighting",
    ],
    imageUrl: imgCampfire,
  },
  {
    id: "cottage-playing",
    name: "Garden Play & Leisure Area",
    description: "A manicured verdant lawn designed for outdoor recreation, yoga sessions, or gentle family sports under the shade of ancient native palms.",
    ratePerNight: 1300,
    maxGuests: 8,
    sizeSquareMeter: 300,
    amenities: [
      "Custom Lawn Game Sets",
      "Yoga & Meditation Mats",
      "Complimentary Refreshment Cart",
      "Shaded Relaxation Cabanas",
    ],
    imageUrl: imgPlayingArea,
  },
  {
    id: "cottage-scenic-arch",
    name: "The Archway Scenic Rooms View",
    description: "Experience structural purity with elegant timber archways that create a fluid transition between inner sanctuaries and outer natural paradise.",
    ratePerNight: 1900,
    maxGuests: 4,
    sizeSquareMeter: 240,
    amenities: [
      "Panoramic Open Layout",
      "Hand-carved Wooden Columns",
      "Integrated Climate Control",
      "Bespoke Sculptural Decor",
    ],
    imageUrl: imgRoomsview,
  },
  {
    id: "cottage-master-bedroom",
    name: "The CoolCottage Master Bedroom",
    description: "The premier sleeping sanctuary. Adored with a signature floating king bed, premium linen sheets, and custom warm timber finishes.",
    ratePerNight: 2200,
    maxGuests: 2,
    sizeSquareMeter: 160,
    amenities: [
      "Signature King Bed",
      "Pre-set Pillow Selection",
      "Integrated Sound Control",
      "Automated Blackout Curtains",
    ],
    imageUrl: imgBedrooms,
  },
  {
    id: "cottage-corner-room",
    name: "Cottage Botanical Corner Room",
    description: "An intimate secondary bedroom boasting a corner-view overlook of the vibrant orchid garden. Styled in sleek minimalist comfort.",
    ratePerNight: 1950,
    maxGuests: 2,
    sizeSquareMeter: 140,
    amenities: [
      "Plush Queen Bedding",
      "Garden Overlook Balcony",
      "Premium Bathrobes & Linens",
      "Organic Local Aromatherapy",
    ],
    imageUrl: imgBedroom,
  },
  {
    id: "cottage-single-bed",
    name: "The Secluded Daybed Studio",
    description: "A cozy, sun-drenched studio library featuring a premium single memory-foam daybed. Perfect for an enchanting reading stay or a personal retreat.",
    ratePerNight: 1400,
    maxGuests: 1,
    sizeSquareMeter: 80,
    amenities: [
      "Premium Single Daybed",
      "Curated Island Book collection",
      "Bespoke Work Nook Desk",
      "Nespresso Master Brewer",
    ],
    imageUrl: imgSingleBed,
  },
  {
    id: "cottage-stone-restroom",
    name: "The Somatic Stone Restroom",
    description: "A spa-inspired sanctuary featuring a master deep-soaking stone bath and an open-concept rainfall shower surrounded by live volcanic ferns.",
    ratePerNight: 1800,
    maxGuests: 2,
    sizeSquareMeter: 110,
    amenities: [
      "Custom Stone Soaking Tub",
      "Twin Organic Rain Showers",
      "Heated Travertine Floors",
      "CoolCottages Somatic Bath Salts",
    ],
    imageUrl: imgRestroom,
  },
];

export const EXPERIENCES_DATA: Experience[] = [
  {
    id: "yacht-charter",
    name: "BESPOKE YACHT CRUISE",
    description: "Board our flagship 85ft luxury motor-yacht 'The Azure Pearl' for a half-day private island exploration. Includes bespoke champagne tastings, gourmet charcuterie, private skipper, and guided water-scooter reef snorkeling.",
    cost: 1800,
    duration: "4 Hours",
    category: "adventure",
    highlight: "Private Champagne Lounge",
    imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "heli-picnic",
    name: "HELI-RIDGE PICNIC",
    description: "Take to the South Pacific skies in our high-altitude Airbus helicopter. Land upon a secluded volcanic ridge overlooking the entire archipelago to indulge in an ice-chilled wild caviar lunch paired with vintage champagne.",
    cost: 2400,
    duration: "2.5 Hours",
    category: "adventure",
    highlight: "Panoramic High-Altitude Views",
    imageUrl: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "somatic-massage",
    name: "SANCTUARY SOMATIC MASSAGE",
    description: "Inhale oceanside serenity at our bamboo-vaulted spa garden. Three hours of custom hot volcanic rock therapies, deep-tissue somatic relaxation with local floral botanical elixirs, and thermal spring baths.",
    cost: 450,
    duration: "3 Hours",
    category: "wellness",
    highlight: "Warm Sea Salt Scrub",
    imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "shoreline-dining",
    name: "STARLIT DOME DINING",
    description: "Indulge in an exclusive private dining bubble inside a suspended glass sphere on the water's edge. Our Executive Chef crafts an 8-course local seafood & hand-reared Wagyu degustation paired with legendary wines.",
    cost: 600,
    duration: "Evening",
    category: "dining",
    highlight: "8-Course Degustation",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
  },
];

export const PACKAGES_DATA: SpecialPackage[] = [
  {
    id: "honeymoon-escape",
    name: "The Honeymoon Sanctuary Escape",
    tagline: "Unparalleled romance and curated isolated memory building",
    description: "Combine 5 nights in our gorgeous Private Secluded Villa with a curated itinerary of a luxury Private Yacht Cruising sunset, Starlit Dome Shoreline Dining, and our signature Sanctuary Somatic wellness treatments. Ultimate romantic luxury.",
    durationDays: 5,
    discountPercentage: 15,
    includedExperiences: ["yacht-charter", "somatic-massage", "shoreline-dining"],
    costMultiplier: 0.85,
  },
  {
    id: "ultimate-lumina-experience",
    name: "The Sovereign Ridge & Reef Experience",
    tagline: "Explore the wild South Pacific heights and ocean depths",
    description: "The peak of Cool Cottages leisure. Stay 4 nights in our premium master bedroom/suites, featuring panoramic views, the Heli-Ridge picnic, private Yacht charter, and dedicated starlit shoreline dinner.",
    durationDays: 4,
    discountPercentage: 10,
    includedExperiences: ["heli-picnic", "yacht-charter", "shoreline-dining"],
    costMultiplier: 0.9,
  },
];
