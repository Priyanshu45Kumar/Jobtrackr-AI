const express = require("express");
const { verifyOtp,resendOtp,signup,login,getMe,logout } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login",login);
router.get("/me", protect, getMe);
router.post("/logout",logout);


module.exports = router;