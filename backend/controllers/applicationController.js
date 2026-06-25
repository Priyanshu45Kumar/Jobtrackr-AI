const Application = require("../models/Application");

const addApplication = async (req, res) => {
  try {
    const {
      company,
      role,
      jobLink,
      status,
      appliedDate,
      followUpDate,
      notes,
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        message: "Company and role are required",
      });
    }

    const application = await Application.create({
      user: req.user._id,
      company,
      role,
      jobLink,
      status,
      appliedDate,
      followUpDate,
      notes,
    });

    res.status(201).json({
      message: "Application added successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Security check
    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const updatedApplication =
      await Application.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Security Check
    if (
      application.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { addApplication,getApplications,updateApplication,deleteApplication };