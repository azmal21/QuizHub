const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 }, // optional rating
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
