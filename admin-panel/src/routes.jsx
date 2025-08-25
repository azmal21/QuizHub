// src/routes.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CreateQuiz from "./pages/CreateQuiz";
import EditQuiz from "./pages/EditQuiz";
import Results from "./pages/Results";
import AdminFeedback from "./pages/AdminFeedback";
import ViewUsers from "./pages/ViewUsers";

function RoutesList() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
     <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-quiz" element={<CreateQuiz />} />
      <Route path="/edit-quiz" element={<EditQuiz />} />
      <Route path="/results" element={<Results />} /> 
      <Route path="/feedback" element={<AdminFeedback/>}/>
      <Route path="/users" element={<ViewUsers/>}/>

    </Routes>
  );
}

export default RoutesList;
