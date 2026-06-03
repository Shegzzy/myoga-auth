"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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
        setMessage("This link has expired or already been used.");
      });
  }, [oobCode]);

  if (!oobCode) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Link Invalid
          </h1>
          <p className="text-gray-500">Invalid reset link.</p>
        </div>
      </main>
    );
  }

  const handleReset = async () => {
    if (!password || password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus("success");
      setMessage("Your password has been reset successfully!");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow p-10 max-w-md w-full">
        {status === "error" ? (
          <div className="text-center">
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Link Invalid
            </h1>
            <p className="text-gray-500">{message}</p>
          </div>
        ) : status === "success" ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Password Reset!
            </h1>
            <p className="text-gray-500">{message}</p>
            <p className="text-gray-400 text-sm mt-4">
              You can now log in with your new password.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Reset Password
            </h1>
            {email && <p className="text-gray-400 text-sm mb-6">for {email}</p>}
            <div className="space-y-4">
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {message && <p className="text-red-500 text-sm">{message}</p>}
              <button
                onClick={handleReset}
                disabled={status === "loading"}
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {status === "loading" ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
