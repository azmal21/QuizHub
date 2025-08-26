// controllers/adminController.js

const Quiz = require("../models/quizModel");
const UserAttempt = require("../models/UserAttempt");

// -------------------- ADMIN LOGIN --------------------
exports.adminLogin = (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ success: false, message: "Password required" });

  if (password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ success: true });
  }
  return res.status(401).json({ success: false, message: "Invalid password" });
};

// -------------------- CREATE QUIZ --------------------
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, timeLimit, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions))
      return res.status(400).json({ success: false, message: "Invalid quiz data" });

    const newQuiz = await Quiz.create({ title, description, timeLimit, questions });
    return res.status(201).json({ success: true, quiz: newQuiz });
  } catch (err) {
    console.error("❌ createQuiz Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------------------- EDIT QUIZ --------------------
exports.editQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const { title, description, timeLimit, questions } = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { title, description, timeLimit, questions },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedQuiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    return res.status(200).json({ success: true, quiz: updatedQuiz });
  } catch (err) {
    console.error("❌ editQuiz Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------------------- DELETE QUIZ --------------------
exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id).lean();
    if (!deletedQuiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    return res.status(200).json({ success: true, message: "Quiz deleted" });
  } catch (err) {
    console.error("❌ deleteQuiz Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------------------- GET QUIZ RESULTS --------------------
exports.getQuizResults = async (req, res) => {
  try {
    const quizId = mongoose.Types.ObjectId(req.params.id); // convert string to ObjectId
    const attempts = await UserAttempt.find({ quizId })
      .select("name phone score attemptedAt")
      .lean();

    return res.status(200).json({ success: true, attempts });
  } catch (err) {
    console.error("❌ getQuizResults Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------------------- GET USER RESULTS --------------------
exports.getUserResults = async (req, res) => {
  try {
    const { name, phone } = req.query;
    if (!name || !phone) return res.status(400).json({ success: false, message: "Name and phone required" });

    const attempts = await UserAttempt.find({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
      phone: phone.trim()
    })
      .populate("quizId", "title timeLimit")
      .lean();

    if (!attempts.length) return res.status(404).json({ success: false, message: "No attempts found" });

    return res.status(200).json({ success: true, attempts });
  } catch (err) {
    console.error("❌ getUserResults Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------------------- GET ALL QUIZZES WITH STATS --------------------
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzesWithStats = await Quiz.aggregate([
      {
        $lookup: {
          from: "userattempts",
          localField: "_id",
          foreignField: "quizId",
          as: "attempts"
        }
      },
      {
        $addFields: {
          totalAttempts: { $size: "$attempts" },
          averageScore: {
            $cond: [
              { $gt: [{ $size: "$attempts" }, 0] },
              { $avg: "$attempts.score" },
              null
            ]
          },
          highestScore: { $max: "$attempts.score" }
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          timeLimit: 1,
          questions: 1,             
          totalAttempts: 1,
          averageScore: { $round: ["$averageScore", 2] },
          highestScore: 1
        }
      }
    ]);

    return res.status(200).json({ success: true, quizzes: quizzesWithStats });
  } catch (err) {
    console.error("❌ getAllQuizzes Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------------------- GET ALL USER ATTEMPTS --------------------
// -------------------- GET ALL USER ATTEMPTS --------------------
exports.getAllUserAttempts = async (req, res) => {
  try {
    const attempts = await UserAttempt.find()
      .populate("quizId", "title timeLimit")
      .select("name phone score quizId answers attemptedAt createdAt usedTime")
      .lean();

    return res.status(200).json({ success: true, attempts });
  } catch (err) {
    console.error("❌ getAllUserAttempts Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

