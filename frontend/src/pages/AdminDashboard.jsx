import { useEffect, useState } from "react";
import api from "../utils/api";

const AdminDashboard = () => {
  const [venueForm, setVenueForm] = useState({
    name: "",
    location: "",
    capacity: "",
    price: "",
    description: "",
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
  });

  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);

  const fetchVenues = async () => {
    try {
      const { data } = await api.get("/venues");
      setVenues(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings");
      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVenues();
    fetchBookings();
  }, []);

  const venueChangeHandler = (e) => {
    setVenueForm({ ...venueForm, [e.target.name]: e.target.value });
  };

  const eventChangeHandler = (e) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };

  const submitVenueHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post("/venues", {
        ...venueForm,
        capacity: Number(venueForm.capacity),
        price: Number(venueForm.price),
      });

      alert("Venue added successfully");
      setVenueForm({
        name: "",
        location: "",
        capacity: "",
        price: "",
        description: "",
      });
      fetchVenues();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add venue");
    }
  };

  const submitEventHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", eventForm);

      alert("Event added successfully");
      setEventForm({
        title: "",
        description: "",
        date: "",
        venue: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add event");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Admin Dashboard</h2>
        <p className="text-slate-500 mt-2">
          Manage venues, events, and customer bookings
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <form
          onSubmit={submitVenueHandler}
          className="bg-white rounded-2xl shadow-md p-6 space-y-4"
        >
          <h3 className="text-xl font-semibold text-slate-800">Add Venue</h3>

          <input
            type="text"
            name="name"
            placeholder="Venue Name"
            value={venueForm.name}
            onChange={venueChangeHandler}
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={venueForm.location}
            onChange={venueChangeHandler}
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
            required
          />

          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={venueForm.capacity}
            onChange={venueChangeHandler}
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={venueForm.price}
            onChange={venueChangeHandler}
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={venueForm.description}
            onChange={venueChangeHandler}
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
            rows="3"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Add Venue
          </button>
        </form>

        <form
          onSubmit={submitEventHandler}
          className="bg-white rounded-2xl shadow-md p-6 space-y-4"
        >
          <h3 className="text-xl font-semibold text-slate-800">Add Event</h3>

          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={eventForm.title}
            onChange={eventChangeHandler}
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={eventForm.description}
            onChange={eventChangeHandler}
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
            rows="3"
          />

          <input
            type="date"
            name="date"
            value={eventForm.date}
            onChange={eventChangeHandler}
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
            required
          />

          <select
            name="venue"
            value={eventForm.venue}
            onChange={eventChangeHandler}
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
            required
          >
            <option value="">Select Venue</option>
            {venues.map((venue) => (
              <option key={venue._id} value={venue._id}>
                {venue.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Add Event
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-2xl font-semibold text-slate-800 mb-4">All Bookings</h3>

        {bookings.length === 0 ? (
          <p className="text-slate-500">No bookings yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50"
              >
                <p className="text-slate-700">
                  <span className="font-semibold">User:</span> {booking.user?.name}
                </p>
                <p className="text-slate-700">
                  <span className="font-semibold">Email:</span> {booking.user?.email}
                </p>
                <p className="text-slate-700">
                  <span className="font-semibold">Event:</span> {booking.event?.title}
                </p>
                <p className="text-slate-700">
                  <span className="font-semibold">Venue:</span> {booking.event?.venue?.name}
                </p>
                <p className="text-slate-700">
                  <span className="font-semibold">Status:</span> {booking.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;