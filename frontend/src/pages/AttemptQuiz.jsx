import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AttemptQuiz.css";
import api from "../api";

const AttemptQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user info from localStorage
  const name = localStorage.getItem("userName");
  const phone = localStorage.getItem("userPhone");

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quiz/${quizId}`);
        if (res.data.success) {
          setQuiz(res.data.quiz);

          // Initialize answers (no correctAnswer stored here for security)
          setAnswers(
            res.data.quiz.questions.map((q) => ({
              questionText: q.question,
              userAnswer: "",
            }))
          );

          setTimeLeft(res.data.quiz.timeLimit * 60); // minutes -> seconds
        } else {
          setMessage("Failed to load quiz.");
          setMessageType("error");
        }
      } catch (err) {
        console.error(err);
        setMessage("Failed to load quiz.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Timer countdown (optimized with setInterval)
  useEffect(() => {
    if (!quiz || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz]);

  // Handle answer selection
  const handleAnswerChange = (index, selectedAnswer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].userAnswer = selectedAnswer;
    setAnswers(updatedAnswers);
  };

  // Submit quiz
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!quiz) {
      setMessage("Quiz not loaded yet.");
      setMessageType("error");
      setIsSubmitting(false);
      return;
    }
    if (!name || !phone) {
      setMessage("User not logged in");
      setMessageType("error");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await api.post(
        `/user/submit/${quizId}`,
        {
          name,
          phone,
          answers,
          usedTime: quiz.timeLimit * 60 - timeLeft,
        }
      );

      const { score } = res.data;

      navigate("/thankyou", {
        state: {
          score,
          totalQuestions: quiz.questions.length,
          name,
        },
      });
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setMessage("Failed to submit quiz.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress percentage
  const getProgressPercentage = () => {
    const answered = answers.filter((a) => a.userAnswer !== "").length;
    return (answered / answers.length) * 100;
  };

  // Loading state
  if (loading) {
    return (
      <div className="attempt-quiz-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!quiz) {
    return (
      <div className="attempt-quiz-container">
        <div className={`message ${messageType}`}>
          {message || "Quiz not found"}
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="attempt-quiz-container">
      <div className="quiz-header">
        <h2 className="quiz-title">{quiz.title}</h2>

        {/* Timer */}
        <div className="timer-display">
          Time Left: {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <p style={{ marginTop: "0.5rem", color: "#666", fontSize: "0.9rem" }}>
          Progress: {answers.filter((a) => a.userAnswer !== "").length} of{" "}
          {answers.length} answered
        </p>
      </div>

      {/* Questions */}
      {quiz.questions.map((q, index) => (
        <div key={q._id || index} className="question-card">
          <p className="question-text">
            <span className="question-number">{index + 1}</span>
            {q.question}
          </p>
          <div className="options-container">
            {q.options.map((opt, i) => (
              <label
                key={i}
                className={`option-label ${
                  answers[index]?.userAnswer === opt ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={opt}
                  checked={answers[index]?.userAnswer === opt}
                  onChange={() => handleAnswerChange(index, opt)}
                  className="option-input"
                />
                <span className="option-text">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        className="submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Quiz"}
      </button>

      {message && <div className={`message ${messageType}`}>{message}</div>}
    </div>
  );
};

export default AttemptQuiz;
