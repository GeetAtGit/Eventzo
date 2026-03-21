import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    navigate(`/book/event/${eventItem._id}`, { state: { item: eventItem } });  };

  if (loading) {
    return <div className="p-6 text-center">Loading events...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Available Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-600">No events available</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((eventItem) => (
            <div
              key={eventItem._id}
              className="bg-white rounded-2xl shadow-md p-5 border"
            >
              {eventItem.image && (
                <img
                  src={eventItem.image}
                  alt={eventItem.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}

              <h2 className="text-xl font-semibold mb-2">
                {eventItem.title || eventItem.name}
              </h2>

              <p className="text-gray-600 mb-2">
                <span className="font-medium">Venue:</span>{" "}
                {eventItem.venue || "Not specified"}
              </p>

              <p className="text-gray-600 mb-2">
                <span className="font-medium">Date:</span>{" "}
                {eventItem.date
                  ? new Date(eventItem.date).toLocaleDateString()
                  : "Not specified"}
              </p>

              <p className="text-gray-600 mb-2">
                <span className="font-medium">Price:</span> ₹
                {eventItem.price || 0}
              </p>

              <p className="text-gray-700 mb-4">
                {eventItem.description || "No description available"}
              </p>

              <button
                onClick={() => handleBookNow(eventItem)}
                className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;