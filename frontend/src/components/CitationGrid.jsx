import { ArrowSquareOut, FileText } from "@phosphor-icons/react";

export default function CitationGrid({ citations }) {
  return (
    <div className="mt-5" data-testid="citation-grid">
      <div className="text-[10px] uppercase text-zinc-500 mb-3">
        [ sources · {citations.length} ]
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-zinc-200">
        {citations.map((c, i) => (
          <a
            key={c.fileId || i}
            href={c.webViewLink || "#"}
            target="_blank"
            rel="noreferrer"
            className={`block p-4 hover:bg-zinc-100 transition ${
              i % 2 === 1 ? "md:border-l border-zinc-200" : ""
            } ${i >= 2 ? "border-t border-zinc-200" : ""}`}
          >
            <div className="flex justify-between mb-2">
              <div className="flex gap-2">
                <FileText size={14} className="text-blue-600" />
                <span className="text-xs truncate">{c.fileName}</span>
              </div>

              <ArrowSquareOut size={14} className="text-gray-400" />
            </div>

            <div className="text-xs text-gray-600">
              {c.snippet}
              {c.snippet && c.snippet.length >= 220 ? "…" : ""}
            </div>

            <div className="mt-2 text-[10px] text-gray-400 flex justify-between">
              <span>chunk {c.chunkIndex}</span>
              <span>sim {c.score}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}