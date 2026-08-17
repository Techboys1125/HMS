import type { DoctorRecord } from "../types/doctors.types";
import type { EditableStaffUser } from "../../users/components/EditStaffUserDrawer";

export const doctorToEditUser = (doc: DoctorRecord): EditableStaffUser => {
  const userId = doc.userId && doc.userId > 0 ? doc.userId : undefined;
  const doctorId = doc.doctorId && doc.doctorId > 0 ? doc.doctorId : undefined;

  return {
    id: userId ? String(userId) : doctorId ? String(doctorId) : "",
    empId: doc.empId,
    fullName: doc.name.replace(/^Dr\.\s*/, ""),
    email: doc.email,
    phone: doc.phone === "N/A" ? "" : doc.phone,
    role: "Doctor",
    department: doc.department,
    status: doc.status,
    doctorId,
  };
};
