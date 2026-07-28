import { usePermissions } from "../../../permissions";

export const appointmentPermissionMap = {
  view: "APPOINTMENT_VIEW",
  create: "APPOINTMENT_CREATE",
  edit: "APPOINTMENT_EDIT",
  reschedule: "APPOINTMENT_RESCHEDULE",
  cancel: "APPOINTMENT_CANCEL",
  checkIn: "APPOINTMENT_CHECK_IN",
  noShow: "APPOINTMENT_MARK_NO_SHOW",
  queue: "APPOINTMENT_VIEW_QUEUE",
  history: "APPOINTMENT_VIEW_HISTORY",
} as const;

export const useAppointmentPermissions = () => {
  const permissions = usePermissions();

  return {
    ...permissions,
    canViewAppointments: permissions.can(appointmentPermissionMap.view),
    canCreateAppointments: permissions.can(appointmentPermissionMap.create),
    canEditAppointments: permissions.can(appointmentPermissionMap.edit),
    canRescheduleAppointments: permissions.can(
      appointmentPermissionMap.reschedule,
    ),
    canCancelAppointments: permissions.can(appointmentPermissionMap.cancel),
    canCheckInAppointments: permissions.can(appointmentPermissionMap.checkIn),
    canMarkNoShowAppointments: permissions.can(appointmentPermissionMap.noShow),
    canViewQueue: permissions.can(appointmentPermissionMap.queue),
    canViewAppointmentHistory: permissions.can(
      appointmentPermissionMap.history,
    ),
  };
};
