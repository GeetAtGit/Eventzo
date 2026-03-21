const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["event", "venue"],
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      default: null,
    },
    guests: {
      type: Number,
      default: 1,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "Cash",
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);