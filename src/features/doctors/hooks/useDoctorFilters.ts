import { useState, useMemo } from "react";
import type { DoctorRecord } from "../types/doctors.types";

export function useDoctorFilters(doctors: DoctorRecord[]) {
  const [searchDoctorQuery, setSearchDoctorQuery] = useState("");
  const [searchEmpIdQuery, setSearchEmpIdQuery] = useState("");
  const [searchRegNoQuery, setSearchRegNoQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [sortColumn, setSortColumn] = useState<keyof DoctorRecord>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        if (searchDoctorQuery) {
          const q = searchDoctorQuery.toLowerCase();
          if (!doc.name.toLowerCase().includes(q) && !doc.id.toLowerCase().includes(q)) return false;
        }
        if (searchEmpIdQuery) {
          if (!doc.empId.toLowerCase().includes(searchEmpIdQuery.toLowerCase())) return false;
        }
        if (searchRegNoQuery) {
          if (!doc.regNumber.toLowerCase().includes(searchRegNoQuery.toLowerCase())) return false;
        }
        if (deptFilter !== "All" && doc.department !== deptFilter) return false;
        if (specialtyFilter !== "All" && doc.specialty !== specialtyFilter) return false;
        if (availabilityFilter !== "All" && doc.availability !== availabilityFilter) return false;
        if (statusFilter !== "All" && doc.status !== statusFilter) return false;
        if (experienceFilter !== "All") {
          if (experienceFilter === "0-5 Years" && doc.experienceYrs > 5) return false;
          if (experienceFilter === "5-10 Years" && (doc.experienceYrs < 5 || doc.experienceYrs > 10)) return false;
          if (experienceFilter === "10-15 Years" && (doc.experienceYrs < 10 || doc.experienceYrs > 15)) return false;
          if (experienceFilter === "15+ Years" && doc.experienceYrs < 15) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }
        const strA = Array.isArray(valA) ? valA.join(", ") : String(valA ?? "").toLowerCase();
        const strB = Array.isArray(valB) ? valB.join(", ") : String(valB ?? "").toLowerCase();
        if (strA < strB) return sortDirection === "asc" ? -1 : 1;
        if (strA > strB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [doctors, searchDoctorQuery, searchEmpIdQuery, searchRegNoQuery, deptFilter, specialtyFilter, availabilityFilter, statusFilter, experienceFilter, sortColumn, sortDirection]);

  const handleSort = (col: keyof DoctorRecord) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  const resetFilters = () => {
    setSearchDoctorQuery("");
    setSearchEmpIdQuery("");
    setSearchRegNoQuery("");
    setDeptFilter("All");
    setSpecialtyFilter("All");
    setAvailabilityFilter("All");
    setStatusFilter("All");
    setExperienceFilter("All");
  };

  return {
    searchDoctorQuery, setSearchDoctorQuery,
    searchEmpIdQuery, setSearchEmpIdQuery,
    searchRegNoQuery, setSearchRegNoQuery,
    deptFilter, setDeptFilter,
    specialtyFilter, setSpecialtyFilter,
    availabilityFilter, setAvailabilityFilter,
    statusFilter, setStatusFilter,
    experienceFilter, setExperienceFilter,
    sortColumn, sortDirection,
    filteredDoctors, handleSort, resetFilters,
  };
}
