import type { DoctorRecord } from "../types/doctors.types";
import type { EditableStaffUser } from "../../users/components/EditStaffUserDrawer";

export const doctorToEditUser = (doc: DoctorRecord): EditableStaffUser => ({
  id: String(doc.userId ?? String(doc.id ?? "").replace("DOC-", "")),
  empId: doc.empId,
  fullName: doc.name.replace(/^Dr\.\s*/, ""),
  email: doc.email,
  phone: doc.phone === "N/A" ? "" : doc.phone,
  role: "Doctor",
  department: doc.department,
  status: doc.status,
});
