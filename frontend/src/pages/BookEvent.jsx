import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function BookEvent() {
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const item = location.state?.item;

  const [guests, setGuests] = useState(1);
  const [bookingDate, setBookingDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);

  if (!item) {
    return (
      <div className="p-6 text-center text-red-600">
        No booking data found. Please go back and select again.
      </div>
    );
  }

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        type,
        guests,
        bookingDate,
        paymentMethod,
        ...(type === "event" ? { eventId: id } : { venueId: id }),
      };

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
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Book {type === "event" ? "Event" : "Venue"}
        </h1>

        <div className="mb-6 border rounded-xl p-4 bg-slate-50">
          <h2 className="text-xl font-semibold">{item.title || item.name}</h2>
          <p className="text-gray-600 mt-2">
            {item.description || "No description available"}
          </p>
          <p className="mt-2">
            <span className="font-medium">Price:</span> ₹{item.price || 0}
          </p>
          {item.venue && (
            <p>
              <span className="font-medium">Venue:</span> {item.venue}
            </p>
          )}
          {item.location && (
            <p>
              <span className="font-medium">Location:</span> {item.location}
            </p>
          )}
        </div>

        <form onSubmit={handleBooking}>
          <label className="block mb-2 font-medium">Number of Guests</label>
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
            required
          />

          <label className="block mb-2 font-medium">Booking Date</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
            required
          />

          <label className="block mb-2 font-medium">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded-lg p-3 mb-6"
          >
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookEvent;