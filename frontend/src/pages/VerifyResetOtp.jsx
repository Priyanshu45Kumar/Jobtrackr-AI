import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Mail, ArrowRight, Sparkles, ArrowLeft } from "lucide-react";
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
    if (!email || !otp) return setError("Email and OTP are required");

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/verify-reset-otp", { email, otp });
      sessionStorage.setItem("resetEmail", res.data.email);
      sessionStorage.setItem("resetToken", res.data.resetToken);
      navigate("/reset-password");
    } catch (error) {
      setError(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-white/8 overflow-hidden">

          {/* Dark header */}
          <div className="bg-slate-900 px-8 pt-8 pb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Sparkles size={13} className="text-indigo-400" />
              </div>
              <span className="text-sm font-semibold text-white">JobTrackr AI</span>
            </div>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center mb-4">
              <ShieldCheck size={26} className="text-indigo-400" />
            </div>

            <h1 className="text-xl font-semibold text-white mb-1">
              Verify reset code
            </h1>
            <p className="text-sm text-white/40 leading-relaxed">
              We sent a 6-digit code to{" "}
              <span className="text-white/70 font-medium">
                {email || "your email"}
              </span>
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">

            {/* Error */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-3">

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  />
                </div>
              </div>

              {/* OTP */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  6-digit reset code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="• • • • • •"
                  maxLength="6"
                  className="w-full py-3 rounded-xl border border-slate-200 text-center text-xl font-bold tracking-[0.5em] text-slate-800 placeholder:text-slate-300 placeholder:tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                />
                <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                  Enter the code exactly as received
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors mt-1"
              >
                {loading ? "Verifying…" : "Verify code"}
                {!loading && <ArrowRight size={15} />}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400">wrong email?</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Back link */}
            <Link
              to="/forgot-password"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={13} />
              Back to forgot password
            </Link>

            {/* Footer */}
            <p className="text-center text-xs text-slate-400 mt-5">
              Remembered your password?{" "}
              <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-[11px] text-white/20 mt-4">
          Check your spam folder if you don't see the email.
        </p>
      </div>
    </div>
  );
}

export default VerifyResetOtp;