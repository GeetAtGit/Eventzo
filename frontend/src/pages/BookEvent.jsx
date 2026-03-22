import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  CalendarDays,
  CreditCard,
  IndianRupee,
  MapPin,
  Ticket,
  Users,
  Sparkles,
  Building2,
  Clock3,
} from "lucide-react";

function BookEvent() {
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const item = location.state?.item;

  const [guests, setGuests] = useState(1);
  const [bookingDate, setBookingDate] = useState("");
  const [days, setDays] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center text-red-600 shadow-sm">
          No booking data found. Please go back and select again.
        </div>
      </div>
    );
  }

  const unitPrice = Number(item?.price || 0);

  const totalPrice = useMemo(() => {
    if (type === "event") {
      return unitPrice * Number(guests || 1);
    }
    return unitPrice * Number(days || 1);
  }, [type, unitPrice, guests, days]);

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        type,
        bookingDate: type === "event" ? item.date : bookingDate,
        paymentMethod,
        totalPrice,
        ...(type === "event"
          ? { eventId: id, guests: Number(guests) }
          : { venueId: id, days: Number(days) }),
      };

      console.log("BOOKING PAYLOAD:", payload);

      await axios.post("http://localhost:5001/api/bookings", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(`${type === "event" ? "Event" : "Venue"} booked successfully!`);
      navigate("/my-bookings");
    } catch (error) {
      console.error("BOOKING ERROR:", error);
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Simple and secure booking
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Book {type === "event" ? "Event" : "Venue"}
          </h1>
          <p className="mt-2 text-sm text-slate-500 md:text-base">
            Confirm your details and complete your booking in a few steps
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left details */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {item.image && (
              <div className="h-60 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title || item.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                {item.title || item.name}
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                {item.description || "No description available"}
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 text-slate-700">
                  <IndianRupee className="h-5 w-5 text-emerald-600" />
                  <span>
                    <span className="font-medium">
                      {type === "event"
                        ? "Price per ticket:"
                        : "Price per day:"}
                    </span>{" "}
                    ₹{unitPrice}
                  </span>
                </div>

                {item.venue && (
                  <div className="flex items-center gap-3 text-slate-700">
                    <Building2 className="h-5 w-5 text-rose-500" />
                    <span>
                      <span className="font-medium">Venue:</span> {item.venue}
                    </span>
                  </div>
                )}

                {item.location && (
                  <div className="flex items-center gap-3 text-slate-700">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    <span>
                      <span className="font-medium">Location:</span>{" "}
                      {item.location}
                    </span>
                  </div>
                )}

                {item.date && type === "event" && (
                  <div className="flex items-center gap-3 text-slate-700">
                    <CalendarDays className="h-5 w-5 text-sky-500" />
                    <span>
                      <span className="font-medium">Event date:</span>{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">
              Booking Details
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Fill in your details below to confirm the reservation
            </p>

            <form onSubmit={handleBooking} className="mt-6 space-y-5">
              {type === "event" && (
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Users className="h-4 w-4 text-slate-500" />
                    Number of Tickets / Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                    required
                  />
                </div>
              )}

              {type === "venue" && (
                <>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                      <CalendarDays className="h-4 w-4 text-slate-500" />
                      Booking Start Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Clock3 className="h-4 w-4 text-slate-500" />
                      Number of Days
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CreditCard className="h-4 w-4 text-slate-500" />
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Ticket className="h-4 w-4 text-rose-500" />
                  Booking Summary
                </h4>

                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>
                      {type === "event" ? "Price per ticket" : "Price per day"}
                    </span>
                    <span>₹{unitPrice}</span>
                  </div>

                  {type === "event" ? (
                    <div className="flex items-center justify-between">
                      <span>Tickets / Guests</span>
                      <span>{guests}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>Number of days</span>
                      <span>{days}</span>
                    </div>
                  )}

                  {type === "event" && item.date && (
                    <div className="flex items-center justify-between">
                      <span>Event date</span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  )}

                  {type === "venue" && bookingDate && (
                    <div className="flex items-center justify-between">
                      <span>Start date</span>
                      <span>{new Date(bookingDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="border-t border-rose-200 pt-2" />

                  <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                    <span>Total Price</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
              >
                {loading ? "Booking..." : `Confirm Booking • ₹${totalPrice}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookEvent;