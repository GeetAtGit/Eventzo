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
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/venues", require("./routes/venueRoutes"));

// Health check
app.get("/", (req, res) => {
  res.send("Catalog Service is running");
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Catalog Service running on port ${PORT}`);
});