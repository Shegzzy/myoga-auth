"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import AuthCard from "../components/AuthCard";
import StoreButtons from "../components/StoreButtons";

const rules = [
  { id: "len", label: "8+ characters", test: (v: string) => v.length >= 8 },
  {
    id: "upper",
    label: "Uppercase letter",
    test: (v: string) => /[A-Z]/.test(v),
  },
  { id: "num", label: "Number", test: (v: string) => /[0-9]/.test(v) },
  {
    id: "special",
    label: "Special character",
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
];

function getStrength(v: string) {
  const score = rules.filter((r) => r.test(v)).length;
  if (score === 0) return { label: "", color: "", width: "0%" };
  if (score === 1) return { label: "Weak", color: "#cc0000", width: "25%" };
  if (score === 2) return { label: "Fair", color: "#f59e0b", width: "50%" };
  if (score === 3) return { label: "Good", color: "#3b82f6", width: "75%" };
  return { label: "Strong", color: "#16a34a", width: "100%" };
}

export default function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const userType = searchParams.get("userType") ?? "user";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!oobCode) return;
    verifyPasswordResetCode(auth, oobCode)
      .then((resolvedEmail) => setEmail(resolvedEmail))
      .catch(() => {
        setStatus("error");
        setMessage("This link has expired or has already been used.");
      });
  }, [oobCode]);

  if (!oobCode) {
    return (
      <AuthCard>
        <div className="px-8 py-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cc0000"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#00002e] mb-2">
            Invalid link
          </h2>
          <p className="text-sm text-gray-500">This reset link is invalid.</p>
        </div>
      </AuthCard>
    );
  }

  const strength = getStrength(password);
  const allRulesPass = rules.every((r) => r.test(password));
  const passwordsMatch = password === confirm && confirm.length > 0;
  const canSubmit = allRulesPass && passwordsMatch && status !== "loading";

  const handleReset = async () => {
    if (!canSubmit) return;
    setStatus("loading");
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <AuthCard>
      <div className="px-8 py-8">
        {status === "error" ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#cc0000"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#00002e] mb-2">
              Link invalid
            </h2>
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        ) : status === "success" ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#00002e] mb-2">
              Password updated!
            </h2>
            <p className="text-sm text-gray-500">
              Your password has been reset. Open the app to log in with your new
              password.
            </p>
            <StoreButtons
              userType={userType}
              label={
                userType === "rider"
                  ? "Open the Myoga Rider app"
                  : "Open the Myoga app"
              }
            />
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#cc0000"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#00002e] mb-1">
              Reset your password
            </h2>
            {email && (
              <p className="text-sm text-gray-400 mb-6">
                for{" "}
                <span className="font-semibold text-[#00002e]">{email}</span>
              </p>
            )}

            {/* New password */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className={`w-full px-4 py-3 pr-10 rounded-xl border text-sm outline-none transition-colors ${
                    password.length === 0
                      ? "border-gray-200"
                      : allRulesPass
                        ? "border-green-400"
                        : "border-amber-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: strength.width,
                        background: strength.color,
                      }}
                    />
                  </div>
                  <span
                    className="text-xs mt-1 block"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Rules */}
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {rules.map((r) => (
                <div key={r.id} className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors"
                    style={{
                      background: r.test(password) ? "#16a34a" : "#d1d5db",
                    }}
                  />
                  <span
                    className="text-xs transition-colors"
                    style={{ color: r.test(password) ? "#16a34a" : "#9ca3af" }}
                  >
                    {r.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Confirm password */}
            <div className="mb-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  className={`w-full px-4 py-3 pr-10 rounded-xl border text-sm outline-none transition-colors ${
                    confirm.length === 0
                      ? "border-gray-200"
                      : passwordsMatch
                        ? "border-green-400"
                        : "border-red-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {confirm.length > 0 && (
                <p
                  className={`text-xs mt-1 ${passwordsMatch ? "text-green-500" : "text-red-500"}`}
                >
                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"}
                </p>
              )}
            </div>

            <button
              onClick={handleReset}
              disabled={!canSubmit}
              className="w-full mt-4 py-3.5 bg-[#cc0000] text-white rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-800 transition-colors"
            >
              {status === "loading" ? "Resetting..." : "Reset password"}
            </button>

            <div className="mt-4 bg-orange-50 border-l-[3px] border-[#cc0000] rounded-r-lg px-4 py-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                This link expires in <strong>1 hour</strong>. If you didn&apos;t
                request this, you can safely ignore this email.
              </p>
            </div>
          </>
        )}
      </div>
    </AuthCard>
  );
}
