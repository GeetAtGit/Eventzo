const express = require("express");
const router = express.Router();

const {
  getVenues,
  getVenueById,
  createVenue,
} = require("../controllers/venueController");

router.get("/", getVenues);
router.get("/:id", getVenueById);
router.post("/", createVenue);

module.exports = router;