import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { handleResponse } from "../utils/api";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // Forgot password flows
  const [forgotFlow, setForgotFlow] = useState(false);
  const [resetFlow, setResetFlow] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(res);

      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await handleResponse(res);

      if (data.mockOtp) {
        setDevOtp(data.mockOtp);
      }
      setResetFlow(true);
      setForgotFlow(false);
      setStatusMsg({
        type: "success",
        text: "Password reset OTP sent to email!",
      });
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otpCode || !newPassword) return;

    setLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode, newPassword }),
      });
      const data = await handleResponse(res);

      setResetFlow(false);
      setDevOtp("");
      setStatusMsg({
        type: "success",
        text: "Password reset successfully! Proceed to sign in.",
      });
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20 max-w-md min-h-[calc(100vh-80px)] flex flex-col justify-center">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-950 border border-blue-900 rounded-2xl flex items-center justify-center mx-auto text-blue-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {forgotFlow
              ? "Request Reset"
              : resetFlow
                ? "Reset Password"
                : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-400 font-semibold">
            {forgotFlow
              ? "Enter your registered email below"
              : resetFlow
                ? "Enter the OTP and new password"
                : "Log in to your secure admin workspace"}
          </p>
        </div>

        {statusMsg.text && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold ${statusMsg.type === "success" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900" : "bg-rose-950/40 text-rose-300 border border-rose-900"}`}
          >
            {statusMsg.text}
          </div>
        )}

        {/* Regular Login Form */}
        {!forgotFlow && !resetFlow && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setStatusMsg({ type: "", text: "" });
                  }}
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none transition-colors"
                  placeholder="name@example.com"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-600" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotFlow(true)}
                  className="text-[10px] text-blue-400 hover:underline font-bold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setStatusMsg({ type: "", text: "" });
                  }}
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl py-3 pl-10 pr-10 text-xs focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-600" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-600 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Forgot Password Request */}
        {forgotFlow && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none"
                  placeholder="name@example.com"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-600" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs cursor-pointer"
            >
              {loading ? "Sending OTP..." : "Send Reset Code"}
            </button>
            <button
              type="button"
              onClick={() => setForgotFlow(false)}
              className="w-full text-center text-xs text-slate-500 hover:text-white mt-2 font-bold"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Enter Code & Reset Password */}
        {resetFlow && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                6-Digit Reset OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs font-mono text-center tracking-widest text-white focus:outline-none"
                placeholder="000000"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs text-white focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs cursor-pointer"
            >
              {loading ? "Resetting Password..." : "Verify & Reset Password"}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-900 text-xs text-slate-500 font-semibold tracking-wide">
          Secure Administrator Console
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
