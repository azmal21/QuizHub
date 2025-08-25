import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrophy, FaChartBar, FaChartLine } from "react-icons/fa";
import "../styles/Welcome.css";

const Welcome = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const navigate = useNavigate();

  // useCallback avoids recreating function on every render
  const toggleFAQ = useCallback(
    (index) => {
      setActiveFAQ((prev) => (prev === index ? null : index));
    },
    []
  );

  const faqs = [
    {
      question: "How do I log in?",
      answer:
        "You can log in using your mobile number with OTP (One Time Password). No need to remember a password!",
    },
    {
      question: "Can I attempt a quiz more than once?",
      answer:
        "No. Each quiz can only be attempted once. This ensures fairness and equal opportunity for all participants.",
    },
    {
      question: "Where can I see my results?",
      answer:
        "You can view your results in the 'Results' page of your dashboard. Each attempt shows your score, time taken, and detailed answers.",
    },
    {
      question: "Can I download a certificate?",
      answer:
        "Yes! After completing a quiz, you can download a certificate from the 'Results' page. The certificate includes your score, all quiz questions, the correct answers, and your submitted answers.",
    },
    {
      question: "How does the leaderboard work?",
      answer:
        "The leaderboard ranks users based on their average score across attempted quizzes. This highlights consistent performance.",
    },
    {
      question: "How can I give feedback?",
      answer:
        "Go to the 'Feedback' section in your dashboard to share your thoughts or report an issue. Your feedback is visible only to the admin.",
    },
    {
      question: "Can I log in again using OTP?",
      answer:
        "Yes, you can log in again using your mobile number and OTP. However, you must enter the same name you used during your first login to keep your records consistent.",
    },
  ];


  return (
    <div className="welcome-page">
      {/* Floating shapes purely decorative → mark aria-hidden for accessibility */}
      <div className="floating-shapes" aria-hidden="true">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      {/* Hero Section */}
      <div className="container">
        <section className="hero-section">
          <h1 className="hero-title">Welcome to the Quiz Hub</h1>
          <p className="hero-tagline">
            Take quizzes, earn certificates, and see how you rank!
          </p>
          <button
            className="cta-button"
            onClick={() => navigate("/login")}
            aria-label="Login with OTP"
          >
            Login with OTP
          </button>
        </section>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <p className="section-subtitle">
            Challenge yourself, learn new things, and enjoy quizzes like never
            before!
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">
                <FaTrophy color="gold" size={60} aria-hidden="true" />
              </span>
              <h3 className="feature-title">Earn Certificates</h3>
              <p className="feature-description">
                Complete quizzes and earn beautiful digital certificates to
                showcase your achievements and knowledge.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">
                <FaChartLine color="#2196f3" size={60} aria-hidden="true" />
              </span>
              <h3 className="feature-title">Track Your Progress</h3>
              <p className="feature-description">
                Track your progress with detailed insights based on your average
                quiz scores.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">
                <FaChartBar color="#4caf50" size={60} aria-hidden="true" />
              </span>
              <h3 className="feature-title">Leaderboards</h3>
              <p className="feature-description">
                Compete with friends in a fun, friendly environment that
                encourages learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Find answers to common questions about our quiz platform.
          </p>

          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={activeFAQ === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{faq.question}</span>
                  <span
                    className={`faq-icon ${activeFAQ === index ? "active" : ""}`}
                  >
                    +
                  </span>

                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`faq-answer ${activeFAQ === index ? "active" : ""
                    }`}
                  role="region"
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
