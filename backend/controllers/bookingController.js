const Booking = require("../models/Booking");
const Event = require("../models/Event");
const Venue = require("../models/Venue");

const createBooking = async (req, res) => {
  try {
    const { type, eventId, venueId, guests, bookingDate, paymentMethod } = req.body;

    let bookingData = {
      user: req.user._id,
      type,
      guests: guests || 1,
      bookingDate,
      paymentMethod: paymentMethod || "Cash",
      status: "Pending",
    };

    if (type === "event") {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      bookingData.event = eventId;
      bookingData.totalPrice = event.price || 0;
    } else if (type === "venue") {
      const venue = await Venue.findById(venueId);
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }

      bookingData.venue = venueId;
      bookingData.totalPrice = venue.price || 0;
    } else {
      return res.status(400).json({ message: "Invalid booking type" });
    }

    const booking = await Booking.create(bookingData);

    res.status(201).json(booking);
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event")
      .populate("venue")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("GET MY BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch your bookings" });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("event")
      .populate("venue")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("GET ALL BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
};