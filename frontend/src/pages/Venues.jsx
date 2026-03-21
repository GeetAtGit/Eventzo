import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  Search,
  MapPin,
  Users,
  IndianRupee,
  ImageOff,
  Filter,
} from "lucide-react";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const { data } = await api.get("/venues");
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
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHighToLow") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "capacityHighToLow") {
      filtered.sort((a, b) => b.capacity - a.capacity);
    }

    return filtered;
  }, [venues, searchTerm, selectedLocation, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Available Venues</h2>
        <p className="text-slate-500 mt-2">
          Explore venues for your next event
        </p>
      </div>

      {/* Search + Filter + Sort */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="default">Sort By</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="capacityHighToLow">Capacity: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Venue Cards */}
      {filteredVenues.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 hover:shadow-lg transition"
            >
              <div className="h-52 w-full bg-slate-100 overflow-hidden">
                {venue.image ? (
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <ImageOff size={30} />
                      <span className="text-sm">No Image Available</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800">
                  {venue.name}
                </h3>

                <div className="flex items-center gap-2 text-slate-500 mt-2">
                  <MapPin size={16} />
                  <span>{venue.location}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700 mt-3">
                  <Users size={16} />
                  <span>
                    <span className="font-semibold">Capacity:</span>{" "}
                    {venue.capacity}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700 mt-2">
                  <IndianRupee size={16} />
                  <span>
                    <span className="font-semibold">Price:</span> ₹{venue.price}
                  </span>
                </div>

                <p className="text-slate-600 mt-4 line-clamp-3">
                  {venue.description}
                </p>

                <button
                  onClick={() =>
                    navigate(`/book/venue/${venue._id}`, {
                      state: { item: venue },
                    })
                  }
                  className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
          No venues found for your search or filter.
        </div>
      )}
    </div>
  );
};

export default Venues;