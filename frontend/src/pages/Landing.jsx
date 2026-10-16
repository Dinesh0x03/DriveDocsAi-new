// frontend/src/pages/Landing.js
import { useState } from "react";
import {useEffect} from "react";
import api from "../lib/api"; // Make sure this path exists
import {
  ArrowRight,
  GoogleDriveLogo,
  ShieldCheck,
  Graph,
  Quotes,
} from "@phosphor-icons/react";

const landingHero =
  "https://static.prod-images.emergentagent.com/jobs/d45d6264-1b2b-4c05-abc3-3e77c7d5dae9/images/4aaeb792dc4afa8aa6d76cc4401301d95391fae859133a8de2ece9270cf229da.png";

export default function Landing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function connectDrive() {
    setLoading(true);
    setError("");
    try {
      console.log("🔑 Fetching auth URL from backend...");
      const { data } = await api.get("/auth/google/url");
      console.log("✅ Got auth URL:", data.url);
      window.location.href = data.url;
    } catch (e) {
      console.error("❌ Connection error:", e);
      setLoading(false);
      setError(
        e.response?.data?.error || 
        "Could not reach the backend. Make sure the Node.js server is running on http://localhost:3001."
      );
    }
  }


useEffect(() => {
  const token = localStorage.getItem("drive_rag_token");
  if (token) {
    window.location.href = "/chat";
  }
}, []);

  return (
    <div className="min-h-screen flex flex-col" data-testid="landing-page">
      {/* Top nav */}
      <header className="border-b border-zinc-300 bg-white/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#002FA7] flex items-center justify-center text-white font-black">
              D
            </div>
            <div>
              <div className="font-black tracking-tighter text-base">
                DRIVE/RAG
              </div>
              <div className="text-[10px] text-zinc-500 uppercase mt-0.5">
                truth engine
              </div>
            </div>
          </div>
          <div className="text-xs text-zinc-500 uppercase">
            v1.0 · node.js
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 border-b border-zinc-300">
        <section className="px-6 lg:px-12 py-16 lg:py-24 flex flex-col justify-center">
          <h1 className="text-5xl font-black">
            Grounded answers.
            <br />
            <span className="text-blue-700">Nothing else.</span>
          </h1>

          <p className="mt-6 text-zinc-600 max-w-lg">
            Connect your Google Drive folder and ask questions. Answers are
            grounded only in your documents.
          </p>

          <button
            onClick={connectDrive}
            disabled={loading}
            className="mt-6 bg-blue-700 text-white px-6 py-3 flex items-center gap-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
          >
            <GoogleDriveLogo size={20} />
            {loading ? "CONNECTING..." : "CONNECT GOOGLE DRIVE"}
            <ArrowRight size={16} />
          </button>

          {error && (
            <div className="mt-4 text-red-500 text-sm">{error}</div>
          )}
        </section>

        <section className="relative bg-zinc-100">
          <img
            src={landingHero}
            alt="preview"
            className="w-full h-full object-cover"
          />
        </section>
      </main>
    </div>
  );
}