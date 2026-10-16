import { ShieldWarning } from "@phosphor-icons/react";
import CitationGrid from "../components/CitationGrid";

const guardrailImg =
  "https://static.prod-images.emergentagent.com/jobs/d45d6264-1b2b-4c05-abc3-3e77c7d5dae9/images/3d37e7165e26019c1924040651d05f449301960337dff9f20fb14c1ba892e01f.png";

export default function GuardrailRefusal({ reason, citations }) {
  return (
    <div className="border-l-4 border-red-500 bg-red-50 relative overflow-hidden">
      
      {/* watermark */}
      <img
        src={guardrailImg}
        alt=""
        className="absolute right-0 top-0 w-40 h-full object-cover opacity-10"
      />

      <div className="relative p-5">
        <div className="flex items-center gap-2 mb-3 text-red-600 text-xs uppercase">
          <ShieldWarning size={16} />
          [ out_of_context · guardrail engaged ]
        </div>

        <h3 className="text-xl font-bold text-red-600 mb-2">
          OUT OF CONTEXT
        </h3>

        <p className="text-sm text-gray-700">
          {reason ||
            "This question cannot be answered from the selected documents."}
        </p>

        {citations && citations.length > 0 && (
          <div className="mt-4">
            <CitationGrid citations={citations.slice(0, 2)} />
          </div>
        )}
      </div>
    </div>
  );
}