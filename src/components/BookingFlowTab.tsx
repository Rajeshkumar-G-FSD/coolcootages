import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Users, 
  MapPin, 
  Check, 
  Lock, 
  ShieldCheck,
  Compass, 
  Sparkles, 
  Clock, 
  Coffee, 
  ArrowRight,
  ChevronRight,
  Coins
} from "lucide-react";
import { Room, Experience, Booking } from "../types";
import { VILLAS_DATA, EXPERIENCES_DATA } from "../data";
import { motion } from "motion/react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

interface BookingFlowTabProps {
  initialRoom?: Room;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: string;
  onBookingConfirmed: (booking: Booking) => void;
}

export default function BookingFlowTab({
  initialRoom = VILLAS_DATA[0],
  initialCheckIn = "",
  initialCheckOut = "",
  initialGuests = "2 Adults, 0 Children",
  onBookingConfirmed
}: BookingFlowTabProps) {
  // Current Active Step (1: Stay Info, 2: Guest Details, 3: Success or Submit)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields - Step 1
  const [room, setRoom] = useState<Room>(initialRoom);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [selectedExps, setSelectedExps] = useState<Experience[]>([]);

  // Form Fields - Step 2 (Replica of Booking.com)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [countryRegion, setCountryRegion] = useState("India");
  const [phonePrefix, setPhonePrefix] = useState("IN +91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paperlessConfirmation, setPaperlessConfirmation] = useState(true);
  const [bookingForSelf, setBookingForSelf] = useState(true);
  const [workTrip, setWorkTrip] = useState(false);
  const [specialRequests, setSpecialRequests] = useState("");
  const [arrivalTime, setArrivalTime] = useState("14:00 - 15:00");
  const [cotRequested, setCotRequested] = useState(false);

  // Status & Submit values
  const [submitting, setSubmitting] = useState(false);
  const [generatedBooking, setGeneratedBooking] = useState<Booking | null>(null);

  // Auto pre-fill dates if none provided
  useEffect(() => {
    if (!checkIn) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 2);
      setCheckIn(today.toISOString().split("T")[0]);
      setCheckOut(tomorrow.toISOString().split("T")[0]);
    }
  }, []);

  // Calculate reservation metrics
  let nights = 1;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    if (diff > 0) {
      nights = Math.ceil(diff / (1000 * 3600 * 24));
    }
  }

  const roomBaseCost = room.ratePerNight * nights;
  const expsCost = selectedExps.reduce((acc, curr) => acc + curr.cost, 0);
  const totalCost = roomBaseCost + expsCost;

  // Toggle Experiences
  const handleToggleExp = (exp: Experience) => {
    if (selectedExps.some((e) => e.id === exp.id)) {
      setSelectedExps((prev) => prev.filter((e) => e.id !== exp.id));
    } else {
      setSelectedExps((prev) => [...prev, exp]);
    }
  };

  // Process Confirmation / Firebase insertion
  const handleCompleteBooking = async () => {
    setSubmitting(true);
    const bookingId = "CST-" + Math.floor(100000 + Math.random() * 900000);
    
    // Construct database entity aligning metadata and schema requirements
    const newBooking: any = {
      id: bookingId,
      room: {
        id: room.id,
        name: room.name,
        ratePerNight: room.ratePerNight
      },
      checkIn,
      checkOut,
      guestsText: guests,
      nightsNum: nights,
      totalCost,
      status: "Confirmed",
      specialRequests: specialRequests.trim() || "None",
      billingName: `${firstName} ${lastName}`.trim(),
      billingEmail: billingEmail.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      countryRegion,
      phonePrefix,
      phoneNumber: phoneNumber.trim(),
      paperlessConfirmation,
      bookingForSelf,
      workTrip,
      cotRequested,
      arrivalTime,
      createdTime: new Date().toLocaleString()
    };

    const pathForWrite = `bookings/${bookingId}`;
    try {
      // Save directly to the live Firebase Firestore service
      await setDoc(doc(db, "bookings", bookingId), newBooking);
      console.log("Booking saved securely in Firebase DB.");
      
      setGeneratedBooking(newBooking);
      onBookingConfirmed(newBooking);
      setStep(3); // Go to final Success Screen
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, pathForWrite);
    } finally {
      setSubmitting(false);
    }
  };

  const executeWhatsAppLink = () => {
    if (!generatedBooking) return;
    const phoneNo = "070103 95526".replace(/\s+/g, '');
    const cleanNo = phoneNo.startsWith("0") ? "91" + phoneNo.substring(1) : phoneNo;
    
    const message = `Hello Coolspot Cottage!\n\nI would like to confirm my booking:\n` +
      `- Reference: ${generatedBooking.id}\n` +
      `- Guest: ${generatedBooking.billingName}\n` +
      `- Contact: ${generatedBooking.billingEmail}\n` +
      `- Phone: ${generatedBooking.phonePrefix} ${generatedBooking.phoneNumber}\n` +
      `- Room: ${generatedBooking.room.name}\n` +
      `- Dates: ${generatedBooking.checkIn} to ${generatedBooking.checkOut} (${generatedBooking.nightsNum} Nights)\n` +
      `- Guests: ${generatedBooking.guestsText}\n` +
      `- Special Requests: ${generatedBooking.specialRequests}\n` +
      `- Cot Requested: ${generatedBooking.cotRequested ? "Yes" : "No"}\n` +
      `- Total Pricing: $${generatedBooking.totalCost.toLocaleString()}\n\n` +
      `Please register this stay. Thank you!`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanNo}&text=${encoded}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-800 pb-20">
      
      {/* Spectacular Custom Hero Header section */}
      <section className="relative bg-[#001a52] text-white py-16 md:py-24 text-center px-4 overflow-hidden mb-10 select-none">
        <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 to-[#001a52]" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#819ae7] inline-block bg-white/10 px-3 py-1 rounded-full mb-3">
            ★ Coolspot Cottage Ooty Booking Portal
          </span>
          <h1 className="font-headline-lg text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
            Complete Your Bespoke Stay
          </h1>
          <p className="font-sans text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Configure your tranquil escape down the Elk Hill heights in Ooty. Enjoy lush greenery, bespoke hospitality, and modern convenience nested in pristine wilderness.
          </p>
        </div>
      </section>

      {/* Modern Horizontal Process Steps Counter */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
          {[
            { nr: 1, label: "Stay Specifications" },
            { nr: 2, label: "Guest Registry" },
            { nr: 3, label: "Confirmation Details" }
          ].map((s) => (
            <div key={s.nr} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                step === s.nr 
                  ? "bg-[#001a52] text-white" 
                  : step > s.nr 
                    ? "bg-emerald-500 text-white" 
                    : "bg-slate-100 text-slate-400"
              }`}>
                {step > s.nr ? <Check className="w-4 h-4" /> : s.nr}
              </div>
              <span className={`text-[11px] uppercase font-bold tracking-wider hidden sm:inline ${
                step === s.nr ? "text-[#001a52]" : "text-slate-400"
              }`}>
                {s.label}
              </span>
              {s.nr < 3 && <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ACTIVE INTERACTIVE FORM STEPS */}
        <div className="md:col-span-2 space-y-6">
          
          {/* STEP 1: Select Room and stay dates */}
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm space-y-6 text-left"
            >
              <div>
                <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold block mb-4 border-b pb-2">
                  1. Stay & Accommodation Selection
                </h3>

                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Room Category
                </label>
                <select
                  value={room.id}
                  onChange={(e) => {
                    const matched = VILLAS_DATA.find((r) => r.id === e.target.value);
                    if (matched) setRoom(matched);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-xs md:text-sm font-medium"
                >
                  {VILLAS_DATA.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — ${r.ratePerNight.toLocaleString()}/night
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates input */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs md:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs md:text-sm"
                  />
                </div>
              </div>

              {/* Guests Selection */}
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Guests Count
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs md:text-sm font-medium"
                >
                  <option>2 Adults, 0 Children</option>
                  <option>2 Adults, 1 Child</option>
                  <option>2 Adults, 2 Children</option>
                  <option>4 Adults, 0 Children</option>
                  <option>1 Adult, 0 Children</option>
                </select>
              </div>

              {/* Curation inclusions */}
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Include Elite Custom Activities
                </label>
                <div className="space-y-2.5">
                  {EXPERIENCES_DATA.map((exp) => {
                    const isChecked = selectedExps.some((e) => e.id === exp.id);
                    return (
                      <div
                        key={exp.id}
                        onClick={() => handleToggleExp(exp)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isChecked
                            ? "bg-[#e5eeff] dark:bg-white/10 border-indigo-200 font-bold text-[#001a52]"
                            : "bg-slate-50 border-slate-100 hover:bg-slate-100/60"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="rounded text-[#001a52] pointer-events-none"
                          />
                          <span>{exp.name}</span>
                        </div>
                        <span className="font-mono text-slate-500">+${exp.cost}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Continue button */}
              <button
                type="button"
                onClick={() => {
                  if (!checkIn || !checkOut) {
                    alert("Please specify stay dates!");
                    return;
                  }
                  setStep(2);
                }}
                className="w-full bg-[#001a52] hover:bg-[#0c2a68] text-white py-3 rounded-xl text-xs uppercase tracking-widest font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Guest Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Your details form (Replicating Screenshot 1) */}
          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-left"
            >
              {/* SignIn Notice Bar */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>
                    Sign in to book with your saved details or <strong className="text-indigo-600 hover:underline cursor-pointer">register</strong> to manage your bookings on the go!
                  </span>
                </div>
              </div>

              {/* Enter Details Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
                <h3 className="text-sm font-bold text-slate-800 tracking-tight pb-3 border-b flex items-center gap-1.5">
                  <span>Enter your details</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">First name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      placeholder="e.g. John"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Last name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      placeholder="e.g. Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Email address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    required
                    value={billingEmail} 
                    onChange={(e) => setBillingEmail(e.target.value)} 
                    placeholder="e.g. johndoe@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-xs"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Confirmation email goes to this address</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Country/region <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={countryRegion} 
                      onChange={(e) => setCountryRegion(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Phone number <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <select 
                        value={phonePrefix} 
                        onChange={(e) => setPhonePrefix(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 text-xs focus:outline-none"
                      >
                        <option>IN +91</option>
                        <option>US +1</option>
                        <option>GB +44</option>
                        <option>AE +971</option>
                      </select>
                      <input 
                        type="text" 
                        required
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        placeholder="070103 95526"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-xs"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Needed for the property to connect if required</p>
                  </div>
                </div>

                {/* Paperless checkbox */}
                <label className="flex items-start gap-2.5 py-2.5 px-3 bg-indigo-50/20 border border-indigo-100/40 rounded-xl cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={paperlessConfirmation} 
                    onChange={(e) => setPaperlessConfirmation(e.target.checked)}
                    className="rounded mt-0.5"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#001a52] block">Yes, I'd like free paperless confirmation (recommended)</span>
                    <span className="text-slate-400 text-[10px] block">We'll text you a link to download our app</span>
                  </div>
                </label>

                {/* Who are you booking for? Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-2">Who are you booking for? (optional)</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs">
                      <input 
                        type="radio" 
                        name="bookingFor" 
                        checked={bookingForSelf} 
                        onChange={() => setBookingForSelf(true)} 
                      />
                      <span>I am the main guest</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input 
                        type="radio" 
                        name="bookingFor" 
                        checked={!bookingForSelf} 
                        onChange={() => setBookingForSelf(false)} 
                      />
                      <span>Booking is for someone else</span>
                    </label>
                  </div>
                </div>

                {/* Traveling for work? */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-2">Are you travelling for work? (optional)</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs">
                      <input 
                        type="radio" 
                        name="workTrip" 
                        checked={workTrip} 
                        onChange={() => setWorkTrip(true)} 
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs">
                      <input 
                        type="radio" 
                        name="workTrip" 
                        checked={!workTrip} 
                        onChange={() => setWorkTrip(false)} 
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Good to know layout block matching screenshot */}
              <div className="bg-emerald-50/50 p-5 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-emerald-800">Good to know:</h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>No credit card needed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>No payment needed now. You'll pay at the property.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Congratulations! You've chosen the cheapest room at Coolspot Cottage. Don't miss out, book now!</span>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Special requests</h4>
                <p className="text-[10px] text-slate-400">Special requests cannot be guaranteed - but the property will do its best to meet your needs.</p>
                <textarea 
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Requests in English or Hindi (optional)..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs focus:outline-none"
                />
              </div>

              {/* Arrival estimated time */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Your arrival time</h4>
                <p className="text-[10px] text-slate-400">You can check in between 12:00 and 23:00</p>
                <select
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-xs"
                >
                  <option>Please select arrival estimate</option>
                  <option>12:00 - 13:00</option>
                  <option>13:00 - 14:00</option>
                  <option>14:00 - 15:00</option>
                  <option>15:00 - 16:00</option>
                  <option>17:00 - 18:00</option>
                  <option>18:00 - 23:00</option>
                </select>
              </div>

              {/* Cots card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Cots and extra beds</h4>
                <p className="text-[10px] text-slate-400">Requests are subject to availability and property confirmation</p>
                <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={cotRequested} 
                    onChange={(e) => setCotRequested(e.target.checked)}
                    className="rounded"
                  />
                  <span>Add Extra Cot Bed for Child</span>
                </label>
              </div>

              {/* Final Review House Rules banner */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800">Review house rules</h4>
                <div className="text-xs text-slate-500 space-y-1 bg-slate-50 p-3 rounded-xl">
                  <p>• No smoking inside cottage rooms</p>
                  <p>• No parties / events unless booked as complete villa</p>
                  <p>• Quiet hours strictly enforced between 23:00 and 06:00</p>
                </div>
                <p className="text-[10px] text-slate-400">By continuing, you are agreeing to these rules.</p>
              </div>

              {/* Navigation Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl border border-slate-300 text-slate-500 text-xs font-sans font-bold uppercase tracking-wider text-center"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!firstName || !lastName || !billingEmail || !phoneNumber) {
                      alert("Please complete all required fields! (First name, Last name, Email, Phone number)");
                      return;
                    }
                    // Validate email
                    if (!billingEmail.includes("@")) {
                      alert("Please enter a valid email address!");
                      return;
                    }
                    // Move to final submission
                    handleCompleteBooking();
                  }}
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#001a52] hover:bg-[#0c2a68] text-white text-xs font-sans font-black uppercase tracking-widest text-center rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-55"
                >
                  <span>{submitting ? "Processing Reservation..." : "Next: Final Details"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Complete screen (Replicating Screenshot 2) */}
          {step === 3 && generatedBooking && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-left"
            >
              {/* No Payment Details Required Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-5 top-5 w-24 h-24 text-amber-500/10 shrink-0">
                  <Coins className="w-full h-full rotate-12" />
                </div>
                
                <h3 className="font-headline-md text-lg text-slate-800 font-extrabold mb-2">No payment details required</h3>
                <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                  Your payment will be handled by Coolspot Cottage during check-in, so you don't need to enter any payment details online for this booking.
                </p>
              </div>

              {/* Status Alerting Card */}
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-800">Booking Successfully Authenticated!</h4>
                    <span className="text-[11px] font-mono uppercase bg-emerald-500/15 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">
                       ID Code: {generatedBooking.id}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#20513d] opacity-90 leading-relaxed">
                  Your resort booking is authenticated and saved in our cloud servers. A representative has been notified of your choice. Please tap below to instantly forward your itinerary via WhatsApp to secure cottage logistics.
                </p>

                {/* WhatsApp message forwarder */}
                <button
                  type="button"
                  onClick={executeWhatsAppLink}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs uppercase tracking-widest font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-emerald-100" />
                  <span>Send Confirmation WhatsApp (Hotline: 070103 95526)</span>
                </button>
              </div>

              {/* Success summary terms */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-800 pb-2 border-b">Compliance & Information agreement</h4>
                <label className="flex items-start gap-2 text-xs text-slate-500">
                  <input type="checkbox" defaultChecked className="rounded mt-0.5" />
                  <span>I agree to receiving marketing emails from Booking.com / Coolspot Cottage including promotions, personalized recommendations, and update alerts.</span>
                </label>

                <p className="text-[10px] text-slate-400 leading-normal">
                  By completing, you allow us to tailor offers and context to your interests by monitoring usage. Unsubscribe in config dashboard. Read our <strong className="hover:underline text-indigo-600 cursor-pointer">privacy policy</strong>.
                </p>
                <p className="text-[10px] text-slate-400 leading-normal pt-1 border-t border-slate-100">
                  Your booking is with Coolspot Cottage directly. Completing this request acts as mutual agreement to the cottage guide <strong className="hover:underline text-indigo-600 cursor-pointer">booking conditions</strong> and <strong className="hover:underline text-indigo-600 cursor-pointer">general terms</strong>.
                </p>
              </div>

              <div className="pb-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full text-center py-3 rounded-xl border border-slate-200 hover:border-[#001a52] text-[#001a52] text-xs font-bold uppercase tracking-wider cursor-pointer font-sans"
                >
                  Return to Landing Page
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN: PRICE ESTIMATES OVERVIEW BOX */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-left">
            <h4 className="text-[10px] uppercase tracking-widest text-[#4a607c] font-black border-b pb-2">
              Stay Details Summary
            </h4>

            {/* Room Category details preview */}
            <div className="flex gap-3">
              <img 
                src={room.imageUrl || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80"} 
                alt={room.name} 
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100" 
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#819ae7] block">Selected Suite</span>
                <span className="text-xs font-bold text-slate-800 block leading-tight">{room.name}</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">${room.ratePerNight} / Night</span>
              </div>
            </div>

            {/* Stay Info specifics list */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Stay Duration:</span>
                <span className="font-semibold text-[#001a52]">{nights} Night{nights > 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stay Dates:</span>
                <span className="font-semibold text-slate-600">{checkIn || "Not set"} to {checkOut || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Guests:</span>
                <span className="font-semibold text-slate-600">{guests}</span>
              </div>
              {selectedExps.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Bespoke Inclusions:</span>
                  <span className="font-semibold text-slate-600">{selectedExps.length} Selected</span>
                </div>
              )}
              {cotRequested && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Extra Cot Bed:</span>
                  <span className="font-semibold text-[#001a52]">Yes (+ Included)</span>
                </div>
              )}
            </div>

            {/* Price breakdown invoice */}
            <div className="bg-[#f8f9ff] p-4 rounded-2xl space-y-2 border border-slate-100 shadow-inner mt-2">
              <main className="flex justify-between text-xs text-slate-600">
                <span>Room Charges:</span>
                <span className="font-mono font-bold">${roomBaseCost.toLocaleString()}</span>
              </main>

              {selectedExps.length > 0 && (
                <main className="flex justify-between text-xs text-slate-600">
                  <span>Curated Exps:</span>
                  <span className="font-mono font-bold">${expsCost.toLocaleString()}</span>
                </main>
              )}

              <footer className="flex justify-between items-baseline pt-2 border-t border-slate-200/40 text-[#001a52]">
                <span className="text-[10px] font-sans uppercase font-bold tracking-wider">Estimated Total</span>
                <span className="font-headline-md text-xl font-black">${totalCost.toLocaleString()}</span>
              </footer>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
