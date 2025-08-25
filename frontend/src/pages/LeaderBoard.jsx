import React, { useEffect, useState } from "react";
import "../styles/LeaderBoard.css";
import api from "../api";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // ✅ prevents state update after unmount

    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get("/user/leaderboard");
        if (isMounted) setUsers(data || []);
      } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLeaderboard();

    return () => {
      isMounted = false; // ✅ cleanup
    };
  }, []);

  if (loading) {
    return (
      <div className="leaderboard-container">
        <h1 className="leaderboard-title">Leaderboard</h1>
        <p className="leaderboard-loading">Loading leaderboard...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="leaderboard-container">
        <h1 className="leaderboard-title">Leaderboard</h1>
        <p className="leaderboard-empty">No users found.</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Average Score (%)</th>
            <th>Attempts</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.phone || index}>
              <td className="rank">{index + 1}</td>
              <td className="name">{user.name}</td>
              <td className="phone">{user.phone}</td>
              <td className="score">{user.averageScore}</td>
              <td className="attempts">{user.attempts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
