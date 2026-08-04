import { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";
import type { DoctorRecord } from "../types/doctors.types";
import { PP, RB } from "../constants/doctors.constants";
import { doctorsService } from "../services/doctors.service";
import { DoctorProfilePage } from "./DoctorProfilePage";

export function DoctorDirectoryPage() {
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<DoctorRecord | null>(
    null,
  );

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await doctorsService.getAll();
      setDoctors(response.items);
    } catch (err) {
      console.warn("Failed to fetch doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (viewingProfile) {
    return (
      <DoctorProfilePage
        doctorId={viewingProfile.id}
        doctor={viewingProfile}
        currentRole="PATIENT"
        onBack={() => setViewingProfile(null)}
      />
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-xl font-bold text-[#111827]"
            style={{ fontFamily: PP }}
          >
            Doctor Directory
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Find a doctor by department, specialty, or name.
          </p>
        </div>
        <button
          onClick={fetchDoctors}
          className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-slate-600 hover:text-[#0D47A1] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw
            size={13}
            className={loading ? "animate-spin text-[#0D47A1]" : ""}
          />
          <span>{loading ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search doctors..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1]"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-slate-200 rounded w-24" />
                  <div className="h-2 bg-slate-100 rounded w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setViewingProfile(doc)}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                  {doc.name
                    .replace("Dr. ", "")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#111827]">
                    {doc.name}
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {doc.department}
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Specialty</span>
                  <span className="font-medium text-[#111827]">
                    {doc.specialty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Qualification</span>
                  <span className="font-medium text-[#111827]">
                    {doc.qualification}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Experience</span>
                  <span className="font-medium text-[#111827]">
                    {doc.experienceYrs} yrs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Consultation Fee</span>
                  <span className="font-bold text-[#0D47A1]">
                    ${doc.consultationFee}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
