import { useState, useEffect, useRef } from "react";
import {
  Search,
  FileText,
  Pill,
  Calendar,
  RefreshCw,
  Eye,
  Download,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "../../auth/store/auth.store";
import { appointmentsApi } from "../../appointments/api/appointments.api";
import { PP, RB } from "../constants/doctors.constants";

type MedicalTab = "visits" | "prescriptions";

type MedicalRecordRow = {
  id?: number | string;
  patientName?: string;
  mrn?: string;
  appointmentDate?: string;
  date?: string;
  complaint?: string;
};

export function DoctorMedicalRecordsScreen() {
  const { user } = useAuthStore();
  const doctorId = user?.doctorId || user?.doctorProfile?.doctorId;
  const [activeTab, setActiveTab] = useState<MedicalTab>("visits");
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<MedicalRecordRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const doctorIdRef = useRef(doctorId);

  const [prevDoctorId, setPrevDoctorId] = useState<number | string | undefined>(
    undefined,
  );
  if (doctorId !== prevDoctorId) {
    setPrevDoctorId(doctorId);
    setIsLoading(Boolean(doctorId));
  }

  const fetchRecords = async () => {
    const id = doctorIdRef.current;
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await appointmentsApi.getAppointments({
        doctorId: id as number,
        size: 100,
        status: "COMPLETED",
      });
      const raw = (res.data || res) as
        unknown[] | { content?: unknown[]; items?: unknown[] };
      const appointments = Array.isArray(raw)
        ? raw
        : (raw.content ?? raw.items ?? []);
      setRecords(appointments as MedicalRecordRow[]);
    } catch {
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    doctorIdRef.current = doctorId;
    if (!doctorId) return;
    let cancelled = false;

    appointmentsApi
      .getAppointments({
        doctorId: doctorId as number,
        size: 100,
        status: "COMPLETED",
      })
      .then((res) => {
        if (cancelled) return;
        const raw = (res.data || res) as
          unknown[] | { content?: unknown[]; items?: unknown[] };
        const appointments = Array.isArray(raw)
          ? raw
          : (raw.content ?? raw.items ?? []);
        setRecords(appointments as MedicalRecordRow[]);
      })
      .catch(() => {
        if (!cancelled) setRecords([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doctorId]);

  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      (r.patientName || "").toLowerCase().includes(q) ||
      (r.mrn || "").toLowerCase().includes(q) ||
      (r.complaint || "").toLowerCase().includes(q)
    );
  });

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Medical Records
        </h1>
        <p className="text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
          View consultation history and prescriptions for your patients.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-1">
            {[
              { id: "visits", label: "Visits", Icon: Calendar },
              { id: "prescriptions", label: "Prescriptions", Icon: Pill },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as MedicalTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#0D47A1] text-white shadow-sm"
                    : "text-[#64748B] hover:bg-slate-50"
                }`}
                style={{ fontFamily: PP }}
              >
                <tab.Icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchRecords}
              title="Refresh Records"
              className="p-2 rounded-xl border border-gray-100 bg-slate-50 hover:bg-slate-100 text-[#0D47A1] transition-colors"
            >
              <RefreshCw size={16} />
            </button>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input aria-label="Search records..."
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm bg-slate-50 border border-gray-100 rounded-xl text-[#111827] placeholder-slate-400 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw size={20} className="animate-spin text-[#0D47A1]" />
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-[#64748B]" style={{ fontFamily: RB }}>
                No records found.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <div
                  key={record.id || record.mrn}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-[#E5E7EB] hover:bg-white hover:shadow-sm transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activeTab === "visits"
                          ? "bg-blue-50 text-[#0D47A1]"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {activeTab === "visits" ? (
                        <Calendar size={18} />
                      ) : (
                        <Pill size={18} />
                      )}
                    </div>
                    <div>
                      <div
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        {record.patientName || "Unknown Patient"}
                      </div>
                      <div
                        className="text-xs text-[#64748B]"
                        style={{ fontFamily: RB }}
                      >
                        {record.mrn || ""} ·{" "}
                        {record.appointmentDate || record.date || "N/A"}
                      </div>
                      {record.complaint && (
                        <div
                          className="text-xs text-[#64748B] mt-0.5 line-clamp-1"
                          style={{ fontFamily: RB }}
                        >
                          {record.complaint}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button aria-label="View details"
                      onClick={() => triggerToast("Opening record details...")}
                      className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
                    >
                      <Eye size={16} />
                    </button>
                    <button aria-label="Download"
                      onClick={() => triggerToast("Downloading record...")}
                      className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 transition-transform duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#66BB6A] shrink-0" />
          <span className="text-xs font-semibold" style={{ fontFamily: PP }}>
            {toastMsg}
          </span>
        </div>
      )}
    </div>
  );
}
