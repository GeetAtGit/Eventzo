const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);

// admin routes
router.get("/", protect, admin, getAllBookings);
router.put("/:id/status", protect, admin, updateBookingStatus);

module.exports = router;