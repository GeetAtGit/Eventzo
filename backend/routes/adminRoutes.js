const express = require("express");
const router = express.Router();

const { getAdminStats } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.get("/stats", protect, admin, getAdminStats);

module.exports = router;