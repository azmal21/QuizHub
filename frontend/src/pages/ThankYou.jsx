import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ThankYou.css";

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Use nullish coalescing (??) for safer fallback values
  const { score, totalQuestions, name } = location.state ?? {};

  // ✅ useCallback prevents re-creation on every render
  const handleBackToHome = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  return (
    <div className="thank-you-container">
      <h1>Thank You, {name ?? "Participant"}!</h1>
      <p>You have successfully completed the quiz.</p>

      {typeof score === "number" && (
        <div className="score-box">
          <h2>
            Your Score: {score} / {totalQuestions}
          </h2>
        </div>
      )}

      <button onClick={handleBackToHome} className="back-btn">
        Back to Home
      </button>
    </div>
  );
};

export default ThankYouPage;
