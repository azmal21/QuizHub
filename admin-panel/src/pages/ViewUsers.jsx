import React, { useEffect, useState } from "react";
import "../styles/ViewUsers.css";
import api from "../services/api";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/user/all");
        if (isMounted) {
          setUsers(data.users || []);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load users. Please try again later.");
          console.error("Error fetching users:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      isMounted = false; // ✅ Cleanup
    };
  }, []);

  if (loading) return <p className="loading">Loading users...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="users-page">
      <h2>All Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Joined Date</th>
            <th>Joined Time</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(({ _id, name, phone, joinedAt }) => {
              const date = new Date(joinedAt);
              return (
                <tr key={_id}>
                  <td>{name}</td>
                  <td>{phone}</td>
                  <td>{date.toLocaleDateString()}</td>
                  <td>{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="no-users">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
