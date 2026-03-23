const express = require("express");
const router = express.Router();

const { getAllUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.get("/", protect, admin, getAllUsers);

module.exports = router;