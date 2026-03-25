const Booking = require("../models/Booking");
const Event = require("../models/Event");
const Venue = require("../models/Venue");

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const {
      type,
      eventId,
      venueId,
      guests,
      days,
      bookingDate,
      paymentMethod,
      totalPrice,
    } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Booking type is required" });
    }

    if (type === "event") {
      if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
      }

      const eventExists = await Event.findById(eventId);
      if (!eventExists) {
        return res.status(404).json({ message: "Event not found" });
      }

      const booking = await Booking.create({
        user: req.user._id,
        type: "event",
        event: eventId,
        venue: null,
        guests: Number(guests),
        days: null,
        bookingDate,
        paymentMethod: paymentMethod || "Cash",
        totalPrice: Number(totalPrice || 0),
      });

      return res.status(201).json(booking);
    }

    if (type === "venue") {
      if (!venueId) {
        return res.status(400).json({ message: "Venue ID is required" });
      }

      const venueExists = await Venue.findById(venueId);
      if (!venueExists) {
        return res.status(404).json({ message: "Venue not found" });
      }

      if (!days || Number(days) < 1) {
        return res.status(400).json({ message: "Valid number of days is required" });
      }

      const booking = await Booking.create({
        user: req.user._id,
        type: "venue",
        event: null,
        venue: venueId,
        guests: null,
        days: Number(days),
        bookingDate,
        paymentMethod: paymentMethod || "Cash",
        totalPrice: Number(totalPrice || 0),
      });

      return res.status(201).json(booking);
    }

    return res.status(400).json({ message: "Invalid booking type" });
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// GET MY BOOKINGS
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event")
      .populate("venue")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("GET MY BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// ADMIN: GET ALL BOOKINGS
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email isAdmin")
      .populate("event")
      .populate("venue")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("GET ALL BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch all bookings" });
  }
};

// ADMIN: UPDATE BOOKING STATUS
const updateBookingStatus = async (req, res) => {
  try {
    console.log("UPDATE BOOKING STATUS BODY:", req.body);
    console.log("BOOKING ID:", req.params.id);

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;

    const updatedBooking = await booking.save();

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("UPDATE BOOKING STATUS ERROR FULL:", error);
    res.status(500).json({
      message: error.message || "Failed to update booking status",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
};