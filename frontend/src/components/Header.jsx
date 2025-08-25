import React from "react";
import "../styles/Header.css";

const Header = React.memo(({ toggleSidebar }) => {
  return (
    <header className="header">
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <h1 className="app-title">QuizHub</h1>
    </header>
  );
});

export default Header;
