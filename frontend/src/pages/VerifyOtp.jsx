import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, RefreshCw } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const initialEmail =
    location.state?.email || localStorage.getItem("verifyEmail") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      setError("Email and OTP are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      setUser(res.data.user);
      localStorage.removeItem("verifyEmail");

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }

    try {
      setResending(true);
      setError("");
      setSuccess("");

      const res = await api.post("/auth/resend-otp", {
        email,
      });

      setSuccess(res.data.message || "New OTP sent successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to resend OTP"
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <ShieldCheck size={32} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Verify Email
          </h1>

          <p className="text-slate-500 mt-2">
            Enter the OTP sent to your email.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest text-center text-lg font-semibold"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          onClick={handleResendOtp}
          disabled={resending}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 disabled:opacity-60 transition"
        >
          <RefreshCw size={17} />
          {resending ? "Sending..." : "Resend OTP"}
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already verified?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;