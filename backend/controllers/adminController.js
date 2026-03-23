const Event = require("../models/Event");
const Venue = require("../models/Venue");
const Booking = require("../models/Booking");
const User = require("../models/User");

const getAdminStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalVenues = await Venue.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalEvents,
      totalVenues,
      totalBookings,
      totalUsers,
    });
  } catch (error) {
    console.error("GET ADMIN STATS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

module.exports = { getAdminStats };