import React, { useEffect, useState } from "react";
import "../styles/Results.css";
import api from "../services/api";

export default function AllAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAttempt, setExpandedAttempt] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // recent, score, name

  useEffect(() => {
    async function fetchAllAttempts() {
      try {
        const { data } = await api.get("/admin/results");
        if (data.success) {
          setAttempts(data.attempts);
        }
      } catch (error) {
        console.error("Failed to fetch attempts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllAttempts();
  }, []);

  const toggleExpanded = (attemptId) => {
    setExpandedAttempt(expandedAttempt === attemptId ? null : attemptId);
  };

  const getScorePercentage = (score, totalQuestions) => {
    if (!totalQuestions || totalQuestions === 0) return 0;
    return Math.round((score / totalQuestions) * 100);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "excellent";
    if (percentage >= 60) return "good";
    if (percentage >= 40) return "average";
    return "poor";
  };

  const filteredAndSortedAttempts = attempts
    .filter(attempt => {
      const searchLower = searchTerm.toLowerCase();
      return (
        attempt.name?.toLowerCase().includes(searchLower) ||
        attempt.quizId?.title?.toLowerCase().includes(searchLower) ||
        attempt.phone?.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score;
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "recent":
        default:
          return new Date(b.attemptedAt || b.createdAt) - new Date(a.attemptedAt || a.createdAt);
      }
    });

  return (
    <div className="page-layout">
      <div className="content-wrapper">
        <main className="main-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading">Loading attempts...</p>
            </div>
          ) : (
            <>
              <div className="attempts-header">
                <h2>Quiz Attempts ({attempts.length})</h2>
                
                {/* Search and Sort Controls */}
                <div className="controls-section">
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search by name, quiz title, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  
                  <div className="sort-container">
                    <label htmlFor="sort-select">Sort by:</label>
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="sort-select"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="score">Highest Score</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              {filteredAndSortedAttempts.length === 0 ? (
                <div className="no-data">
                  {searchTerm ? "No attempts match your search." : "No attempts found."}
                </div>
              ) : (
                <div className="attempts-list">
                  {filteredAndSortedAttempts.map((attempt) => {
                    const isExpanded = expandedAttempt === attempt._id;
                    const totalQuestions = attempt.answers?.length || 0;
                    const scorePercentage = getScorePercentage(attempt.score, totalQuestions);
                    
                    return (
                      <div
                        key={attempt._id}
                        className={`attempt-accordion ${isExpanded ? "expanded" : ""}`}
                      >
                        {/* Collapsed View - Summary */}
                        <div
                          className="attempt-summary"
                          onClick={() => toggleExpanded(attempt._id)}
                        >
                          <div className="summary-main">
                            <div className="participant-info">
                              <h3 className="participant-name">{attempt.name || "Anonymous"}</h3>
                              <p className="quiz-title">{attempt.quizId?.title || "Untitled Quiz"}</p>
                            </div>
                            
                            <div className="summary-stats">
                              <div className={`score-badge ${getScoreColor(scorePercentage)}`}>
                                {attempt.score}/{totalQuestions}
                                <span className="percentage">({scorePercentage}%)</span>
                              </div>
                              
                              <div className="attempt-date">
                                {new Date(attempt.attemptedAt || attempt.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="expand-indicator">
                            <span className={`arrow ${isExpanded ? "up" : "down"}`}>▼</span>
                          </div>
                        </div>

                        {/* Expanded View - Detailed Information */}
                        {isExpanded && (
                          <div className="attempt-details">
                            <div className="details-grid">
                              <div className="detail-section">
                                <h4>Contact Information</h4>
                                <p><strong>Phone:</strong> {attempt.phone || "Not provided"}</p>
                                <p><strong>Attempted At:</strong> {new Date(attempt.attemptedAt || attempt.createdAt).toLocaleString()}</p>
                                <p><strong>Time Taken:</strong> {attempt.usedTime ? `${attempt.usedTime} seconds` : "Not recorded"}</p>
                              </div>
                              
                              <div className="detail-section">
                                <h4>Quiz Performance</h4>
                                <p><strong>Final Score:</strong> {attempt.score} out of {totalQuestions}</p>
                                <p><strong>Percentage:</strong> {scorePercentage}%</p>
                                <p><strong>Quiz:</strong> {attempt.quizId?.title || "Untitled Quiz"}</p>
                              </div>
                            </div>

                            {/* Detailed Answers */}
                            {attempt.answers && attempt.answers.length > 0 && (
                              <div className="answers-detailed">
                                <h4>Detailed Answers</h4>
                                <div className="answers-list">
                                  {attempt.answers.map((ans, i) => (
                                    <div key={i} className={`answer-item ${ans.isCorrect ? "correct" : "incorrect"}`}>
                                      <div className="question-header">
                                        <span className="question-number">Q{i + 1}</span>
                                        <span className={`result-icon ${ans.isCorrect ? "correct" : "incorrect"}`}>
                                          {ans.isCorrect ? "✓" : "✗"}
                                        </span>
                                      </div>
                                      
                                      <div className="question-content">
                                        <p className="question-text">{ans.questionText}</p>
                                        <div className="answer-comparison">
                                          <div className="user-answer">
                                            <strong>Your Answer:</strong> {ans.userAnswer}
                                          </div>
                                          {!ans.isCorrect && (
                                            <div className="correct-answer">
                                              <strong>Correct Answer:</strong> {ans.correctAnswer}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}