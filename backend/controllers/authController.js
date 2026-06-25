const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtpEmail = async (email, otp) => {
  await sendEmail({
    to: email,
    subject: "Verify your JobTrackr AI account",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Verify your email</h2>
        <p>Your OTP for JobTrackr AI is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `,
  });
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isEmailVerified === true) {
      return res.status(400).json({
        message: "Email already registered. Please login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    let user;

    if (existingUser && existingUser.isEmailVerified === false) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.emailOtp = otp;
      existingUser.emailOtpExpires = otpExpires;

      user = await existingUser.save();
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        isEmailVerified: false,
        emailOtp: otp,
        emailOtpExpires: otpExpires,
      });
    }

    await sendOtpEmail(email, otp);

    res.status(201).json({
      message: "OTP sent to your email. Please verify your account.",
      email: user.email,
      requiresVerification: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isEmailVerified === true) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    if (!user.emailOtp || !user.emailOtpExpires) {
      return res.status(400).json({
        message: "OTP not found. Please request a new OTP.",
      });
    }

    if (user.emailOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.emailOtpExpires < new Date()) {
      return res.status(400).json({
        message: "OTP expired. Please request a new OTP.",
      });
    }

    user.isEmailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;

    await user.save();

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(200).json({
      message: "Email verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isEmailVerified === true) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    const otp = generateOtp();

    user.emailOtp = otp;
    user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();
    await sendOtpEmail(email, otp);

    res.status(200).json({
      message: "New OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to resend OTP",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.isEmailVerified === false) {
      return res.status(403).json({
        message: "Please verify your email first before login.",
      });
    }

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};
const getMe = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
};

module.exports = {
  signup,
  verifyOtp,
  resendOtp,
  login,
  getMe,
  logout,
};