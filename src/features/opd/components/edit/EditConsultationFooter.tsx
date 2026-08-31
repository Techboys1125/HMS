import React from "react";
import { Save, Loader2 } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface EditConsultationFooterProps {
  isEditing: boolean;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export const EditConsultationFooter: React.FC<EditConsultationFooterProps> = ({
  isEditing,
  saving,
  onCancel,
  onSave,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-6 py-3.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="text-xs text-slate-500 font-medium hidden sm:block"
          style={{ fontFamily: RB }}
        >
          {isEditing ? (
            <span className="text-amber-700 font-semibold">
              ● Unsaved changes in revision draft
            </span>
          ) : (
            <span>Consultation details locked for view</span>
          )}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {isEditing && (
            <button
              onClick={onCancel}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              style={{ fontFamily: PP }}
            >
              Cancel Edit
            </button>
          )}

          {isEditing && (
            <button
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-[#0D47A1] text-white hover:bg-[#0a3880] text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              style={{ fontFamily: PP }}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving Revision...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Revision & Finalize
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
