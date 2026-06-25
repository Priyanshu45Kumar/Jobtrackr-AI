import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Copy, Mail, Sparkles, Check } from "lucide-react";
import api from "../api/axios";

function ColdEmail() {
  const initialFormData = {
    recruiterName: "",
    company: "",
    role: "",
    yourName: "",
    portfolio: "",
    reason: "",
    skills: "",
    experience: "",
    tone: "Professional",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateEmail = async () => {
    if (!formData.company || !formData.role || !formData.yourName) {
      alert("Please fill company, role, and your name");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/ai/cold-email", {
        recruiterName: formData.recruiterName,
        company: formData.company,
        role: formData.role,
        userName: formData.yourName,
        portfolio: formData.portfolio,
        reason: formData.reason,
        skills: formData.skills,
        experience: formData.experience,
        tone: formData.tone,
      });
      setEmail(res.data.email);
      setFormData(initialFormData);
    } catch (error) {
      alert(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "AI email generation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tones = ["Professional", "Friendly", "Confident", "Short and Direct"];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">

        {/* Hero */}
        <div className="bg-slate-900 rounded-2xl p-7 text-white mb-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-indigo-500/10 pointer-events-none" />
          <div className="absolute -bottom-14 right-20 w-36 h-36 rounded-full bg-blue-500/10 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/50 mb-2">
                <Sparkles size={11} />
                AI-powered
              </div>
              <h1 className="text-2xl font-semibold tracking-tight leading-none">
                Cold email generator
              </h1>
              <p className="text-sm text-white/45 mt-1">
                Generate professional recruiter outreach emails in seconds.
              </p>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-5">

          {/* Left — Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
              Email details
            </p>

            <div className="space-y-3">

              {/* Row: recruiter + company */}
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Recruiter name"
                  name="recruiterName"
                  value={formData.recruiterName}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Khan"
                />
                <Field
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Google"
                  required
                />
              </div>

              {/* Row: role + your name */}
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Role / position"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. SWE Intern"
                  required
                />
                <Field
                  label="Your name"
                  name="yourName"
                  value={formData.yourName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>

              <Field
                label="Portfolio / GitHub / LinkedIn"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://github.com/yourname"
              />

              <TextArea
                label="Why this company?"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="What excites you about working here?"
                rows={3}
              />

              <TextArea
                label="Skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB, DSA"
                rows={2}
              />

              <TextArea
                label="Projects / experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Briefly describe your relevant projects or work experience."
                rows={3}
              />

              {/* Tone selector */}
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Tone</p>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map((t) => (
                    <button
                      key={t}
                      onClick={() => setFormData({ ...formData, tone: t })}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                        formData.tone === t
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateEmail}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60 transition-colors mt-1"
              >
                <Sparkles size={15} />
                {loading ? "Generating…" : "Generate with AI"}
              </button>
            </div>
          </div>

          {/* Right — Output */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Generated email
              </p>

              {email && (
                <button
                  onClick={copyEmail}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    copied
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>

            {email ? (
              <div className="flex-1 flex flex-col">
                {/* Email meta bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <p className="text-xs font-medium text-slate-600">Ready to send</p>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {email.split(" ").length} words
                  </span>
                </div>

                {/* Email body */}
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-y-auto max-h-[560px]">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-7">
                    {email}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                  <Mail size={20} className="text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-500">No email generated yet</p>
                <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                  Fill in the details on the left and click generate to create a personalized cold email.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Reusable field components ── */

function Field({ label, name, value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange, placeholder, rows }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 transition resize-none"
      />
    </div>
  );
}

export default ColdEmail;