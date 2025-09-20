QuizHub — Family Quiz App

QuizHub is an online family quiz application built with React (CSS styling), Express, and MongoDB.
Features include secure admin quiz creation, Firebase OTP login, timed quizzes with auto-submit, downloadable certificates (jsPDF), and a leaderboard that shows users’ average scores. The project is deployed and running live on Render.

Table of Contents

Overview
Features
Tech Stack
Data Models
API Endpoints
Frontend Pages / Flow
OTP Login Flow (Firebase)
Certificate Download
Leaderboard
Setup & Run Locally
Environment Variables
Deployment
Future Improvements

Overview

QuizHub allows an admin to create quizzes and view results, while users can log in with their mobile number (via Firebase OTP), attempt quizzes once, and download a certificate after completion.
A leaderboard ranks all users by their average score, making the app fun and competitive.

Features

Admin Panel
Secure login (password-protected)
Create, edit, and delete quizzes
View user attempts and results
User Side
Login with mobile OTP (Firebase phone auth)
See available quizzes
Attempt a quiz once per user (phone-based restriction)
Auto-submit when the timer ends
Certificate generation & download using jspdf
Leaderboard showing average scores

Tech Stack

Frontend: React + React Router + Axios + CSS
Backend: Node.js + Express
Database: MongoDB (mongoose)
Auth: Firebase Phone Auth (OTP verification)
PDF Certificate: jspdf (in frontend)
Deployment: Render (backend + frontend hosted)

Data Models

Quiz (models/Quiz.js)
{
  title: String,
  description: String,
  timeLimit: Number, // in seconds
  questions: [
    { text: String, options: [String], correct: [Number] }
  ],
  createdAt: Date,
  updatedAt: Date
}

UserAttempt (models/UserAttempt.js)
{
  quizId: ObjectId,
  name: String,
  phone: String,     // used to block repeat attempts
  answers: [Number],
  score: Number,
  timeTaken: Number, // seconds
  createdAt: Date
}

Admin (models/Admin.js - optional)
{
  username: String,
  passwordHash: String
}

API Endpoints

Admin

POST /api/admin/login — login with password
POST /api/admin/quizzes — create quiz
PUT /api/admin/quizzes/:id — edit quiz
DELETE /api/admin/quizzes/:id — delete quiz
GET /api/admin/quizzes — list all quizzes
GET /api/admin/results/:quizId — view results

User

GET /api/quizzes — list all quizzes
GET /api/quizzes/:id — fetch quiz (without correct answers)
POST /api/quizzes/:id/submit — submit answers, store score, return result

Leaderboard

GET /api/leaderboard — average score of all users
Frontend Pages / Flow
LoginPage (Firebase OTP) — enter phone, verify OTP
QuizList — list all available quizzes
UserQuiz — quiz-taking interface with timer + auto-submit
ResultPage — show score + certificate download button
LeaderboardPage — show average scores of all users
Admin Pages — login, dashboard, quiz management, view results
OTP Login Flow (Firebase)
User enters mobile number
Firebase sends OTP SMS to user
User enters OTP in app
Firebase verifies OTP and returns an auth token
Token used to identify user (phone number stored in DB with submission)
No OTP schema is stored in MongoDB. Firebase handles OTP lifecycle.

Certificate Download

After quiz submission, user can download a certificate in PDF format.
Generated using jspdf in frontend.
Certificate includes: user name, quiz title, score, and date.

Leaderboard

The leaderboard shows all users with their average scores.



Setup & Run Locally
Prerequisites

Node.js (v16+)
MongoDB (local or Atlas)
Firebase project for OTP setup

Steps
# clone
git clone https://github.com/yourname/quizhub.git
cd quizhub

# backend
cd server
npm install
npm run dev   # starts Express server

# frontend
cd ../client
npm install
npm start     # starts React dev server

Environment Variables

Create .env in server/:

PORT=5000
MONGODB_URI=mongodb+srv://...
ADMIN_PASSWORD_HASH=...
JWT_SECRET=...

Create .env in client/ for Firebase:

REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_APP_ID=...

Deployment

Backend deployed on Render (Express + MongoDB Atlas).
Frontend deployed on Render static site hosting.
Firebase OTP works online with whitelisted domains.

Future Improvements

Email-based certificate delivery
Multiple admin roles
Quiz categories & difficulty levels
Question types (image, audio, video)
