import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import pdfToText from "react-pdftotext";
import api from "../config/api";
import {
  Target,
  UploadCloud,
  Mic,
  BarChart3,
  Zap,
  SkipForward,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  User,
  Bot
} from "lucide-react";

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
        const text = await pdfToText(file);
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
const ScoreRing = ({ score, isDark }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#4ade80" : score >= 50 ? "#facc15" : "#f87171";

  return (
    <div className="relative w-32 h-32">
      <svg width="130" height="130" className="transform -rotate-90">
        <circle
          cx="65" cy="65" r={radius}
          fill="none"
          stroke={"rgba(0,0,0,0.06)"}
          strokeWidth="10"
        />
        <circle
          cx="65" cy="65" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
const InterviewAgent = () => {
  const [phase, setPhase] = useState("upload");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState([]);
  const [questionContext, setQuestionContext] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [userInput, setUserInput] = useState("");
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
  const handleStartInterview = async () => {
    if (!resumeFile) return;
    setLoading(true);
    setError("");

    try {
      const text = await extractTextFromFile(resumeFile);

      if (!text || text.trim() === "") {
        setError("Could not extract text from this file. Please try a different file.");
        setLoading(false);
        return;
      }

      setResumeText(text);

      const res = await api.post("/api/ai/interview-prep", { resumeText: text });
      const { question, questionContext: ctx, questionNumber: qNum } = res.data;

      setQuestionContext(ctx);
      setQuestionNumber(qNum);
      setMessages([{ role: "assistant", content: question, context: ctx }]);
      setPhase("interviewing");

    } catch (err) {
      console.error("Full error:", err);
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

      const res = await api.post("/api/ai/interview-respond", {
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

  // ── UPLOAD PHASE ───────────────────────────────────────────────────────────
  if (phase === "upload") {
    return (
      <div className={`min-h-screen  `}>
        <div className="max-w-2xl mx-auto px-4">
          {/* Nav */}
          <div className={`flex items-center justify-between py-6 border-b `}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center `}>
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`font-bold `}>Interview Agent</div>
                <div className={`text-xs `}>AI-Powered Mock Interviewer</div>
              </div>
            </div>
            <Link
              to="/app"
              className={`flex items-center gap-2 text-sm font-medium transition-colors `}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>

          {/* Badge */}
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mt-6 mb-4 text-xs font-bold tracking-wider uppercase `}>
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            7 Questions · Scored
          </div>

          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 `}>
              Ace Your Next
              <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent"> Interview</span>
            </h1>
            <p className={`text-base max-w-md mx-auto `}>
              Upload your resume. Our AI reads it, runs a live personalized mock interview — then scores you and tells you exactly how to improve.
            </p>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 mb-5
              ${dragOver
                ? "border-sky-400 bg-sky-500/10"
                : resumeFile
                  ? "border-sky-400/50 bg-sky-500/5"
                  : "border-slate-300 hover:border-slate-400 bg-slate-100"
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={(e) => validateAndSetFile(e.target.files[0])}
            />

            {resumeFile ? (
              <>
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center `}>
                  <UploadCloud className="w-7 h-7 text-sky-400" />
                </div>
                <div className="text-sky-400 font-semibold mb-1">{resumeFile.name}</div>
                <div className={`text-sm `}>Click to replace</div>
              </>
            ) : (
              <>
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center `}>
                  <UploadCloud className={`w-7 h-7 `} />
                </div>
                <div className={`font-medium mb-1 `}>Drop your resume here</div>
                <div className={`text-sm `}>PDF or TXT · Click to browse</div>
              </>
            )}
          </div>

          {error && (
            <div className={`flex items-center gap-2 text-sm p-3 rounded-xl mb-5 `}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { icon: Mic, label: "Resume-tailored Q&A" },
              { icon: BarChart3, label: "Scored out of 100" },
              { icon: Lightbulb, label: "Hire tips" },
              { icon: Zap, label: "Skip any question" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm `}
              >
                <Icon className="w-4 h-4 text-sky-400" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleStartInterview}
            disabled={!resumeFile || loading}
            className={`
              w-full py-4 rounded-xl font-bold text-base tracking-wide mb-2
              flex items-center justify-center gap-3 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${resumeFile && !loading
                ? "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5"
                : "bg-slate-200 text-slate-400"
              }
            `}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-400/30 border-t-white rounded-full animate-spin" />
                Analyzing Resume...
              </>
            ) : resumeFile ? (
              <>
                <Sparkles className="w-5 h-5" />
                Start Interview →
              </>
            ) : (
              "Upload Resume to Begin"
            )}
          </button>
        </div>
      </div>
    );
  }

  // ── INTERVIEW PHASE ────────────────────────────────────────────────────────
  if (phase === "interviewing") {
    const progress = (questionNumber / TOTAL_QUESTIONS) * 100;

    return (
      <div className={`min-h-screen flex flex-col `}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b `}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center `}>
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className={`font-bold `}>Interview Agent</div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`text-sm `}>
              Question <span className="text-sky-400 font-bold">{questionNumber}</span>
              <span className={"text-slate-400"}> / {TOTAL_QUESTIONS}</span>
            </div>
            <button
              onClick={handleReset}
              className={`text-sm px-4 py-2 rounded-lg border transition-all `}
            >
              Quit
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`h-1 `}>
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-5">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                <div className={`flex items-start gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {msg.role === "assistant" ? (
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center flex-shrink-0 `}>
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 `}>
                      <User className="w-5 h-5 text-indigo-500" />
                    </div>
                  )}
                  <div className={`
                    px-5 py-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                    ${msg.role === "assistant"
                      ? "bg-sky-50 border border-sky-200 rounded-tl-2xl text-slate-700"
                      : "bg-indigo-100 border border-indigo-200 rounded-tr-2xl text-slate-800"
                    }
                  `}>
                    {msg.content}
                    {msg.role === "assistant" && msg.context && (
                      <div className={`mt-3 pt-3 border-t text-xs italic `}>
                        💬 {msg.context}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center flex-shrink-0 `}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className={`px-5 py-4 rounded-2xl rounded-tl-2xl flex items-center gap-2 `}>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>
        </div>

        {/* Input */}
        {!loading && (
          <div className={`px-6 pb-6 pt-4 border-t `}>
            <div className="max-w-3xl mx-auto">
              <div className={`rounded-2xl border p-4 `}>
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendAnswer(userInput); } }}
                  placeholder="Type your answer here... (Enter to send · Shift+Enter for new line)"
                  rows={3}
                  className={`w-full bg-transparent border-none resize-none text-sm leading-relaxed focus:ring-0 focus:outline-none `}
                />
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <button
                    onClick={handleSkip}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all `}
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip / Don't Know
                  </button>
                  <button
                    onClick={() => handleSendAnswer(userInput)}
                    disabled={!userInput.trim()}
                    className={`
                      flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all
                      ${userInput.trim()
                        ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
                        : "bg-slate-200 text-slate-400"
                      }
                    `}
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
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
    const gradeLabel = result.score >= 75 ? "Strong" : result.score >= 50 ? "Average" : "Needs Work";

    return (
      <div className={`min-h-screen `}>
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Nav */}
          <div className={`flex items-center justify-between py-6 `}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center `}>
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`font-bold `}>Interview Complete</div>
                <div className={`text-xs `}>{resumeFile?.name}</div>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Practice Again
            </button>
          </div>

          {/* Score Card */}
          <div className={`rounded-2xl border p-6 mt-6 `}>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center">
                <ScoreRing score={result.score} />
                <div className={`text-xs uppercase tracking-widest mt-2 `}>Score</div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                  <span className="text-3xl font-bold font-mono" style={{ color: gradeColor }}>{result.grade}</span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold border"
                    style={{ backgroundColor: `${gradeColor}15`, color: gradeColor, borderColor: `${gradeColor}30` }}
                  >
                    {result.performance}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed mb-3 `}>{result.summary}</p>
                {result.skippedQuestions > 0 && (
                  <span className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg `}>
                    <AlertCircle className="w-3 h-3" />
                    {result.skippedQuestions} question{result.skippedQuestions !== 1 ? "s" : ""} skipped
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {/* Strengths */}
            <div className={`rounded-2xl border p-5 `}>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Strengths</span>
              </div>
              <ul className="space-y-3">
                {result.strengths?.map((s, i) => (
                  <li key={i} className={`flex gap-2 text-sm `}>
                    <span className="text-emerald-400 flex-shrink-0 mt-1">›</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className={`rounded-2xl border p-5 `}>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">Areas to Improve</span>
              </div>
              <ul className="space-y-3">
                {result.weaknesses?.map((w, i) => (
                  <li key={i} className={`flex gap-2 text-sm `}>
                    <span className="text-red-400 flex-shrink-0 mt-1">›</span>
                    <span className="leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tips to Get Hired */}
          <div className={`rounded-2xl border p-5 mt-5 `}>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Tips to Get Hired</span>
            </div>
            <div className="space-y-3">
              {result.tipsToGetHired?.map((tip, i) => (
                <div
                  key={i}
                  className={`flex gap-4 p-4 rounded-xl `}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold `}>
                    {i + 1}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm mb-1 `}>{tip.tip}</div>
                    <div className={`text-sm leading-relaxed `}>{tip.detail}</div>
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




