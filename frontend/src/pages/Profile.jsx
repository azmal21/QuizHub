import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import api from "../api";

const Profile = () => {
  const name = localStorage.getItem("userName") || "Unknown User";
  const phone = localStorage.getItem("userPhone") || "N/A";

  const [avgScore, setAvgScore] = useState(null);
  const [loading, setLoading] = useState(phone !== "N/A"); // ✅ skip loading if phone not available
  const [error, setError] = useState("");

  useEffect(() => {
    if (phone === "N/A") {
      setAvgScore("N/A");
      return;
    }

    let isMounted = true;

    const fetchAverageScore = async () => {
      try {
        const { data } = await api.get(
          `/user/average-score/${phone}`
        );


        if (!isMounted) return;

        if (data.success) {
          setAvgScore(data.averageScore);
        } else {
          setError("Failed to fetch average score");
        }
      } catch (err) {
        console.error("❌ Error fetching average score:", err);
        if (isMounted) setError("Error fetching average score");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAverageScore();

    return () => {
      isMounted = false; // ✅ cleanup to avoid memory leaks
    };
  }, [phone]);

  // ✅ Small reusable component for profile cards
  const ProfileCard = ({ icon, label, value }) => (
    <div className="profile-card">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3 className="card-label">{label}</h3>
        <p className="card-value">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-text">{name.charAt(0).toUpperCase()}</span>
        </div>
        <h1 className="profile-title">My Profile</h1>
      </div>

      <div className="profile-content">
        <ProfileCard
          label="Full Name"
          value={name}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />

        <ProfileCard
          label="Phone Number"
          value={phone}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />

        <ProfileCard
          label="Average Score"
          value={
            loading ? (
              <span className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
            ) : error ? (
              <span className="score-value">{error}</span>
            ) : avgScore !== null ? (
              <span className="score-value">{avgScore}%</span>
            ) : (
              "N/A"
            )
          }
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
};

export default Profile;
