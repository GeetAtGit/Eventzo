const Venue = require("../models/Venue");

exports.getVenues = async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createVenue = async (req, res) => {
  try {
    const { name, location, capacity, price, description } = req.body;
    const venue = await Venue.create({
      name,
      location,
      capacity,
      price,
      description,
    });
    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};