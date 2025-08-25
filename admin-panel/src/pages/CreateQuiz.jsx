import { useState } from "react";
import "../styles/CreateQuiz.css";
import api from "../services/api";

const CreateQuiz = () => {
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    timeLimit: "",
    questions: [],
  });

  const [currentQ, setCurrentQ] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const [message, setMessage] = useState("");

  const handleQuizChange = (field, value) => {
    setQuiz({ ...quiz, [field]: value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQ.options];
    newOptions[index] = value;
    setCurrentQ({ ...currentQ, options: newOptions });
  };

  const handleAddQuestion = () => {
    const { question, options, correctAnswer } = currentQ;

    if (!question || options.some((opt) => !opt) || !correctAnswer) {
      alert("Please fill all question fields before adding.");
      return;
    }

    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, currentQ],
    }));

    // Reset current question
    setCurrentQ({ question: "", options: ["", "", "", ""], correctAnswer: "" });
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();

    const { title, timeLimit, questions } = quiz;

    if (!title || !timeLimit || questions.length === 0) {
      alert("Please fill quiz details and add at least one question.");
      return;
    }

    try {
      await api.post(
        '/admin/quiz',
        quiz,
        {
          headers: {
            "x-admin-password": import.meta.env.VITE_ADMIN_PASSWORD,
          },
        }
      );

      setMessage("Quiz created successfully!");

      // Reset form
      setQuiz({ title: "", description: "", timeLimit: "", questions: [] });
      setCurrentQ({ question: "", options: ["", "", "", ""], correctAnswer: "" });
    } catch (err) {
      console.error(err);
      setMessage("Failed to create quiz. Please try again.");
    }
  };

  return (
    <div className="main-layout">
      <div className="content">
        <h2>Create a New Quiz</h2>

        <form className="quiz-form" onSubmit={handleSubmitQuiz}>
          {/* Quiz Info */}
          <label>Title:</label>
          <input
            value={quiz.title}
            onChange={(e) => handleQuizChange("title", e.target.value)}
            required
          />

          <label>Description:</label>
          <textarea
            value={quiz.description}
            onChange={(e) => handleQuizChange("description", e.target.value)}
          />

          <label>Time Limit (minutes):</label>
          <input
            type="number"
            value={quiz.timeLimit}
            onChange={(e) => handleQuizChange("timeLimit", e.target.value)}
            required
          />

          {/* Add Question */}
          <h3>Add Question</h3>
          <label>Question:</label>
          <input
            value={currentQ.question}
            onChange={(e) =>
              setCurrentQ({ ...currentQ, question: e.target.value })
            }
            required
          />

          {currentQ.options.map((opt, index) => (
            <div key={index}>
              <label>Option {index + 1}:</label>
              <input
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
            </div>
          ))}

          <label>Correct Answer:</label>
          <input
            value={currentQ.correctAnswer}
            onChange={(e) =>
              setCurrentQ({ ...currentQ, correctAnswer: e.target.value })
            }
            required
          />

          <div className="button-group">
            <button type="button" onClick={handleAddQuestion}>
              Add Question
            </button>
            <button type="submit">Create Quiz</button>
          </div>
        </form>

        {/* Show list of added questions */}
        {quiz.questions.length > 0 && (
          <div className="question-list">
            <h3>Questions Added:</h3>
            <ul>
              {quiz.questions.map((q, idx) => (
                <li key={idx}>
                  {idx + 1}. {q.question}
                </li>
              ))}
            </ul>
          </div>
        )}

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default CreateQuiz;
