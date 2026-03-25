const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    type: {
      type: String,
      enum: ["event", "venue"],
      required: true,
    },
    guests: {
      type: Number,
      default: null,
    },
    days: {
      type: Number,
      default: null,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Online"],
      default: "Cash",
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);