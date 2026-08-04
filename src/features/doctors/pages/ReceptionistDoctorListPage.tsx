import { useState, useEffect } from "react";
import {RefreshCw, Eye } from "lucide-react";
import type { DoctorRecord } from "../types/doctors.types";
import { PP, RB } from "../constants/doctors.constants";
import { doctorsService } from "../services/doctors.service";
import { useDoctorFilters } from "../hooks/useDoctorFilters";
import { DoctorFilterBar } from "../components/DoctorFilterBar";
import { DoctorProfilePage } from "./DoctorProfilePage";

export function ReceptionistDoctorListPage() {
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorRecord | null>(null);

  const {
    searchDoctorQuery,
    setSearchDoctorQuery,
    searchEmpIdQuery,
    setSearchEmpIdQuery,
    searchRegNoQuery,
    setSearchRegNoQuery,
    deptFilter,
    setDeptFilter,
    specialtyFilter,
    setSpecialtyFilter,
    availabilityFilter,
    setAvailabilityFilter,
    statusFilter,
    setStatusFilter,
    experienceFilter,
    setExperienceFilter,
    filteredDoctors,
    resetFilters,
  } = useDoctorFilters(doctors);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await doctorsService.getAll();
      const overrides = JSON.parse(localStorage.getItem("doctor_status_overrides") || "{}");
      const updated = res.items.map((r: DoctorRecord) => {
        if (overrides[r.id]) {
          return {
            ...r,
            status: overrides[r.id].status,
            availability: overrides[r.id].availability,
          };
        }
        return r;
      });
      setDoctors(updated);
    } catch (err) {
      console.error("Failed to load doctors for receptionist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (selectedDoctor) {
    return (
      <DoctorProfilePage
        doctorId={selectedDoctor.id}
        doctor={selectedDoctor}
        currentRole="RECEPTIONIST"
        onBack={() => setSelectedDoctor(null)}
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
            Doctor Management
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            View doctor profiles, schedules, daily availability, and appointment status.
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

      <DoctorFilterBar
        searchDoctorQuery={searchDoctorQuery}
        setSearchDoctorQuery={setSearchDoctorQuery}
        searchEmpIdQuery={searchEmpIdQuery}
        setSearchEmpIdQuery={setSearchEmpIdQuery}
        searchRegNoQuery={searchRegNoQuery}
        setSearchRegNoQuery={setSearchRegNoQuery}
        deptFilter={deptFilter}
        setDeptFilter={setDeptFilter}
        specialtyFilter={specialtyFilter}
        setSpecialtyFilter={setSpecialtyFilter}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        experienceFilter={experienceFilter}
        setExperienceFilter={setExperienceFilter}
        onResetFilters={resetFilters}
      />

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#111827]">
            <thead className="bg-slate-50 border-b border-[#E5E7EB] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Doctor Name</th>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Specialty</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#64748B]">
                    Loading doctors...
                  </td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#64748B]">
                    No doctors found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#111827]">{doc.name}</td>
                    <td className="px-4 py-3 text-[#64748B]">{doc.empId}</td>
                    <td className="px-4 py-3">{doc.department}</td>
                    <td className="px-4 py-3">{doc.specialty}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          doc.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedDoctor(doc)}
                        className="px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a] transition-colors inline-flex items-center gap-1"
                      >
                        <Eye size={12} /> View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
