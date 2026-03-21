const Event = require("../models/Event");

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("venue").sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, venue } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      venue,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};