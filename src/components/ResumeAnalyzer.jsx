import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft, UploadCloud, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/ai/analyze-resume`;

/* ─── Circular Score Ring ─────────────────────────────────────────────────── */
const ScoreRing = ({ score, isDark }) => {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const progress = (score / 100) * circ;
  const color = score >= 75 ? "#4ade80" : score >= 50 ? "#facc15" : "#f87171";

  return (
    <div className="relative w-36 h-36">
      <svg width="140" height="140" className="transform -rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke={"#e2e8f0"} strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${progress} ${circ}`}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold" style={{ color, lineHeight: 1 }}>
          {score}
        </span>
        <span className={`text-xs tracking-widest uppercase mt-1 `}>
          Score
        </span>
      </div>
    </div>
  );
};

/* ─── Tag Chip ────────────────────────────────────────────────────────────── */
const Chip = ({ label, color }) => (
  <span
    className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide border"
    style={{
      backgroundColor: color + "22",
      color,
      borderColor: color + "44",
    }}
  >
    {label}
  </span>
);

/* ─── Section Card ────────────────────────────────────────────────────────── */
const Card = ({ children, className = "", isDark = true }) => (
  <div
    className={`rounded-2xl border p-5 ${className} ${
      "border-slate-200 bg-white"
    }`}
  >
    {children}
  </div>
);

const SectionTitle = ({ children, isDark = true }) => (
  <p className={`text-xs font-bold tracking-[0.2em] uppercase mb-4 `}>
    {children}
  </p>
);

