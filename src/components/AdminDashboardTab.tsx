import React, { useState, useEffect } from "react";
import { 
  Lock, 
  User, 
  ShieldCheck, 
  RefreshCcw, 
  Trash2, 
  Edit2, 
  Plus, 
  Check, 
  Calendar, 
  Mail, 
  Phone, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Briefcase,
  Layers,
  X
} from "lucide-react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc 
} from "firebase/firestore";
import { Booking, Room } from "../types";
import { VILLAS_DATA } from "../data";
import { motion } from "motion/react";

export default function AdminDashboardTab() {
  // Authentication states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(false);

  // Administrative Data lists
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Form toggles for Add / Edit actions
  const [showFormModal, setShowFormModal] = useState(false);
  const [editBookingId, setEditBookingId] = useState<string | null>(null);

  // Schema state variables for Add / Edit Form Inputs
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRoomId, setFormRoomId] = useState(VILLAS_DATA[0].id);
  const [formCheckIn, setFormCheckIn] = useState("");
  const [formCheckOut, setFormCheckOut] = useState("");
  const [formGuestsText, setFormGuestsText] = useState("2 Adults, 0 Children");
  const [formStatus, setFormStatus] = useState<"Confirmed" | "Completed" | "Pending">("Confirmed");
  const [formRequests, setFormRequests] = useState("");
  const [formCot, setFormCot] = useState(false);

  // Authenticate user via Firestore Admin Seeding credentials
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingAuth(true);
    setAuthError("");

    const normalizedUser = usernameInput.trim().toLowerCase();
    const pathForGet = `admins/${normalizedUser}`;

    try {
      const adminRef = doc(db, "admins", normalizedUser);
      const snap = await getDoc(adminRef);

      if (snap.exists()) {
        const data = snap.data();
        if (data.password === passwordInput) {
          setIsAdminLoggedIn(true);
          fetchBookings();
        } else {
          setAuthError("Incorrect password. Please try again.");
        }
      } else {
        // Fallback checks just in case Firestore hasn't seeded yet on first turn load
        if ((normalizedUser === "coolcootage" || normalizedUser === "coolcottage") && passwordInput === "12345") {
          setIsAdminLoggedIn(true);
          fetchBookings();
        } else {
          setAuthError("Admin username not found in database.");
        }
      }
    } catch (err) {
      setAuthError("Error authenticating with Firestore. Check connectivity.");
    } finally {
      setCheckingAuth(false);
    }
  };

  // Fetch all bookings from Firebase Firestore
  const fetchBookings = async () => {
    setLoadingBookings(true);
    const pathForListing = "bookings";
    try {
      const colRef = collection(db, "bookings");
      const snap = await getDocs(colRef);
      const list: any[] = [];
      snap.forEach((d) => {
        list.push({ ...d.data(), firestoreDocId: d.id });
      });
      // Sort bookings by creation date of doc
      setBookingsList(list);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, pathForListing);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Launch modal configured for Add or Edit Mode
  const openFormModal = (bookingToEdit?: any) => {
    if (bookingToEdit) {
      setEditBookingId(bookingToEdit.id);
      setFormFirstName(bookingToEdit.firstName || bookingToEdit.billingName?.split(" ")[0] || "");
      setFormLastName(bookingToEdit.lastName || bookingToEdit.billingName?.split(" ")[1] || "");
      setFormEmail(bookingToEdit.billingEmail || "");
      setFormPhone(bookingToEdit.phoneNumber || "");
      setFormRoomId(bookingToEdit.room?.id || VILLAS_DATA[0].id);
      setFormCheckIn(bookingToEdit.checkIn || "");
      setFormCheckOut(bookingToEdit.checkOut || "");
      setFormGuestsText(bookingToEdit.guestsText || "2 Adults, 0 Children");
      setFormStatus(bookingToEdit.status || "Confirmed");
      setFormRequests(bookingToEdit.specialRequests || "");
      setFormCot(!!bookingToEdit.cotRequested);
    } else {
      setEditBookingId(null);
      setFormFirstName("");
      setFormLastName("");
      setFormEmail("");
      setFormPhone("");
      setFormRoomId(VILLAS_DATA[0].id);
      setFormCheckIn("");
      setFormCheckOut("");
      setFormGuestsText("2 Adults, 0 Children");
      setFormStatus("Confirmed");
      setFormRequests("");
      setFormCot(false);
    }
    setShowFormModal(true);
  };

  // Handle Form Submission - Create or Update a Booking
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName || !formLastName || !formEmail || !formCheckIn || !formCheckOut) {
      alert("Please complete all required fields.");
      return;
    }

    const matchedRoom = VILLAS_DATA.find((r) => r.id === formRoomId) || VILLAS_DATA[0];
    
    // Calculate nights number
    let nightsNum = 1;
    const start = new Date(formCheckIn);
    const end = new Date(formCheckOut);
    const diff = end.getTime() - start.getTime();
    if (diff > 0) {
      nightsNum = Math.ceil(diff / (1000 * 3600 * 24));
    }
    const totalCost = matchedRoom.ratePerNight * nightsNum;

    const bookingId = editBookingId || "CST-" + Math.floor(100000 + Math.random() * 900000);
    const bookingPayload: any = {
      id: bookingId,
      room: {
        id: matchedRoom.id,
        name: matchedRoom.name,
        ratePerNight: matchedRoom.ratePerNight
      },
      checkIn: formCheckIn,
      checkOut: formCheckOut,
      guestsText: formGuestsText,
      nightsNum,
      totalCost,
      status: formStatus,
      specialRequests: formRequests.trim() || "None",
      billingName: `${formFirstName} ${formLastName}`.trim(),
      billingEmail: formEmail.trim(),
      firstName: formFirstName.trim(),
      lastName: formLastName.trim(),
      phonePrefix: "IN +91",
      phoneNumber: formPhone.trim(),
      paperlessConfirmation: true,
      bookingForSelf: true,
      workTrip: false,
      cotRequested: formCot,
      createdTime: new Date().toLocaleDateString()
    };

    const pathForWrite = `bookings/${bookingId}`;
    try {
      await setDoc(doc(db, "bookings", bookingId), bookingPayload);
      setShowFormModal(false);
      fetchBookings();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, pathForWrite);
    }
  };

  // Delete a Booking record from Firestore DB
  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the reservation ${bookingId}?`)) return;
    
    const pathForDelete = `bookings/${bookingId}`;
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      fetchBookings();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, pathForDelete);
    }
  };

  // Render Login interface if they are not logged in yet
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#f8f9ff] px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full text-left"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#001a52]/5 text-[#001a52] flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-headline-lg text-2xl font-bold text-slate-800 tracking-tight">Admin Live Console</h3>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Authorized access only</span>
          </div>

          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium mb-5 border border-red-100">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={usernameInput} 
                  onChange={(e) => setUsernameInput(e.target.value)} 
                  placeholder="e.g. coolcootage" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  value={passwordInput} 
                  onChange={(e) => setPasswordInput(e.target.value)} 
                  placeholder="Password Code" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={checkingAuth}
              className="w-full bg-[#001a52] hover:bg-slate-800 text-white font-sans text-xs uppercase tracking-widest font-black py-3 rounded-xl transition-all shadow-md mt-6 cursor-pointer"
            >
              {checkingAuth ? "Authenticating..." : "Authorize Console"}
            </button>
          </form>

          <p className="text-[10px] text-slate-400 text-center mt-5 leading-normal">
            Seed accounts are set of <strong>coolcootage</strong> / <strong>12345</strong> saved securely in cloud Firestore.
          </p>
        </motion.div>
      </div>
    );
  }

  // Calculate sum metric total costs for top statistics counters
  const totalRevenue = bookingsList.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);
  const pendingCount = bookingsList.filter((b) => b.status === "Pending").length;
  const confirmedCount = bookingsList.filter((b) => b.status === "Confirmed").length;
  const completedCount = bookingsList.filter((b) => b.status === "Completed").length;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-800 pb-20 pt-24 text-left max-w-7xl mx-auto px-4 md:px-8">
      
      {/* Admin Dashboard header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
            Cloud Relational Firestore Connected
          </span>
          <h2 className="font-headline-lg text-3xl font-black text-slate-800 tracking-tight mt-1">
            Cottage Reservations Console
          </h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchBookings}
            className="p-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs flex items-center gap-1.5 font-bold cursor-pointer transition-all"
          >
            <RefreshCcw className="w-4 h-4 text-indigo-500" />
            <span>Sync DB</span>
          </button>
          <button
            onClick={() => openFormModal()}
            className="p-3 bg-[#001a52] hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Create Reservation</span>
          </button>
        </div>
      </section>

      {/* Top statistics summary row */}
      <main className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Grand Volume</span>
            <span className="text-sm font-bold text-slate-800 block">${totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Total Bookings</span>
            <span className="text-sm font-bold text-slate-800 block">{bookingsList.length} Accounts</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Live Verified</span>
            <span className="text-sm font-bold text-slate-800 block">{confirmedCount} Active</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Pending Hold</span>
            <span className="text-sm font-bold text-slate-800 block">{pendingCount} holds</span>
          </div>
        </div>
      </main>

      {/* Bookings Ledger Records table */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
        {loadingBookings ? (
          <div className="flex flex-col items-center justify-center h-[350px] text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3" />
            <span>Reading cloud database indexes...</span>
          </div>
        ) : bookingsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[350px] text-slate-400 text-xs">
            <span>No reservations stored in Firestore database.</span>
            <button 
              onClick={() => openFormModal()}
              className="text-indigo-600 hover:underline mt-2 text-xs font-bold"
            >
              Add the first booking now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9ff] text-[#4a607c] font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-4 px-5">ID Code</th>
                  <th className="py-4 px-5">Guest details</th>
                  <th className="py-4 px-5">Stay Accommodation</th>
                  <th className="py-4 px-5">Date Intervals</th>
                  <th className="py-4 px-5">Grand Total</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Console Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {bookingsList.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-black text-xs">
                      {bk.id}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-800 text-xs">{bk.billingName || "Guest"}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{bk.billingEmail}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{bk.phonePrefix || ""} {bk.phoneNumber || "No Phone"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-bold text-slate-700 block text-xs">{bk.room?.name || "Suite"}</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">Guests config: {bk.guestsText || "2 Guests"}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-medium text-slate-600 block text-xs">{bk.checkIn} to {bk.checkOut}</span>
                      <span className="text-[10px] text-indigo-500 font-bold block mt-1">{bk.nightsNum || 1} Nights Stay</span>
                    </td>
                    <td className="py-4 px-5 font-mono font-bold text-slate-800 text-xs">
                      ${(bk.totalCost || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        bk.status === "Pending" 
                          ? "bg-amber-500/10 text-amber-500" 
                          : bk.status === "Completed" 
                            ? "bg-emerald-500/10 text-emerald-500" 
                            : "bg-indigo-500/10 text-indigo-500"
                      }`}>
                        {bk.status || "Confirmed"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openFormModal(bk)}
                        className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg inline-block text-xs font-bold shrink-0 cursor-pointer"
                        title="Edit Booking"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(bk.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg inline-block text-xs font-bold shrink-0 cursor-pointer"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CREATE / EDIT FORM MODAL FOR EVERYTHING CLOUD-STORED SYNC */}
      {showFormModal && (
        <div className="fixed inset-0 bg-[#001a52]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-left border border-slate-100 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100">
              <h3 className="font-headline-lg text-lg font-bold text-slate-800">
                {editBookingId ? `Update Reservation ${editBookingId}` : "Create New SQL-style Booking"}
              </h3>
              <button 
                onClick={() => setShowFormModal(false)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">First Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formFirstName} 
                    onChange={(e) => setFormFirstName(e.target.value)} 
                    placeholder="e.g. Martha"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Last Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formLastName} 
                    onChange={(e) => setFormLastName(e.target.value)} 
                    placeholder="e.g. Kent"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Email <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    value={formEmail} 
                    onChange={(e) => setFormEmail(e.target.value)} 
                    placeholder="e.g. marthak@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={formPhone} 
                    onChange={(e) => setFormPhone(e.target.value)} 
                    placeholder="e.g. 070103 95526"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Villa Suite</label>
                <select 
                  value={formRoomId} 
                  onChange={(e) => setFormRoomId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-semibold"
                >
                  {VILLAS_DATA.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — ${r.ratePerNight}/Night
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Check In <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={formCheckIn} 
                    onChange={(e) => setFormCheckIn(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Check Out <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={formCheckOut} 
                    onChange={(e) => setFormCheckOut(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Guests text option</label>
                  <select 
                    value={formGuestsText} 
                    onChange={(e) => setFormGuestsText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs"
                  >
                    <option>2 Adults, 0 Children</option>
                    <option>2 Adults, 1 Child</option>
                    <option>2 Adults, 2 Children</option>
                    <option>4 Adults, 0 Children</option>
                    <option>1 Adult, 0 Children</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Operational status</label>
                  <select 
                    value={formStatus} 
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-semibold"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Special requests</label>
                <textarea 
                  value={formRequests} 
                  onChange={(e) => setFormRequests(e.target.value)} 
                  placeholder="Remarks..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold select-none cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formCot} 
                    onChange={(e) => setFormCot(e.target.checked)} 
                    className="rounded"
                  />
                  <span>Add Extra Cot Bed</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold uppercase text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#001a52] hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest text-center shadow"
                >
                  {editBookingId ? "Save Modifications" : "Assemble Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
