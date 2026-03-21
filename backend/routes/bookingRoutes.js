const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
} = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/", protect, adminOnly, getAllBookings);

module.exports = router;