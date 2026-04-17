import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, UploadCloud, AlertCircle, Sparkles, Target, TrendingUp, Award, CheckCircle, XCircle } from "lucide-react";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/ai/analyze-resume`;

/* ─── Circular Score Ring ─────────────────────────────────────────────────── */
const ScoreRing = ({ score }) => {
  const radius = 60;
  const circ = 2 * Math.PI * radius;
  const progress = (score / 100) * circ;

  const scoreInfo = score >= 75
    ? { color: "#10b981", label: "Excellent", bg: "from-emerald-50 to-green-50" }
    : score >= 50
      ? { color: "#f59e0b", label: "Good", bg: "from-amber-50 to-yellow-50" }
      : { color: "#ef4444", label: "Needs Work", bg: "from-red-50 to-rose-50" };

  return (
    <div className={`relative w-48 h-48 rounded-full bg-gradient-to-br ${scoreInfo.bg} p-4`}>
      <svg width="180" height="180" className="transform -rotate-90">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={scoreInfo.color} />
            <stop offset="100%" stopColor={`${scoreInfo.color}aa`} />
          </linearGradient>
        </defs>
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          strokeDasharray={`${progress} ${circ}`}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-5xl font-black"
          style={{ color: scoreInfo.color, lineHeight: 1 }}
        >
          {score}
        </span>
        <span className="text-xs font-semibold tracking-wider uppercase text-gray-500 mt-1">
          ATS Score
        </span>
      </div>
    </div>
  );
};

/* ─── Tag Chip ────────────────────────────────────────────────────────────── */
const Chip = ({ label, color }) => {
  const colorMap = {
    "#10b981": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "#f59e0b": "bg-amber-50 text-amber-700 border-amber-200",
    "#ef4444": "bg-red-50 text-red-700 border-red-200",
  };
  const className = colorMap[color] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
};

/* ─── Section Card ────────────────────────────────────────────────────────── */
const Card = ({ children, className = "", highlight = false }) => (
  <div
    className={`
      rounded-2xl border p-6 transition-all duration-300
      ${highlight
        ? "border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-white shadow-lg shadow-indigo-100/50"
        : "border-gray-200 bg-white hover:shadow-md hover:border-gray-300"
      }
      ${className}
    `}
  >
    {children}
  </div>
);

const SectionTitle = ({ children, icon: Icon }) => (
  <div className="flex items-center gap-2.5 mb-5">
    {Icon && <Icon className="w-4 h-4 text-indigo-600" />}
    <p className="text-xs font-bold tracking-[0.25em] uppercase text-gray-500">
      {children}
    </p>
  </div>
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
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 flex flex-col items-center justify-center gap-4
          ${dragging
            ? "border-indigo-500 bg-indigo-50 scale-[1.01]"
            : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30"
          }
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
            <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-indigo-600 font-semibold text-sm">Extracting from PDF...</p>
          </div>
        ) : (
          <>
            <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
              ${dragging ? "bg-indigo-500 shadow-lg shadow-indigo-500/30" : "bg-indigo-100"}
            `}>
              <UploadCloud className={`w-8 h-8 ${dragging ? "text-white" : "text-indigo-500"}`} />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-gray-800 font-semibold text-lg">
                Drop your resume here
              </p>
              <p className="text-gray-500 text-sm">
                <span className="text-indigo-600 font-medium">.pdf</span> or{" "}
                <span className="text-indigo-600 font-medium">.txt</span> · or click to browse
              </p>
            </div>
          </>
        )}
      </div>

      {fileError && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
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
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("strengths");

  const loadingSteps = [
    { text: "📄 Parsing your resume...", icon: "📄" },
    { text: "🔍 Analyzing content...", icon: "🔍" },
    { text: "🧠 Generating insights...", icon: "🧠" },
  ];

  const analyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 3500);

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
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const reset = () => { setAnalysis(null); setResumeText(""); setError(null); };

  const scoreLabel = analysis
    ? analysis.score >= 75 ? { text: "Excellent", color: "#10b981" }
      : analysis.score >= 50 ? { text: "Good", color: "#f59e0b" }
      : { text: "Needs Improvement", color: "#ef4444" }
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 pb-24">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          {/* Back Link */}
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 bg-indigo-100 border border-indigo-200">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-700">
              AI-Powered Analysis
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
            Get Your Resume
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ATS Scored Instantly
            </span>
          </h1>
          <p className="text-gray-600 text-base max-w-lg mx-auto leading-relaxed">
            Upload or paste your resume and receive an <span className="text-indigo-600 font-semibold">ATS compatibility score</span> with actionable improvement tips.
          </p>
        </div>

        {!analysis && !loading ? (
          /* ── INPUT PANEL ── */
          <div className="flex flex-col gap-6">
            <UploadZone onText={setResumeText} dragging={dragging} setDragging={setDragging} />

            {/* Divider */}
            <div className="flex items-center gap-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />
              <span className="text-xs font-bold tracking-widest text-gray-400">OR PASTE TEXT</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
            </div>

            {/* Textarea */}
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content here..."
              rows={10}
              className={`
                w-full rounded-2xl p-5 text-sm leading-relaxed resize-y
                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                bg-white border border-gray-300
                text-gray-800 placeholder-gray-400
                hover:border-gray-400 focus:border-indigo-500
              `}
            />

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={analyze}
              disabled={loading || !resumeText.trim()}
              className={`
                w-full py-4 rounded-2xl font-bold text-base tracking-wide
                flex items-center justify-center gap-3 transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                ${loading
                  ? "bg-gray-200 text-gray-500"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                  Analyzing your resume...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze My Resume
                </>
              )}
            </button>
          </div>
        ) : loading ? (
          /* ── ANIMATED LOADING STATE ── */
          <div className="flex flex-col items-center justify-center py-20 gap-8">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-3 text-xl font-bold text-gray-800 transition-all duration-500">
                <span>{loadingSteps[loadingStep].icon}</span>
                <span>{loadingSteps[loadingStep].text}</span>
              </div>
              <p className="text-gray-400 text-sm font-medium">Our AI is carefully reviewing your profile...</p>
            </div>
            <div className="flex gap-2">
              {loadingSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-8 rounded-full transition-all duration-500 ${i <= loadingStep ? 'bg-indigo-600 w-12' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* ── RESULTS PANEL ── */
          <div className="flex flex-col gap-6">

            {/* Score + Summary Card */}
            <Card highlight className="flex flex-col sm:flex-row items-center gap-8">
              <ScoreRing score={analysis.score} />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Resume Score
                  </h2>
                  {scoreLabel && <Chip label={scoreLabel.text} color={scoreLabel.color} />}
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {analysis.summary}
                </p>
              </div>
            </Card>

            {/* Detailed Insights Card */}
            <Card>
              <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                {["strengths", "weaknesses", "pro_tips"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`
                      flex-1 px-4 py-2.5 rounded-lg text-sm font-bold capitalize transition-all duration-300
                      ${tab === t
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                      }
                    `}
                  >
                    {t === "strengths" ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Strengths
                      </span>
                    ) : t === "weaknesses" ? (
                      <span className="flex items-center justify-center gap-2">
                        <Target className="w-4 h-4" /> Weaknesses
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" /> Pro Tips
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <ul className="flex flex-col gap-3">
                {(tab === "strengths" ? (analysis.strengths || []) : tab === "weaknesses" ? (analysis.weaknesses || []) : (analysis.pro_tips || [])).map((item, i) => (
                  <li key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div
                      className={`
                        w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                        text-xs font-bold border
                        ${tab === "strengths"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : tab === "weaknesses"
                          ? "bg-red-50 text-red-600 border-red-200"
                          : "bg-blue-50 text-blue-600 border-blue-200"
                        }
                      `}
                    >
                      {tab === "strengths" ? "✓" : tab === "weaknesses" ? "!" : "💡"}
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Analyze Again Button */}
            <button
              onClick={reset}
              className={`
                w-full py-4 rounded-2xl font-bold text-base
                border-2 transition-all duration-300
                border-gray-300 text-gray-600
                hover:border-indigo-500 hover:text-indigo-600
                bg-white hover:bg-indigo-50
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