/* ─── Upload Zone ─────────────────────────────────────────────────────────── */
const UploadZone = ({ onText, dragging, setDragging }) => {
  const fileRef = useRef();
  const [fileError, setFileError] = useState(null);
  const [extracting, setExtracting] = useState(false);

  useEffect(() => {
    if (window.pdfjsLib) return;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    };
    document.head.appendChild(script);
  }, []);

  const extractPdfText = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          const pdf = await window.pdfjsLib.getDocument(typedArray).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item) => item.str).join(" ");
            fullText += pageText + "\n";
          }
          resolve(fullText.trim());
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFile = async (file) => {
    if (!file) return;
    setFileError(null);

    const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const isTxt = file.type === "text/plain" || file.name.endsWith(".txt");

    if (!isPDF && !isTxt) {
      setFileError("Only .pdf or .txt files are supported.");
      return;
    }

    if (isTxt) {
      const reader = new FileReader();
      reader.onload = (e) => onText(e.target.result);
      reader.readAsText(file);
      return;
    }

    if (!window.pdfjsLib) {
      setFileError("PDF reader is still loading. Please try again in a moment.");
      return;
    }

    setExtracting(true);
    try {
      const text = await extractPdfText(file);
      if (!text || text.length < 50) {
        setFileError("Could not extract text from this PDF. Try a text-based PDF or paste manually.");
        return;
      }
      onText(text);
    } catch {
      setFileError("Failed to read PDF. Please paste your resume text manually.");
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div>
      <div
        onClick={() => fileRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-200 flex flex-col items-center justify-center gap-4
          ${dragging ? "border-indigo-400 bg-indigo-500/10" : "border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/30"}
        `}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {extracting ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-11 h-11 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-indigo-400 font-bold">Extracting text from PDF…</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
              <UploadCloud className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <p className="text-gray-200 font-bold text-lg mb-1">
                Drop your resume here
              </p>
              <p className="text-gray-500 text-sm">
                .pdf and .txt supported · or click to browse
              </p>
            </div>
          </>
        )}
      </div>

      {fileError && (
        <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {fileError}
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("strengths");

  const analyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Analysis failed");
      setAnalysis(data.analysis);
      setTab("strengths");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setAnalysis(null); setResumeText(""); setError(null); };

  const scoreLabel = analysis
    ? analysis.score >= 75 ? { text: "Strong", color: "#4ade80" }
      : analysis.score >= 50 ? { text: "Average", color: "#facc15" }
        : { text: "Needs Work", color: "#f87171" }
    : null;

  return (
    <div className={`min-h-screen  py-10 px-4 pb-20`}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          {/* Badge */}
          <div className={`inline-flex items-center gap-3 rounded-full px-4 py-2 mb-6 `}>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-400">
              ATS Resume Analyzer
            </span>
          </div>

          {/* Back Link */}
          <Link
            to="/app"
            className={`inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors `}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Title */}
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 `}>
            Get your resume
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"> scored instantly</span>
          </h1>
          <p className={`text-base max-w-md mx-auto `}>
            Paste or upload your resume and receive an ATS score with actionable improvement tips.
          </p>
        </div>

        {!analysis ? (
          /* ── INPUT PANEL ── */
          <div className="flex flex-col gap-4">
            <UploadZone onText={setResumeText} dragging={dragging} setDragging={setDragging} />

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className={`flex-1 h-px `} />
              <span className={`text-xs font-bold tracking-widest `}>OR PASTE TEXT</span>
              <div className={`flex-1 h-px `} />
            </div>

            {/* Textarea */}
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content here…"
              rows={8}
              className={`
                w-full rounded-xl p-4 text-sm leading-relaxed resize-y
                transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                ${"bg-white border border-slate-300 text-slate-700 placeholder-slate-400"
                }
              `}
            />

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={analyze}
              disabled={loading || !resumeText.trim()}
              className={`
                w-full py-4 rounded-xl font-bold text-base tracking-wide
                flex items-center justify-center gap-3 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${loading
                  ? "bg-slate-700 text-slate-400"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-500/30 border-t-white rounded-full animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze My Resume
                </>
              )}
            </button>
          </div>

        ) : (
          /* ── RESULTS PANEL ── */
          <div className="flex flex-col gap-5">

            {/* Score + Summary Card */}
            <Card className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreRing score={analysis.score} />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                  <h2 className={`text-2xl font-bold `}>
                    Your Resume Score
                  </h2>
                  {scoreLabel && <Chip label={scoreLabel.text} color={scoreLabel.color} />}
                </div>
                <p className={`text-sm leading-relaxed `}>
                  {analysis.summary}
                </p>
              </div>
            </Card>

            {/* Strengths / Weaknesses Card */}
            <Card>
              {/* Tab Buttons */}
              <div className="flex gap-2 mb-6">
                {["strengths", "weaknesses"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200
                      ${tab === t
                        ? "bg-indigo-600 text-white"
                        : ``
                      }
                    `}
                  >
                    {t === "strengths" ? "✓ Strengths" : "⚠ Weaknesses"}
                  </button>
                ))}
              </div>

              {/* List */}
              <ul className="flex flex-col gap-3">
                {(tab === "strengths" ? analysis.strengths : analysis.weaknesses).map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                      style={{
                        backgroundColor: tab === "strengths" ? "#4ade8022" : "#f8717122",
                        color: tab === "strengths" ? "#4ade80" : "#f87171",
                        border: `1px solid ${tab === "strengths" ? "#4ade8044" : "#f8717144"}`,
                      }}
                    >
                      {tab === "strengths" ? "✓" : "!"}
                    </div>
                    <span className={`text-sm leading-relaxed `}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Improvement Roadmap Card */}
            <Card>
              <SectionTitle>Improvement Roadmap</SectionTitle>
              <div className="flex flex-col">
                {analysis.improvement_steps.map((step, i) => (
                  <div key={i} className={`flex gap-4 py-4 ${i !== analysis.improvement_steps.length - 1 ? `border-b ` : ""}`}>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <p className={`font-bold text-sm mb-1 `}>
                        {step.section}
                      </p>
                      <p className={`text-sm leading-relaxed `}>
                        {step.advice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Analyze Again Button */}
            <button
              onClick={reset}
              className={`
                w-full py-4 rounded-xl font-bold text-base
                border transition-all duration-200
                ${"border-slate-300 text-slate-500 hover:border-indigo-500 hover:text-indigo-600 bg-white"
                }
              `}
            >
              ← Analyze Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}




