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
    console.log("CREATE EVENT BODY:", req.body);

    const { title, description, venue, date, price, image } = req.body;

    if (!title || !description || !venue || !date || price === "" || price == null) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const event = await Event.create({
      title: String(title).trim(),
      description: String(description).trim(),
      venue: String(venue).trim(),
      date: new Date(date),
      price: Number(price),
      image: image ? String(image).trim() : "",
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("CREATE EVENT ERROR FULL:", error);
    res.status(500).json({ message: error.message || "Failed to create event" });
  }
};

// UPDATE event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.venue = req.body.venue || event.venue;
    event.date = req.body.date || event.date;
    event.price = req.body.price || event.price;
    event.image = req.body.image || event.image;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);
    res.status(500).json({ message: "Failed to update event" });
  }
};

// DELETE event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};