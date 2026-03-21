const Event = require("../models/Event");

// GET all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// CREATE event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, venue, price, image } = req.body;

    if (!title || !description || !date || !venue || !price) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      venue,
      price,
      image,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    res.status(500).json({ message: "Failed to create event" });
  }
};

module.exports = {
  getEvents,
  createEvent,
};