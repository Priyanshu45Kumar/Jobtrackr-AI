import { useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import {
  Bot,
  User,
  Sparkles,
  MessageCircle,
  Code,
  Brain,
  FolderGit2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function InterviewAssistant() {
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    difficulty: "",
    interviewType: "",
    jobDescription: "",
  });

  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasAsked, setHasAsked] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateQuestions = async (e) => {
    e.preventDefault();

    if (!formData.role.trim()) return setError("Role is required");
    if (!formData.difficulty) return setError("Please select difficulty level");
    if (!formData.interviewType) return setError("Please select interview type");
    if (!formData.jobDescription.trim()) return setError("Job description is required");

    try {
      setLoading(true);
      setError("");
      setInterviewData(null);
      setHasAsked(true);

      const res = await api.post("/interview/generate", formData);
      setInterviewData(res.data.interviewData);

      setFormData({ role: "", company: "", difficulty: "", interviewType: "", jobDescription: "" });
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Interview question generation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const difficulties = ["Easy", "Medium", "Hard"];
  const interviewTypes = ["Mixed", "HR", "Technical", "DSA", "Project Based"];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">Interview Assistant</p>
            <p className="text-[11px] text-white/40">AI-powered interview preparation</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-white/50">Ready</span>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <div className="max-w-4xl mx-auto space-y-5">

            {/* Bot intro */}
            <div className="flex gap-3">
              <BotAvatar />
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-xl">
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  Hi, I'm your AI Interview Assistant.
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Fill in the role and job description below. I'll generate HR, technical, DSA, and project questions — with answer hints to help you prepare.
                </p>
              </div>
            </div>

            {/* User message */}
            {hasAsked && (
              <div className="flex gap-3 justify-end">
                <div className="bg-slate-900 text-white rounded-2xl rounded-tr-sm p-4 shadow-sm max-w-sm">
                  <p className="text-xs font-medium text-white/50 mb-2">Your request</p>
                  <p className="text-sm text-white/90">Generate interview prep questions</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {formData.difficulty === "" && interviewData && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">Submitted</span>
                    )}
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
                    <span className="text-xs text-slate-400 ml-1">Preparing your interview questions…</span>
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

            {/* Results */}
            {interviewData && (
              <div className="flex gap-3">
                <BotAvatar />
                <div className="flex-1 min-w-0 space-y-4">

                  {/* Overview card */}
                  <div className="bg-slate-900 text-white rounded-2xl rounded-tl-sm p-5">
                    <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Interview prep overview</p>
                    <p className="text-base font-semibold text-white mb-3">Your personalized interview plan</p>
                    <p className="text-sm text-white/60 leading-relaxed">{interviewData.overview}</p>
                  </div>

                  {/* Question sections */}
                  {interviewData.hrQuestions?.length > 0 && (
                    <QuestionSection icon={<MessageCircle size={15} />} title="HR questions" questions={interviewData.hrQuestions} color="blue" />
                  )}
                  {interviewData.technicalQuestions?.length > 0 && (
                    <QuestionSection icon={<Code size={15} />} title="Technical questions" questions={interviewData.technicalQuestions} color="violet" />
                  )}
                  {interviewData.dsaQuestions?.length > 0 && (
                    <QuestionSection icon={<Brain size={15} />} title="DSA questions" questions={interviewData.dsaQuestions} color="amber" />
                  )}
                  {interviewData.projectQuestions?.length > 0 && (
                    <QuestionSection icon={<FolderGit2 size={15} />} title="Project-based questions" questions={interviewData.projectQuestions} color="emerald" />
                  )}

                  {/* Final tips */}
                  {interviewData.finalTips?.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb size={15} className="text-amber-600" />
                        <p className="text-sm font-semibold text-amber-800">Final tips</p>
                      </div>
                      <ul className="space-y-2">
                        {interviewData.finalTips.map((tip, i) => (
                          <li key={i} className="flex gap-2 text-sm text-amber-700 leading-relaxed">
                            <span className="text-amber-400 flex-shrink-0">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 bg-slate-50 border-t border-slate-200 px-6 py-4">
          <form onSubmit={generateQuestions} className="max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">

              {/* Top row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                <input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Role *"
                  className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company (optional)"
                  className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />

                {/* Difficulty toggle */}
                <div className="flex gap-1">
                  {difficulties.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFormData({ ...formData, difficulty: d })}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${
                        formData.difficulty === d
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <select
                  name="interviewType"
                  value={formData.interviewType}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option value="" disabled>Interview type</option>
                  {interviewTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Bottom row */}
              <div className="flex gap-2">
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Paste the job description here…"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300 min-h-[44px] max-h-[80px]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60 transition-colors whitespace-nowrap self-end"
                >
                  <Sparkles size={14} />
                  {loading ? "Generating…" : "Generate"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

/* ── Avatar components ── */

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

/* ── Question section with collapse ── */

function QuestionSection({ icon, title, questions, color }) {
  const [collapsed, setCollapsed] = useState(false);

  const colorMap = {
    blue:    { header: "bg-blue-50 border-blue-200",    icon: "bg-blue-100 text-blue-600",    title: "text-blue-800"  },
    violet:  { header: "bg-violet-50 border-violet-200",icon: "bg-violet-100 text-violet-600",title: "text-violet-800"},
    amber:   { header: "bg-amber-50 border-amber-200",  icon: "bg-amber-100 text-amber-600",  title: "text-amber-800" },
    emerald: { header: "bg-emerald-50 border-emerald-200",icon:"bg-emerald-100 text-emerald-600",title:"text-emerald-800"},
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* Section header */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className={`w-full flex items-center justify-between px-4 py-3 border-b ${c.header} transition-colors`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.icon}`}>
            {icon}
          </div>
          <span className={`text-sm font-semibold ${c.title}`}>{title}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${c.icon}`}>
            {questions.length}
          </span>
        </div>
        {collapsed
          ? <ChevronDown size={15} className="text-slate-400" />
          : <ChevronUp size={15} className="text-slate-400" />
        }
      </button>

      {/* Questions */}
      {!collapsed && (
        <div className="divide-y divide-slate-100">
          {questions.map((item, index) => (
            <div key={index} className="p-4">
              <p className="text-sm font-medium text-slate-800 mb-3">
                <span className="text-slate-400 mr-1.5">Q{index + 1}.</span>
                {item.question}
              </p>

              <div className="space-y-2">
                {item.approach && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Approach</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.approach}</p>
                  </div>
                )}

                {item.sampleAnswer && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 mb-1">Sample answer</p>
                    <p className="text-xs text-blue-700 leading-relaxed">{item.sampleAnswer}</p>
                  </div>
                )}

                {item.keyPoints?.length > 0 && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Key points</p>
                    <ul className="space-y-1">
                      {item.keyPoints.map((point, i) => (
                        <li key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
                          <span className="text-slate-300 flex-shrink-0">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InterviewAssistant;