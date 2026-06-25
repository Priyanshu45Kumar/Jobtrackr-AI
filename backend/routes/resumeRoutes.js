const express = require("express");
const { analyzeResume } = require("../controllers/resumeController");
const uploadResume = require("../middleware/uploadResume");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/analyze",
  protect,
  uploadResume.single("resume"),
  analyzeResume
);

module.exports = router;