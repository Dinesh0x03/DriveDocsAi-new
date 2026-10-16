import { Link } from "react-router-dom";

export default function AuthError() {
  const reason =
    new URLSearchParams(window.location.search).get("reason") ||
    "Unknown error";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-zinc-50 px-6"
      data-testid="auth-error-page"
    >
      <div className="max-w-xl w-full border-l-4 border-[#FF2A00] bg-white p-8">
        <div className="font-mono text-xs tracking-[0.2em] uppercase text-[#FF2A00] mb-3">
          [ auth failed ]
        </div>

        <h1 className="font-black text-3xl tracking-tighter mb-3 leading-none">
          Could not connect to Google.
        </h1>

        <p className="text-sm text-zinc-600 break-all mb-6">
          {reason}
        </p>

        <Link
          to="/"
          className="inline-block border border-zinc-950 px-5 py-2 hover:bg-zinc-950 hover:text-white transition-colors font-medium"
          data-testid="auth-error-back-link"
        >
          ← TRY AGAIN
        </Link>
      </div>
    </div>
  );
}