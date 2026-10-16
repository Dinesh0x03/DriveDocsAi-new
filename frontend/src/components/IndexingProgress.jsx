export default function IndexingProgress({ status }) {
  const { stage, processed = 0, total = 0, file, chunks, error } = status;

  const pct =
    total > 0
      ? Math.min(100, Math.round((processed / total) * 100))
      : 0;

  if (stage === "error") {
    return (
      <div
        className="border-b border-[#FF2A00] bg-[#FF2A00]/5"
        data-testid="indexing-error"
      >
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-4">
          <div className="text-[10px] uppercase text-[#FF2A00] mb-1">
            [ indexing failed ]
          </div>
          <div className="text-xs text-[#FF2A00]">{error}</div>
        </div>
      </div>
    );
  }

  const label =
    stage === "extracting"
      ? "EXTRACTING TEXT"
      : stage === "embedding"
      ? "EMBEDDING"
      : stage === "starting"
      ? "STARTING"
      : stage?.toUpperCase() || "";

  return (
    <div
      className="border-b border-zinc-300 bg-white"
      data-testid="indexing-progress"
    >
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-[10px] uppercase text-[#002FA7] shrink-0">
              [ {label} ]
            </div>

            {file && (
              <div className="text-[11px] text-zinc-600 truncate">
                {file}
                {chunks ? ` · ${chunks} chunks` : ""}
              </div>
            )}
          </div>

          <div className="text-[11px] text-zinc-950 shrink-0">
            {processed} / {total || "…"} · {pct}%
          </div>
        </div>

        <div className="h-1.5 bg-zinc-200 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-[#002FA7] transition-all duration-150"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}