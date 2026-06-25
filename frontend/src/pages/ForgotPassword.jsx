import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import api from "../api/axios";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/forgot-password", {
        email,
      });

      sessionStorage.setItem("resetEmail", res.data.email);

      navigate("/verify-reset-otp", {
        state: {
          email: res.data.email,
        },
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to send reset OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Mail size={32} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Forgot Password
          </h1>

          <p className="text-slate-500 mt-2">
            Enter your email to receive a reset OTP.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? "Sending OTP..." : "Send Reset OTP"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Remember password?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;