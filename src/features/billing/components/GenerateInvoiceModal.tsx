import React, { useState } from "react";
import { X } from "lucide-react";
import { PP, RB } from "../constants/billing.constants";

interface GenerateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    patientName: string;
    mrn: string;
    doctorName: string;
    department: string;
    invoiceAmount: number;
    mobile?: string;
  }) => void;
}

export function GenerateInvoiceModal({
  isOpen,
  onClose,
  onConfirm,
}: GenerateInvoiceModalProps) {
  const [patientName, setPatientName] = useState("");
  const [mrn, setMrn] = useState("");
  const [doctorName, setDoctorName] = useState("Dr. Arjun Mehta");
  const [department, setDepartment] = useState("Cardiology");
  const [invoiceAmount, setInvoiceAmount] = useState<number>(1000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !mrn || invoiceAmount <= 0) return;
    onConfirm({
      patientName,
      mrn,
      doctorName,
      department,
      invoiceAmount,
    });
    setPatientName("");
    setMrn("");
    setInvoiceAmount(1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <h3
            className="text-base font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            + Generate New OPD Invoice
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4 text-xs"
          style={{ fontFamily: RB }}
        >
          <div>
            <label className="block text-slate-600 font-medium mb-1">
              Patient Name *
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                MRN Number *
              </label>
              <input
                type="text"
                required
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
                placeholder="e.g. MRN-89211"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Invoice Amount (₹) *
              </label>
              <input
                type="number"
                required
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Attending Doctor
              </label>
              <select
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
              >
                <option>Dr. Arjun Mehta</option>
                <option>Dr. Priya Sharma</option>
                <option>Dr. Sunita Patel</option>
                <option>Dr. Rajesh Kapoor</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:border-[#0D47A1] focus:outline-none"
              >
                <option>Cardiology</option>
                <option>General Medicine</option>
                <option>Gynecology</option>
                <option>Neurology</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-slate-600 font-medium hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white font-semibold hover:bg-blue-900 transition-colors shadow-sm cursor-pointer"
              style={{ fontFamily: PP }}
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GenerateInvoiceModal;
