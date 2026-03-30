import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  CalendarDays, CreditCard, IndianRupee, MapPin,
  Ticket, User, Building2, Clock3, CheckCircle2,
  XCircle, AlertCircle, Search, Filter,
  BarChart3, Layers3, Wallet,
} from "lucide-react";

const BOOKING_API = import.meta.env.VITE_BOOKING_API;

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => { fetchBookings(); }, []);

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BOOKING_API}/api/bookings`, getAuthConfig());
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
      await axios.put(`${BOOKING_API}/api/bookings/${bookingId}/status`, { status }, getAuthConfig());
      fetchBookings();
    } catch (error) {
      console.error("UPDATE BOOKING STATUS ERROR:", error);
      alert(error.response?.data?.message || "Failed to update booking status");
    } finally {
      setUpdatingId("");
    }
  };

  const metrics = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === "Confirmed").length;
    const pending = bookings.filter(b => b.status === "Pending" || !b.status).length;
    const cancelled = bookings.filter(b => b.status === "Cancelled").length;
    const revenue = bookings
      .filter(b => b.status === "Confirmed")
      .reduce((sum, b) => {
        const item = b.type === "event" ? b.event : b.venue;
        const qty = b.type === "event" ? Number(b.guests || 1) : Number(b.days || 1);
        return sum + (b.totalPrice != null ? Number(b.totalPrice) : Number(item?.price || 0) * qty);
      }, 0);
    const eventBookings = bookings.filter(b => b.type === "event").length;
    const venueBookings = bookings.filter(b => b.type !== "event").length;
    return { total, confirmed, pending, cancelled, revenue, eventBookings, venueBookings };
  }, [bookings]);

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const item = b.type === "event" ? b.event : b.venue;
      const name = (item?.title || item?.name || "").toLowerCase();
      const userName = (b.user?.name || "").toLowerCase();
      const email = (b.user?.email || "").toLowerCase();
      const term = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || name.includes(term) || userName.includes(term) || email.includes(term);
      const matchesStatus = statusFilter === "All" || (b.status || "Pending") === statusFilter;
      const matchesType = typeFilter === "All" || (typeFilter === "Event" ? b.type === "event" : b.type !== "event");
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [bookings, searchTerm, statusFilter, typeFilter]);

  const getStatusStyle = (status) => {
    if (status === "Confirmed") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "Cancelled") return "bg-red-100 text-red-700 border-red-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Bookings</h1>
          <p className="mt-2 text-sm text-slate-500">Review all bookings, update statuses, and track revenue</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <MetricCard label="Total" value={metrics.total} icon={<Layers3 size={15} />} color="slate" />
          <MetricCard label="Confirmed" value={metrics.confirmed} icon={<CheckCircle2 size={15} />} color="emerald" />
          <MetricCard label="Pending" value={metrics.pending} icon={<AlertCircle size={15} />} color="amber" />
          <MetricCard label="Cancelled" value={metrics.cancelled} icon={<XCircle size={15} />} color="red" />
          <MetricCard label="Events" value={metrics.eventBookings} icon={<CalendarDays size={15} />} color="blue" />
          <MetricCard label="Venues" value={metrics.venueBookings} icon={<Building2 size={15} />} color="violet" />
        </div>

        <div className="mb-6 rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shrink-0">
              <Wallet size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Confirmed Revenue</p>
              <p className="text-2xl font-bold text-slate-900">₹{metrics.revenue.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-xs text-slate-500">Confirmation Rate</p>
              <p className="font-semibold text-slate-800">{metrics.total > 0 ? Math.round((metrics.confirmed / metrics.total) * 100) : 0}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Cancellation Rate</p>
              <p className="font-semibold text-slate-800">{metrics.total > 0 ? Math.round((metrics.cancelled / metrics.total) * 100) : 0}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Avg per Booking</p>
              <p className="font-semibold text-slate-800">₹{metrics.confirmed > 0 ? Math.round(metrics.revenue / metrics.confirmed).toLocaleString("en-IN") : 0}</p>
            </div>
          </div>
        </div>

        <div className="mb-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search by name, user, email..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-900 transition" />
            </div>
            <div className="relative">
              <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-900 transition">
                <option>All</option><option>Confirmed</option><option>Pending</option><option>Cancelled</option>
              </select>
            </div>
            <div className="relative">
              <BarChart3 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-900 transition">
                <option>All</option><option>Event</option><option>Venue</option>
              </select>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-4">Showing {filtered.length} of {bookings.length} bookings</p>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">Loading bookings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">No bookings match your filters.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((booking) => {
              const item = booking.type === "event" ? booking.event : booking.venue;
              const isEvent = booking.type === "event";
              const quantity = isEvent ? Number(booking.guests || 1) : Number(booking.days || 1);
              const finalPrice = booking.totalPrice != null ? Number(booking.totalPrice) : Number(item?.price || 0) * quantity;
              const status = booking.status || "Pending";
              return (
                <div key={booking._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md flex flex-col">
                  <div className="relative h-40 overflow-hidden bg-slate-100 shrink-0">
                    {item?.image ? (
                      <img src={item.image} alt={item?.title || item?.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300 text-sm">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isEvent ? "bg-blue-500/90 text-white" : "bg-violet-500/90 text-white"}`}>
                        {isEvent ? "Event" : "Venue"}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold bg-white/90 ${getStatusStyle(status)}`}>{status}</span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="line-clamp-1 text-base font-semibold text-slate-900 mb-3">{item?.title || item?.name || "Booking Item"}</h2>
                    <div className="space-y-2 text-sm text-slate-600 flex-1">
                      <div className="flex items-center gap-2"><User size={13} className="text-slate-400 shrink-0" /><span className="line-clamp-1">{booking.user?.name || "Unknown"}</span></div>
                      <div className="flex items-center gap-2"><Ticket size={13} className="text-slate-400 shrink-0" /><span className="line-clamp-1 text-xs">{booking.user?.email || "—"}</span></div>
                      {(item?.venue || item?.location) && (
                        <div className="flex items-center gap-2"><MapPin size={13} className="text-rose-400 shrink-0" /><span className="line-clamp-1">{item.venue || item.location}</span></div>
                      )}
                      <div className="flex items-center gap-2">
                        {isEvent ? <Ticket size={13} className="text-sky-500 shrink-0" /> : <Clock3 size={13} className="text-sky-500 shrink-0" />}
                        <span>{quantity} {isEvent ? "ticket(s)" : "day(s)"}</span>
                      </div>
                      <div className="flex items-center gap-2"><CalendarDays size={13} className="text-slate-400 shrink-0" /><span>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString("en-IN") : "—"}</span></div>
                      <div className="flex items-center gap-2"><CreditCard size={13} className="text-slate-400 shrink-0" /><span>{booking.paymentMethod || "Cash"}</span></div>
                    </div>
                    <div className="mt-3 mb-4 flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2">
                      <span className="text-xs text-slate-500">Total Amount</span>
                      <div className="flex items-center gap-1 font-bold text-slate-900"><IndianRupee size={13} className="text-emerald-600" />{finalPrice.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button onClick={() => handleStatusChange(booking._id, "Confirmed")} disabled={updatingId === booking._id || status === "Confirmed"} className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500 px-2 py-2 text-xs font-medium text-white transition hover:bg-emerald-600 disabled:opacity-40"><CheckCircle2 size={12} /> Confirm</button>
                      <button onClick={() => handleStatusChange(booking._id, "Pending")} disabled={updatingId === booking._id || status === "Pending"} className="inline-flex items-center justify-center gap-1 rounded-xl bg-amber-500 px-2 py-2 text-xs font-medium text-white transition hover:bg-amber-600 disabled:opacity-40"><AlertCircle size={12} /> Pending</button>
                      <button onClick={() => handleStatusChange(booking._id, "Cancelled")} disabled={updatingId === booking._id || status === "Cancelled"} className="inline-flex items-center justify-center gap-1 rounded-xl bg-red-500 px-2 py-2 text-xs font-medium text-white transition hover:bg-red-600 disabled:opacity-40"><XCircle size={12} /> Cancel</button>
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

function MetricCard({ label, value, icon, color }) {
  const styles = {
    slate: "bg-slate-50 border-slate-200 text-slate-600",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
    amber: "bg-amber-50 border-amber-200 text-amber-600",
    red: "bg-red-50 border-red-200 text-red-600",
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    violet: "bg-violet-50 border-violet-200 text-violet-600",
  };
  return (
    <div className={`rounded-2xl border ${styles[color]} p-4`}>
      <div className="flex items-center gap-1.5 mb-2 opacity-70">{icon}<span className="text-xs font-medium">{label}</span></div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default ManageBookings;
