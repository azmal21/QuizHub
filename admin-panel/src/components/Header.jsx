import React, { memo } from "react";
import PropTypes from "prop-types";
import "../styles/Header.css";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <button 
        className="menu-btn" 
        onClick={toggleSidebar} 
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>
      <h1 className="app-title">QuizHub</h1>
    </header>
  );
};

// ✅ Add prop validation
Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

// ✅ Memoize since Header doesn't need re-render unless props change
export default memo(Header);
