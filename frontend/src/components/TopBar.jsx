import { useEffect, useState } from "react";
import { Power, ArrowClockwise, Folder, CaretRight } from "@phosphor-icons/react";

export default function TopBar({
  user,
  activeFolder,
  indexSummary,
  onDisconnect,
  onSwitchFolder,
  onReindex,
}) {
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("drive_rag_user") || "{}");
    } catch {
      return {};
    }
  })();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const displayUser = user || storedUser;

  return (
    <header
      className="sticky top-0 z-20 bg-white/85 backdrop-blur-xl border-b border-zinc-300"
      data-testid="top-bar"
    >
      <div className="px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-[#002FA7] flex items-center justify-center text-white font-black text-sm">
              D
            </div>
            <div className="font-black text-sm hidden sm:block">
              DRIVE/RAG
            </div>
          </div>

          <CaretRight size={14} className="text-zinc-400 shrink-0" />

          {activeFolder ? (
            <button
              onClick={onSwitchFolder}
              className="flex items-center gap-2 min-w-0 border border-zinc-300 px-3 py-1.5 hover:bg-zinc-950 hover:text-white transition"
            >
              <Folder size={14} weight="fill" />
              <span className="text-xs truncate max-w-[200px]">
                {activeFolder.name}
              </span>
            </button>
          ) : (
            <span className="text-xs text-zinc-400 uppercase">
              no folder
            </span>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <span className="hidden md:block text-xs text-zinc-400">
            {time.toLocaleTimeString("en-GB")}
          </span>

          {activeFolder && (
            <button
              onClick={onReindex}
              className="flex items-center gap-1 border px-3 py-1 text-xs"
            >
              <ArrowClockwise size={12} />
              re-index
            </button>
          )}

          <button
            onClick={onDisconnect}
            className="flex items-center gap-1 text-xs"
          >
            <Power size={12} />
            disconnect
          </button>
        </div>
      </div>
    </header>
  );
}