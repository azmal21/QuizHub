// controllers/quizController.js

const Quiz = require("../models/quizModel");

// -------------------- GET ALL QUIZZES (metadata only) --------------------
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, "title description timeLimit").lean();
    return res.status(200).json({ success: true, quizzes });
  } catch (err) {
    console.error("❌ getAllQuizzes Error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch quizzes" });
  }
};

// -------------------- GET QUIZ BY ID --------------------
exports.getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    if (!quizId) return res.status(400).json({ success: false, message: "Quiz ID is required" });

    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    // Remove correctAnswer from questions before sending
    const questions = quiz.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options
    }));

    return res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        questions
      }
    });
  } catch (err) {
    console.error("❌ getQuizById Error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch quiz" });
  }
};

// -------------------- GET TOTAL QUIZZES COUNT --------------------
exports.getQuizCount = async (req, res) => {
  try {
    const totalQuizzes = await Quiz.countDocuments(); // accurate count
    return res.status(200).json({ success: true, totalQuizzes });
  } catch (err) {
    console.error("❌ getQuizCount Error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch quiz count" });
  }
};

