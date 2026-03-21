import { useEffect, useState } from "react";
import api from "../utils/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get("/bookings/my");
        setBookings(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">My Bookings</h2>
        <p className="text-slate-500 mt-2">
          Track all your confirmed event bookings
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-slate-500">No bookings found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-md p-6 border border-slate-100"
            >
              <h3 className="text-xl font-semibold text-slate-800">
                {booking.event?.title}
              </h3>
              <p className="mt-3 text-slate-700">
                <span className="font-semibold">Date:</span>{" "}
                {new Date(booking.event?.date).toLocaleDateString()}
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Venue:</span>{" "}
                {booking.event?.venue?.name}
              </p>
              <p className="text-slate-700">
                <span className="font-semibold">Status:</span> {booking.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;