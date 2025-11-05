Overview

QuizHub allows admins to create quizzes and view results, while users can log in using their name and phone number, attempt quizzes once, and download a certificate after completion.
A leaderboard ranks all users by their average score, making the platform interactive and competitive.

Features
Admin Panel

Secure login (password-protected)

Create, edit, and delete quizzes

View user attempts and results

User Side

Login with name and phone number (no OTP required)

View available quizzes

Attempt a quiz only once per user (based on phone number)

Auto-submit when the timer ends

Certificate generation and download using jsPDF

Leaderboard showing users’ average scores

Tech Stack

Frontend: React + React Router + Axios + CSS
Backend: Node.js + Express
Database: MongoDB (Mongoose)
PDF Certificate: jsPDF (in frontend)
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

User (models/User.js)
{
  name: String,
  phone: String // unique 10-digit number
}

UserAttempt (models/UserAttempt.js)
{
  quizId: ObjectId,
  name: String,
  phone: String,     // used to prevent repeat attempts
  answers: [Number],
  score: Number,
  timeTaken: Number, // in seconds
  createdAt: Date
}

Admin (models/Admin.js)
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

POST /api/user/login — login or register with name and phone
GET /api/quizzes — list all quizzes
GET /api/quizzes/:id — fetch quiz (without correct answers)
POST /api/quizzes/:id/submit — submit answers, store score, and return result

Leaderboard

GET /api/leaderboard — average score of all users

Frontend Pages / Flow

LoginPage — enter name and 10-digit phone number to log in
QuizList — list all available quizzes
UserQuiz — quiz interface with timer and auto-submit
ResultPage — show score and certificate download option
LeaderboardPage — show all users’ average scores
Admin Pages — login, dashboard, quiz management, and view results

Certificate Download

After quiz submission, users can download a personalized certificate in PDF format.
Generated using jsPDF in the frontend.
The certificate includes:

User’s name

Quiz title

Score

Date of completion

Leaderboard

The leaderboard shows all users along with their average scores, creating a competitive and engaging quiz experience.

Setup & Run Locally
Prerequisites

Node.js (v16 or later)

MongoDB (local or Atlas)

Steps
# Clone repository
git clone https://github.com/yourname/quizhub.git
cd quizhub

# Backend setup
cd server
npm install
npm run dev   # starts Express backend

# Frontend setup
cd ../client
npm install
npm start     # starts React frontend

Environment Variables

Create .env in the server/ folder:

PORT=5000
MONGO_URI=mongodb+srv://...
ADMIN_PASSWORD_HASH=...
JWT_SECRET=...

Deployment

Backend deployed on Render (Express + MongoDB Atlas)

Frontend deployed on Render static site hosting

CORS configured to allow frontend domain (https://quizhub-frontend-1.onrender.com)

Future Improvements

Email-based certificate delivery

Multiple admin roles

Quiz categories and difficulty levels

Multimedia question types (image, audio, video)

Enhanced leaderboard with quiz filters

QuizHub is a modern, full-stack online quiz platform built for seamless quiz creation, participation, and performance tracking — fast, secure, and easy to use.
