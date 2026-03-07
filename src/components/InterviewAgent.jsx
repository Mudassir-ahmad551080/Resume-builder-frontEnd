import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import pdfToText from "react-pdftotext";


// ── Utility: Extract text from TXT or PDF file ──────────────────────────────
const extractTextFromFile = (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      } else if (file.type === "application/pdf") {
        const text = await pdfToText(file); // ← handles PDF internally
        resolve(text);
      } else {
        reject(new Error("Unsupported file type"));
      }
    } catch (err) {
      reject(err);
    }
  });
};

// ── Score Ring Component ─────────────────────────────────────────────────────
const ScoreRing = ({ score }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#4ade80" : score >= 50 ? "#facc15" : "#f87171";

  return (
    <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      <circle
        cx="65" cy="65" r={radius} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s ease", filter: `drop-shadow(0 0 8px ${color}88)` }}
      />
      <text x="65" y="72" textAnchor="middle"
        style={{ fill: color, fontSize: "22px", fontWeight: 700, fontFamily: "'Sora', sans-serif", transform: "rotate(90deg)", transformOrigin: "65px 65px" }}>
        {score}
      </text>
    </svg>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
const InterviewAgent = () => {
  const [phase, setPhase] = useState("upload"); // upload | interviewing | results
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Interview state
  const [messages, setMessages] = useState([]);
  const [questionContext, setQuestionContext] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [userInput, setUserInput] = useState("");

  // Results state
  const [result, setResult] = useState(null);

  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const TOTAL_QUESTIONS = 7;

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (phase === "interviewing" && !loading) {
      inputRef.current?.focus();
    }
  }, [phase, loading, questionNumber]);

  // ── File Handling ──────────────────────────────────────────────────────────
  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    const allowed = ["application/pdf", "text/plain"];
    if (!allowed.includes(file.type)) {
      setError("Only PDF or TXT files are supported.");
      return;
    }
    setError("");
    setResumeFile(file);
  };

  // ── Start Interview ────────────────────────────────────────────────────────
 // ── Start Interview ────────────────────────────────────────────────────────
