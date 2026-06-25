import { useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import {
  Bot,
  User,
  Sparkles,
  Briefcase,
  MessageCircle,
  Code,
  Brain,
  FolderGit2,
  Lightbulb,
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateQuestions = async (e) => {
  e.preventDefault();

  if (!formData.role.trim()) {
    setError("Role is required");
    return;
  }

  if (!formData.difficulty) {
    setError("Please select difficulty level");
    return;
  }

  if (!formData.interviewType) {
    setError("Please select interview type");
    return;
  }

  if (!formData.jobDescription.trim()) {
    setError("Job description is required");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setInterviewData(null);
    setHasAsked(true);

    const res = await api.post("/interview/generate", formData);

    setInterviewData(res.data.interviewData);

    setFormData({
      role: "",
      company: "",
      difficulty: "",
      interviewType: "",
      jobDescription: "",
    });
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

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        

        <div className="flex-1 px-8 pt-10 pb-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                <Bot size={21} />
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm max-w-3xl">
                <h2 className="font-bold text-slate-900 mb-2">
                  Hi, I am your AI Interview Assistant.
                </h2>

                <p className="text-sm text-slate-600 leading-6">
                  Enter the role and job description below. I will generate
                  HR questions, technical questions, DSA questions, project
                  questions, and answer hints to help you prepare.
                </p>
              </div>
            </div>

            {hasAsked && (
              <div className="flex gap-4 justify-end">
                <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm max-w-3xl">
                  <p className="text-sm font-semibold mb-2">
                    Generate interview preparation questions
                  </p>

                  <div className="text-sm text-slate-300 space-y-1">
                    <p>
                      <span className="font-semibold text-white">
                        Role:
                      </span>{" "}
                      Submitted
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
                      Preparing interview questions...
                    </span>
                  </div>
                </div>
              </div>
            )}

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

            {interviewData && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                  <Bot size={21} />
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm w-full">
                  <div className="bg-slate-900 text-white rounded-3xl p-6 mb-6">
                    <p className="text-sm text-slate-300">
                      Interview Prep Overview
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                      Your Personalized Interview Plan
                    </h2>

                    <p className="text-slate-300 mt-4 leading-6">
                      {interviewData.overview}
                    </p>
                  </div>

                  <div className="space-y-5">
                    {interviewData.hrQuestions?.length > 0 && (
  <QuestionSection
    icon={<MessageCircle size={20} />}
    title="HR Questions"
    questions={interviewData.hrQuestions}
  />
)}

{interviewData.technicalQuestions?.length > 0 && (
  <QuestionSection
    icon={<Code size={20} />}
    title="Technical Questions"
    questions={interviewData.technicalQuestions}
  />
)}

{interviewData.dsaQuestions?.length > 0 && (
  <QuestionSection
    icon={<Brain size={20} />}
    title="DSA Questions"
    questions={interviewData.dsaQuestions}
  />
)}

{interviewData.projectQuestions?.length > 0 && (
  <QuestionSection
    icon={<FolderGit2 size={20} />}
    title="Project-Based Questions"
    questions={interviewData.projectQuestions}
  />
)}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb size={20} className="text-blue-700" />
                        <h3 className="font-bold text-blue-900">
                          Final Tips
                        </h3>
                      </div>

                      <ul className="space-y-2">
                        {interviewData.finalTips?.map((tip, index) => (
                          <li
                            key={index}
                            className="text-sm text-blue-800 leading-6"
                          >
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-100 px-8 pb-5">
  <form onSubmit={generateQuestions} className="max-w-5xl mx-auto">
    <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
      <div className="grid md:grid-cols-4 gap-3 mb-3">
        <input
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
        />

        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company optional"
          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
        />

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm text-slate-700"
        >
          <option value="" disabled>
            Difficulty
          </option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          name="interviewType"
          value={formData.interviewType}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm text-slate-700"
        >
          <option value="" disabled>
            Interview type
          </option>
          <option value="Mixed">Mixed</option>
          <option value="HR">HR</option>
          <option value="Technical">Technical</option>
          <option value="DSA">DSA</option>
          <option value="Project Based">Project Based</option>
        </select>
      </div>

      <div className="flex items-end gap-3">
        <textarea
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          rows="2"
          placeholder="Paste job description here..."
          className="flex-1 min-h-[48px] max-h-[90px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm text-slate-800 placeholder:text-slate-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="h-[48px] flex items-center justify-center gap-2 px-5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60 transition whitespace-nowrap"
        >
          <Sparkles size={17} />
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  </form>
</div>
      </main>
    </div>
  );
}

function QuestionSection({ icon, title, questions }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
          {icon}
        </div>

        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>

      <div className="space-y-4">
        {questions.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-2xl p-4"
          >
            <p className="font-semibold text-slate-900 text-sm">
              Q{index + 1}. {item.question}
            </p>

            {item.approach && (
              <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                  Approach
                </p>
                <p className="text-sm text-slate-700 leading-6">
                  {item.approach}
                </p>
              </div>
            )}

            {item.sampleAnswer && (
              <div className="mt-3 bg-blue-50 rounded-xl p-3 border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase mb-1">
                  Sample Answer
                </p>
                <p className="text-sm text-blue-800 leading-6">
                  {item.sampleAnswer}
                </p>
              </div>
            )}

            {item.keyPoints && item.keyPoints.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                  Key Points
                </p>

                <ul className="space-y-1">
                  {item.keyPoints.map((point, i) => (
                    <li
                      key={i}
                      className="text-sm text-slate-600 leading-6"
                    >
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InterviewAssistant;