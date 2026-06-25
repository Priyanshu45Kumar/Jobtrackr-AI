const express = require("express");
const { generateInterviewQuestions } = require("../controllers/interviewController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate", protect, generateInterviewQuestions);

module.exports = router;