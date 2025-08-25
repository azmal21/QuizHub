// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";   // ✅ Import ToastContainer
import "react-toastify/dist/ReactToastify.css";    // ✅ Import styles

import UserLogin from "./pages/UserLogin";
import Home from "./pages/Home";
import AttemptQuiz from "./pages/AttemptQuiz";
import Profile from "./pages/Profile";
import ThankYouPage from "./pages/ThankYou";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./App.css";
import QuizResultPDF from "./pages/QuizResultPDF";
import FeedbackForm from "./pages/FeedbackForm";
import Leaderboard from "./pages/LeaderBoard";
import Welcome from "./pages/Welcome";

function AppContent() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const isLoginPage = location.pathname === "/" || location.pathname === "/login";

  return (
    <div className="app-container">
      {!isLoginPage && (
        <>
          <Header toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
        </>
      )}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/quiz/:quizId" element={<AttemptQuiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/thankyou" element={<ThankYouPage />} />
          <Route path="/result" element={<QuizResultPDF />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>

      {/* ✅ Add ToastContainer once in root */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
