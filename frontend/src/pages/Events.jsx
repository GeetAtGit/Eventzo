import { useEffect, useState } from "react";
import api from "../utils/api";

const Events = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get("/events");
      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const bookEventHandler = async (eventId) => {
    try {
      await api.post("/bookings", { event: eventId });
      alert("Booking successful");
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Upcoming Events</h2>
        <p className="text-slate-500 mt-2">
          Browse and book available events
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-2xl shadow-md p-6 border border-slate-100"
          >
            <h3 className="text-xl font-semibold text-slate-800">{event.title}</h3>
            <p className="text-slate-600 mt-2">{event.description}</p>
            <p className="mt-4 text-slate-700">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-slate-700">
              <span className="font-semibold">Venue:</span> {event.venue?.name}
            </p>

            <button
              onClick={() => bookEventHandler(event._id)}
              className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;