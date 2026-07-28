import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  ChevronDown,
  Activity,
  Calendar,
  Stethoscope,
  Pill,
  FileText,
  Clock,
} from "lucide-react";
import { PP, RB } from "../constants/patient.mock";

export function MedicalHistoryScreen({ onBack }: { onBack: () => void }) {
  const historyData = [
    {
      id: "VIS-2024-001",
      date: "March 12, 2024",
      time: "10:30 AM",
      department: "Cardiology",
      doctor: "Dr. Arjun Mehta",
      diagnosis: "Mild Hypertension, R/O Angina",
      notes:
        "Patient reported occasional chest tightness after exertion. BP is elevated (145/92). Advised lifestyle changes and prescribed medication to manage blood pressure. Follow-up in 2 weeks.",
      prescriptions: ["Amlodipine 5mg OD", "Atorvastatin 20mg HS"],
    },
    {
      id: "VIS-2023-089",
      date: "December 4, 2023",
      time: "02:15 PM",
      department: "General Medicine",
      doctor: "Dr. Priya Sharma",
      diagnosis: "Acute Bronchitis",
      notes:
        "Presenting with productive cough, mild fever, and fatigue for 4 days. Auscultation reveals bilateral rhonchi. Prescribed antibiotics and symptomatic relief.",
      prescriptions: [
        "Amoxicillin 500mg TDS",
        "Paracetamol 500mg SOS",
        "Cough Syrup 10ml BD",
      ],
    },
    {
      id: "VIS-2023-045",
      date: "July 18, 2023",
      time: "11:00 AM",
      department: "Cardiology",
      doctor: "Dr. Arjun Mehta",
      diagnosis: "Annual Cardiac Check-up",
      notes:
        "Routine check-up. ECG normal. TMT negative for ischemia. Lipid profile shows borderline high LDL. Advised diet control and regular aerobic exercise.",
      prescriptions: ["Rosuvastatin 10mg OD (if diet control fails)"],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header & Breadcrumb */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 text-slate-400 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h1
              className="text-xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              Medical History
            </h1>
          </div>
          <div
            className="flex items-center gap-1.5 text-sm text-slate-500 pl-8"
            style={{ fontFamily: RB }}
          >
            <span>Dashboard</span>
            <ChevronRight size={14} className="text-slate-300" />
            <button
              onClick={onBack}
              className="hover:text-[#0D47A1] transition-colors"
            >
              Patients
            </button>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Medical History</span>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search history..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <select className="w-full appearance-none pl-9 pr-8 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-slate-700 outline-none focus:border-[#0D47A1] transition-colors">
                <option value="">All Dates</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>Last 1 Year</option>
              </select>
              <Calendar
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
            <div className="relative w-full md:w-auto">
              <select className="w-full appearance-none pl-9 pr-8 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-slate-700 outline-none focus:border-[#0D47A1] transition-colors">
                <option value="">All Doctors</option>
                <option>Dr. Arjun Mehta</option>
                <option>Dr. Priya Sharma</option>
              </select>
              <UserCheck
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Download size={15} />
              Export
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 md:pl-8 space-y-8 pb-8">
          {/* Vertical Line */}
          <div className="absolute top-4 bottom-0 left-[35px] md:left-[43px] w-px bg-gray-200 -z-10" />

          {historyData.map((visit) => (
            <div key={visit.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-6 md:-left-8 top-5 w-4 h-4 rounded-full bg-[#0D47A1] ring-4 ring-[#F1F5F9] shadow-sm" />

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Visit Header */}
                <div className="px-6 py-4 border-b border-gray-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#111827]">
                        {visit.date}
                      </span>
                      <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Clock size={12} /> {visit.time}
                      </span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 hidden md:block" />
                    <div>
                      <div className="text-sm font-semibold text-[#0D47A1]">
                        {visit.department}
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Stethoscope size={12} /> {visit.doctor}
                      </span>
                    </div>
                  </div>
                  <div className="font-mono text-xs font-medium text-slate-400 bg-white px-2.5 py-1 rounded-md border border-gray-100 self-start md:self-auto">
                    {visit.id}
                  </div>
                </div>

                {/* Visit Content */}
                <div className="p-6 space-y-5">
                  {/* Diagnosis */}
                  <div>
                    <h4
                      className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2"
                      style={{ fontFamily: PP }}
                    >
                      <Activity size={14} className="text-[#009688]" />{" "}
                      Diagnosis
                    </h4>
                    <div className="text-sm font-semibold text-[#111827] bg-[#009688]/10 text-[#009688] px-3 py-1.5 rounded-lg inline-block">
                      {visit.diagnosis}
                    </div>
                  </div>

                  {/* Doctor Notes */}
                  <div>
                    <h4
                      className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2"
                      style={{ fontFamily: PP }}
                    >
                      <FileText size={14} className="text-[#0D47A1]" /> Clinical
                      Notes
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-gray-100">
                      {visit.notes}
                    </p>
                  </div>

                  {/* Prescriptions */}
                  <div>
                    <h4
                      className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2"
                      style={{ fontFamily: PP }}
                    >
                      <Pill size={14} className="text-[#9C27B0]" />{" "}
                      Prescriptions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {visit.prescriptions.map((med, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-slate-700 shadow-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#9C27B0]" />
                          {med}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}