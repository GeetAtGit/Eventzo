import { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  CreditCard,
  MapPin,
  Users,
  BadgeIndianRupee,
  Ticket,
  Building2,
  ImageOff,
  Clock3,
} from "lucide-react";

const BOOKING_API = import.meta.env.VITE_BOOKING_API;

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(`${BOOKING_API}/api/bookings/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setBookings(data); // ✅ FIXED
  } catch (error) {
    console.error("FETCH BOOKINGS ERROR:", error);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 text-lg font-medium">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Bookings</h1>
          <p className="text-slate-500 mt-2">
            Track your event and venue reservations in one place
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
            <p className="text-slate-500 text-lg">No bookings found yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bookings.map((booking) => {
              const item = booking.type === "event" ? booking.event : booking.venue;

              const unitPrice = Number(item?.price ?? booking.price ?? 0);

              const quantity =
                booking.type === "event"
                  ? Number(booking.guests ?? booking.tickets ?? 1)
                  : Number(booking.days ?? 1);

              const totalPrice =
                booking.totalPrice != null
                  ? Number(booking.totalPrice)
                  : unitPrice * quantity;

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <div className="h-40 w-full bg-slate-100 overflow-hidden">
                    {item?.image ? (
                      <img
                        src={item.image}
                        alt={item?.title || item?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <ImageOff size={28} />
                          <span className="text-xs">No Image</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h2 className="text-lg font-semibold text-slate-800 line-clamp-1">
                        {item?.title || item?.name || "Booking Item"}
                      </h2>

                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                          booking.type === "event"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {booking.type === "event" ? "Event" : "Venue"}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-sm text-slate-600">
                      {item?.venue && (
                        <div className="flex items-center gap-2">
                          <Building2 size={15} className="text-slate-400" />
                          <span className="line-clamp-1">{item.venue}</span>
                        </div>
                      )}

                      {item?.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-slate-400" />
                          <span className="line-clamp-1">{item.location}</span>
                        </div>
                      )}

                      {booking.type === "event" ? (
                        <div className="flex items-center gap-2">
                          <Users size={15} className="text-slate-400" />
                          <span>{quantity} ticket(s)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Clock3 size={15} className="text-slate-400" />
                          <span>{quantity} day(s)</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <CalendarDays size={15} className="text-slate-400" />
                        <span>
                          {booking.bookingDate
                            ? new Date(booking.bookingDate).toLocaleDateString()
                            : "No date"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CreditCard size={15} className="text-slate-400" />
                        <span>{booking.paymentMethod || "Cash"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <BadgeIndianRupee size={15} className="text-slate-400" />
                        <span className="font-medium text-slate-800">
                          ₹{totalPrice}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 pl-6">
                        ₹{unitPrice} × {quantity}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          booking.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : booking.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {booking.status || "Pending"}
                      </span>

                      <div className="flex items-center gap-1 text-slate-400">
                        <Ticket size={15} />
                        <span className="text-xs">Booked</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;