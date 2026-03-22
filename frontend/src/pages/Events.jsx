import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CalendarDays,
  MapPin,
  IndianRupee,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5001/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents(res.data);
      setError("");
    } catch (err) {
      console.error("FETCH EVENTS ERROR:", err);
      setError(err.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (eventItem) => {
    navigate(`/book/event/${eventItem._id}`, { state: { item: eventItem } });
  };

  const uniqueVenues = useMemo(() => {
    const venues = events
      .map((event) => event.venue?.trim())
      .filter(Boolean);

    return ["All", ...new Set(venues)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(term) ||
          event.name?.toLowerCase().includes(term) ||
          event.venue?.toLowerCase().includes(term) ||
          event.description?.toLowerCase().includes(term)
      );
    }

    if (selectedVenue !== "All") {
      filtered = filtered.filter((event) => event.venue === selectedVenue);
    }

    if (sortBy === "priceLowToHigh") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "priceHighToLow") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "dateEarliest") {
      filtered.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    } else if (sortBy === "dateLatest") {
      filtered.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    }

    return filtered;
  }, [events, searchTerm, selectedVenue, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 text-lg">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-center text-red-600 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Discover curated experiences
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Available Events
          </h1>
          <p className="mt-2 text-sm text-slate-500 md:text-base">
            Explore beautiful events and book your next memorable experience
          </p>
        </div>

        {/* Search + Filter + Sort */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by title, venue, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-900"
              />
            </div>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-900"
              >
                {uniqueVenues.map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-900"
              >
                <option value="default">Sort By</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="dateEarliest">Date: Earliest First</option>
                <option value="dateLatest">Date: Latest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cards */}
        {filteredEvents.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">No events found</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEvents.map((eventItem) => (
              <div
                key={eventItem._id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={
                      eventItem.image ||
                      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80"
                    }
                    alt={eventItem.title || eventItem.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2 className="line-clamp-1 text-lg font-semibold text-slate-900">
                    {eventItem.title || eventItem.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {eventItem.description || "No description available"}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-rose-500" />
                      <span className="line-clamp-1">
                        {eventItem.venue || "Venue not specified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays className="h-4 w-4 text-orange-500" />
                      <span>
                        {eventItem.date
                          ? new Date(eventItem.date).toLocaleDateString()
                          : "Date not specified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <IndianRupee className="h-4 w-4 text-emerald-600" />
                      <span>{eventItem.price || 0}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookNow(eventItem)}
                    className="mt-5 w-full rounded-2xl bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;