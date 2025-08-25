import React, { memo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "../styles/Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/create-quiz", label: "Create Quiz" },
    { path: "/edit-quiz", label: "Edit Quiz" },
    { path: "/results", label: "View Results" },
    { path: "/feedback", label: "View Feedback" },
    { path: "/users", label: "View All Users" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
        role="presentation"
      ></div>

      {/* Sidebar Menu */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={onClose} aria-label="Close Sidebar">
          &times;
        </button>
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            {menuItems.map(({ path, label }) => (
              <li key={path}>
                <Link to={path} onClick={onClose}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default memo(Sidebar);
