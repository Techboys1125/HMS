import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Building,
  Plus,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit2,
  Stethoscope,
  Network,
  BarChart2,
  X,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  departmentsApi,
  type ApiDepartment,
  type ApiSpecialtyItem,
  type DepartmentSpecialtiesPageResponse,
} from "../api/departments.api";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface Department {
  id: string;
  code: string;
  name: string;
  specialty: string;
  specialtyCount: number;
  doctorsCount: number;
  status: "Active" | "Inactive";
  lastUpdated: string;
  description: string;
  createdDate: string;
  rawSpecialties?: ApiSpecialtyItem[];
  active: boolean;
}

const mapApiToDepartment = (d: ApiDepartment, index: number): Department => {
  const deptId = String(d.departmentId || d.id || index + 1);
  const deptName = d.departmentName || d.name || "Department";
  const deptCode =
    d.departmentCode ||
    d.code ||
    `DEP-${deptName.substring(0, 4).toUpperCase()}-0${index + 1}`;
  const specsList = d.specialties
    ?.flatMap((s) => (s.name ? [s.name] : []))
    .join(", ");
  const isActive =
    d.active !== undefined
      ? d.active
      : d.status !== "INACTIVE" && d.status !== "Inactive";

  return {
    id: deptId,
    code: deptCode,
    name: deptName,
    specialty: specsList || d.description || "General Specialty",
    specialtyCount: d.specialties?.length || 0,
    doctorsCount: d.doctorCount ?? d.doctorsCount ?? 0,
    status: isActive ? "Active" : "Inactive",
    lastUpdated: d.updatedAt
      ? new Date(d.updatedAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Recently updated",
    description: d.description || `${deptName} clinical unit.`,
    createdDate: d.createdDate || d.createdAt?.split("T")[0] || "2024",
    rawSpecialties: d.specialties || [],
    active: isActive,
  };
};

export function DepartmentsSpecialtiesWorkspace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Form State for Add
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");
  const newDeptDescription = useRef("");
  const [newDeptSpecialties, setNewDeptSpecialties] = useState<string[]>([]);
  const [newSpecialtyInput, setNewSpecialtyInput] = useState("");
  const [editSpecialtyInput, setEditSpecialtyInput] = useState("");

  // Confirmation modal for doctor-assigned deletion
  const [showDoctorAssignedModal, setShowDoctorAssignedModal] = useState(false);
  const [doctorAssignedDeptName, setDoctorAssignedDeptName] = useState("");

  const [departments, setDepartments] = useState<Department[]>([]);

  // Toast State
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadDepartments = useCallback(async () => {
    try {
      const activeOnly =
        selectedStatusFilter === "Active"
          ? true
          : selectedStatusFilter === "Inactive"
            ? false
            : undefined;
      const response: DepartmentSpecialtiesPageResponse =
        await departmentsApi.getDepartments({
          search: debouncedSearchTerm || undefined,
          activeOnly,
          page: currentPage,
          size: pageSize,
        });
      if (response.content && response.content.length > 0) {
        const mapped: Department[] = response.content.map((d, index) =>
          mapApiToDepartment(d, index),
        );
        setDepartments(mapped);
        setTotalElements(response.totalElements || 0);
        setTotalPages(response.totalPages || 0);
      } else {
        setDepartments([]);
        setTotalElements(0);
        setTotalPages(0);
      }
    } catch (err) {
      console.warn("Failed to load departments from API:", err);
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, selectedStatusFilter, currentPage, pageSize]);

  // Debounce search input
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0);
    }, 400);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchTerm]);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const activeOnly =
          selectedStatusFilter === "Active"
            ? true
            : selectedStatusFilter === "Inactive"
              ? false
              : undefined;
        const response: DepartmentSpecialtiesPageResponse =
          await departmentsApi.getDepartments({
            search: debouncedSearchTerm || undefined,
            activeOnly,
            page: currentPage,
            size: pageSize,
          });
        if (cancelled) return;
        if (response.content && response.content.length > 0) {
          const mapped: Department[] = response.content.map((d, index) =>
            mapApiToDepartment(d, index),
          );
          setDepartments(mapped);
          setTotalElements(response.totalElements || 0);
          setTotalPages(response.totalPages || 0);
        } else {
          setDepartments([]);
          setTotalElements(0);
          setTotalPages(0);
        }
      } catch (err) {
        console.warn("Failed to load departments from API:", err);
        if (!cancelled) setDepartments([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearchTerm, selectedStatusFilter, currentPage, pageSize]);

  const handleCreateDepartment = async () => {
    if (!newDeptName.trim()) {
      triggerToast("Department name is required.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const cleanDeptCode = (newDeptCode || `DEP_${newDeptName}`)
        .replace(/[^a-zA-Z0-9_]/g, "_")
        .toUpperCase();

      const payload: Partial<ApiDepartment> = {
        departmentName: newDeptName,
        departmentCode: cleanDeptCode,
        description:
          newDeptDescription.current ||
          (newDeptSpecialties.length > 0 ? newDeptSpecialties.join(", ") : ""),
        active: true,
        specialties: newDeptSpecialties.map((spec, idx) => ({
          name: spec,
          code: `${cleanDeptCode}_SPEC_${idx + 1}`,
          description: `${spec} Specialty`,
          active: true,
        })),
      };
      await departmentsApi.createDepartment(payload);
      triggerToast(
        `Department "${newDeptName}" created successfully!`,
        "success",
      );
      setIsAddModalOpen(false);
      setNewDeptName("");
      setNewDeptCode("");
      setNewDeptSpecialties([]);
      setNewSpecialtyInput("");
      newDeptDescription.current = "";
      setIsLoading(true);
      loadDepartments();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create department";
      triggerToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDepartment = async () => {
    if (!selectedDept) return;
    setIsSubmitting(true);
    try {
      const payload: Partial<ApiDepartment> = {
        departmentName: selectedDept.name,
        departmentCode: selectedDept.code,
        description: selectedDept.description,
        active: selectedDept.status === "Active",
        specialties: (selectedDept.rawSpecialties || []).map(
          (s: ApiSpecialtyItem, idx: number) => ({
            id: s.id,
            name: s.name,
            code: s.code || `${selectedDept.code}_SPEC_${idx + 1}`,
            description: s.description || `${s.name} Specialty`,
            active: s.active !== undefined ? s.active : true,
          }),
        ),
      };
      await departmentsApi.updateDepartment(selectedDept.id, payload);
      triggerToast(
        `Department "${selectedDept.name}" updated successfully!`,
        "success",
      );
      setIsEditMode(false);
      setIsLoading(true);
      loadDepartments();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update department";
      triggerToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (dept: Department) => {
    const newActive = !dept.active;
    const action = newActive ? "Activate" : "Deactivate";
    if (
      !window.confirm(
        `Are you sure you want to ${action} department "${dept.name}"?`,
      )
    )
      return;
    setIsSubmitting(true);
    try {
      const payload: Partial<ApiDepartment> = {
        departmentName: dept.name,
        departmentCode: dept.code,
        description: dept.description,
        active: newActive,
        specialties: (dept.rawSpecialties || []).map(
          (s: ApiSpecialtyItem, idx: number) => ({
            id: s.id,
            name: s.name,
            code: s.code || `${dept.code}_SPEC_${idx + 1}`,
            description: s.description || `${s.name} Specialty`,
            active: s.active !== undefined ? s.active : true,
          }),
        ),
      };
      await departmentsApi.updateDepartment(dept.id, payload);
      triggerToast(
        `Department "${dept.name}" ${action.toLowerCase()}d successfully!`,
        "success",
      );
      setIsLoading(true);
      loadDepartments();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : `Failed to ${action.toLowerCase()} department`;
      triggerToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDepartment = async (dept: Department) => {
    if (dept.doctorsCount > 0) {
      setDoctorAssignedDeptName(dept.name);
      setShowDoctorAssignedModal(true);
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete department "${dept.name}"?`,
      )
    )
      return;
    setIsSubmitting(true);
    try {
      await departmentsApi.deleteDepartment(dept.id);
      triggerToast(
        `Department "${dept.name}" deleted successfully!`,
        "success",
      );
      if (selectedDept?.id === dept.id) setSelectedDept(null);
      setIsLoading(true);
      loadDepartments();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete department";
      triggerToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic Specialties computed from real API data
  const specialties = useMemo(() => {
    const list: {
      name: string;
      doctors: number;
      department: string;
      icon: LucideIcon;
      color: string;
    }[] = [];
    const colors = [
      "#EF4444",
      "#F59E0B",
      "#0D47A1",
      "#009688",
      "#9C27B0",
      "#4DB6AC",
      "#E91E63",
      "#607D8B",
    ];

    departments.forEach((dept, deptIdx) => {
      const rawSpecs = dept.rawSpecialties || [];
      if (rawSpecs.length > 0) {
        rawSpecs.forEach((spec: ApiSpecialtyItem, specIdx: number) => {
          list.push({
            name: spec.name || "Specialty",
            doctors: dept.doctorsCount
              ? Math.max(1, Math.round(dept.doctorsCount / rawSpecs.length))
              : 3,
            department: dept.name,
            icon: Stethoscope,
            color: colors[(deptIdx + specIdx) % colors.length],
          });
        });
      } else if (dept.specialty && dept.specialty !== "General Specialty") {
        // Fallback for comma separated specialties list
        const parts = dept.specialty
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        parts.forEach((part, partIdx) => {
          list.push({
            name: part,
            doctors: dept.doctorsCount
              ? Math.max(1, Math.round(dept.doctorsCount / parts.length))
              : 3,
            department: dept.name,
            icon: Stethoscope,
            color: colors[(deptIdx + partIdx) % colors.length],
          });
        });
      }
    });
    return list;
  }, [departments]);

  // Dynamic filter lists
  const availableSpecialtyOptions = useMemo(() => {
    const names = Array.from(new Set(specialties.map((s) => s.name)));
    return names;
  }, [specialties]);

  // KPI calculations
  const totalDepts = departments.length;
  const activeDepts = departments.filter((d) => d.status === "Active").length;
  const inactiveDepts = totalDepts - activeDepts;
  const totalSpecialties = specialties.length;

  // Filter Logic
  // Server-side filtering is handled by the API - departments state is already filtered
  const filteredDepartments = departments;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* ─── SECTION: SUB-HEADER ACTIONS ───────────────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: PP,
              fontSize: "18px",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
            }}
          >
            Departments & Specialties Management
          </h2>
          <p
            style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0 0" }}
          >
            Manage medical departments, specialty consultation units, doctor
            allocations, and hospital organizational hierarchy.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => {
              setIsLoading(true);
              loadDepartments();
            }}
            disabled={isLoading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              background: "#FFFFFF",
              color: "#64748B",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              background: "#0D47A1",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(13,71,161,0.2)",
            }}
          >
            <Plus size={14} /> Add Department
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in ${
            toast.type === "error" ? "bg-[#EF4444]" : "bg-[#111827]"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={16} className="text-white" />
          ) : (
            <CheckCircle2 size={16} className="text-[#66BB6A]" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ─── TOP KPI CARDS (4 CARDS) ──────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
            >
              Total Departments
            </span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#E3F2FD",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building size={18} style={{ color: "#0D47A1" }} />
            </div>
          </div>
          <div
            style={{
              fontFamily: PP,
              fontSize: "24px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            {totalDepts}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "6px",
            }}
          >
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>
              Hospital Units
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#2E7D32",
                background: "#E8F5E9",
                padding: "1px 6px",
                borderRadius: "4px",
              }}
            >
              Active Sys
            </span>
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
            >
              Medical Specialties
            </span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#E0F2F1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stethoscope size={18} style={{ color: "#009688" }} />
            </div>
          </div>
          <div
            style={{
              fontFamily: PP,
              fontSize: "24px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            {totalSpecialties}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "6px",
            }}
          >
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>
              Specialized Care
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#009688",
                background: "#E0F2F1",
                padding: "1px 6px",
                borderRadius: "4px",
              }}
            >
              100% Dynamic
            </span>
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
            >
              Active Departments
            </span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#E8F5E9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle2 size={18} style={{ color: "#2E7D32" }} />
            </div>
          </div>
          <div
            style={{
              fontFamily: PP,
              fontSize: "24px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            {activeDepts}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "6px",
            }}
          >
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>
              Operational OPDs
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#2E7D32",
                background: "#E8F5E9",
                padding: "1px 6px",
                borderRadius: "4px",
              }}
            >
              Optimal
            </span>
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
            >
              Inactive Departments
            </span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#FEF3C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertCircle size={18} style={{ color: "#B45309" }} />
            </div>
          </div>
          <div
            style={{
              fontFamily: PP,
              fontSize: "24px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            {inactiveDepts}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "6px",
            }}
          >
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>
              Offline / Pending
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#B45309",
                background: "#FEF3C7",
                padding: "1px 6px",
                borderRadius: "4px",
              }}
            >
              Reviewing
            </span>
          </div>
        </div>
      </div>

      {/* ─── SEARCH & FILTER BAR ─────────────────────────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          padding: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "240px", position: "relative" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94A3B8",
            }}
          />
          <input
            aria-label="Search by department name or code..."
            type="text"
            placeholder="Search by department name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px 9px 36px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
              fontFamily: RB,
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <select
            aria-label="Select option"
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            style={{
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              background: "#FFFFFF",
              color: "#374151",
            }}
          >
            <option value="All">All Specialties</option>
            {availableSpecialtyOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select
            aria-label="Select option"
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            style={{
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              background: "#FFFFFF",
              color: "#374151",
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedTypeFilter("All");
              setSelectedStatusFilter("All");
            }}
            style={{
              padding: "9px 14px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              background: "#F8FAFC",
              color: "#64748B",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT SECTIONS ───────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "20px",
        }}
      >
        {/* SECTION 01: DEPARTMENTS DATA TABLE */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                fontFamily: PP,
                fontSize: "15px",
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              Hospital Departments Roster ({filteredDepartments.length})
            </h3>
            <span style={{ fontSize: "12px", color: "#64748B" }}>
              Real-time Unit Sync
            </span>
          </div>

          {filteredDepartments.length === 0 ? (
            <div style={{ padding: "48px 20px", textAlign: "center" }}>
              <Building
                size={48}
                style={{ color: "#94A3B8", marginBottom: "12px" }}
              />
              <h4
                style={{
                  fontFamily: PP,
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: "0 0 6px 0",
                }}
              >
                No departments configured
              </h4>
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748B",
                  margin: "0 0 16px 0",
                }}
              >
                Click "Add Department" to create your first hospital department
                unit.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#0D47A1",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                + Add Department
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  fontSize: "13px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#F8FAFC",
                      borderBottom: "1px solid #E5E7EB",
                      color: "#475569",
                      fontWeight: 600,
                    }}
                  >
                    <th style={{ padding: "12px 16px" }}>Department Name</th>
                    <th style={{ padding: "12px 16px" }}>Code</th>
                    <th style={{ padding: "12px 16px" }}>Description</th>
                    <th style={{ padding: "12px 16px" }}>Specialties</th>
                    <th style={{ padding: "12px 16px" }}>Status</th>
                    <th style={{ padding: "12px 16px" }}>Updated At</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((dept) => (
                    <tr
                      key={dept.id}
                      style={{
                        borderBottom: "1px solid #F1F5F9",
                        transition: "background 0.15s ease",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: 700,
                          color: "#0D47A1",
                        }}
                      >
                        <div>{dept.name}</div>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontFamily: "monospace",
                          fontSize: "12px",
                          color: "#475569",
                        }}
                      >
                        {dept.code}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#475569",
                          maxWidth: "250px",
                        }}
                      >
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {dept.description}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: "12px",
                            background: "#E0F2FE",
                            color: "#0369A1",
                          }}
                        >
                          {dept.specialtyCount}{" "}
                          {dept.specialtyCount === 1
                            ? "specialty"
                            : "specialties"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: "12px",
                            background:
                              dept.status === "Active" ? "#E8F5E9" : "#FEF3C7",
                            color:
                              dept.status === "Active" ? "#2E7D32" : "#B45309",
                          }}
                        >
                          {dept.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#94A3B8",
                          fontSize: "12px",
                        }}
                      >
                        {dept.lastUpdated}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            onClick={() => setSelectedDept(dept)}
                            title="View Details"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              border: "1px solid #0D47A1",
                              background: "#FFFFFF",
                              color: "#0D47A1",
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <Eye size={13} /> View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDept(dept);
                              setIsEditMode(true);
                            }}
                            title="Edit Department"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              border: "1px solid #009688",
                              background: "#FFFFFF",
                              color: "#009688",
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleToggleActive(dept)}
                            title={dept.active ? "Deactivate" : "Activate"}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              border: `1px solid ${dept.active ? "#F59E0B" : "#66BB6A"}`,
                              background: dept.active ? "#FEF3C7" : "#E8F5E9",
                              color: dept.active ? "#B45309" : "#2E7D32",
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <Shield size={13} />{" "}
                            {dept.active ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDeleteDepartment(dept)}
                            title="Delete Department"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              border: "1px solid #EF4444",
                              background: "#FEF2F2",
                              color: "#EF4444",
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px",
                  borderTop: "1px solid #F1F5F9",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "#64748B",
                    fontFamily: PP,
                  }}
                >
                  Showing {totalElements === 0 ? 0 : currentPage * pageSize + 1}
                  {" – "}
                  {Math.min(
                    (currentPage + 1) * pageSize,
                    totalElements,
                  )} of {totalElements} departments
                </span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB",
                      background: currentPage === 0 ? "#F9FAFB" : "#FFFFFF",
                      color: currentPage === 0 ? "#94A3B8" : "#374151",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: currentPage === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const startPage = Math.max(
                      0,
                      Math.min(currentPage - 2, totalPages - 5),
                    );
                    const pageNum = startPage + i;
                    if (pageNum >= totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: "1px solid",
                          borderColor:
                            pageNum === currentPage ? "#0D47A1" : "#E5E7EB",
                          background:
                            pageNum === currentPage ? "#0D47A1" : "#FFFFFF",
                          color:
                            pageNum === currentPage ? "#FFFFFF" : "#374151",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={currentPage >= totalPages - 1}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB",
                      background:
                        currentPage >= totalPages - 1 ? "#F9FAFB" : "#FFFFFF",
                      color:
                        currentPage >= totalPages - 1 ? "#94A3B8" : "#374151",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor:
                        currentPage >= totalPages - 1
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 02: MEDICAL SPECIALTIES CARDS GRID */}
        {specialties.length > 0 && (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{
                fontFamily: PP,
                fontSize: "16px",
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Stethoscope size={18} style={{ color: "#009688" }} /> Medical
              Specialties Catalog
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "14px",
              }}
            >
              {specialties.map((sp) => {
                const IconC = sp.icon;
                return (
                  <div
                    key={sp.name}
                    style={{
                      background: "#F8FAFC",
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      padding: "14px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "8px",
                            background: "#FFFFFF",
                            border: "1px solid #E2E8F0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconC size={16} style={{ color: sp.color }} />
                        </div>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            background: "#E8F5E9",
                            color: "#2E7D32",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          Active
                        </span>
                      </div>
                      <h4
                        style={{
                          fontFamily: PP,
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#111827",
                          margin: "0 0 4px 0",
                        }}
                      >
                        {sp.name}
                      </h4>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#64748B",
                          margin: 0,
                        }}
                      >
                        Dept: {sp.department}
                      </p>
                    </div>

                    <div
                      style={{
                        marginTop: "12px",
                        paddingTop: "8px",
                        borderTop: "1px solid #E2E8F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#0D47A1",
                        }}
                      >
                        {sp.doctors} Doctors
                      </span>
                      <button
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#0D47A1",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Active Unit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 03: DEPARTMENT HIERARCHY ORG CHART */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontFamily: PP,
              fontSize: "16px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Network size={18} style={{ color: "#0D47A1" }} /> Department
            Organizational Hierarchy
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px",
              background: "#F8FAFC",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
            }}
          >
            <div
              style={{
                background: "#0D47A1",
                color: "#FFFFFF",
                padding: "10px 24px",
                borderRadius: "10px",
                fontWeight: 700,
                fontFamily: PP,
                fontSize: "14px",
                boxShadow: "0 2px 4px rgba(13,71,161,0.2)",
              }}
            >
              🏥 Jude General Hospital Master Facilities Directorate
            </div>
            <div
              style={{ width: "2px", height: "16px", background: "#CBD5E1" }}
            />

            <div
              style={{
                background: "#009688",
                color: "#FFFFFF",
                padding: "8px 20px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              Medical & Clinical Services Directorate
            </div>
            <div
              style={{ width: "2px", height: "16px", background: "#CBD5E1" }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "12px",
                width: "100%",
              }}
            >
              {departments.slice(0, 4).map((d) => (
                <div
                  key={d.id}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #CBD5E1",
                    padding: "10px",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "12px",
                      color: "#111827",
                    }}
                  >
                    {d.name}
                  </div>
                  <div style={{ fontSize: "10px", color: "#64748B" }}>
                    Code: {d.code}
                  </div>
                </div>
              ))}
              {departments.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    width: "100%",
                    color: "#94A3B8",
                    fontSize: "12px",
                    gridColumn: "1/-1",
                  }}
                >
                  Add departments to visualize organization hierarchy nodes.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 04: DEPARTMENT STATISTICS CHARTS */}
        {departments.length > 0 && (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{
                fontFamily: PP,
                fontSize: "16px",
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 16px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <BarChart2 size={18} style={{ color: "#009688" }} /> Department
              Operational Statistics
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "16px",
              }}
            >
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <h4
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#111827",
                    margin: "0 0 12px 0",
                  }}
                >
                  Physician Distribution
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {departments.slice(0, 5).map((d, i) => {
                    const colors = [
                      "#0D47A1",
                      "#EF4444",
                      "#E91E63",
                      "#009688",
                      "#9C27B0",
                    ];
                    const maxVal = Math.max(
                      ...departments.map((x) => x.doctorsCount),
                      1,
                    );
                    return (
                      <div key={d.id}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "11px",
                            marginBottom: "2px",
                          }}
                        >
                          <span>{d.name}</span>
                          <span style={{ fontWeight: 600 }}>
                            {d.doctorsCount} Docs
                          </span>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: "8px",
                            background: "#E2E8F0",
                            borderRadius: "4px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${(d.doctorsCount / maxVal) * 100}%`,
                              height: "100%",
                              background: colors[i % colors.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── SECTION 05: REUSABLE HMS RIGHT DRAWER (VIEW & EDIT MODES) ─────── */}
      {selectedDept && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 100,
            transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              width: "540px",
              height: "100%",
              boxSizing: "border-box",
              boxShadow: "-8px 0 24px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* DRAWER HEADER */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#F8FAFC",
              }}
            >
              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <h3
                    style={{
                      fontFamily: PP,
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {selectedDept.name}
                  </h3>
                  {isEditMode ? (
                    <select
                      aria-label="Select option"
                      value={selectedDept.status}
                      onChange={(e) =>
                        setSelectedDept({
                          ...selectedDept,
                          status: e.target.value as "Active" | "Inactive",
                        })
                      }
                      style={{
                        padding: "2px 8px",
                        borderRadius: "8px",
                        border: "1px solid #CBD5E1",
                        fontSize: "11px",
                        fontWeight: 600,
                        background: "#FFFFFF",
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background:
                          selectedDept.status === "Active"
                            ? "#E8F5E9"
                            : "#FEF3C7",
                        color:
                          selectedDept.status === "Active"
                            ? "#2E7D32"
                            : "#B45309",
                      }}
                    >
                      {selectedDept.status}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#64748B",
                    margin: "4px 0 0 0",
                  }}
                >
                  Code: <strong>{selectedDept.code}</strong>
                </p>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: "1px solid #009688",
                    background: isEditMode ? "#009688" : "#FFFFFF",
                    color: isEditMode ? "#FFFFFF" : "#009688",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition:
                      "background-color 0.2s ease, border-color 0.2s ease",
                  }}
                >
                  <Edit2 size={14} /> {isEditMode ? "Cancel Edit" : "Edit"}
                </button>
                <button
                  aria-label="Edit"
                  onClick={() => {
                    setSelectedDept(null);
                    setIsEditMode(false);
                  }}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#64748B",
                    padding: "4px",
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* DRAWER CONTENT */}
            <div
              style={{
                padding: "24px",
                overflowY: "auto",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Group 1: General Information Card */}
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  padding: "16px",
                }}
              >
                <h4
                  style={{
                    fontFamily: PP,
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#0D47A1",
                    margin: "0 0 12px 0",
                  }}
                >
                  General Information
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    fontSize: "12px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "#64748B",
                        fontSize: "11px",
                        marginBottom: "2px",
                      }}
                    >
                      Department Name
                    </span>
                    {isEditMode ? (
                      <input
                        aria-label="Input field"
                        type="text"
                        value={selectedDept.name}
                        onChange={(e) =>
                          setSelectedDept({
                            ...selectedDept,
                            name: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          border: "1px solid #CBD5E1",
                          fontSize: "12px",
                        }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600, color: "#111827" }}>
                        {selectedDept.name}
                      </span>
                    )}
                  </div>
                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "#64748B",
                        fontSize: "11px",
                        marginBottom: "2px",
                      }}
                    >
                      Medical Specialties
                    </span>
                    {isEditMode ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <div style={{ display: "flex", gap: "6px" }}>
                          <input
                            aria-label="Input field"
                            type="text"
                            value={editSpecialtyInput}
                            onChange={(e) =>
                              setEditSpecialtyInput(e.target.value)
                            }
                            placeholder="Add specialty..."
                            style={{
                              flex: 1,
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid #CBD5E1",
                              fontSize: "11px",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (editSpecialtyInput.trim()) {
                                const newSpecObj = {
                                  name: editSpecialtyInput.trim(),
                                  code: `${selectedDept.code}_SPEC_${Date.now().toString(36).toUpperCase()}`,
                                  description: `${editSpecialtyInput.trim()} Specialty`,
                                  active: true,
                                };
                                setSelectedDept({
                                  ...selectedDept,
                                  rawSpecialties: [
                                    ...(selectedDept.rawSpecialties || []),
                                    newSpecObj,
                                  ],
                                  specialty: [
                                    ...(selectedDept.rawSpecialties || []).map(
                                      (s: ApiSpecialtyItem) => s.name,
                                    ),
                                    newSpecObj.name,
                                  ].join(", "),
                                });
                                setEditSpecialtyInput("");
                              }
                            }}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "none",
                              background: "#009688",
                              color: "#FFFFFF",
                              fontSize: "11px",
                              cursor: "pointer",
                            }}
                          >
                            Add
                          </button>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px",
                          }}
                        >
                          {(selectedDept.rawSpecialties || []).map(
                            (spec: ApiSpecialtyItem) => {
                              const specName = spec.name ?? "";
                              return (
                                <span
                                  key={spec.id || spec.name || specName}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "3px",
                                    background: "#E0F2F1",
                                    color: "#009688",
                                    padding: "1px 6px",
                                    borderRadius: "6px",
                                    fontSize: "10px",
                                    fontWeight: 600,
                                  }}
                                >
                                  {specName}
                                  <button
                                    aria-label="Action"
                                    type="button"
                                    onClick={() => {
                                      const filtered = (
                                        selectedDept.rawSpecialties || []
                                      ).filter(
                                        (s: ApiSpecialtyItem) =>
                                          (s.name ?? "") !== specName,
                                      );
                                      setSelectedDept({
                                        ...selectedDept,
                                        rawSpecialties: filtered,
                                        specialty: filtered
                                          .map(
                                            (s: ApiSpecialtyItem) =>
                                              s.name ?? "",
                                          )
                                          .join(", "),
                                      });
                                    }}
                                    style={{
                                      border: "none",
                                      background: "transparent",
                                      color: "#EF4444",
                                      cursor: "pointer",
                                      padding: "0 1px",
                                      fontSize: "9px",
                                    }}
                                  >
                                    ✕
                                  </button>
                                </span>
                              );
                            },
                          )}
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px",
                          marginTop: "2px",
                        }}
                      >
                        {(selectedDept.rawSpecialties || []).map(
                          (spec: ApiSpecialtyItem) => (
                            <span
                              key={spec.id || spec.name || spec.code}
                              style={{
                                background: "#E0F2F1",
                                color: "#009688",
                                padding: "2px 6px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: 600,
                              }}
                            >
                              {spec.name ?? ""}
                            </span>
                          ),
                        )}
                        {(!selectedDept.rawSpecialties ||
                          selectedDept.rawSpecialties.length === 0) && (
                          <span style={{ fontWeight: 600, color: "#94A3B8" }}>
                            None
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Group 2: Operational Information Card */}
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  padding: "16px",
                }}
              >
                <h4
                  style={{
                    fontFamily: PP,
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#0D47A1",
                    margin: "0 0 12px 0",
                  }}
                >
                  Operational & Clinical Details
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    fontSize: "12px",
                    marginBottom: "12px",
                  }}
                ></div>
                <div>
                  <span
                    style={{
                      display: "block",
                      color: "#64748B",
                      fontSize: "11px",
                      marginBottom: "2px",
                    }}
                  >
                    Operational Description
                  </span>
                  {isEditMode ? (
                    <textarea
                      aria-label="Text input"
                      rows={3}
                      value={selectedDept.description}
                      onChange={(e) =>
                        setSelectedDept({
                          ...selectedDept,
                          description: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #CBD5E1",
                        fontSize: "12px",
                        boxSizing: "border-box",
                      }}
                    />
                  ) : (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#475569",
                        margin: 0,
                        lineHeight: "1.4",
                      }}
                    >
                      {selectedDept.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Group 3: Related Statistics Card */}
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  padding: "16px",
                }}
              >
                <h4
                  style={{
                    fontFamily: PP,
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#0D47A1",
                    margin: "0 0 12px 0",
                  }}
                >
                  Related Statistics & Capacity
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    fontSize: "12px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: "#64748B",
                        display: "block",
                        fontSize: "11px",
                      }}
                    >
                      Assigned Physicians
                    </span>
                    <span style={{ fontWeight: 700, color: "#111827" }}>
                      {selectedDept.doctorsCount} Doctors
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DRAWER STICKY FOOTER */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #E5E7EB",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => {
                  setSelectedDept(null);
                  setIsEditMode(false);
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  background: "#FFFFFF",
                  color: "#64748B",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              {isEditMode && (
                <button
                  onClick={handleUpdateDepartment}
                  disabled={isSubmitting}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#0D47A1",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(13,71,161,0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {isSubmitting && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD DEPARTMENT MODAL */}
      {isAddModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "500px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
                borderBottom: "1px solid #E5E7EB",
                paddingBottom: "12px",
              }}
            >
              <h3
                style={{
                  fontFamily: PP,
                  fontSize: "16px",
                  fontWeight: 700,
                  margin: 0,
                  color: "#111827",
                }}
              >
                Add New Hospital Department
              </h3>
              <button
                aria-label="Close"
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#64748B",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "4px",
                  }}
                >
                  Department Name *
                  <input
                    aria-label="Input field"
                    type="text"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    placeholder="e.g. Nephrology Department"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                </span>
              </div>

              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "4px",
                  }}
                >
                  Department Code
                  <input
                    aria-label="Input field"
                    type="text"
                    value={newDeptCode}
                    onChange={(e) =>
                      setNewDeptCode(e.target.value.toUpperCase())
                    }
                    placeholder="e.g. DEP-NEPH-07"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                </span>
              </div>

              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "4px",
                  }}
                >
                  Medical Specialties (Add one or more) *
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    aria-label="Input field"
                    type="text"
                    value={newSpecialtyInput}
                    onChange={(e) => setNewSpecialtyInput(e.target.value)}
                    placeholder="e.g. Renal Transplantation"
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "13px",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSpecialtyInput.trim()) {
                        setNewDeptSpecialties([
                          ...newDeptSpecialties,
                          newSpecialtyInput.trim(),
                        ]);
                        setNewSpecialtyInput("");
                      }
                    }}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#009688",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: 650,
                      cursor: "pointer",
                    }}
                  >
                    Add
                  </button>
                </div>
                {newDeptSpecialties.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginTop: "8px",
                      padding: "8px",
                      borderRadius: "8px",
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    {newDeptSpecialties.map((spec) => (
                      <span
                        key={spec}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          background: "#E0F2F1",
                          color: "#009688",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        {spec}
                        <button
                          aria-label="Action"
                          type="button"
                          onClick={() => {
                            setNewDeptSpecialties(
                              newDeptSpecialties.filter((s) => s !== spec),
                            );
                          }}
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "#EF4444",
                            cursor: "pointer",
                            padding: "0 2px",
                            fontSize: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "12px",
                }}
              >
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    background: "#FFFFFF",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDepartment}
                  disabled={isSubmitting}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#0D47A1",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {isSubmitting && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  Create Department
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR ASSIGNED CONFIRMATION MODAL */}
      {showDoctorAssignedModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "440px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AlertCircle size={22} color="#B45309" />
              </div>
              <h3
                style={{
                  fontFamily: PP,
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Cannot Delete Department
              </h3>
            </div>
            <p
              style={{
                fontFamily: PP,
                fontSize: "13px",
                color: "#475569",
                margin: "0 0 20px 0",
                lineHeight: 1.6,
              }}
            >
              This department cannot be deleted because doctors are currently
              assigned to it. Please reassign or remove the assigned doctors
              before deleting <strong>"{doctorAssignedDeptName}"</strong>.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowDoctorAssignedModal(false)}
                style={{
                  fontFamily: PP,
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  background: "#FFFFFF",
                  color: "#374151",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