const handleStartInterview = async () => {
    if (!resumeFile) return;
    setLoading(true);
    setError("");

    try {
      // ✅ Both PDF and TXT now parsed on frontend — no backend call needed
      const text = await extractTextFromFile(resumeFile);

      if (!text || text.trim() === "") {
        setError("Could not extract text from this file. Please try a different file.");
        setLoading(false);
        return;
      }

      setResumeText(text);

      const res = await axios.post("/api/ai/interview-prep", { resumeText: text });
      const { question, questionContext: ctx, questionNumber: qNum } = res.data;

      setQuestionContext(ctx);
      setQuestionNumber(qNum);
      setMessages([{ role: "assistant", content: question, context: ctx }]);
      setPhase("interviewing");

    } catch (err) {
      console.error("Full error:", err);
      console.error("Response data:", err.response?.data);
      const msg = err.response?.data?.message || err.message || "Failed to start interview.";
      setError(msg);
    } finally {
      setLoading(false);
    }
};

  // ── Send Answer ────────────────────────────────────────────────────────────
  const handleSendAnswer = async (answer) => {
    if (!answer.trim() || loading) return;

    const userMessage = { role: "user", content: answer };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput("");
    setLoading(true);

    try {
      const apiMessages = updatedMessages.map(({ role, content }) => ({ role, content }));

      const res = await axios.post("/api/ai/interview-respond", {
        resumeText,
        messages: apiMessages,
        questionNumber,
        userAnswer: answer,
      });

      if (res.data.isComplete) {
        setResult(res.data.result);
        setPhase("results");
      } else {
        const { acknowledgment, question, questionContext: ctx, questionNumber: nextNum } = res.data;
        const combined = acknowledgment ? `${acknowledgment}\n\n${question}` : question;
        setMessages((prev) => [...prev, { role: "assistant", content: combined, context: ctx }]);
        setQuestionContext(ctx);
        setQuestionNumber(nextNum);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "There was a connection issue. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => handleSendAnswer("I don't know the answer to this question.");

  const handleReset = () => {
    setPhase("upload");
    setResumeFile(null);
    setResumeText("");
    setMessages([]);
    setQuestionContext("");
    setQuestionNumber(0);
    setUserInput("");
    setResult(null);
    setError("");
  };

  const BASE_STYLES = {
    page: {
      minHeight: "100vh",
      background: "#080c14",
      backgroundImage: `
        radial-gradient(ellipse 60% 40% at 15% 60%, rgba(56,189,248,0.05) 0%, transparent 70%),
        radial-gradient(ellipse 50% 50% at 85% 20%, rgba(99,102,241,0.05) 0%, transparent 70%)
      `,
      fontFamily: "'Sora', sans-serif",
      color: "#e2eaf8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0 1rem",
    },
    navBrand: { display: "flex", alignItems: "center", gap: 10 },
    navDot: {
      width: 32, height: 32, borderRadius: "50%",
      background: "linear-gradient(135deg, #38bdf8, #6366f1)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "0.85rem", boxShadow: "0 0 18px rgba(56,189,248,0.35)",
    },
  };

  const GLOBAL_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; margin:0; padding:0; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
    textarea:focus, input:focus { outline:none; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-thumb { background:rgba(56,189,248,0.2); border-radius:4px; }
  `;

  // ── UPLOAD PHASE ───────────────────────────────────────────────────────────
  if (phase === "upload") {
    return (
      <div style={BASE_STYLES.page}>
        <style>{GLOBAL_CSS}</style>

        {/* Nav */}
        <div style={{ width: "100%", maxWidth: 800, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "1rem" }}>
          <div style={BASE_STYLES.navBrand}>
            <div style={BASE_STYLES.navDot}>🎯</div>
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "0.04em" }}>Interview Agent</div>
              <div style={{ fontSize: "0.72rem", color: "#4b6280", marginTop: 1 }}>AI-Powered Mock Interviewer</div>
            </div>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#4b6280", background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)", padding: "5px 12px", borderRadius: 20 }}>
            7 Questions · Scored
          </div>
        </div>

        <div style={{ width: "100%", maxWidth: 520, animation: "fadeUp 0.5s ease" }}>
          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", fontWeight: 700, lineHeight: 1.25, marginBottom: "0.9rem", background: "linear-gradient(135deg, #e2eaf8 30%, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Ace Your Next<br />Interview
            </h1>
            <p style={{ color: "#4b6280", fontSize: "0.92rem", lineHeight: 1.75, maxWidth: 380, margin: "0 auto" }}>
              Upload your resume. Our AI reads it, runs a live personalized mock interview — then scores you and tells you exactly how to improve.
            </p>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: dragOver ? "2px solid #38bdf8" : resumeFile ? "2px solid rgba(56,189,248,0.45)" : "2px dashed rgba(255,255,255,0.09)",
              borderRadius: 18, padding: "2.8rem 2rem", textAlign: "center", cursor: "pointer",
              transition: "all 0.25s",
              background: dragOver ? "rgba(56,189,248,0.06)" : resumeFile ? "rgba(56,189,248,0.04)" : "rgba(255,255,255,0.02)",
              marginBottom: "1.2rem",
            }}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,.txt" style={{ display: "none" }}
              onChange={(e) => validateAndSetFile(e.target.files[0])} />
            {resumeFile ? (
              <>
                <div style={{ fontSize: "2.2rem", marginBottom: "0.7rem" }}>📄</div>
                <div style={{ color: "#38bdf8", fontWeight: 600, marginBottom: "0.3rem", fontSize: "0.95rem" }}>{resumeFile.name}</div>
                <div style={{ color: "#4b6280", fontSize: "0.78rem" }}>Click to replace</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: "2.2rem", marginBottom: "0.7rem", opacity: 0.4 }}>📋</div>
                <div style={{ color: "#6b8aad", fontWeight: 500, marginBottom: "0.4rem" }}>Drop your resume here</div>
                <div style={{ color: "#4b6280", fontSize: "0.78rem" }}>PDF or TXT · Click to browse</div>
              </>
            )}
          </div>

          {error && (
            <div style={{ color: "#f87171", fontSize: "0.82rem", textAlign: "center", marginBottom: "1rem", padding: "0.6rem", background: "rgba(248,113,113,0.08)", borderRadius: 8, border: "1px solid rgba(248,113,113,0.2)" }}>
              ⚠ {error}
            </div>
          )}

          {/* Feature Pills */}
          <div style={{ display: "flex", gap: 8, marginBottom: "1.8rem", flexWrap: "wrap" }}>
            {[["🎤", "Resume-tailored Q&A"], ["📊", "Scored out of 100"], ["💡", "Hire tips"], ["⚡", "Skip any question"]].map(([icon, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "5px 12px", fontSize: "0.75rem", color: "#6b8aad" }}>
                <span>{icon}</span><span>{label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleStartInterview}
            disabled={!resumeFile || loading}
            style={{
              width: "100%", padding: "1rem",
              background: resumeFile && !loading ? "linear-gradient(135deg, #38bdf8, #6366f1)" : "rgba(255,255,255,0.05)",
              border: "none", borderRadius: 14,
              cursor: resumeFile && !loading ? "pointer" : "not-allowed",
              color: resumeFile && !loading ? "#fff" : "#2e4060",
              fontFamily: "'Sora', sans-serif", fontSize: "0.97rem", fontWeight: 700, letterSpacing: "0.03em",
              transition: "all 0.3s",
              boxShadow: resumeFile && !loading ? "0 6px 30px rgba(56,189,248,0.25)" : "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
          >
            {loading ? (
              <>
                <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Analyzing Resume...
              </>
            ) : resumeFile ? "Start Interview →" : "Upload Resume to Begin"}
          </button>
        </div>
      </div>
    );
  }

  // ── INTERVIEW PHASE ────────────────────────────────────────────────────────
  if (phase === "interviewing") {
    const progress = (questionNumber / TOTAL_QUESTIONS) * 100;

    return (
      <div style={{ ...BASE_STYLES.page, height: "100vh", justifyContent: "flex-start" }}>
        <style>{GLOBAL_CSS}</style>

        {/* Header */}
        <div style={{ width: "100%", maxWidth: 760, padding: "1.2rem 0 0.6rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.8rem" }}>
            <div style={BASE_STYLES.navBrand}>
              <div style={BASE_STYLES.navDot}>🎯</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>Interview Agent</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: "0.8rem", color: "#6b8aad" }}>
                Question <span style={{ color: "#38bdf8", fontWeight: 700 }}>{questionNumber}</span>
                <span style={{ color: "#2e4060" }}> / {TOTAL_QUESTIONS}</span>
              </div>
              <button onClick={handleReset} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#4b6280", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontSize: "0.75rem", fontFamily: "'Sora', sans-serif" }}>
                ✕ Quit
              </button>
            </div>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg, #38bdf8, #6366f1)", borderRadius: 2, width: `${progress}%`, transition: "width 0.6s ease", boxShadow: "0 0 8px rgba(56,189,248,0.5)" }} />
          </div>
        </div>

        {/* Chat */}
        <div style={{ flex: 1, width: "100%", maxWidth: 760, overflowY: "auto", padding: "0.8rem 0", display: "flex", flexDirection: "column" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", flexDirection: msg.role === "assistant" ? "row" : "row-reverse", alignItems: "flex-start", gap: 12, marginBottom: "1.2rem", animation: "fadeUp 0.35s ease" }}>
              {msg.role === "assistant" && (
                <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #38bdf8, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: "#fff", boxShadow: "0 0 14px rgba(56,189,248,0.3)" }}>AI</div>
              )}
              <div style={{ maxWidth: "75%", background: msg.role === "assistant" ? "rgba(56,189,248,0.06)" : "rgba(99,102,241,0.1)", border: msg.role === "assistant" ? "1px solid rgba(56,189,248,0.15)" : "1px solid rgba(99,102,241,0.2)", borderRadius: msg.role === "assistant" ? "4px 16px 16px 16px" : "16px 4px 16px 16px", padding: "12px 16px", fontSize: "0.9rem", lineHeight: 1.7, color: "#c8d8ec", whiteSpace: "pre-wrap" }}>
                {msg.content}
                {msg.role === "assistant" && msg.context && (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(56,189,248,0.1)", fontSize: "0.72rem", color: "#38bdf855", fontStyle: "italic" }}>
                    💬 {msg.context}
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>👤</div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: "1.2rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #38bdf8, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: "#fff", animation: "pulse 1.5s infinite" }}>AI</div>
              <div style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.12)", borderRadius: "4px 16px 16px 16px", padding: "12px 18px", display: "flex", gap: 6, alignItems: "center" }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#38bdf8", animation: "bounce 1.2s infinite", animationDelay: `${i * 0.18}s` }} />)}
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input */}
        {!loading && (
          <div style={{ width: "100%", maxWidth: 760, padding: "0.6rem 0 1.5rem", flexShrink: 0 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1rem 1rem 0.75rem" }}>
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendAnswer(userInput); } }}
                placeholder="Type your answer here... (Enter to send · Shift+Enter for new line)"
                rows={3}
                style={{ width: "100%", background: "transparent", border: "none", color: "#c8d8ec", fontFamily: "'Sora', sans-serif", fontSize: "0.9rem", lineHeight: 1.7, resize: "none", caretColor: "#38bdf8" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.6rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <button onClick={handleSkip} style={{ background: "transparent", border: "1px solid rgba(248,113,113,0.2)", color: "rgba(248,113,113,0.6)", padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.78rem", fontFamily: "'Sora', sans-serif", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(248,113,113,0.08)"; e.target.style.color = "#f87171"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "rgba(248,113,113,0.6)"; }}>
                  Skip / Don't Know
                </button>
                <button
                  onClick={() => handleSendAnswer(userInput)}
                  disabled={!userInput.trim()}
                  style={{ background: userInput.trim() ? "linear-gradient(135deg, #38bdf8, #6366f1)" : "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, color: userInput.trim() ? "#fff" : "#2e4060", padding: "7px 22px", fontWeight: 700, fontSize: "0.85rem", fontFamily: "'Sora', sans-serif", cursor: userInput.trim() ? "pointer" : "not-allowed", transition: "all 0.2s", boxShadow: userInput.trim() ? "0 3px 14px rgba(56,189,248,0.3)" : "none" }}>
                  Send →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── RESULTS PHASE ──────────────────────────────────────────────────────────
  if (phase === "results" && result) {
    const gradeColor = result.score >= 75 ? "#4ade80" : result.score >= 50 ? "#facc15" : "#f87171";

    return (
      <div style={BASE_STYLES.page}>
        <style>{GLOBAL_CSS}</style>

        {/* Nav */}
        <div style={{ width: "100%", maxWidth: 760, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "1.5rem" }}>
          <div style={BASE_STYLES.navBrand}>
            <div style={BASE_STYLES.navDot}>🎯</div>
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 700 }}>Interview Complete</div>
              <div style={{ fontSize: "0.72rem", color: "#4b6280", marginTop: 1 }}>{resumeFile?.name}</div>
            </div>
          </div>
          <button onClick={handleReset} style={{ background: "linear-gradient(135deg, #38bdf8, #6366f1)", border: "none", borderRadius: 10, cursor: "pointer", color: "#fff", padding: "8px 18px", fontSize: "0.82rem", fontWeight: 700, fontFamily: "'Sora', sans-serif", boxShadow: "0 4px 16px rgba(56,189,248,0.25)" }}>
            🔄 Practice Again
          </button>
        </div>

        <div style={{ width: "100%", maxWidth: 760, paddingBottom: "3rem", animation: "fadeUp 0.5s ease" }}>

          {/* Score Card */}
          <div style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(99,102,241,0.06))", border: "1px solid rgba(56,189,248,0.18)", borderRadius: 20, padding: "2rem", display: "flex", alignItems: "center", gap: "2rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <ScoreRing score={result.score} />
              <div style={{ fontSize: "0.72rem", color: "#4b6280", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Score</div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.6rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 700, color: gradeColor, fontFamily: "'JetBrains Mono', monospace", textShadow: `0 0 20px ${gradeColor}55` }}>{result.grade}</span>
                <span style={{ background: `${gradeColor}18`, border: `1px solid ${gradeColor}33`, color: gradeColor, padding: "3px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600 }}>{result.performance}</span>
              </div>
              <p style={{ color: "#8faac0", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "0.8rem" }}>{result.summary}</p>
              {result.skippedQuestions > 0 && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, padding: "4px 12px", fontSize: "0.78rem", color: "#f87171" }}>
                  ⚠ {result.skippedQuestions} question{result.skippedQuestions !== 1 ? "s" : ""} skipped
                </div>
              )}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.14)", borderRadius: 16, padding: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
                <span>✅</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.08em" }}>Strengths</span>
              </div>
              {result.strengths?.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: "0.6rem", fontSize: "0.84rem", color: "#8faac0", lineHeight: 1.6 }}>
                  <span style={{ color: "#4ade80", flexShrink: 0, marginTop: 1 }}>›</span> {s}
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.14)", borderRadius: 16, padding: "1.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
                <span>⚠️</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.08em" }}>Areas to Improve</span>
              </div>
              {result.weaknesses?.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: "0.6rem", fontSize: "0.84rem", color: "#8faac0", lineHeight: 1.6 }}>
                  <span style={{ color: "#f87171", flexShrink: 0, marginTop: 1 }}>›</span> {w}
                </div>
              ))}
            </div>
          </div>

          {/* Tips to Get Hired */}
          <div style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 16, padding: "1.4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.2rem" }}>
              <span style={{ fontSize: "1.1rem" }}>💡</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Tips to Get Hired</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {result.tipsToGetHired?.map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "0.9rem 1rem" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "#818cf8", fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#c8d8ec", marginBottom: "0.25rem" }}>{tip.tip}</div>
                    <div style={{ fontSize: "0.82rem", color: "#6b8aad", lineHeight: 1.6 }}>{tip.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return null;
};

export default InterviewAgent;