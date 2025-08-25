const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/login", adminController.adminLogin);
router.post("/quiz", adminController.createQuiz);
router.put("/quiz/:id", adminController.editQuiz);
router.delete("/quiz/:id", adminController.deleteQuiz);
router.get("/quizzes", adminController.getAllQuizzes);
router.get("/results/users", adminController.getUserResults)
router.get("/results", adminController.getAllUserAttempts);
router.get("/results/:id", adminController.getQuizResults);

module.exports = router;