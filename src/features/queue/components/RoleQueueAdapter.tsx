import React from "react";
import { usePermissions } from "../../../permissions";

interface RoleQueueAdapterProps {
  receptionView?: React.ReactNode;
  doctorView?: React.ReactNode;
  nurseView?: React.ReactNode;
  patientView?: React.ReactNode;
  fallbackView?: React.ReactNode;
}

/**
 * Permission & Role Adapter for Queue Views
 */
export const RoleQueueAdapter: React.FC<RoleQueueAdapterProps> = ({
  receptionView,
  doctorView,
  nurseView,
  patientView,
  fallbackView,
}) => {
  const { can, role } = usePermissions();

  if (role === "PATIENT" || can("PATIENT_VIEW_SELF")) {
    return <>{patientView || fallbackView}</>;
  }

  if (role === "DOCTOR" || can("DOCTOR_VIEW_OWN")) {
    return <>{doctorView || fallbackView}</>;
  }

  if (role === "NURSE" || can("VITALS_CREATE")) {
    return <>{nurseView || fallbackView}</>;
  }

  if (role === "RECEPTIONIST" || can("RECEPTION_VIEW") || can("CHECKIN_CREATE")) {
    return <>{receptionView || fallbackView}</>;
  }

  return <>{fallbackView}</>;
};
