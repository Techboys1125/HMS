import React from "react";

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getStyle = (r: string) => {
    const term = r.toUpperCase().replace("-", " ").trim();
    if (term === "SUPER ADMIN" || term === "SUPER_ADMIN") {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }
    if (term === "HOSPITAL ADMIN" || term === "HOSPITAL_ADMIN" || term === "ADMIN") {
      return "bg-blue-50 text-[#0D47A1] border-blue-200";
    }
    if (term === "DOCTOR") {
      return "bg-teal-50 text-[#009688] border-teal-200";
    }
    if (term === "NURSE") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (term === "RECEPTIONIST") {
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    }
    if (term === "ACCOUNTANT") {
      return "bg-amber-50 text-[#F59E0B] border-amber-200";
    }
    if (term === "PATIENT") {
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStyle(role)}`}>
      {role}
    </span>
  );
};

export default RoleBadge;
