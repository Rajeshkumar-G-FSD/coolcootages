/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  ratePerNight: number;
  maxGuests: number;
  sizeSquareMeter: number;
  amenities: string[];
  imageUrl: string;
}

export interface Experience {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: string;
  category: "adventure" | "dining" | "wellness" | "leisure";
  highlight: string;
  imageUrl: string;
}

export interface SpecialPackage {
  id: string;
  name: string;
  tagline: string;
  description: string;
  durationDays: number;
  discountPercentage: number;
  includedExperiences: string[];
  costMultiplier: number;
}

export interface Booking {
  id: string;
  room: Room;
  checkIn: string;
  checkOut: string;
  guestsText: string;
  nightsNum: number;
  totalCost: number;
  createdTime: string;
  status: "Confirmed" | "Completed" | "Pending";
  selectedExperiences: Experience[];
  specialRequests?: string;
  billingName: string;
  billingEmail: string;
}
