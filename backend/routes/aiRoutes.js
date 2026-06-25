const express = require("express");
const { generateColdEmail } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/cold-email", protect, generateColdEmail);

module.exports = router;