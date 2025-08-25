// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import RoutesList from "./routes";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./App.css";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation(); // Get current path
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const isLoginPage = location.pathname === "/"; // Check if we are on login page

  return (
    <div className="app-container">
      {/* Only show Header if not login page */}
      {!isLoginPage && <Header toggleSidebar={toggleSidebar} />}

      {/* Sidebar (CSS controls visibility) */}
      {!isLoginPage && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />}

      {/* Overlay when sidebar is open */}
      {!isLoginPage && isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      {/* Main Content */}
      <main className={`main-content ${!isLoginPage && isSidebarOpen ? "shifted" : ""}`}>
        <RoutesList />
      </main>
    </div>
  );
}

export default AppWrapper;
