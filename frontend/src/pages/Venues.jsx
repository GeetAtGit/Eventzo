import { useEffect, useState } from "react";
import api from "../utils/api";

const Venues = () => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const { data } = await api.get("/venues");
        setVenues(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVenues();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Available Venues</h2>
        <p className="text-slate-500 mt-2">
          Explore venues for your next event
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <div
            key={venue._id}
            className="bg-white rounded-2xl shadow-md p-6 border border-slate-100"
          >
            <h3 className="text-xl font-semibold text-slate-800">{venue.name}</h3>
            <p className="text-slate-500 mt-2">{venue.location}</p>
            <p className="mt-3 text-slate-700">
              <span className="font-semibold">Capacity:</span> {venue.capacity}
            </p>
            <p className="text-slate-700">
              <span className="font-semibold">Price:</span> ₹{venue.price}
            </p>
            <p className="text-slate-600 mt-3">{venue.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Venues;