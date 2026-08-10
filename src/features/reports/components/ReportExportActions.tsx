import React from "react";
import { X, FileText, FileSpreadsheet, Download } from "lucide-react";
import { PP, RB } from "../constants/reports.constants";

interface ReportExportActionsProps {
  isOpen: boolean;
  onClose: () => void;
  onExportPdf?: () => void;
  onExportCsv?: () => void;
  onExportExcel?: () => void;
  reportName: string;
}

export function ReportExportActions({
  isOpen,
  onClose,
  onExportPdf,
  onExportCsv,
  onExportExcel,
  reportName,
}: ReportExportActionsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-[400px] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <div>
            <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>
              Export Report
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
              {reportName}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#64748B] hover:bg-slate-50">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] hover:border-[#EF4444]/40 hover:bg-red-50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <FileText size={18} className="text-[#EF4444]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>PDF Document</div>
                <div className="text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>Formatted report with charts</div>
              </div>
              <Download size={16} className="ml-auto text-[#94A3B8]" />
            </button>
          )}
          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] hover:border-[#009688]/40 hover:bg-teal-50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <FileSpreadsheet size={18} className="text-[#009688]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>CSV File</div>
                <div className="text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>Raw data for spreadsheet apps</div>
              </div>
              <Download size={16} className="ml-auto text-[#94A3B8]" />
            </button>
          )}
          {onExportExcel && (
            <button
              onClick={onExportExcel}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] hover:border-[#0D47A1]/40 hover:bg-blue-50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <FileSpreadsheet size={18} className="text-[#0D47A1]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#111827]" style={{ fontFamily: PP }}>Excel Workbook</div>
                <div className="text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>Multiple sheets with formatting</div>
              </div>
              <Download size={16} className="ml-auto text-[#94A3B8]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
