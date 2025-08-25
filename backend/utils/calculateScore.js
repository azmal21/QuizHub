// utils/calculateScore.js

/**
 * Calculates the score of a quiz attempt
 * @param {Array} correctAnswers - Array of correct answers from the quiz
 * @param {Array} userAnswers - Array of user's selected answers
 * @returns {Number} score - Total correct answers
 */
function calculateScore(correctAnswers, userAnswers) {
  let score = 0;

  for (let i = 0; i < correctAnswers.length; i++) {
    if (userAnswers[i] === correctAnswers[i]) {
      score++;
    }
  }

  return score;
}

module.exports = calculateScore;
