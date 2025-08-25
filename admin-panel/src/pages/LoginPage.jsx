// src/pages/LoginPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"; // Custom CSS

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (password.trim() === adminPassword) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } else {
      setError(" Invalid admin password");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Admin Login</h2>

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />

        <button type="submit" className="login-btn">
          Login
        </button>

        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
