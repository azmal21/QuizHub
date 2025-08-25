import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import api from "../api";

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState(new Set()); // ✅ Use Set for faster lookup
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const name = localStorage.getItem("userName");
  const phone = localStorage.getItem("userPhone");

  // ✅ Extract API calls into one place
  const fetchData = useCallback(async () => {
    try {
      const [quizRes, completedRes] = await Promise.all([
        api.get("/admin/quizzes"),
        name && phone
          ? api.get("/user/completed", {
              params: { name, phone },
            })
          : Promise.resolve({ data: { success: false } }),
      ]);

      if (quizRes.data.success) {
        setQuizzes(quizRes.data.quizzes);
      }

      if (
        completedRes.data.success &&
        Array.isArray(completedRes.data.completedQuizIds)
      ) {
        // ✅ store in Set for O(1) checks
        setCompletedQuizzes(new Set(completedRes.data.completedQuizIds.map(String)));
      }
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, [name, phone]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAttempt = (quizId) => {
    if (!completedQuizzes.has(String(quizId))) {
      navigate(`/quiz/${quizId}`);
    }
  };

  if (loading) return <p className="loading-text">Loading quizzes...</p>;

  if (!loading && quizzes.length === 0) {
    return <p className="no-quizzes-text">No quizzes found.</p>;
  }

  return (
    <div className="dashboard-container">
      {quizzes.map((quiz) => {
        const isCompleted = completedQuizzes.has(String(quiz._id));
        return (
          <div
            key={quiz._id}
            className={`quiz-card ${isCompleted ? "completed" : ""}`}
          >
            <h3 className="quiz-title">{quiz.title}</h3>
            <p className="quiz-description">{quiz.description}</p>
            <p className="quiz-time">Time Limit: {quiz.timeLimit} minutes</p>
            {isCompleted && <span className="completed-badge">✅ Completed</span>}
            <button
              className="attempt-btn"
              onClick={() => handleAttempt(quiz._id)}
              disabled={isCompleted}
            >
              {isCompleted ? "Already Attempted" : "Attempt Quiz"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
