const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Check if user has already attempted the quiz
router.post("/check", userController.checkIfAttempted);

// Submit a quiz
router.post("/submit/:quizId", userController.submitQuiz);

// User login
router.post("/login", userController.loginUser);

// Get completed quizzes for a user
router.get("/completed", userController.getCompletedQuizzes);

// Get user attempts with quiz details
router.get("/attempt/:attemptId", userController.getUserAttemptsWithQuiz);

// Get total users
router.get("/count", userController.getUserCount);

// Get total attempts
router.get("/attemptcount", userController.getAttemptCount);

// Get all users (name + phone)
router.get("/all", userController.getAllUsers);

router.get("/average-score/:phone", userController.getAverageScore)

// Get leaderboard for all users
router.get("/leaderboard", userController.getLeaderboard);

router.post("/precheck", userController.precheckUser);


module.exports = router;
