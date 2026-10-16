// frontend/src/pages/Chat.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

import TopBar from "../components/TopBar";
import FolderPicker from "../components/FolderPicker";
import IndexingProgress from "../components/IndexingProgress";
import ChatMessage from "../components/ChatMessage";
import GuardrailRefusal from "../components/GuardrailRefusal";
import EmptyState from "../components/EmptyState";

import { PaperPlaneTilt, Folder } from "@phosphor-icons/react";

export default function Chat() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [status, setStatus] = useState({ stage: "idle" });
  const [activeFolder, setActiveFolder] = useState(null);
  const [indexSummary, setIndexSummary] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  // Load user data on mount
  useEffect(() => {
    const token = localStorage.getItem("drive_rag_token");
    if (!token) {
      navigate("/");
      return;
    }

    const loadUserData = async () => {
      try {
        console.log("Loading user data...");
        const { data } = await api.get("/me");
        console.log("User data:", data);
        setMe(data);
        
        if (data.activeFolder) {
          console.log("Active folder found:", data.activeFolder);
          setActiveFolder(data.activeFolder);
        } else {
          console.log("No active folder, showing picker");
          setShowPicker(true);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        if (err.response?.status === 401) {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  // Poll indexing status
  useEffect(() => {
    const poll = async () => {
      try {
        const { data } = await api.get("/index/status");
        console.log("Index status:", data);
        setStatus(data.status || { stage: "idle" });
        if (data.activeFolder) {
          setActiveFolder(data.activeFolder);
        }
        setIndexSummary(data.summary || null);
      } catch (err) {
        console.error("Failed to get index status:", err);
      }
    };
    
    poll();
    const id = setInterval(poll, 1500);
    return () => clearInterval(id);
  }, []);

  async function handleSelectFolder(folder) {
    console.log("Selected folder:", folder);
    setShowPicker(false);
    setMessages([]);
    setIndexSummary(null);
    setStatus({ stage: "starting" });

    try {
      await api.post(`/index/${folder.id}`, { folderName: folder.name });
      console.log("Indexing started for folder:", folder.name);
      setActiveFolder(folder);
    } catch (err) {
      console.error("Failed to start indexing:", err);
      setStatus({
        stage: "error",
        error: err?.response?.data?.error || err.message,
      });
      // Show picker again on error
      setShowPicker(true);
    }
  }

  async function handleDisconnect() {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem("drive_rag_token");
    localStorage.removeItem("drive_rag_user");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_picture");
    navigate("/", { replace: true });
  }

  async function handleSwitchFolder() {
    setShowPicker(true);
  }

  async function handleReindex() {
    if (!activeFolder) return;
    
    setMessages([]);
    setIndexSummary(null);
    setStatus({ stage: "starting" });
    
    try {
      await api.post(`/index/${activeFolder.id}`, { folderName: activeFolder.name });
      console.log("Re-indexing started for:", activeFolder.name);
    } catch (err) {
      console.error("Failed to re-index:", err);
      setStatus({
        stage: "error",
        error: err?.response?.data?.error || err.message,
      });
    }
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!question.trim() || thinking) return;

    setMessages((m) => [...m, { role: "user", content: question }]);
    setQuestion("");
    setThinking(true);

    try {
      const { data } = await api.post("/chat", { question });
      console.log("Chat response:", data);

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.answer,
          citations: data.citations || [],
          outOfContext: data.outOfContext,
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: err?.response?.data?.error || "Error occurred. Please try again.",
          outOfContext: true,
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002FA7] mx-auto mb-4"></div>
          <div className="font-mono text-sm text-zinc-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <TopBar 
        user={me} 
        activeFolder={activeFolder}
        indexSummary={indexSummary}
        onDisconnect={handleDisconnect}
        onSwitchFolder={handleSwitchFolder}
        onReindex={handleReindex}
      />

      {/* Show indexing progress if indexing is in progress */}
      {status.stage && status.stage !== "idle" && status.stage !== "done" && (
        <IndexingProgress status={status} />
      )}

      <main className="flex-1 flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
          {!activeFolder && !showPicker && (
            <EmptyState
              title="No Folder Selected"
              body="Select a Google Drive folder to start asking questions"
              actionLabel="Select Folder"
              onAction={() => setShowPicker(true)}
            />
          )}

          {messages.length === 0 && activeFolder && status.stage === "done" && (
            <EmptyState
              title="Ready to Answer"
              body={`Ask questions about documents in "${activeFolder.name}"`}
              actionLabel="Ask a Question"
              onAction={() => document.querySelector("input")?.focus()}
            />
          )}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <UserMessage key={i} content={m.content} />
            ) : m.outOfContext ? (
              <GuardrailRefusal key={i} reason={m.content} citations={m.citations} />
            ) : (
              <ChatMessage key={i} content={m.content} citations={m.citations} />
            )
          )}

          {thinking && <ThinkingMessage />}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={activeFolder ? "Ask something..." : "Select a folder first..."}
            disabled={!activeFolder || thinking}
            className="flex-1 border border-zinc-300 p-3 outline-none focus:border-[#002FA7] disabled:bg-zinc-100"
          />
          <button 
            type="submit"
            disabled={!activeFolder || thinking || !question.trim()}
            className="bg-[#002FA7] text-white px-6 py-3 hover:bg-[#001F7A] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperPlaneTilt size={18} />
          </button>
        </form>
      </main>

      {showPicker && (
        <FolderPicker 
          onClose={() => setShowPicker(false)} 
          onSelect={handleSelectFolder}
          allowClose={true}
        />
      )}
    </div>
  );
}

function UserMessage({ content }) {
  return (
    <div className="mb-4 flex justify-end">
      <div className="bg-[#002FA7] text-white rounded-lg px-4 py-2 max-w-[70%]">
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
}

function ThinkingMessage() {
  return (
    <div className="mb-4 flex justify-start">
      <div className="bg-zinc-200 text-zinc-700 rounded-lg px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="animate-pulse">●</div>
          <div className="animate-pulse delay-100">●</div>
          <div className="animate-pulse delay-200">●</div>
          <span className="text-sm ml-1">Thinking...</span>
        </div>
      </div>
    </div>
  );
}