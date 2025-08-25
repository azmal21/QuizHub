// controllers/userController.js

const Quiz = require("../models/quizModel");
const UserAttempt = require("../models/UserAttempt");
const User = require("../models/User");

// ------------------------------
// Check if user already attempted a quiz
// ------------------------------
exports.checkIfAttempted = async (req, res) => {
  try {
    const { name, phone, quizId } = req.body;

    if (!name || !phone || !quizId) {
      return res.status(400).json({ success: false, message: "Name, phone and quizId are required" });
    }

    const alreadyAttempted = await UserAttempt.exists({ name, phone, quizId });
    res.status(200).json({ success: true, alreadyAttempted: !!alreadyAttempted });
  } catch (err) {
    console.error("checkIfAttempted error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ------------------------------
// Submit quiz attempt
// ------------------------------
exports.submitQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const { name, phone, answers, usedTime } = req.body;

    if (!name || !phone || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    let score = 0;
    const detailedAnswers = answers.map((ans, index) => {
      const correctAnswer = quiz.questions[index]?.correctAnswer || "";
      const isCorrect = ans.userAnswer === correctAnswer;
      if (isCorrect) score++;
      return {
        questionText: ans.questionText || quiz.questions[index]?.question || "",
        userAnswer: ans.userAnswer,
        correctAnswer,
        isCorrect,
      };
    });

    const newAttempt = new UserAttempt({
      quizId,
      name,
      phone,
      answers: detailedAnswers,
      score,
      total: quiz.questions.length,
      usedTime,
    });

    await newAttempt.save();
    res.status(201).json({ success: true, message: "Quiz submitted", score });
  } catch (err) {
    console.error("submitQuiz error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ------------------------------
// Login or register user
// ------------------------------
exports.loginUser = async (req, res) => {
  try {
    let { name, phone, firebaseUid } = req.body;
    if (!name || !phone || !firebaseUid) {
      return res.status(400).json({ success: false, message: "Name, phone, and firebase UID required" });
    }

    name = name.trim();
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Invalid phone number format" });
    }

    let user = await User.findOne({ phone });

    if (user) {
      if (user.name !== name) {
        return res.status(400).json({ success: false, message: "Phone already registered with a different name" });
      }

      // ✅ Update firebaseUid if missing or changed
      if (!user.firebaseUid || user.firebaseUid !== firebaseUid) {
        user.firebaseUid = firebaseUid;
        await user.save();
      }

      return res.status(200).json({ success: true, userId: user._id });
    }

    // ✅ New user registration
    user = new User({ name, phone, firebaseUid });
    await user.save();

    return res.status(201).json({ success: true, userId: user._id });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ------------------------------
// Get all quiz IDs attempted by a user
// ------------------------------
exports.getCompletedQuizzes = async (req, res) => {
  try {
    const { name, phone } = req.query;
    if (!name || !phone) return res.status(400).json({ success: false, message: "Name and phone required" });

    const attempts = await UserAttempt.find({ name, phone }).select("quizId").lean();
    const completedQuizIds = attempts.map(a => a.quizId.toString());

    res.status(200).json({ success: true, completedQuizIds });
  } catch (err) {
    console.error("getCompletedQuizzes error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ------------------------------
// Get attempt with quiz details populated
// ------------------------------
exports.getUserAttemptsWithQuiz = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const attempt = await UserAttempt.findById(attemptId)
      .populate("quizId", "title description timeLimit")
      .lean();

    if (!attempt) return res.status(404).json({ success: false, message: "Attempt not found" });

    res.status(200).json({ success: true, attempt });
  } catch (err) {
    console.error("getUserAttemptsWithQuiz error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ------------------------------
// Get counts and lists
// ------------------------------
exports.getUserCount = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ success: true, totalUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

exports.getAttemptCount = async (req, res) => {
  try {
    const totalAttempts = await UserAttempt.countDocuments();
    res.status(200).json({ success: true, totalAttempts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name phone joinedAt").lean();
    res.status(200).json({ success: true, total: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ------------------------------
// Get average score for a user
// ------------------------------
exports.getAverageScore = async (req, res) => {
  try {
    const { phone } = req.params;

    const result = await UserAttempt.aggregate([
      { $match: { phone } },
      {
        $group: {
          _id: "$phone",
          totalScore: { $sum: "$score" },
          totalPossible: { $sum: "$total" },
        },
      },
    ]);

    const avgPercentage = result.length > 0
      ? (result[0].totalScore / result[0].totalPossible) * 100
      : 0;

    res.status(200).json({ success: true, averageScore: avgPercentage.toFixed(2) });
  } catch (err) {
    console.error("getAverageScore error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ------------------------------
// Leaderboard
// ------------------------------
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await UserAttempt.aggregate([
      {
        $group: {
          _id: "$phone",
          totalScore: { $sum: "$score" },
          totalPossible: { $sum: "$total" },
          attempts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "phone",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          name: "$user.name",
          phone: "$_id",
          averageScore: { $multiply: [{ $divide: ["$totalScore", "$totalPossible"] }, 100] },
          attempts: 1,
        },
      },
      { $sort: { averageScore: -1 } },
    ]);

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error("getLeaderboard error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ------------------------------
// Precheck user before OTP
// ------------------------------
exports.precheckUser = async (req, res) => {
  try {
    let { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and phone required" });
    }

    name = name.trim();
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Invalid phone number format" });
    }

    const user = await User.findOne({ phone });
    if (user && user.name !== name) {
      return res.status(400).json({ success: false, message: "Phone registered with a different name" });
    }

    return res.status(200).json({ success: true, message: "Valid user, proceed with OTP" });
  } catch (err) {
    console.error("precheckUser error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

