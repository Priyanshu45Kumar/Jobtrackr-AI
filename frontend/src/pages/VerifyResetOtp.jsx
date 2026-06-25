import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import api from "../api/axios";

function VerifyResetOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail =
    location.state?.email || sessionStorage.getItem("resetEmail") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      setError("Email and OTP are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/verify-reset-otp", {
        email,
        otp,
      });

      sessionStorage.setItem("resetEmail", res.data.email);
      sessionStorage.setItem("resetToken", res.data.resetToken);

      navigate("/reset-password");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
            <ShieldCheck size={32} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Verify Reset OTP
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

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 tracking-widest text-center text-lg font-semibold"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Wrong email?{" "}
          <Link to="/forgot-password" className="text-green-600 font-semibold">
            Go back
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyResetOtp;