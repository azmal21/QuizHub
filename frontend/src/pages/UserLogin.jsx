import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserLogin.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const UserLogin = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name.trim()) return toast.warning("Please enter your name.");
    if (!phone.trim() || phone.length !== 10)
      return toast.warning("Please enter a valid 10-digit phone number.");

    setLoading(true);
    try {
      const { data } = await api.post("/user/login", {
        name: name.trim(),
        phone: phone.trim(),
      });

      if (data.success) {
        // Save user info in localStorage
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", name.trim());
        localStorage.setItem("userPhone", phone.trim());

        // Reset inputs
        setName("");
        setPhone("");

        toast.success("Login successful!");
        navigate("/home");
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>User Login</h2>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="login-input"
        />

        {/* Phone Input (10 digits only) */}
        <input
          type="tel"
          placeholder="Enter your phone number (10 digits)"
          value={phone}
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/\D/g, ""); // only numbers
            if (onlyNums.length <= 10) setPhone(onlyNums); // max 10 digits
          }}
          disabled={loading}
          className="login-input"
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="login-button"
        >
          {loading ? "Checking..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default UserLogin;
