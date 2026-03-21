const express = require("express");
const router = express.Router();
const { getVenues, createVenue } = require("../controllers/venueController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getVenues);
router.post("/", protect, adminOnly, createVenue);

module.exports = router;
