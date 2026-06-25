const Application = require("../models/Application");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalApplications = await Application.countDocuments({
      user: userId,
    });

    const applied = await Application.countDocuments({
      user: userId,
      status: "Applied",
    });

    const assessment = await Application.countDocuments({
      user: userId,
      status: "Assessment",
    });

    const interview = await Application.countDocuments({
      user: userId,
      status: "Interview",
    });

    const offer = await Application.countDocuments({
      user: userId,
      status: "Offer",
    });

    const rejected = await Application.countDocuments({
      user: userId,
      status: "Rejected",
    });

    const today = new Date();

    const followUpsDue = await Application.countDocuments({
      user: userId,
      followUpDate: { $lte: today },
      status: { $nin: ["Offer", "Rejected"] },
    });

    res.status(200).json({
      totalApplications,
      applied,
      assessment,
      interview,
      offer,
      rejected,
      followUpsDue,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { getDashboardStats };