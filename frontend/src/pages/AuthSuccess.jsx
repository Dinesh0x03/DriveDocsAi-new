// frontend/src/pages/AuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("🔐 AuthSuccess page loaded");
    console.log("📍 Full URL:", window.location.href);
    console.log("📍 Location search:", location.search);
    
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const email = params.get("email");
    const name = params.get("name");
    const picture = params.get("picture");

    console.log("📦 Token found:", !!token);
    console.log("👤 User info:", { email, name });

    if (token && token !== "null" && token !== "undefined") {
      // Store the JWT token
      localStorage.setItem("drive_rag_token", token);
      
      // Store user info
      if (email) localStorage.setItem("user_email", email);
      if (name) localStorage.setItem("user_name", name);
      if (picture) localStorage.setItem("user_picture", picture);
      
      // Also store as JSON for compatibility with your TopBar
      localStorage.setItem(
        "drive_rag_user",
        JSON.stringify({
          email: email || "",
          name: name || "",
          picture: picture || "",
        })
      );
      
      console.log("✅ Token stored, redirecting to /chat");
      // Small delay to ensure storage is complete
      setTimeout(() => {
        navigate("/chat", { replace: true });
      }, 100);
    } else {
      console.error("❌ No token found in URL");
      console.error("All params:", Object.fromEntries(params));
      navigate("/auth/error?reason=missing_token", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-zinc-50"
      data-testid="auth-success-page"
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002FA7] mx-auto mb-4"></div>
        <div className="font-mono text-sm text-zinc-600 tracking-[0.1em] uppercase">
          signing you in…
        </div>
      </div>
    </div>
  );
}