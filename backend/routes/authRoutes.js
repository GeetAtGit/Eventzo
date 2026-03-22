const express = require("express");
const router = express.Router();
const { registerUser, loginUser, updateUserProfile,} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", updateUserProfile);

module.exports = router;