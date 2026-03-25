const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config({ path: "./.env" });

const app = express();

// DB
connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Correct Routes
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Health check
app.get("/", (req, res) => {
  res.send("Booking Service is running");
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`);
});