import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = React.memo(({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/home", label: "Home" },
    { path: "/profile", label: "Profile" },
    { path: "/result", label: "Result" },
    { path: "/feedback", label: "Feedback" },
    { path: "/leaderboard", label: "LeaderBoard" },
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose}>✖</button>
      <h2 className="sidebar-logo"> QuizHub</h2>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path} onClick={onClose}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default Sidebar;
