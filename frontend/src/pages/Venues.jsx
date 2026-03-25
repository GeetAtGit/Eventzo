import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  MapPin,
  Users,
  IndianRupee,
  ImageOff,
  Filter,
  Sparkles,
} from "lucide-react";

const CATALOG_API = import.meta.env.VITE_CATALOG_API;


const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  

  const navigate = useNavigate();

  useEffect(() => {
  const fetchVenues = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`${CATALOG_API}/api/venues`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVenues(data);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  fetchVenues();
}, []);

  const uniqueLocations = useMemo(() => {
    const locations = venues
      .map((venue) => venue.location?.trim())
      .filter(Boolean);

    return ["All", ...new Set(locations)];
  }, [venues]);

  const filteredVenues = useMemo(() => {
    let filtered = [...venues];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (venue) =>
          venue.name?.toLowerCase().includes(term) ||
          venue.location?.toLowerCase().includes(term) ||
          venue.description?.toLowerCase().includes(term)
      );
    }

    if (selectedLocation !== "All") {
      filtered = filtered.filter(
        (venue) => venue.location === selectedLocation
      );
    }

    if (sortBy === "priceLowToHigh") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "priceHighToLow") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "capacityHighToLow") {
      filtered.sort((a, b) => (b.capacity || 0) - (a.capacity || 0));
    }

    return filtered;
  }, [venues, searchTerm, selectedLocation, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 ">
          

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Available Venues
          </h1>
          <p className="mt-2 text-sm text-slate-500 md:text-base">
            Explore elegant venues for your next event
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
                placeholder="Search by name, location, description..."
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
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-900"
              >
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
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
                <option value="capacityHighToLow">Capacity: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cards */}
        {filteredVenues.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVenues.map((venue) => (
              <div
                key={venue._id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  {venue.image ? (
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <ImageOff size={28} />
                        <span className="text-sm">No Image Available</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">
                    {venue.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {venue.description || "No description available"}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-rose-500" />
                      <span className="line-clamp-1">
                        {venue.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="h-4 w-4 text-orange-500" />
                      <span>Capacity: {venue.capacity || 0}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <IndianRupee className="h-4 w-4 text-emerald-600" />
                      <span>{venue.price || 0}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/book/venue/${venue._id}`, {
                        state: { item: venue },
                      })
                    }
                    className="mt-5 w-full rounded-2xl bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            No venues found for your search or filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;