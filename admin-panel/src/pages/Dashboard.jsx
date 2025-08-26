import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    quizzes: 0,
    users: 0,
    attempts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("👉 Using API URL:", import.meta.env.VITE_API_URL);
  }, []);


  // Fetch stats when component loads
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [quizRes, userRes, attemptRes] = await Promise.all([
          api.get("/quiz/count"),
          api.get("/user/count"),
          api.get("/user/attemptcount"),
        ]);

        console.log("👉 quizRes:", quizRes.data);   // 👈 add this
        console.log("👉 userRes:", userRes.data);
        console.log("👉 attemptRes:", attemptRes.data);

        setStats({
          quizzes: quizRes.data.totalQuizzes || 0,
          users: userRes.data.totalUsers || 0,
          attempts: attemptRes.data.totalAttempts || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="dashboard-loading">Loading dashboard stats...</p>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <div className="dashboard-content">
          <h2 className="dashboard-title">Welcome to the Admin Dashboard</h2>
          <p className="dashboard-subtitle">
            Here you can manage quizzes, view results, and more.
          </p>

          {/* Quick Stats Section */}
          <div className="dashboard-stats">
            <StatCard title="Total Quizzes" value={stats.quizzes} />
            <StatCard title="Total Users" value={stats.users} />
            <StatCard title="Total Attempts" value={stats.attempts} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <h3 className="stat-title">{title}</h3>
    <p className="stat-value">{value}</p>
  </div>
);

export default Dashboard;
