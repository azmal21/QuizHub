import { useState, useCallback, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/QuizResultPDF.css";
import api from "../api";

// ✅ Utility function to format seconds into minutes and seconds
const formatTime = (seconds) => {
  if (!seconds) return "0 sec";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins} min ${secs} sec` : `${secs} sec`;
};

// ✅ LocalStorage keys
const STORAGE_KEYS = {
  userName: "userName",
  userPhone: "userPhone"
};

// ✅ PDF colors
const PDF_COLORS = {
  teal: [0, 128, 128],
  white: [255, 255, 255],
  lightTeal: [240, 255, 255],
  darkTeal: [0, 100, 100],
  gray: [100, 100, 100],
  black: [0, 0, 0]
};

// ✅ Roasting phrases
const roastingPhrases = [
  "has unleashed their ultimate guessing skills and conquered the quiz!",
  "proved that luck is a valid quiz strategy!"
];

const QuizResultPDF = () => {
  const userData = useMemo(() => ({
    name: localStorage.getItem(STORAGE_KEYS.userName) || "",
    phone: localStorage.getItem(STORAGE_KEYS.userPhone) || ""
  }), []);

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserResults = useCallback(async () => {
    const { name, phone } = userData;

    if (!name || !phone) {
      setError("No user data found. Please ensure you're logged in.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.get("/admin/results/users", {
        params: { name, phone }
      });

      const detailedAttempts = (data.attempts || []).map((attempt) => ({
        ...attempt,
        answers: Array.isArray(attempt.answers) ? attempt.answers : [],
        quizId: attempt.quizId || { title: "Mystery Quiz" },
        score: typeof attempt.score === 'number' ? attempt.score : 0,
        usedTime: typeof attempt.usedTime === 'number' ? attempt.usedTime : 0,
        attemptedAt: attempt.attemptedAt || new Date().toISOString(),
      }));

      setResults(detailedAttempts);
    } catch (err) {
      console.error("❌ Error fetching results:", err);
      if (err.response?.status === 404) setError("No quiz results found for this user.");
      else if (err.response?.status >= 500) setError("Server error. Please try again later.");
      else if (err.code === 'ECONNABORTED') setError("Request timed out. Please check your connection.");
      else setError("Failed to fetch quiz results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [userData]);


  const downloadCertificate = useCallback((attempt) => {
    if (!attempt) return;

    try {
      const doc = new jsPDF("p", "mm", "a4");
      const { name } = userData;

      // Outer border
      doc.setLineWidth(3);
      doc.setDrawColor(...PDF_COLORS.teal);
      doc.rect(10, 10, 190, 277);

      // Title
      doc.setFontSize(26).setFont("helvetica", "bold").setTextColor(...PDF_COLORS.teal);
      doc.text("QUIZ CERTIFICATE", 105, 50, { align: "center" });

      // Subtitle
      doc.setFontSize(14).setFont("helvetica", "italic").setTextColor(...PDF_COLORS.gray);
      doc.text("Certificate of Achievement", 105, 65, { align: "center" });

      // Recipient
      doc.setFontSize(22).setFont("helvetica", "bold").setTextColor(...PDF_COLORS.teal);
      doc.text(name || "Anonymous", 105, 90, { align: "center" });

      // ✅ Random roasting achievement
      const randomIndex = Math.floor(Math.random() * roastingPhrases.length);
      const funnyText = roastingPhrases[randomIndex];
      doc.setFontSize(16).setFont("helvetica", "normal").setTextColor(50, 50, 50);
      doc.text(funnyText, 105, 110, { align: "center" });

      // Quiz Title
      const quizTitle = `"${attempt.quizId?.title || "Mystery Quiz"}"`;
      doc.setFontSize(14).setFont("helvetica", "bold").setTextColor(...PDF_COLORS.teal);
      doc.text(quizTitle, 105, 125, { align: "center" });

      // Score
      const score = typeof attempt.score === 'number' ? attempt.score : 0;
      doc.setFontSize(16).setFont("helvetica", "bold").setTextColor(...PDF_COLORS.darkTeal);
      doc.text(`Final Score: ${score}`, 105, 145, { align: "center" });

      // Time Taken
      doc.setFontSize(12).setFont("helvetica", "normal").setTextColor(...PDF_COLORS.gray);
      doc.text(`Time Taken: ${formatTime(attempt.usedTime)}`, 105, 160, { align: "center" });

      // Completion Date
      const completionDate = new Date(attempt.attemptedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      doc.setFontSize(12).setFont("helvetica", "normal").setTextColor(...PDF_COLORS.teal);
      doc.text(`Completed on: ${completionDate}`, 105, 175, { align: "center" });

      // Results Table
      const tableData = (attempt.answers || []).map((ans, i) => [
        `Q${i + 1}`,
        ans.userAnswer || "Not Answered",
        ans.correctAnswer || "N/A",
        ans.isCorrect ? "Correct" : "Incorrect"
      ]);

      if (tableData.length > 0) {
        autoTable(doc, {
          head: [["Question", "Your Answer", "Correct Answer", "Result"]],
          body: tableData,
          startY: 190,
          theme: "grid",
          styles: { fontSize: 9, halign: "center", valign: "middle", textColor: PDF_COLORS.black, cellPadding: 3 },
          headStyles: { fillColor: PDF_COLORS.teal, textColor: PDF_COLORS.white, fontStyle: "bold", fontSize: 10 },
          alternateRowStyles: { fillColor: PDF_COLORS.lightTeal },
          columnStyles: { 0: { halign: 'center', cellWidth: 20 }, 1: { halign: 'left', cellWidth: 55 }, 2: { halign: 'left', cellWidth: 55 }, 3: { halign: 'center', cellWidth: 30 } }
        });
      }

      // Save PDF
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${name || "user"}_certificate_${timestamp}.pdf`;
      doc.save(filename);

    } catch (error) {
      console.error("Error generating PDF certificate:", error);
      alert("Failed to generate certificate. Please try again.");
    }
  }, [userData]);

  const userInfoDisplay = useMemo(() => ({
    name: userData.name || "Not available",
    phone: userData.phone || "Not available"
  }), [userData]);

  return (
    <div className="quiz-result-container">
      <header className="quiz-result-header">
        <h2 className="page-title">My Quiz Results</h2>
        <div className="user-info-section">
          <div className="user-info-card">
            <p className="user-name-info"><span className="info-label">Name:</span> <span className="info-value">{userInfoDisplay.name}</span></p>
            <p className="user-phone-info"><span className="info-label">Phone:</span> <span className="info-value">{userInfoDisplay.phone}</span></p>
          </div>
        </div>
      </header>

      <div className="fetch-section">
        <button
          className={`fetch-btn ${isLoading ? "fetch-btn--loading" : ""}`}
          onClick={fetchUserResults}
          disabled={isLoading}
          aria-label="Fetch quiz results"
        >
          {isLoading ? "Loading..." : "🔍 Get Results"}
        </button>
        {error && <div className="error-message" role="alert">⚠️ {error}</div>}
      </div>

      {results.length > 0 ? (
        <section className="results-section">
          <h3 className="results-title">Results for <span className="highlight-name">{userData.name}</span></h3>
          <div className="attempts-grid">
            {results.map((attempt, index) => (
              <article key={attempt._id || `attempt-${index}`} className="attempt-card">
                <header className="attempt-header"><h4 className="attempt-title">{index + 1}. {attempt.quizId?.title || "Mystery Quiz"}</h4></header>
                <div className="attempt-meta">
                  <p className="meta-item"> Score: {attempt.score ?? 0}</p>
                  <p className="meta-item"> Used Time: {formatTime(attempt.usedTime ?? 0)}</p>
                  <p className="meta-item">{new Date(attempt.attemptedAt).toLocaleString()}</p>
                </div>
                <footer className="attempt-footer">
                  <button className="download-btn" onClick={() => downloadCertificate(attempt)} aria-label={`Download certificate for ${attempt.quizId?.title || "quiz"}`}>
                    Download Certificate
                  </button>
                </footer>
              </article>
            ))}
          </div>
        </section>
      ) : (
        !isLoading && <div className="no-results-message"><p>Click "Get Results" button to fetch your certificates!</p></div>
      )}
    </div>
  );
};

export default QuizResultPDF;
