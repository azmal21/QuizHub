const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

// Get all quizzes
router.get("/all", quizController.getAllQuizzes);

// Get total quizzes
router.get("/count", quizController.getQuizCount);

// Get a quiz by ID
router.get("/:quizId", quizController.getQuizById);

module.exports = router;
