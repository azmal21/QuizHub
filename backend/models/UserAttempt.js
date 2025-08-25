const mongoose = require("mongoose");

const userAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  answers: [
    {
      questionText: String,
      userAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean,
    }
  ],
  score: { type: Number, required: true },   // ✅ user’s correct answers
  total: { type: Number, required: true },   // ✅ total questions in the quiz
  usedTime: { type: Number },                // ✅ time taken by user
  attemptedAt: { type: Date, default: Date.now }, // ✅ timestamp
});

const UserAttempt = mongoose.model("UserAttempt", userAttemptSchema);

module.exports = UserAttempt;
