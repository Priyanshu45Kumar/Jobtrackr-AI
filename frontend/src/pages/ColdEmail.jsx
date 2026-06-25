import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Copy, Mail, Sparkles } from "lucide-react";
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
  }   catch (error) {
  console.log("AI email error:", error.response?.data || error.message);

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
    alert("Email copied successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Mail size={26} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Cold Email Generator
              </h1>
              <p className="text-slate-300 text-sm">
                Generate professional recruiter outreach emails.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              Email Details
            </h2>

            <div className="space-y-4">
              <input
                name="recruiterName"
                value={formData.recruiterName}
                onChange={handleChange}
                placeholder="Recruiter Name"
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />

              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />

              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Role / Position"
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />

              <input
                name="yourName"
                value={formData.yourName}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />

              <input
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="Portfolio / GitHub / LinkedIn Link"
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Why are you interested in this company?"
                rows="4"
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />

              <textarea
  name="skills"
  value={formData.skills}
  onChange={handleChange}
  placeholder="Your skills, e.g. React, Node.js, MongoDB, DSA"
  rows="3"
  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
/>

<textarea
  name="experience"
  value={formData.experience}
  onChange={handleChange}
  placeholder="Your projects or experience"
  rows="4"
  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
/>

<select
  name="tone"
  value={formData.tone}
  onChange={handleChange}
  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
>
  <option>Professional</option>
  <option>Friendly</option>
  <option>Confident</option>
  <option>Short and Direct</option>
</select>

              <button
  onClick={generateEmail}
  disabled={loading}
  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60 transition"
>
  <Sparkles size={18} />
  {loading ? "Generating with AI..." : "Generate with AI"}
</button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Generated Email
              </h2>

              {email && (
                <button
                  onClick={copyEmail}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"
                >
                  <Copy size={16} />
                  Copy
                </button>
              )}
            </div>

            {email ? (
  <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
    <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          Email Preview
        </p>
        <p className="text-xs text-slate-500">
          Ready to copy and send
        </p>
      </div>

      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
        Generated
      </span>
    </div>

    <div className="p-5 max-h-[520px] overflow-y-auto">
      <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-7">
        {email}
      </pre>
    </div>
  </div>
) : (
  <div className="min-h-[420px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 border border-dashed border-slate-300 rounded-2xl text-center p-8">
    <div className="max-w-sm">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl">
        📧
      </div>

      <h3 className="text-lg font-bold text-slate-800">
        No email generated yet
      </h3>

      <p className="text-sm text-slate-500 mt-2">
        Fill in the recruiter, company, and role details, then generate a professional cold email.
      </p>
    </div>
  </div>
)}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ColdEmail;