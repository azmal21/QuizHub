import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import "../styles/FeedbackForm.css";
import api from "../api";

const FeedbackForm = ({ quizId }) => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const name = localStorage.getItem("userName");
  const phone = localStorage.getItem("userPhone");

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.warning("Please select a rating before submitting.");
      return;
    }

    try {
      await api.post("/feedback/submit", {
        name,
        phone,
        quizId,
        message,
        rating,
      });

      toast.success("Feedback submitted successfully!");
      setMessage("");
      setRating(0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit feedback. Try again!");
    }
  };

  // ✅ Handle star interactions (memoized for performance)
  const handleStarClick = useCallback((starValue) => setRating(starValue), []);
  const handleStarHover = useCallback((starValue) => setHoveredRating(starValue), []);
  const handleStarLeave = useCallback(() => setHoveredRating(0), []);

  // ✅ Render stars dynamically
  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) => {
      const value = i + 1;
      const isFilled = value <= (hoveredRating || rating);
      return (
        <span
          key={value}
          className={`star ${isFilled ? "filled" : "empty"}`}
          onClick={() => handleStarClick(value)}
          onMouseEnter={() => handleStarHover(value)}
          onMouseLeave={handleStarLeave}
        >
          ★
        </span>
      );
    });

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h3 className="feedback-title">Submit Feedback</h3>

      <textarea
        className="feedback-textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your feedback..."
        required
      />

      <div className="feedback-rating-container">
        <label className="feedback-rating-label">Rating: </label>
        <div className="star-rating">
          {renderStars()}
          <span className="rating-text">
            ({rating} star{rating !== 1 ? "s" : ""})
          </span>
        </div>
      </div>

      <button
        className="feedback-submit-btn"
        type="submit"
        disabled={!rating}
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
