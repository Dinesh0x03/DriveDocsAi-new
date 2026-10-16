import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";
import AuthSuccess from "./pages/AuthSuccess";
import AuthError from "./pages/AuthError";

function RequireAuth({ children }) {
  const token = localStorage.getItem("drive_rag_token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="App min-h-screen bg-zinc-50 text-zinc-950 font-sans">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/auth/error" element={<AuthError />} />

          <Route
            path="/chat"
            element={
              <RequireAuth>
                <Chat />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}