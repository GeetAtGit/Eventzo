import { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  CreditCard,
  IndianRupee,
  MapPin,
  Sparkles,
  Ticket,
  User,
  Building2,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:5001/api/bookings",
        getAuthConfig()
      );
      setBookings(data);
    } catch (error) {
      console.error("FETCH BOOKINGS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      setUpdatingId(bookingId);

      await axios.put(
        `http://localhost:5001/api/bookings/${bookingId}/status`,
        { status },
        getAuthConfig()
      );

      fetchBookings();
    } catch (error) {
      console.error("UPDATE BOOKING STATUS ERROR:", error);
      console.error("SERVER RESPONSE:", error.response?.data);
      alert(error.response?.data?.message || "Failed to update booking status");
    }finally {
      setUpdatingId("");
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Confirmed") {
      return "bg-emerald-100 text-emerald-700";
    }
    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }
    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Admin Booking Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Manage Bookings
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review all event and venue bookings and update their statuses
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">No bookings found.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bookings.map((booking) => {
              const item = booking.type === "event" ? booking.event : booking.venue;
              const isEvent = booking.type === "event";
              const quantity = isEvent
                ? Number(booking.guests || 1)
                : Number(booking.days || 1);
              const unitPrice = Number(item?.price || 0);
              const finalPrice =
                booking.totalPrice != null
                  ? Number(booking.totalPrice)
                  : unitPrice * quantity;

              return (
                <div
                  key={booking._id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="h-44 overflow-hidden bg-slate-100">
                    {item?.image ? (
                      <img
                        src={item.image}
                        alt={item?.title || item?.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h2 className="line-clamp-1 text-lg font-semibold text-slate-900">
                        {item?.title || item?.name || "Booking Item"}
                      </h2>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isEvent
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {isEvent ? "Event" : "Venue"}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="line-clamp-1">
                          {booking.user?.name || "User"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-slate-400" />
                        <span className="line-clamp-1">
                          {booking.user?.email || "No email"}
                        </span>
                      </div>

                      {item?.venue && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-rose-500" />
                          <span className="line-clamp-1">{item.venue}</span>
                        </div>
                      )}

                      {item?.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-orange-500" />
                          <span className="line-clamp-1">{item.location}</span>
                        </div>
                      )}

                      {isEvent ? (
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-sky-500" />
                          <span>{quantity} ticket(s)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-sky-500" />
                          <span>{quantity} day(s)</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        <span>
                          {booking.bookingDate
                            ? new Date(booking.bookingDate).toLocaleDateString()
                            : "No date"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-slate-400" />
                        <span>{booking.paymentMethod || "Cash"}</span>
                      </div>

                      <div className="flex items-center gap-2 font-medium text-slate-800">
                        <IndianRupee className="h-4 w-4 text-emerald-600" />
                        <span>{finalPrice}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {booking.status || "Pending"}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <button
                        onClick={() =>
                          handleStatusChange(booking._id, "Confirmed")
                        }
                        disabled={updatingId === booking._id}
                        className="inline-flex items-center justify-center gap-1 rounded-2xl bg-emerald-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-600 disabled:opacity-70"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Confirm
                      </button>

                      <button
                        onClick={() =>
                          handleStatusChange(booking._id, "Pending")
                        }
                        disabled={updatingId === booking._id}
                        className="inline-flex items-center justify-center gap-1 rounded-2xl bg-amber-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-amber-600 disabled:opacity-70"
                      >
                        <AlertCircle className="h-4 w-4" />
                        Pending
                      </button>

                      <button
                        onClick={() =>
                          handleStatusChange(booking._id, "Cancelled")
                        }
                        disabled={updatingId === booking._id}
                        className="inline-flex items-center justify-center gap-1 rounded-2xl bg-red-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-600 disabled:opacity-70"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel
                      </button>
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

export default ManageBookings;