import { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  Image as ImageIcon,
  IndianRupee,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Sparkles,
  FileText,
  X,
} from "lucide-react";

// API URL Constants
const CATALOG_API = import.meta.env.VITE_CATALOG_API;
const BUDGET_API = import.meta.env.VITE_BUDGET_API; // Ensure this is http://localhost:8081

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${CATALOG_API}/api/events`,
        getAuthConfig()
      );
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH EVENTS ERROR:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVenue("");
    setDate("");
    setPrice("");
    setImage("");
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setTitle(event.title || "");
    setDescription(event.description || "");
    setVenue(event.venue || "");
    setDate(event.date ? event.date.split("T")[0] : "");
    setPrice(event.price || "");
    setImage(event.image || "");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      venue,
      date,
      price: Number(price),
      image,
    };

    try {
      if (editingEvent) {
        // Update existing event
        await axios.put(
          `${CATALOG_API}/api/events/${editingEvent._id}`,
          payload,
          getAuthConfig()
        );
      } else {
        // Create new event
        const response = await axios.post(
          `${CATALOG_API}/api/events`,
          payload,
          getAuthConfig()
        );

        // --- BUDGET SERVICE INTEGRATION ---
        // Once the event is created in the Catalog (Node.js), 
        // we create the budget entry in Spring Boot.
        const newEventId = response.data._id || response.data.id;

        if (newEventId) {
          try {
            await axios.post(`${BUDGET_API}/api/budgets`, {
              eventId: newEventId,      // Matches your Java DTO field
              totalBudget: Number(price) // Matches your Java DTO field
            });
            console.log("Budget Service: Successfully initialized budget for event", newEventId);
          } catch (budgetError) {
            // We log the error but don't stop the flow, so the user 
            // knows the event was saved even if the budget failed.
            console.error("BUDGET SERVICE ERROR:", budgetError.response?.data || budgetError.message);
          }
        }
      }

      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("SAVE EVENT ERROR:", error);
      alert(error.response?.data?.message || "Failed to save event");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${CATALOG_API}/api/events/${id}`, getAuthConfig());
      fetchEvents();
    } catch (error) {
      console.error("DELETE EVENT ERROR:", error);
      alert(error.response?.data?.message || "Failed to delete event");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Events</h1>
            <p className="mt-2 text-sm text-slate-500">Add, edit, and delete event listings from one place</p>
          </div>

          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Close Form" : "Add Event"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              {editingEvent ? "Edit Event" : "Create New Event"}
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-1">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FileText className="h-4 w-4 text-slate-500" /> Event Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div className="md:col-span-1">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <MapPin className="h-4 w-4 text-slate-500" /> Venue
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div className="md:col-span-1">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CalendarDays className="h-4 w-4 text-slate-500" /> Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div className="md:col-span-1">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <IndianRupee className="h-4 w-4 text-slate-500" /> Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <ImageIcon className="h-4 w-4 text-slate-500" /> Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FileText className="h-4 w-4 text-slate-500" /> Description
                </label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Event List */}
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">No events found.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="h-44 overflow-hidden bg-slate-100">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">No Image</div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{event.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{event.description}</p>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-rose-500" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-orange-500" />
                      <span>{event.date ? new Date(event.date).toLocaleDateString() : "No date"}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-slate-800">
                      <IndianRupee className="h-4 w-4 text-emerald-600" />
                      <span>{event.price}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageEvents;