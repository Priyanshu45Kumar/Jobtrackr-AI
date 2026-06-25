import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", formData);

      setUser(res.data.user);
      navigate("/");
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-500/20"></div>

      <div className="relative w-full max-w-5xl grid md:grid-cols-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">

        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Welcome Back 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Continue your job search journey with JobTrackr AI.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/15 p-4 rounded-2xl">
              📈 Track Applications
            </div>

            <div className="bg-white/15 p-4 rounded-2xl">
              🤖 AI Interview Assistant
            </div>

            <div className="bg-white/15 p-4 rounded-2xl">
              📧 Cold Email Generator
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Login
          </h2>

          <p className="text-slate-500 mb-8">
            Access your dashboard and continue tracking your applications.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
              Login
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6 text-center">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-semibold"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;