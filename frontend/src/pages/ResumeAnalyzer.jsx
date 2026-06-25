import { useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import {
  FileText,
  Bot,
  User,
  Paperclip,
  Sparkles,
  X,
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

    if (!resume) {
      setError("Please upload your resume PDF");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste the job description");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);
      setHasAsked(true);

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const res = await api.post("/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAnalysis(res.data.analysis);
      setResume(null);
      setJobDescription("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        
        

        {/* Chat Area */}
        <div className="flex-1 px-8 pt-10 pb-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Intro Message */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                <Bot size={21} />
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm max-w-3xl">
                <h2 className="font-bold text-slate-900 mb-2">
                  Hi, I am your AI Resume Analyzer.
                </h2>

                <p className="text-sm text-slate-600 leading-6">
                  Upload your resume PDF and paste the job description below.
                  I will analyze your resume and provide an ATS score, missing
                  skills, strong points, recommended keywords, and improvement
                  suggestions.
                </p>
              </div>
            </div>

            {/* User Message */}
            {hasAsked && (
              <div className="flex gap-4 justify-end">
                <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm max-w-3xl">
                  <p className="text-sm font-semibold mb-2">
                    Analyze my resume for this job
                  </p>

                  <div className="text-sm text-slate-300 space-y-1">
                    <p>
                      <span className="font-semibold text-white">
                        Resume:
                      </span>{" "}
                      PDF uploaded
                    </p>

                    <p>
                      <span className="font-semibold text-white">
                        Job Description:
                      </span>{" "}
                      Submitted
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                  <User size={20} />
                </div>
              </div>
            )}

            {/* Loading Message */}
            {loading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                  <Bot size={21} />
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-150"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-300"></span>

                    <span className="text-sm ml-2">
                      Analyzing your resume...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  !
                </div>

                <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-5 shadow-sm max-w-3xl text-sm">
                  {error}
                </div>
              </div>
            )}

            {/* AI Analysis Result */}
            {analysis && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                  <Bot size={21} />
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm w-full">
                  <div className="bg-slate-900 text-white rounded-3xl p-6 mb-6">
                    <p className="text-sm text-slate-300">ATS Score</p>

                    <div className="flex items-end gap-3 mt-2">
                      <h3 className="text-5xl font-bold">
                        {analysis.atsScore}
                      </h3>

                      <span className="text-slate-300 mb-2">
                        /100
                      </span>
                    </div>

                    <p className="text-slate-300 mt-4 leading-6">
                      {analysis.summary}
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-5">
                    <ResultList
                      title="Strong Points"
                      items={analysis.strongPoints}
                    />

                    <ResultList
                      title="Missing Skills"
                      items={analysis.missingSkills}
                    />

                    <ResultList
                      title="Improvements"
                      items={analysis.improvements}
                    />

                    <ResultList
                      title="Recommended Keywords"
                      items={analysis.recommendedKeywords}
                    />
                  </div>

                  <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-5">
                    <h3 className="font-bold text-blue-900 mb-2">
                      Final Advice
                    </h3>

                    <p className="text-sm text-blue-800 leading-6">
                      {analysis.finalAdvice}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Input */}
        <div className="bg-slate-100 px-8 pb-8">
          <form onSubmit={handleAnalyze} className="max-w-5xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows="3"
                placeholder="Paste job description here..."
                className="w-full bg-transparent resize-none focus:outline-none text-sm text-slate-800 placeholder:text-slate-400"
              />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 text-sm font-semibold cursor-pointer hover:bg-slate-200 transition">
                    <Paperclip size={17} />
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
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm max-w-[260px]">
                      <span className="truncate">
                        {resume.name}
                      </span>

                      <button
                        type="button"
                        onClick={removeResume}
                        className="text-blue-700 hover:text-red-600"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60 transition"
                >
                  <Sparkles size={18} />
                  {loading ? "Analyzing..." : "Analyze"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function ResultList({ title, items }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
      <h3 className="font-bold text-slate-900 mb-3">
        {title}
      </h3>

      {items && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="text-sm text-slate-700 leading-6"
            >
              • {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">
          No data available
        </p>
      )}
    </div>
  );
}

export default ResumeAnalyzer;