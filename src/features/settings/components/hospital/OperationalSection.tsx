import { FileText } from "lucide-react";
import type { HospitalInformationForm } from "../../types/settings.types";

const PP = "'Poppins', system-ui, sans-serif";

interface OperationalSectionProps {
  form: HospitalInformationForm;
  errors: Record<string, string>;
  onChange: (field: string, value: string | boolean | number) => void;
}

export function OperationalSection({
  form,
  onChange,
}: OperationalSectionProps) {
  return (
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
          fontSize: "15px",
          fontWeight: 700,
          color: "#111827",
          margin: "0 0 16px 0",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <FileText size={18} style={{ color: "#009688" }} /> Section 04: Hospital
        Operational Details
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
        }}
      >
        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Hospital Type
          
          <select aria-label="Select option"
            value={form.hospitalType}
            onChange={(e) => onChange("hospitalType", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          >
            <option>Multi Specialty</option>
            <option>General Hospital</option>
            <option>Specialty Hospital</option>
            <option>Clinic / Outpatient Facility</option>
          </select></span>
        </div>

        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Ownership Structure
          
          <select aria-label="Select option"
            value={form.ownership}
            onChange={(e) => onChange("ownership", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          >
            <option>Private</option>
            <option>Government / Public</option>
            <option>Trust / Charitable</option>
            <option>Corporate Healthcare Chain</option>
          </select></span>
        </div>

        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Established Year
          
          <input aria-label="Input field"
            type="text"
            value={form.establishedYear}
            onChange={(e) => onChange("establishedYear", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          /></span>
        </div>

        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Active Departments
          
          <input aria-label="Input field"
            type="number"
            value={form.numDepartments}
            onChange={(e) => onChange("numDepartments", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          /></span>
        </div>

        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Registered Doctors
          
          <input aria-label="Input field"
            type="number"
            value={form.numDoctors}
            onChange={(e) => onChange("numDoctors", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          /></span>
        </div>

        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Consultation Rooms / OPD Units
          
          <input aria-label="Input field"
            type="number"
            value={form.numConsultationRooms}
            onChange={(e) => onChange("numConsultationRooms", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          /></span>
        </div>
      </div>
    </div>
  );
}
