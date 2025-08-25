import { useEffect, useState } from "react";
import "../styles/EditQuiz.css";
import api from "../services/api";

const EditQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [message, setMessage] = useState("");

  // 🔹 Fetch quizzes
  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/admin/quizzes", {
        headers: { "x-admin-password": import.meta.env.VITE_ADMIN_PASSWORD },
      });
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      console.error(" Error fetching quizzes:", err);
      setQuizzes([]);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // 🔹 Safe state updater
  const updateQuiz = (quizIndex, updater) => {
    setQuizzes((prev) => {
      const updated = [...prev];
      if (!updated[quizIndex].questions) updated[quizIndex].questions = [];
      updater(updated[quizIndex]);
      return updated;
    });
  };

  const handleQuizChange = (quizIndex, field, value) => {
    updateQuiz(quizIndex, (quiz) => (quiz[field] = value));
  };

  const handleQuestionChange = (quizIndex, qIndex, field, value) => {
    updateQuiz(quizIndex, (quiz) => {
      if (!quiz.questions[qIndex]) return;
      quiz.questions[qIndex][field] = value;
    });
  };

  const handleOptionChange = (quizIndex, qIndex, optIndex, value) => {
    updateQuiz(quizIndex, (quiz) => {
      if (!quiz.questions[qIndex]) return;
      quiz.questions[qIndex].options[optIndex] = value;
    });
  };

  const handleAddQuestion = (quizIndex) => {
    updateQuiz(quizIndex, (quiz) => {
      quiz.questions.push({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
    });
  };

  const handleDeleteQuestion = (quizIndex, qIndex) => {
    updateQuiz(quizIndex, (quiz) => {
      quiz.questions.splice(qIndex, 1);
    });
  };

  // 🔹 Save quiz
  const handleSaveQuiz = async (quizId, quizData) => {
    try {
      await api.put(`/admin/quiz/${quizId}`, quizData, {
        headers: { "x-admin-password": import.meta.env.VITE_ADMIN_PASSWORD },
      });
      setMessage(" Quiz updated successfully!");
      setEditingQuizId(null);
      fetchQuizzes();
    } catch (err) {
      console.error(" Failed to update quiz:", err);
      setMessage(" Failed to update quiz.");
    }
  };

  // 🔹 Delete quiz
  const handleDeleteQuiz = async (quizId) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await api.delete(`/admin/quiz/${quizId}`, {
        headers: { "x-admin-password": import.meta.env.VITE_ADMIN_PASSWORD },
      });
      setMessage(" Quiz deleted successfully!");
      fetchQuizzes();
    } catch (err) {
      console.error(" Failed to delete quiz:", err);
      setMessage(" Failed to delete quiz.");
    }
  };

  return (
    <div className="main-layout">
      <div className="content">
        <h2>Edit & Manage Quizzes</h2>
        {message && <p className="message">{message}</p>}

        {quizzes.length === 0 ? (
          <p>No quizzes found.</p>
        ) : (
          quizzes.map((quiz, quizIndex) => (
            <div key={quiz._id} className="quiz-card">
              {editingQuizId === quiz._id ? (
                <>
                  {/* Editable fields */}
                  <label>Title:</label>
                  <input
                    value={quiz.title || ""}
                    onChange={(e) => handleQuizChange(quizIndex, "title", e.target.value)}
                  />

                  <label>Description:</label>
                  <textarea
                    value={quiz.description || ""}
                    onChange={(e) =>
                      handleQuizChange(quizIndex, "description", e.target.value)
                    }
                  />

                  <label>Time Limit (min):</label>
                  <input
                    type="number"
                    value={quiz.timeLimit || ""}
                    onChange={(e) =>
                      handleQuizChange(quizIndex, "timeLimit", e.target.value)
                    }
                  />

                  <h4>Questions:</h4>
                  {quiz.questions?.length > 0 ? (
                    quiz.questions.map((q, qIndex) => (
                      <div key={qIndex} className="question-block">
                        <label>Question:</label>
                        <input
                          value={q.question || ""}
                          onChange={(e) =>
                            handleQuestionChange(quizIndex, qIndex, "question", e.target.value)
                          }
                        />

                        {q.options?.map((opt, optIndex) => (
                          <div key={optIndex}>
                            <label>Option {optIndex + 1}:</label>
                            <input
                              value={opt || ""}
                              onChange={(e) =>
                                handleOptionChange(quizIndex, qIndex, optIndex, e.target.value)
                              }
                            />
                          </div>
                        ))}

                        <label>Correct Answer:</label>
                        <input
                          value={q.correctAnswer || ""}
                          onChange={(e) =>
                            handleQuestionChange(
                              quizIndex,
                              qIndex,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDeleteQuestion(quizIndex, qIndex)}
                        >
                           Delete Question
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No questions yet. Add one below</p>
                  )}

                  <button type="button" onClick={() => handleAddQuestion(quizIndex)}>
                     Add Question
                  </button>

                  <div className="button-group">
                    <button onClick={() => handleSaveQuiz(quiz._id, quizzes[quizIndex])}>
                       Save
                    </button>
                    <button onClick={() => setEditingQuizId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  {/* Display mode */}
                  <h3>{quiz.title || "Untitled Quiz"}</h3>
                  <p>{quiz.description || "No description"}</p>
                  <p> {quiz.timeLimit || 0} minutes</p>
                  <p> {quiz.questions?.length || 0} questions</p>

                  <div className="button-group">
                    <button onClick={() => setEditingQuizId(quiz._id)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteQuiz(quiz._id)}>
                       Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EditQuiz;
