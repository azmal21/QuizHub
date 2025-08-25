// models/Quiz.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  timeLimit: { type: Number, required: true }, // in minutes
  questions: [questionSchema],
});

module.exports = mongoose.model("Quiz", quizSchema);
