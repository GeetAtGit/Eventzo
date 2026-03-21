const Venue = require("../models/Venue");

exports.getVenues = async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 });
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createVenue = async (req, res) => {
  try {
    const { name, location, capacity, price, description, image } = req.body;

    const venue = await Venue.create({
      name,
      location,
      capacity,
      price,
      description,
      image,
    });

    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};