import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  LayoutDashboard,
  Bot,
  FileText,
} from "lucide-react";

function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const res = await api.post("/auth/signup", formData);
      localStorage.setItem("verifyEmail", res.data.email);
      setSuccess(res.data.message);
      navigate("/verify-otp", { state: { email: res.data.email } });
    } catch (error) {
      setError(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <LayoutDashboard size={15} />, label: "Track all your applications in one place" },
    { icon: <Bot size={15} />,             label: "AI-powered interview preparation"         },
    { icon: <FileText size={15} />,        label: "Resume analyzer with ATS scoring"         },
    { icon: <Mail size={15} />,            label: "Cold email generator for outreach"         },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-white/8">

        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-between p-8 bg-slate-900">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Sparkles size={15} className="text-indigo-400" />
              </div>
              <span className="text-sm font-semibold text-white">JobTrackr AI</span>
            </div>

            <h2 className="text-2xl font-semibold text-white leading-snug mb-3">
              Start your job search journey 🚀
            </h2>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Everything you need to track applications, prep interviews, and land your next role — all in one place.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-2.5">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/8"
              >
                <span className="text-indigo-400 flex-shrink-0">{f.icon}</span>
                <span className="text-sm text-white/60">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-[11px] text-white/20 mt-6">
            © 2025 JobTrackr AI. All rights reserved.
          </p>
        </div>

        {/* Right panel */}
        <div className="bg-white p-8 md:p-10 flex flex-col justify-center">

          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-6 md:hidden">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-800">JobTrackr AI</span>
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Get started
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">
            Create your account
          </h1>
          <p className="text-sm text-slate-400 mb-7">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Name */}
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="name"
                placeholder="Full name"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>

            {/* Password hint */}
            <p className="text-[11px] text-slate-400 pl-1">
              Use at least 8 characters with a mix of letters and numbers.
            </p>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60 transition-colors mt-1"
            >
              {loading ? "Creating account…" : "Create account"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400">free forever</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <p className="text-center text-xs text-slate-400">
            By signing up you agree to our{" "}
            <span className="text-slate-600 font-medium cursor-pointer hover:underline">Terms</span>
            {" "}and{" "}
            <span className="text-slate-600 font-medium cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;