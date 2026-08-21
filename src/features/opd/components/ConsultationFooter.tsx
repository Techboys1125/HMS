import React from "react";
import { Save, Check } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";

interface ConsultationFooterProps {
  onCancel: () => void;
  onSaveDraft?: () => void;
  onFinalize: () => void;
  isSavingDraft?: boolean;
  isFinalizing?: boolean;
  disabled?: boolean;
}

export const ConsultationFooter: React.FC<ConsultationFooterProps> = ({
  onCancel,
  onSaveDraft,
  onFinalize,
  isSavingDraft = false,
  isFinalizing = false,
  disabled = false,
}) => {
  return (
    <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] py-4 px-6 flex items-center justify-between z-40 shadow-lg mt-auto">
      <button
        type="button"
        onClick={onCancel}
        disabled={disabled}
        className="px-4 py-2 border border-[#E5E7EB] text-[#64748B] hover:text-[#111827] hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
        style={{ fontFamily: PP }}
      >
        Cancel
      </button>

      <div className="flex items-center gap-2">
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={disabled || isSavingDraft}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#0D47A1] text-[#0D47A1] hover:bg-blue-50 text-xs font-semibold rounded-xl transition-colors"
            style={{ fontFamily: PP }}
          >
            <Save size={14} />
            {isSavingDraft ? "Saving..." : "Save Draft"}
          </button>
        )}

        <button
          type="button"
          onClick={onFinalize}
          disabled={disabled || isFinalizing}
          className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#009688] text-white hover:bg-[#00827a] text-xs font-bold rounded-xl shadow-sm transition-colors"
          style={{ fontFamily: PP }}
        >
          <Check size={14} />
          {isFinalizing ? "Finalizing..." : "Finalize & Complete"}
        </button>
      </div>
    </div>
  );
};

export default ConsultationFooter;
