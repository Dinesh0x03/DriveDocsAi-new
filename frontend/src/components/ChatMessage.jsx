import ReactMarkdown from "react-markdown";
import CitationGrid from "../components/CitationGrid";

export default function ChatMessage({ content, citations }) {
  return (
    <div
      className="border-l-4 border-[#002FA7] pl-6 py-4 bg-white shadow-sm"
      data-testid="assistant-message"
    >
      <div className="text-[10px] uppercase text-[#002FA7] mb-3">
        [ agent · grounded ]
      </div>

      <div className="text-base text-zinc-950 leading-relaxed">
        <ReactMarkdown>{content || ""}</ReactMarkdown>
      </div>

      {citations && citations.length > 0 && (
        <CitationGrid citations={citations} />
      )}
    </div>
  );
}