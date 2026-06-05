"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { applyActionCode } from "firebase/auth";
import AuthCard from "../components/AuthCard";
import StoreButtons from "../components/StoreButtons";
import { getFirebaseAuth } from "@/lib/firebase";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const userType = searchParams.get("userType") ?? "user";
  const project = searchParams.get("project") ?? "myoga-80daa";
  const auth = useMemo(() => getFirebaseAuth(project), [project]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!oobCode) return;

    console.log("oobCode received:", oobCode);
    console.log("Firebase project:", auth.app.options.projectId);

    applyActionCode(auth, oobCode)
      .then(() => setStatus("success"))
      .catch((error) => {
        console.error("applyActionCode error:", error.code, error.message);
        setStatus("error");
        setMessage(
          error.code === "auth/invalid-action-code"
            ? "This link has expired or has already been used."
            : `Something went wrong: ${error.code}`,
        );
      });
  }, [auth, oobCode]);

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
          <p className="text-sm text-gray-500">
            This verification link is invalid.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="px-8 py-10">
        {status === "loading" && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
              <div className="w-8 h-8 border-[3px] border-blue-100 border-t-blue-500 rounded-full animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-[#00002e] mb-2">
              Verifying your email
            </h2>
            <p className="text-sm text-gray-500">Please wait a moment...</p>
          </div>
        )}

        {status === "success" && (
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
              Email verified!
            </h2>
            <p className="text-sm text-gray-500 mb-0">
              Your email has been verified successfully. You can now return to
              the app and start using MyOga.
            </p>
            <StoreButtons
              userType={userType}
              label={
                userType === "rider"
                  ? "Open the MyOga Rider app"
                  : "Open the MyOga app"
              }
            />
          </>
        )}

        {status === "error" && (
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
              Verification failed
            </h2>
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        )}
      </div>
    </AuthCard>
  );
}
