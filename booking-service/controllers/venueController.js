const Venue = require("../models/Venue");

// GET all venues
const getVenues = async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 });
    res.status(200).json(venues);
  } catch (error) {
    console.error("GET VENUES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch venues" });
  }
};

// CREATE venue
const createVenue = async (req, res) => {
  try {
    console.log("CREATE VENUE BODY:", req.body);

    const { name, description, location, capacity, price, image } = req.body;

    if (
      !name ||
      !description ||
      !location ||
      capacity === "" ||
      capacity == null ||
      price === "" ||
      price == null
    ) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const venue = await Venue.create({
      name: String(name).trim(),
      description: String(description).trim(),
      location: String(location).trim(),
      capacity: Number(capacity),
      price: Number(price),
      image: image ? String(image).trim() : "",
    });

    res.status(201).json(venue);
  } catch (error) {
    console.error("CREATE VENUE ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to create venue" });
  }
};

// UPDATE venue
const updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    venue.name = req.body.name ?? venue.name;
    venue.description = req.body.description ?? venue.description;
    venue.location = req.body.location ?? venue.location;
    venue.capacity =
      req.body.capacity != null ? Number(req.body.capacity) : venue.capacity;
    venue.price = req.body.price != null ? Number(req.body.price) : venue.price;
    venue.image = req.body.image ?? venue.image;

    const updatedVenue = await venue.save();
    res.status(200).json(updatedVenue);
  } catch (error) {
    console.error("UPDATE VENUE ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to update venue" });
  }
};

// DELETE venue
const deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    await venue.deleteOne();
    res.status(200).json({ message: "Venue deleted successfully" });
  } catch (error) {
    console.error("DELETE VENUE ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to delete venue" });
  }
};

module.exports = {
  getVenues,
  createVenue,
  updateVenue,
  deleteVenue,
};