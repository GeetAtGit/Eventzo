const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config({ path: "./.env" });

const app = express();

connectDB();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/venues", require("./routes/venueRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

app.get("/", (req, res) => {
  res.send("Eventzo API is running");
});

console.log("JWT_SECRET loaded:", process.env.JWT_SECRET);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("JWT_SECRET loaded:", process.env.JWT_SECRET);
});