import { useState, useEffect, useRef } from "react";
import {
  Search,
  User,
  ChevronRight,
  Calendar,
  Pill,
  Activity,
  RefreshCw,
  X,
} from "lucide-react";
import { useAuthStore } from "../../auth";
import { appointmentsApi } from "../../appointments/api/appointments.api";
import { PP, RB } from "../constants/doctors.constants";

type PatientTab = "overview" | "visits" | "prescriptions" | "vitals";

type PatientRow = {
  id: string;
  name: string;
  mrn: string;
  gender: string;
  age: number;
  mobile: string;
  lastVisit: string;
  visits: number;
};

type RawAppointment = {
  id?: string | number;
  patientId?: string | number;
  mrn?: string;
  date?: string;
  appointmentDate?: string;
  patientName?: string;
  gender?: string;
  age?: number;
  patient?: {
    fullName?: string;
    mrn?: string;
    gender?: string;
    age?: number;
    mobileNumber?: string;
    mobile?: string;
  };
};

export function DoctorPatientsScreen() {
  const { user } = useAuthStore();
  const doctorId = user?.doctorId || user?.doctorProfile?.doctorId;
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientRow | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<PatientTab>("overview");
  const [isLoading, setIsLoading] = useState(false);

  const doctorIdRef = useRef(doctorId);

  const [prevDoctorId, setPrevDoctorId] = useState<number | string | undefined>(
    undefined,
  );
  if (doctorId !== prevDoctorId) {
    setPrevDoctorId(doctorId);
    setIsLoading(Boolean(doctorId));
  }

  const processAppointments = (raw: unknown) => {
    const appointments = Array.isArray(raw)
      ? raw
      : ((raw as { content?: unknown[]; items?: unknown[] }).content ??
        (raw as { content?: unknown[]; items?: unknown[] }).items ??
        []);
    const patientMap = new Map<string, PatientRow>();
    (appointments as RawAppointment[]).forEach((apt) => {
      const pid = String(apt.patientId ?? apt.mrn ?? apt.id ?? Math.random());
      const existing = patientMap.get(pid);
      const visitDate = apt.appointmentDate || apt.date || "";
      if (existing) {
        if (visitDate > existing.lastVisit) {
          existing.lastVisit = visitDate;
        }
        existing.visits += 1;
      } else {
        patientMap.set(pid, {
          id: pid,
          name: apt.patientName || apt.patient?.fullName || "Unknown",
          mrn: apt.mrn || apt.patient?.mrn || "",
          gender: apt.patient?.gender || apt.gender || "",
          age: apt.patient?.age || apt.age || 0,
          mobile: apt.patient?.mobileNumber || apt.patient?.mobile || "",
          lastVisit: visitDate,
          visits: 1,
        });
      }
    });
    return Array.from(patientMap.values());
  };

  const fetchPatients = async () => {
    const id = doctorIdRef.current;
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await appointmentsApi.getAppointments({
        doctorId: id as number,
        size: 100,
      });
      const raw = res.data || res;
      setPatients(processAppointments(raw));
    } catch {
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    doctorIdRef.current = doctorId;
    if (!doctorId) return;
    let cancelled = false;

    appointmentsApi
      .getAppointments({ doctorId: doctorId as number, size: 100 })
      .then((res) => {
        if (!cancelled) setPatients(processAppointments(res.data || res));
      })
      .catch(() => {
        if (!cancelled) setPatients([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doctorId]);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Patient Details
        </h1>
        <p className="text-sm text-[#64748B] mt-0.5" style={{ fontFamily: RB }}>
          View patient profiles, history, and records under your care.
        </p>
      </div>

      {!selectedPatient ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div className="p-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <button
                onClick={fetchPatients}
                title="Refresh Patients"
                className="p-2.5 rounded-xl border border-gray-100 bg-slate-50 hover:bg-slate-100 text-[#0D47A1] transition-colors"
              >
                <RefreshCw size={16} />
              </button>
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search patients by name or MRN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-gray-100 rounded-xl text-[#111827] placeholder-slate-400 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw size={20} className="animate-spin text-[#0D47A1]" />
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <User size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-[#64748B]" style={{ fontFamily: RB }}>
                No patients found.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E7EB]">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setActiveTab("overview");
                  }}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-sm">
                      {patient.name[0]}
                    </div>
                    <div>
                      <div
                        className="text-sm font-bold text-[#111827]"
                        style={{ fontFamily: PP }}
                      >
                        {patient.name}
                      </div>
                      <div
                        className="text-xs text-[#64748B] font-mono"
                        style={{ fontFamily: RB }}
                      >
                        {patient.mrn} · {patient.gender} · {patient.age} yrs
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#64748B]">
                      {patient.visits} visits
                    </span>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div className="p-6 border-b border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-lg">
                  {selectedPatient.name[0]}
                </div>
                <div>
                  <h2
                    className="text-lg font-bold text-[#111827]"
                    style={{ fontFamily: PP }}
                  >
                    {selectedPatient.name}
                  </h2>
                  <div
                    className="text-xs text-[#64748B] font-mono"
                    style={{ fontFamily: RB }}
                  >
                    {selectedPatient.mrn} · {selectedPatient.gender} ·{" "}
                    {selectedPatient.age} yrs
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 rounded-xl hover:bg-slate-50 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 p-2 border-b border-[#E5E7EB]">
            {[
              { id: "overview", label: "Overview", Icon: User },
              { id: "visits", label: "Visits", Icon: Calendar },
              { id: "prescriptions", label: "Prescriptions", Icon: Pill },
              { id: "vitals", label: "Vitals", Icon: Activity },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PatientTab)}
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

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div
                    className="text-xs font-semibold text-[#64748B] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Mobile Number
                  </div>
                  <div
                    className="text-sm text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    {selectedPatient.mobile || "N/A"}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div
                    className="text-xs font-semibold text-[#64748B] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Last Visit
                  </div>
                  <div
                    className="text-sm text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    {selectedPatient.lastVisit
                      ? new Date(selectedPatient.lastVisit).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div
                    className="text-xs font-semibold text-[#64748B] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Total Visits
                  </div>
                  <div
                    className="text-sm text-[#111827]"
                    style={{ fontFamily: RB }}
                  >
                    {selectedPatient.visits}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div
                    className="text-xs font-semibold text-[#64748B] mb-1"
                    style={{ fontFamily: PP }}
                  >
                    Status
                  </div>
                  <div
                    className="text-sm text-emerald-700 font-semibold"
                    style={{ fontFamily: PP }}
                  >
                    Active
                  </div>
                </div>
              </div>
            )}
            {activeTab === "visits" && (
              <div className="text-center py-8">
                <Calendar size={32} className="mx-auto text-slate-300 mb-2" />
                <p
                  className="text-sm text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Visit history will appear here.
                </p>
              </div>
            )}
            {activeTab === "prescriptions" && (
              <div className="text-center py-8">
                <Pill size={32} className="mx-auto text-slate-300 mb-2" />
                <p
                  className="text-sm text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Prescriptions will appear here.
                </p>
              </div>
            )}
            {activeTab === "vitals" && (
              <div className="text-center py-8">
                <Activity size={32} className="mx-auto text-slate-300 mb-2" />
                <p
                  className="text-sm text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Vitals will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
