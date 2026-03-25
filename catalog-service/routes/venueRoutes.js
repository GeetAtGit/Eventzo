const express = require("express");
const router = express.Router();

const {
  getVenues,
  createVenue,
  updateVenue,
  deleteVenue,
} = require("../controllers/venueController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.get("/", protect, getVenues);
router.post("/", protect, admin, createVenue);
router.put("/:id", protect, admin, updateVenue);
router.delete("/:id", protect, admin, deleteVenue);

module.exports = router;