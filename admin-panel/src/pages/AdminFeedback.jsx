import { useEffect, useState } from "react";
import "../styles/AdminFeedback.css";
import api from "../services/api";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true; 

    const fetchFeedbacks = async () => {
      try {
        const res = await api.get(
          '/feedback'
        ); 
        if (isMounted) {
          setFeedbacks(res.data.feedbacks || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching feedbacks:", err);
          setError("Failed to load feedbacks. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeedbacks();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p className="feedback-loading">Loading feedbacks...</p>;
  }

  if (error) {
    return <p className="feedback-error">{error}</p>;
  }

  if (feedbacks.length === 0) {
    return <p className="feedback-empty">No feedbacks available.</p>;
  }

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">User Feedbacks</h2>
      <table className="feedback-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Rating</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(({ _id, name, phone, message, rating, submittedAt }) => (
            <tr key={_id}>
              <td>{name}</td>
              <td>{phone}</td>
              <td>{message}</td>
              <td>{rating} ⭐</td>
              <td>{new Date(submittedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFeedback;
