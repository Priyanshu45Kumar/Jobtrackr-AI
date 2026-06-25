import { useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import {
  Bot,
  User,
  Paperclip,
  Sparkles,
  X,
  FileText,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Tag,
} from "lucide-react";

function ResumeAnalyzer() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);

  const fileInputRef = useRef(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resume) return setError("Please upload your resume PDF");
    if (!jobDescription.trim()) return setError("Please paste the job description");

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);
      setHasAsked(true);

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const res = await api.post("/resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAnalysis(res.data.analysis);
      setResume(null);
      setJobDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Resume analysis failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const removeResume = () => {
    setResume(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { text: "text-emerald-400", label: "Excellent", ring: "bg-emerald-500" };
    if (score >= 60) return { text: "text-amber-400", label: "Good", ring: "bg-amber-500" };
    return { text: "text-red-400", label: "Needs Work", ring: "bg-red-500" };
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">Resume Analyzer</p>
            <p className="text-[11px] text-white/40">AI-powered ATS scoring and feedback</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-white/50">Ready</span>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-5">

            {/* Bot intro */}
            <div className="flex gap-3">
              <BotAvatar />
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-xl">
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  Hi, I'm your AI Resume Analyzer.
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Upload your resume PDF and paste the job description below. I'll analyze your resume and give you an ATS score, missing skills, strong points, recommended keywords, and improvement tips.
                </p>
              </div>
            </div>

            {/* User message */}
            {hasAsked && (
              <div className="flex gap-3 justify-end">
                <div className="bg-slate-900 text-white rounded-2xl rounded-tr-sm p-4 shadow-sm max-w-sm">
                  <p className="text-xs font-medium text-white/50 mb-2">Your request</p>
                  <p className="text-sm text-white/90">Analyze my resume for this job</p>
                  <div className="flex gap-2 mt-2.5 flex-wrap">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 flex items-center gap-1">
                      <FileText size={10} /> PDF uploaded
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                      JD submitted
                    </span>
                  </div>
                </div>
                <UserAvatar />
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex gap-3">
                <BotAvatar />
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-xs text-slate-400 ml-1">Analyzing your resume…</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">!</div>
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl rounded-tl-sm p-4 text-sm max-w-md">
                  {error}
                </div>
              </div>
            )}

            {/* Analysis result */}
            {analysis && (
              <div className="flex gap-3">
                <BotAvatar />
                <div className="flex-1 min-w-0 space-y-4">

                  {/* ATS Score card */}
                  <div className="bg-slate-900 text-white rounded-2xl rounded-tl-sm p-5">
                    <p className="text-[11px] text-white/40 uppercase tracking-wider mb-3">ATS Score</p>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <svg viewBox="0 0 64 64" className="w-20 h-20 -rotate-90">
                          <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                          <circle
                            cx="32" cy="32" r="26"
                            fill="none"
                            stroke={analysis.atsScore >= 80 ? "#34d399" : analysis.atsScore >= 60 ? "#fbbf24" : "#f87171"}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={`${(analysis.atsScore / 100) * 163} 163`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center rotate-90">
                          <span className={`text-xl font-bold ${getScoreColor(analysis.atsScore).text}`}>
                            {analysis.atsScore}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-lg font-semibold ${getScoreColor(analysis.atsScore).text}`}>
                            {getScoreColor(analysis.atsScore).label}
                          </span>
                          <span className="text-white/30 text-sm">/ 100</span>
                        </div>
                        <p className="text-sm text-white/55 leading-relaxed max-w-sm">
                          {analysis.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Results grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <ResultList
                      title="Strong points"
                      items={analysis.strongPoints}
                      icon={<CheckCircle size={14} />}
                      color="emerald"
                    />
                    <ResultList
                      title="Missing skills"
                      items={analysis.missingSkills}
                      icon={<AlertCircle size={14} />}
                      color="red"
                    />
                    <ResultList
                      title="Improvements"
                      items={analysis.improvements}
                      icon={<Lightbulb size={14} />}
                      color="amber"
                    />
                    <ResultList
                      title="Recommended keywords"
                      items={analysis.recommendedKeywords}
                      icon={<Tag size={14} />}
                      color="blue"
                      pills
                    />
                  </div>

                  {/* Final advice */}
                  {analysis.finalAdvice && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-indigo-500" />
                        <p className="text-sm font-semibold text-indigo-800">Final advice</p>
                      </div>
                      <p className="text-sm text-indigo-700 leading-relaxed">{analysis.finalAdvice}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 bg-slate-50 border-t border-slate-200 px-6 py-4">
          <form onSubmit={handleAnalyze} className="max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                placeholder="Paste the job description here…"
                className="w-full bg-transparent resize-none focus:outline-none text-sm text-slate-700 placeholder:text-slate-400 px-1 mb-2"
              />

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium cursor-pointer hover:bg-slate-200 transition-colors">
                    <Paperclip size={13} />
                    Upload PDF
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setResume(e.target.files[0])}
                      className="hidden"
                    />
                  </label>

                  {resume && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-xs max-w-[200px]">
                      <FileText size={12} className="flex-shrink-0" />
                      <span className="truncate">{resume.name}</span>
                      <button
                        type="button"
                        onClick={removeResume}
                        className="flex-shrink-0 hover:text-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60 transition-colors"
                >
                  <Sparkles size={14} />
                  {loading ? "Analyzing…" : "Analyze"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

/* ── Avatars ── */

function BotAvatar() {
  return (
    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center flex-shrink-0 self-start mt-0.5">
      <Bot size={15} />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 self-start mt-0.5">
      <User size={15} />
    </div>
  );
}

/* ── Result list ── */

function ResultList({ title, items, icon, color, pills = false }) {
  const colorMap = {
    emerald: { header: "bg-emerald-50 border-emerald-200", icon: "text-emerald-600", title: "text-emerald-800", pill: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
    red:     { header: "bg-red-50 border-red-200",         icon: "text-red-500",     title: "text-red-800",     pill: "bg-red-50 text-red-600 border-red-200",         dot: "bg-red-400"     },
    amber:   { header: "bg-amber-50 border-amber-200",     icon: "text-amber-600",   title: "text-amber-800",   pill: "bg-amber-50 text-amber-700 border-amber-200",   dot: "bg-amber-400"   },
    blue:    { header: "bg-blue-50 border-blue-200",       icon: "text-blue-600",    title: "text-blue-800",    pill: "bg-blue-50 text-blue-700 border-blue-200",      dot: "bg-blue-400"    },
  };

  const c = colorMap[color];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className={`flex items-center gap-2 px-4 py-3 border-b ${c.header}`}>
        <span className={c.icon}>{icon}</span>
        <p className={`text-xs font-semibold ${c.title}`}>{title}</p>
        {items?.length > 0 && (
          <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.pill}`}>
            {items.length}
          </span>
        )}
      </div>

      <div className="p-4">
        {items?.length > 0 ? (
          pills ? (
            <div className="flex flex-wrap gap-1.5">
              {items.map((item, i) => (
                <span key={i} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${c.pill}`}>
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot} flex-shrink-0 mt-1.5`} />
                  {item}
                </li>
              ))}
            </ul>
          )
        ) : (
          <p className="text-xs text-slate-400">No data available</p>
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzer;