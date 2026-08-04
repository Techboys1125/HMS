import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-gray-150 shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            {isDangerous && (
              <AlertTriangle size={18} className="text-red-500" />
            )}
            <span className="font-bold text-[#1E293B] text-sm">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-650 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 text-xs text-[#64748B] font-medium leading-relaxed">
          {message}
        </div>
        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-gray-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-250 text-slate-700 bg-white hover:bg-slate-50 rounded-xl font-bold cursor-pointer transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-xl font-bold cursor-pointer transition-colors ${
              isDangerous
                ? "bg-[#EF4444] hover:bg-red-650 shadow-sm"
                : "bg-[#0D47A1] hover:bg-[#0c3d8a] shadow-sm"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
