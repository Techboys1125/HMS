import React, { useMemo, useEffect, useState } from "react";
import { Building2, Briefcase } from "lucide-react";
import type { FormValues, FormErrors } from "../hooks/useCreateStaffForm";
import { departmentsApi } from "../api/departments.api";

interface ConsultationDetailsSectionProps {
  form: FormValues;
  errors: FormErrors;
  setFieldValue: (name: string, value: unknown) => void;
}

const EMPTY_ARRAY: string[] = [];

export const ConsultationDetailsSection: React.FC<
  ConsultationDetailsSectionProps
> = ({ form, errors, setFieldValue }) => {
  const [apiDepts, setApiDepts] = useState<string[]>([]);
  const [deptSpecialtiesMap, setDeptSpecialtiesMap] = useState<Record<string, string[]>>({});

  useEffect(() => {
    departmentsApi.getDepartmentLookup(true).then((lookupList) => {
      if (lookupList && lookupList.length > 0) {
        const names = lookupList.map((d) => d.departmentName).filter(Boolean);
        setApiDepts(names);

        const map: Record<string, string[]> = {};
        lookupList.forEach((d) => {
          if (d.departmentName && d.specialties) {
            map[d.departmentName] = d.specialties.map((s) => s.name).filter(Boolean);
          }
        });
        setDeptSpecialtiesMap(map);
      } else {
        // Fallback to full department-specialties list if lookup is empty
        departmentsApi.getDepartments({ activeOnly: true }).then((list) => {
          const names = list.map((d) => d.departmentName || d.name).filter((n): n is string => Boolean(n));
          if (names.length > 0) setApiDepts(names);
        });
      }
    });
  }, []);

  const departmentOptions = useMemo(() => [...apiDepts], [apiDepts]);

  // Get specialties based on the selected primary department
  const primarySpecialties = useMemo(() => {
    if (deptSpecialtiesMap[form.primaryDepartment]?.length) {
      return deptSpecialtiesMap[form.primaryDepartment];
    }
    return [];
  }, [form.primaryDepartment, deptSpecialtiesMap]);

  // Get specialties based on the selected secondary department
  const secondarySpecialties = useMemo(() => {
    if (!form.secondaryDepartment) return EMPTY_ARRAY;
    if (deptSpecialtiesMap[form.secondaryDepartment]?.length) {
      return deptSpecialtiesMap[form.secondaryDepartment];
    }
    return [];
  }, [form.secondaryDepartment, deptSpecialtiesMap]);

  // Auto-select first primary specialty when department changes
  useEffect(() => {
    if (
      primarySpecialties.length > 0 &&
      !primarySpecialties.includes(form.primarySpecialty)
    ) {
      setFieldValue("primarySpecialty", primarySpecialties[0]);
    }
  }, [primarySpecialties, form.primarySpecialty, setFieldValue]);

  // Auto-select first secondary specialty when secondary department changes
  useEffect(() => {
    if (
      form.secondaryDepartment &&
      secondarySpecialties.length > 0 &&
      !secondarySpecialties.includes(form.secondarySpecialty)
    ) {
      setFieldValue("secondarySpecialty", secondarySpecialties[0]);
    } else if (!form.secondaryDepartment && form.secondarySpecialty !== "") {
      setFieldValue("secondarySpecialty", "");
    }
  }, [
    form.secondaryDepartment,
    secondarySpecialties,
    form.secondarySpecialty,
    setFieldValue,
  ]);

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-4 animate-fade-in">
      <h3 className="text-[#0D47A1] font-heading font-bold text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
        3. Professional Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary Department */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">
            Primary Department *
          </label>
          <div className="relative">
            <Building2
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={form.primaryDepartment}
              onChange={(e) =>
                setFieldValue("primaryDepartment", e.target.value)
              }
              className={`w-full bg-[#F8FAFC] border rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none transition-all text-[#1E293B] cursor-pointer ${
                errors.primaryDepartment
                  ? "border-red-500 bg-red-50/50"
                  : "border-[#E5E7EB] focus:border-[#0D47A1] focus:bg-white"
              }`}
            >
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          {errors.primaryDepartment && (
            <p className="text-red-500 text-[10px] font-semibold mt-0.5">
              {errors.primaryDepartment}
            </p>
          )}
        </div>

        {/* Secondary Department (Optional) */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">
            Secondary Department{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <Building2
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={form.secondaryDepartment}
              onChange={(e) =>
                setFieldValue("secondaryDepartment", e.target.value)
              }
              className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-all text-[#1E293B] cursor-pointer"
            >
              <option value="">None (Optional)</option>
              {departmentOptions.filter(
                (dept) => dept !== form.primaryDepartment,
              ).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Specialty */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">
            Primary Specialty *
          </label>
          <div className="relative">
            <Briefcase
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={form.primarySpecialty}
              onChange={(e) =>
                setFieldValue("primarySpecialty", e.target.value)
              }
              className={`w-full bg-[#F8FAFC] border rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none transition-all text-[#1E293B] cursor-pointer ${
                errors.primarySpecialty
                  ? "border-red-500 bg-red-50/50"
                  : "border-[#E5E7EB] focus:border-[#0D47A1] focus:bg-white"
              }`}
            >
              {primarySpecialties.length > 0 ? (
                primarySpecialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))
              ) : (
                <option value="">Select Department first</option>
              )}
            </select>
          </div>
          {errors.primarySpecialty && (
            <p className="text-red-500 text-[10px] font-semibold mt-0.5">
              {errors.primarySpecialty}
            </p>
          )}
        </div>

        {/* Secondary Specialty (Optional) */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">
            Secondary Specialty{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <Briefcase
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={form.secondarySpecialty}
              onChange={(e) =>
                setFieldValue("secondarySpecialty", e.target.value)
              }
              className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl pl-11 pr-4 py-2.5 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-all text-[#1E293B] cursor-pointer"
            >
              <option value="">None (Optional)</option>
              {secondarySpecialties.length > 0 ? (
                secondarySpecialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))
              ) : form.secondaryDepartment ? (
                <option value="" disabled>
                  No specialties available
                </option>
              ) : null}
            </select>
          </div>
        </div>

        {/* Consultation Fee */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">
            Consultation Fee (₹) *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
              ₹
            </span>
            <input
              type="number"
              min={0}
              value={form.consultationFee}
              onChange={(e) => setFieldValue("consultationFee", e.target.value)}
              placeholder="500"
              className={`w-full bg-[#F8FAFC] border rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none transition-all text-text-body ${
                errors.consultationFee
                  ? "border-red-500 bg-red-50/50"
                  : "border-[#E5E7EB] focus:border-[#0D47A1] focus:bg-white"
              }`}
            />
          </div>
          {errors.consultationFee && (
            <p className="text-red-500 text-[10px] font-semibold mt-0.5">
              {errors.consultationFee}
            </p>
          )}
        </div>

        {/* Follow-up Fee */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">
            Follow-up Fee (₹) <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
              ₹
            </span>
            <input
              type="number"
              min={0}
              value={form.followUpFee}
              onChange={(e) => setFieldValue("followUpFee", e.target.value)}
              placeholder="300"
              className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-all text-text-body"
            />
          </div>
        </div>

        {/* Qualification */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">
            Qualification <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={form.qualification}
            onChange={(e) => setFieldValue("qualification", e.target.value)}
            placeholder="e.g. MBBS, MD, DM (Cardiology)"
            className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-all text-text-body"
          />
        </div>

        {/* Years of Experience */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">
            Years of Experience <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="number"
            min={0}
            value={form.yearsOfExperience}
            onChange={(e) => setFieldValue("yearsOfExperience", e.target.value)}
            placeholder="e.g. 10"
            className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-all text-text-body"
          />
        </div>

        {/* Doctor Code */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">
            Doctor Code <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={form.doctorCode}
            onChange={(e) => setFieldValue("doctorCode", e.target.value.toUpperCase())}
            placeholder="e.g. DOC-CARD-01"
            className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-all text-text-body font-mono uppercase"
          />
        </div>

        {/* Slot Duration Minutes */}
        <div className="space-y-1">
          <label className="block text-xs font-heading font-bold text-text-body">
            Slot Duration (Minutes)
          </label>
          <select
            value={form.slotDurationMinutes}
            onChange={(e) => setFieldValue("slotDurationMinutes", e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#0D47A1] focus:bg-white transition-all text-text-body cursor-pointer font-medium"
          >
            <option value="10">10 Minutes</option>
            <option value="15">15 Minutes (Default)</option>
            <option value="20">20 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="45">45 Minutes</option>
            <option value="60">60 Minutes</option>
          </select>
        </div>
      </div>
    </div>
  );
};
export default ConsultationDetailsSection;
