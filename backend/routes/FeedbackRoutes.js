const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");


// 📩 Submit feedback
router.post("/submit", async (req, res) => {
  try {
    const { name, phone, quizId, message, rating } = req.body;

    // ✅ validation (quizId is optional)
    if (!name || !phone || !message || rating == null) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, message, and rating are required.",
      });
    }

    const feedback = await Feedback.create({
      name,
      phone,
      quizId: quizId || null, // store null if not provided
      message,
      rating,
    });

    res.status(201).json({ success: true, feedback });
  } catch (err) {
    console.error(" Feedback Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while submitting feedback.",
    });
  }
});

// 📤 Get all feedback
router.get("/", async (req, res) => {
  try {
    console.log("📥 Fetching all feedbacks...");

    const feedbacks = await Feedback.find()
      .populate("quizId", "title")
      .sort({ submittedAt: -1 });

    console.log(`✅ Found ${feedbacks.length} feedbacks`);
    res.status(200).json({ success: true, feedbacks });
  } catch (err) {
    console.error("🔥 Feedback Fetch Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching feedback.",
    });
  }
});

module.exports = router;
