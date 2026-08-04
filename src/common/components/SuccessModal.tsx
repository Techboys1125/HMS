import React from "react";
import { CheckCircle2, X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionText?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  actionText = "Continue",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-gray-150 shadow-xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-end px-4 py-3 border-b border-gray-50">
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-650 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4 border border-green-100">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="font-bold text-[#1E293B] text-base leading-snug">{title}</h3>
          <p className="text-xs text-[#64748B] font-medium leading-relaxed mt-2 max-w-xs">
            {message}
          </p>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 bg-slate-50/50 flex justify-center">
          <button
            onClick={onClose}
            className="w-full max-w-[200px] px-4 py-2 bg-[#0D47A1] hover:bg-[#0c3d8a] text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
