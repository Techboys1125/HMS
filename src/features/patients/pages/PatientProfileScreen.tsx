import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  UserCheck,
  Calendar,
  Stethoscope,
  Edit,
  FileText,
  Droplets,
  Printer,
} from "lucide-react";
import type { PatientProfileScreenProps } from "../types/patient.types";
import { PP, RB } from "../constants/patient.mock";
import { Avatar, Chip } from "../components/Avatar";
import { StatusBadge } from "../components/StatusBadges";
import { Pagination } from "../../../common/components/Pagination";

export function PatientProfileScreen({
  onBack,
  onEditPatient,
  onBookAppointment,
  onCheckInClick,
  patientMrn = "MRN-892101",
}: PatientProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "appointments"
    | "visits"
    | "medical-history"
    | "billing"
    | "documents"
  >("overview");

  // Patient Mock Profile Data
  const patient = {
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    name: "Sarah Mitchell",
    mrn: patientMrn,
    age: 34,
    gender: "Female",
    dob: "1990-06-14",
    maritalStatus: "Married",
    bloodGroup: "Blood O+",
    mobile: "+1 (555) 234-5678",
    email: "sarah.m@example.com",
    emergencyContact: "+1 (555) 345-6789 (Spouse: David Mitchell)",
    address: "123 Healthcare Ave, Apt 4B, NY 10001",
    category: "Regular Outpatient",
    status: "Active",
    regDate: "Mar 12, 2024",
    registrationType: "WALK_IN",
    assignedDoctor: "Dr. A. Mehta",
    department: "Cardiology",
  };

  // Appointment History Mock (Reception Scope)
  const appointmentHistory = [
    {
      id: "APT-1024",
      doctor: "Dr. A. Mehta",
      dept: "Cardiology",
      date: "March 15, 2024",
      time: "10:30 AM",
      type: "Follow-up Visit",
      status: "Scheduled",
    },
    {
      id: "APT-1018",
      doctor: "Dr. P. Sharma",
      dept: "General Medicine",
      date: "March 28, 2024",
      time: "02:00 PM",
      type: "OPD Consultation",
      status: "Scheduled",
    },
    {
      id: "APT-0982",
      doctor: "Dr. A. Mehta",
      dept: "Cardiology",
      date: "March 12, 2024",
      time: "09:45 AM",
      type: "OPD Consultation",
      status: "Completed",
    },
  ];

  // Visit History Mock
  const visitHistory = [
    {
      id: "VIS-2024-001",
      date: "March 12, 2024",
      time: "09:45 AM",
      doctor: "Dr. Arjun Mehta",
      dept: "Cardiology",
      diagnosis: "Primary Essential Hypertension",
      treatmentSummary: "Oral anti-hypertensive daily (Lisinopril 10mg)",
      rxStatus: "Issued",
      billingStatus: "Paid",
    },
    {
      id: "VIS-2024-002",
      date: "February 10, 2024",
      time: "11:15 AM",
      doctor: "Dr. Priya Sharma",
      dept: "General Medicine",
      diagnosis: "Type 2 Diabetes Mellitus",
      treatmentSummary: "Dietary control & Metformin 500mg BD",
      rxStatus: "Issued",
      billingStatus: "Paid",
    },
    {
      id: "VIS-2023-089",
      date: "November 14, 2023",
      time: "02:30 PM",
      doctor: "Dr. Rajesh Kapoor",
      dept: "Neurology",
      diagnosis: "Mild Bronchial Asthma",
      treatmentSummary: "Inhaler PRN during seasonal exacerbation",
      rxStatus: "Pending",
      billingStatus: "Paid",
    },
    {
      id: "VIS-2023-045",
      date: "August 05, 2023",
      time: "10:00 AM",
      doctor: "Dr. Sunita Patel",
      dept: "Gynecology",
      diagnosis: "Routine Health Screening",
      treatmentSummary: "Normal vitals, general wellness guidance",
      rxStatus: "Pending",
      billingStatus: "Not Paid",
    },
  ];

  // Billing Summary Mock (Read-Only)
  const billingSummary = [
    {
      invoiceNo: "INV-10245",
      appointment: "APT-1024",
      date: "March 12, 2024",
      amount: "$125.00",
      status: "Pending",
    },
    {
      invoiceNo: "INV-10189",
      appointment: "APT-0982",
      date: "February 10, 2024",
      amount: "$220.00",
      status: "Paid",
    },
  ];

  // Timeline Events Mock

  const getStatusChipVariant = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "info";
      case "Checked-In":
      case "Waiting for Vitals":
        return "teal";
      case "Waiting":
      case "Waiting for Doctor":
        return "warning";
      case "Completed":
        return "success";
      case "Cancelled":
        return "error";
      case "Paid":
        return "success";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "appointments" as const, label: "Appointments" },
    { id: "visits" as const, label: "Visit History" },
    { id: "billing" as const, label: "Billing" },
    { id: "documents" as const, label: "Documents" },
  ];

  // Pagination for appointment history
  const [apptPage, setApptPage] = useState(1);
  const apptPageSize = 10;
  const apptTotalPages = Math.ceil(appointmentHistory.length / apptPageSize);
  const paginatedAppointments = appointmentHistory.slice(
    (apptPage - 1) * apptPageSize,
    apptPage * apptPageSize,
  );

  // Pagination for visit history
  const [visitPage, setVisitPage] = useState(1);
  const visitPageSize = 10;
  const visitTotalPages = Math.ceil(visitHistory.length / visitPageSize);
  const paginatedVisits = visitHistory.slice(
    (visitPage - 1) * visitPageSize,
    visitPage * visitPageSize,
  );

  // Pagination for billing summary
  const [billingPage, setBillingPage] = useState(1);
  const billingPageSize = 10;
  const billingTotalPages = Math.ceil(billingSummary.length / billingPageSize);
  const paginatedBilling = billingSummary.slice(
    (billingPage - 1) * billingPageSize,
    billingPage * billingPageSize,
  );

  return (
    <div
      className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]"
      style={{ fontFamily: RB }}
    >
      <div className="w-full space-y-6">
        {/* ── HEADER & BREADCRUMBS (MATCHES HOSPITAL ADMIN PATIENT PROFILE) ── */}
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
              Patient Profile
            </h1>
          </div>
          <div
            className="flex items-center gap-1.5 text-xs text-slate-500 pl-8"
            style={{ fontFamily: RB }}
          >
            <span>Reception Management</span>
            <ChevronRight size={13} className="text-slate-300" />
            <button
              onClick={onBack}
              className="hover:text-[#0D47A1] transition-colors"
            >
              Patient Search
            </button>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-semibold text-[#111827]">{patient.name}</span>
          </div>
        </div>

        {/* ── REUSABLE PATIENT HERO HEADER (MATCHES HOSPITAL ADMIN PATIENT PROFILE HERO) ── */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Avatar name={patient.name} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2
                  className="text-lg font-bold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  {patient.name}
                </h2>
                <span className="text-[10px] font-mono font-semibold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {patient.mrn}
                </span>
                <StatusBadge status={patient.status} />
              </div>
              <div
                className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 mt-1"
                style={{ fontFamily: RB }}
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <UserCheck size={14} className="text-slate-400" />{" "}
                  {patient.age} Y / {patient.gender}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Droplets size={14} className="text-red-500" />{" "}
                  {patient.bloodGroup}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Phone size={14} className="text-slate-400" />{" "}
                  {patient.mobile}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                <span>Reg: {patient.regDate}</span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="flex items-center gap-1">
                  <Stethoscope size={13} className="text-[#009688]" />{" "}
                  {patient.assignedDoctor} ({patient.department})
                </span>
              </div>
            </div>
          </div>

          {/* RECEPTION-SPECIFIC QUICK ACTION BUTTONS IN HERO */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onBookAppointment?.(patient.mrn)}
              className="px-3.5 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <Calendar size={14} /> Book Appointment
            </button>
            <button
              onClick={() => onCheckInClick?.(undefined, patient.mrn)}
              className="px-3.5 py-2 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-1.5"
              style={{ fontFamily: PP }}
            >
              <UserCheck size={14} /> Patient Check-In
            </button>
            <button
              onClick={onEditPatient}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Edit size={14} className="text-slate-500" /> Edit Patient
              Information
            </button>
            <button
              onClick={() =>
                alert(
                  `Printing official Patient Card for ${patient.name} (${patient.mrn})...`,
                )
              }
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Printer size={14} className="text-slate-500" /> Print Patient
              Card
            </button>
          </div>
        </div>

        {/* ── KPI SUMMARY CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">
              Total Visits
            </div>
            <div
              className="text-xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              12
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">
              Last Visit
            </div>
            <div className="text-xs font-bold text-[#111827] mt-1">
              Mar 12, 2024
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">
              Upcoming
            </div>
            <div className="text-xs font-bold text-[#0D47A1] mt-1">
              Mar 15, 2024
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">
              Active Queue
            </div>
            <div
              className="text-xl font-bold text-[#009688]"
              style={{ fontFamily: PP }}
            >
              TK-086
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">
              Billing Status
            </div>
            <div className="text-xs font-bold text-green-600 mt-1">Cleared</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-[11px] text-slate-500 font-medium mb-0.5">
              Category
            </div>
            <div className="text-xs font-bold text-slate-700 mt-1">
              Regular OPD
            </div>
          </div>
        </div>

        {/* ── THREE-COLUMN LAYOUT (DESKTOP) ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* CENTER COLUMN: REUSABLE PATIENT PROFILE TABS (12 COLS) */}
          <div className="xl:col-span-12 space-y-6">
            {/* TAB NAVIGATION BAR */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex overflow-x-auto gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#0D47A1] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  style={{ fontFamily: PP }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* DYNAMIC TAB CONTENT CONTAINER */}
            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[420px]"
              style={{ fontFamily: RB }}
            >
              {/* TAB 01: OVERVIEW (CONTAINS DETAILED PERSONAL INFO, EMERGENCY CONTACT, REGISTRATION DETAILS) */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Detailed Personal Information & Emergency Contact */}
                    <div className="bg-slate-50/60 p-5 rounded-2xl border border-gray-100 space-y-4">
                      <h3
                        className="text-xs font-bold uppercase tracking-wider text-[#0D47A1]"
                        style={{ fontFamily: PP }}
                      >
                        Personal &amp; Emergency Contact Details
                      </h3>
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Date of Birth &amp; Marital Status
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {patient.dob} ({patient.age} Yrs) ·{" "}
                            {patient.maritalStatus}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Residential Address
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {patient.address}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Email Address
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {patient.email}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Emergency Contact Person &amp; Phone
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {patient.emergencyContact}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Master Registration Details */}
                    <div className="bg-slate-50/60 p-5 rounded-2xl border border-gray-100 space-y-4">
                      <h3
                        className="text-xs font-bold uppercase tracking-wider text-[#009688]"
                        style={{ fontFamily: PP }}
                      >
                        Registration &amp; Reception Details
                      </h3>
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Registration Date
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {patient.regDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Registration Type
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {patient.registrationType}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Patient Category
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {patient.category}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">
                            Primary Care Department
                          </span>
                          <span className="font-semibold text-[#111827] mt-0.5 block">
                            {patient.department} ({patient.assignedDoctor})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Appointments Summary */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className="text-xs font-bold uppercase tracking-wider text-slate-600"
                        style={{ fontFamily: PP }}
                      >
                        Recent Appointments Summary
                      </h3>
                      <button
                        onClick={() => setActiveTab("appointments")}
                        className="text-xs font-bold text-[#0D47A1] hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-2">
                      {appointmentHistory.slice(0, 2).map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white shadow-sm"
                        >
                          <div>
                            <div className="font-bold text-[#111827] text-xs">
                              {a.doctor}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {a.dept} • {a.date} ({a.time})
                            </div>
                          </div>
                          <StatusBadge status={a.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 02: APPOINTMENTS */}
              {activeTab === "appointments" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3
                      className="text-xs font-bold text-[#111827] uppercase tracking-wider"
                      style={{ fontFamily: PP }}
                    >
                      Appointment History
                    </h3>
                    <button
                      onClick={() => onBookAppointment?.(patient.mrn)}
                      className="px-3 py-1.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-all flex items-center gap-1"
                      style={{ fontFamily: PP }}
                    >
                      <Calendar size={14} /> Book Appointment
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table
                      className="w-full text-left text-xs"
                      style={{ fontFamily: RB }}
                    >
                      <thead>
                        <tr
                          className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]"
                          style={{ fontFamily: PP }}
                        >
                          <th className="px-3 py-2.5">Appt ID</th>
                          <th className="px-3 py-2.5">Doctor</th>
                          <th className="px-3 py-2.5">Department</th>
                          <th className="px-3 py-2.5">Date &amp; Time</th>
                          <th className="px-3 py-2.5">Status</th>
                          <th className="px-3 py-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-[#111827]">
                        {paginatedAppointments.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-3 py-3 font-mono font-bold text-[#0D47A1]">
                              {item.id}
                            </td>
                            <td className="px-3 py-3 font-semibold">
                              {item.doctor}
                            </td>
                            <td className="px-3 py-3 text-slate-600">
                              {item.dept}
                            </td>
                            <td className="px-3 py-3 font-mono text-slate-500">
                              {item.date} · {item.time}
                            </td>
                            <td className="px-3 py-3">
                              <Chip
                                label={item.status}
                                variant={getStatusChipVariant(item.status)}
                              />
                            </td>
                            <td className="px-3 py-3 text-right">
                              {item.status === "Scheduled" ? (
                                <button
                                  onClick={() =>
                                    onCheckInClick?.(item.id, patient.mrn)
                                  }
                                  className="px-2.5 py-1 rounded-lg bg-[#009688] text-white text-[11px] font-semibold hover:bg-teal-700 transition-colors"
                                >
                                  Check-In
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-medium">
                                  View Only
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    currentPage={apptPage}
                    totalPages={apptTotalPages}
                    onPageChange={setApptPage}
                    pageSize={apptPageSize}
                    totalCount={appointmentHistory.length}
                  />
                </div>
              )}

              {/* TAB 03: VISIT HISTORY */}
              {activeTab === "visits" && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3
                        className="text-xs font-bold text-[#111827] uppercase tracking-wider"
                        style={{ fontFamily: PP }}
                      >
                        Patient Visit History
                      </h3>
                      <p className="text-xs text-slate-500">
                        Comprehensive log of outpatient consultations,
                        diagnoses, and treatments.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-200">
                          {[
                            "Visit Date",
                            "Visit ID",
                            "Doctor",
                            "Department",
                            "Diagnosis",
                            "Treatment Summary",
                            "Prescription Status",
                            "Billing Status",
                            "Actions",
                          ].map((h) => (
                            <th
                              key={h}
                              className="px-3.5 py-3 font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap"
                              style={{ fontFamily: PP }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paginatedVisits.map((v) => (
                          <tr
                            key={v.id}
                            className="hover:bg-blue-50/30 transition-colors"
                          >
                            {/* 1. Visit Date */}
                            <td className="px-3.5 py-3 whitespace-nowrap font-medium text-slate-700">
                              {v.date}
                            </td>

                            {/* 2. Visit ID */}
                            <td className="px-3.5 py-3 whitespace-nowrap font-mono font-bold text-[#0D47A1]">
                              <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                {v.id}
                              </span>
                            </td>

                            {/* 3. Doctor */}
                            <td className="px-3.5 py-3 whitespace-nowrap font-semibold text-[#111827]">
                              {v.doctor}
                            </td>

                            {/* 4. Department */}
                            <td className="px-3.5 py-3 whitespace-nowrap text-slate-600">
                              {v.dept}
                            </td>

                            {/* 5. Diagnosis */}
                            <td className="px-3.5 py-3 font-semibold text-[#111827]">
                              {v.diagnosis}
                            </td>

                            {/* 6. Treatment Summary */}
                            <td className="px-3.5 py-3 text-slate-600 max-w-xs truncate">
                              {v.treatmentSummary}
                            </td>

                            {/* 7. Prescription Status */}
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                  v.rxStatus === "Issued"
                                    ? "bg-green-50 text-green-700 border-green-100"
                                    : "bg-amber-50 text-amber-700 border-amber-100"
                                }`}
                              >
                                {v.rxStatus}
                              </span>
                            </td>

                            {/* 8. Billing Status */}
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <StatusBadge status={v.billingStatus} />
                            </td>

                            {/* 9. Actions */}
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <button
                                className="px-3 py-1.5 rounded-xl bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm flex items-center gap-1"
                                style={{ fontFamily: PP }}
                              >
                                View Visit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    currentPage={visitPage}
                    totalPages={visitTotalPages}
                    onPageChange={setVisitPage}
                    pageSize={visitPageSize}
                    totalCount={visitHistory.length}
                  />
                </div>
              )}

              {/* TAB 04: MEDICAL HISTORY (READ-ONLY OPERATIONAL SCOPE) */}
              {activeTab === "medical-history" && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <h3
                      className="text-xs font-bold text-[#111827] uppercase tracking-wider"
                      style={{ fontFamily: PP }}
                    >
                      Medical History Overview
                    </h3>
                    <span className="text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">
                      Operational View
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="font-semibold text-[#111827]">
                      Primary Clinical Profile
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      No active critical alerts logged. Operational medical
                      record flags indicate regular OPD checkups with Cardiology
                      and General OPD.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 05: BILLING */}
              {activeTab === "billing" && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <h3
                      className="text-xs font-bold text-[#111827] uppercase tracking-wider"
                      style={{ fontFamily: PP }}
                    >
                      Billing &amp; Payment Records
                    </h3>
                    <span className="text-[10px] bg-[#0D47A1]/10 text-[#0D47A1] px-2 py-0.5 rounded font-bold">
                      Read-Only
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table
                      className="w-full text-left text-xs"
                      style={{ fontFamily: RB }}
                    >
                      <thead>
                        <tr
                          className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]"
                          style={{ fontFamily: PP }}
                        >
                          <th className="px-3 py-2.5">Invoice No</th>
                          <th className="px-3 py-2.5">Appointment</th>
                          <th className="px-3 py-2.5">Date</th>
                          <th className="px-3 py-2.5">Amount</th>
                          <th className="px-3 py-2.5">Payment Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-[#111827]">
                        {paginatedBilling.map((inv) => (
                          <tr
                            key={inv.invoiceNo}
                            className="hover:bg-slate-50"
                          >
                            <td className="px-3 py-3 font-mono font-bold text-[#0D47A1]">
                              {inv.invoiceNo}
                            </td>
                            <td className="px-3 py-3 font-mono text-slate-600">
                              {inv.appointment}
                            </td>
                            <td className="px-3 py-3 font-mono text-slate-500">
                              {inv.date}
                            </td>
                            <td className="px-3 py-3 font-bold text-[#111827]">
                              {inv.amount}
                            </td>
                            <td className="px-3 py-3">
                              <Chip
                                label={inv.status}
                                variant={getStatusChipVariant(inv.status)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    currentPage={billingPage}
                    totalPages={billingTotalPages}
                    onPageChange={setBillingPage}
                    pageSize={billingPageSize}
                    totalCount={billingSummary.length}
                  />
                </div>
              )}

              {/* TAB 06: DOCUMENTS */}
              {activeTab === "documents" && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <h3
                      className="text-xs font-bold text-[#111827] uppercase tracking-wider"
                      style={{ fontFamily: PP }}
                    >
                      Patient Documents &amp; Records
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl border border-gray-200 bg-slate-50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-[#0D47A1]" />
                        <div>
                          <div className="font-bold text-[#111827]">
                            Patient Registration Form
                          </div>
                          <div className="text-[11px] text-slate-500">
                            March 12, 2024 · 1.8 MB
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          alert("Downloading Registration Document...")
                        }
                        className="px-2.5 py-1 rounded bg-white border border-gray-200 text-[#0D47A1] font-semibold text-[11px] hover:bg-blue-50"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
