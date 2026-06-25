import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

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

    navigate("/verify-otp", {
      state: {
        email: res.data.email,
      },
    });
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Signup failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-500/20"></div>

      <div className="relative w-full max-w-5xl grid md:grid-cols-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
        
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-4">JobTrackr AI</h1>
            <p className="text-blue-100 text-lg">
              Track applications, prepare interviews, analyze resumes and grow your career with AI.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/15 p-4 rounded-2xl">
              ✅ AI Resume Analyzer
            </div>
            <div className="bg-white/15 p-4 rounded-2xl">
              ✅ Cold Email Generator
            </div>
            <div className="bg-white/15 p-4 rounded-2xl">
              ✅ Interview Preparation Assistant
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Create your account
          </h2>
          <p className="text-slate-500 mb-8">
            Start tracking your job journey professionally.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              placeholder="Full name"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="email"
              type="email"
              placeholder="Email address"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
    {error}
  </div>
)}

{success && (
  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
    {success}
  </div>
)}

            <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;