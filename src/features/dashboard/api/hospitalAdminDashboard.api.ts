import { apiClient } from "../../../lib/axios";
import type {
  DashboardApiResponse,
  AdminDashboardSummary,
  AdminAppointmentFlowResponse,
  AdminAppointmentFlowPoint,
  AdminDepartments,
  AdminDepartmentSummaryItem,
  AdminDeptWorkload,
  AdminDoctorAvailability,
  AdminPatientStatus,
  AdminRevenueSummary,
  HospitalAdminSummary,
  HospitalAdminAppointmentFlow,
  HospitalAdminStatusDist,
  HospitalAdminDeptWorkload,
  HospitalAdminDoctorAvailability,
  HospitalAdminTimelineItem,
  HospitalAdminRevenueDist,
  HospitalAdminDeptSummary,
} from "../types/dashboard.types";
import { appointmentsApi } from "../../appointments/api/appointments.api";

function unwrap<T>(response: { data: DashboardApiResponse<T> | T }): T {
  const body = response.data;
  if (body && typeof body === "object" && "data" in body) {
    return (body as DashboardApiResponse<T>).data;
  }
  return body as T;
}

const today = () => new Date().toISOString().split("T")[0];

export const hospitalAdminDashboardApi = {
  async getSummary(): Promise<HospitalAdminSummary> {
    const [summaryRes, statusRes] = await Promise.all([
      apiClient.get<DashboardApiResponse<AdminDashboardSummary>>(
        "/api/v1/admin/dashboard/summary",
      ),
      apiClient.get<DashboardApiResponse<AdminPatientStatus>>(
        "/api/v1/admin/dashboard/patient-status",
      ),
    ]);

    const summary =
      unwrap(summaryRes) || ({} as Partial<AdminDashboardSummary>);
    const status = unwrap(statusRes) || ({} as Partial<AdminPatientStatus>);

    const scheduled = Number(status.scheduled ?? 0) || 0;
    const checkedIn = Number(status.checkedIn ?? 0) || 0;
    const inConsultation = Number(status.inConsultation ?? 0) || 0;
    const completed = Number(status.completed ?? 0) || 0;

    const opdCount =
      summary.opdPatients?.today ?? summary.totalPatientsToday ?? 0;
    const apptCount =
      summary.appointments?.today ??
      scheduled + checkedIn + inConsultation + completed;
    const revenueCount =
      summary.revenue?.today ?? summary.totalRevenueToday ?? 0;
    const docCount = summary.doctors?.available ?? summary.activeDoctors ?? 0;

    return {
      todayOpdPatients: Number(opdCount) || 0,
      todayAppointments: Number(apptCount) || 0,
      todayRevenue: Number(revenueCount) || 0,
      pendingAppointments: Number(summary.pendingAppointments ?? 0) || 0,
      doctorsAvailable: Number(docCount) || 0,
      date: summary.date,
      opdPatients: summary.opdPatients,
      appointments: summary.appointments,
      revenue: summary.revenue,
      doctors: summary.doctors,
    };
  },

  async getAppointmentFlow(): Promise<HospitalAdminAppointmentFlow> {
    const res = await apiClient.get<
      DashboardApiResponse<AdminAppointmentFlowResponse>
    >("/api/v1/admin/dashboard/appointment-flow");
    const flowData =
      unwrap(res) || ({} as Partial<AdminAppointmentFlowResponse>);

    return {
      startTime: flowData.startTime || "08:00",
      endTime: flowData.endTime || "17:00",
      totalCompleted: Number(flowData.totalCompleted ?? 0) || 0,
      peakHour: flowData.peakHour || "--",
      peakAppointments: Number(flowData.peakAppointments ?? 0) || 0,
      flow: (flowData.flow || []).map((point: AdminAppointmentFlowPoint) => ({
        hour: point.hour,
        completed: Number(point.completed ?? 0) || 0,
      })),
    };
  },

  async getStatusDistribution(): Promise<HospitalAdminStatusDist[]> {
    const res = await apiClient.get<DashboardApiResponse<AdminPatientStatus>>(
      "/api/v1/admin/dashboard/patient-status",
    );
    const status = unwrap(res) || ({} as Partial<AdminPatientStatus>);

    return [
      {
        name: "Scheduled",
        value: Number(status.scheduled ?? 0) || 0,
        color: "#0D47A1",
      },
      {
        name: "Checked In",
        value: Number(status.checkedIn ?? 0) || 0,
        color: "#009688",
      },
      {
        name: "In Consultation",
        value: Number(status.inConsultation ?? 0) || 0,
        color: "#F59E0B",
      },
      {
        name: "Completed",
        value: Number(status.completed ?? 0) || 0,
        color: "#66BB6A",
      },
      {
        name: "Cancelled",
        value: Number(status.cancelled ?? 0) || 0,
        color: "#EF4444",
      },
      {
        name: "No Show",
        value: Number(status.noShow ?? 0) || 0,
        color: "#64748B",
      },
    ];
  },

  async getDepartmentWorkload(): Promise<HospitalAdminDeptWorkload[]> {
    const [deptRes, workloadRes] = await Promise.all([
      apiClient.get<DashboardApiResponse<AdminDepartments>>(
        "/api/v1/admin/dashboard/departments",
      ),
      apiClient.get<DashboardApiResponse<AdminDeptWorkload>>(
        "/api/v1/admin/dashboard/departments/workload",
      ),
    ]);

    const departments = unwrap(deptRes).departments || [];
    const workloadMap = new Map(
      (unwrap(workloadRes).workload || []).map((w) => [w.departmentName, w]),
    );

    return departments.map((dept: AdminDepartmentSummaryItem) => {
      const workload = workloadMap.get(dept.departmentName);
      return {
        dept: dept.departmentName,
        appts: dept.appointments,
        avgWaitTimeMinutes: workload?.avgWaitTimeMinutes,
        patientLoad: workload?.patientLoad,
      };
    });
  },

  async getDoctorAvailability(): Promise<HospitalAdminDoctorAvailability[]> {
    const res = await apiClient.get<
      DashboardApiResponse<AdminDoctorAvailability>
    >("/api/v1/admin/dashboard/doctors/availability");
    const availability = unwrap(res);

    return [
      { status: "Available", count: availability.available, color: "#66BB6A" },
      {
        status: "In Consultation",
        count: availability.inConsultation,
        color: "#009688",
      },
      { status: "On Leave", count: availability.onLeave, color: "#EF4444" },
    ];
  },

  async getTodayTimeline(): Promise<HospitalAdminTimelineItem[]> {
    const res = await appointmentsApi.getAppointments({
      date: today(),
      page: 0,
      size: 500,
    });
    const appointments = (res.data as { content?: unknown[] })?.content || [];
    const todayAppointments = appointments
      .filter(
        (a: Record<string, unknown>) => String(a.appointmentDate) === today(),
      )
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
        const timeA = String(a.startTime || "99:99");
        const timeB = String(b.startTime || "99:99");
        return timeA.localeCompare(timeB);
      });

    return todayAppointments.map((a: Record<string, unknown>) => {
      const status = String(a.status || "Scheduled");
      const labelMap: Record<string, string> = {
        BOOKED: "Scheduled",
        CONFIRMED: "Scheduled",
        CHECKED_IN: "In Consultation",
        WAITING_FOR_VITALS: "Waiting",
        WAITING_FOR_DOCTOR_CALL: "Waiting",
        CALLED: "Waiting",
        IN_CONSULTATION: "In Consultation",
        CONSULTATION_COMPLETED: "Completed",
        BILLING_PENDING: "Waiting",
        PAYMENT_COMPLETED: "Completed",
        COMPLETED: "Completed",
        CANCELLED: "Cancelled",
        NO_SHOW: "Cancelled",
        RESCHEDULED: "Scheduled",
      };
      return {
        time: String(a.startTime || "--:--"),
        patient: String(a.patientName || "Unknown"),
        doctor: String(a.doctorName || "Unknown"),
        dept: String(
          (a as Record<string, unknown>).departmentName ||
            (a as Record<string, unknown>).department ||
            "General",
        ),
        status: labelMap[status] || status,
        token: String(a.queueToken || a.appointmentNumber || "--"),
        room: String(
          (a as Record<string, unknown>).opdRoom ||
            (a as Record<string, unknown>).roomNumber ||
            "--",
        ),
        stage: String(a.queueStatus || status || "Scheduled"),
      };
    });
  },

  async getRevenueDistribution(): Promise<HospitalAdminRevenueDist[]> {
    const res = await apiClient.get<DashboardApiResponse<AdminRevenueSummary>>(
      "/api/v1/admin/dashboard/revenue",
    );
    const revenue: Partial<AdminRevenueSummary> = unwrap(res) || {};

    const cash = revenue.cashCollected ?? 0;
    const upi = revenue.upiCollected ?? 0;
    const card = revenue.cardCollected ?? 0;
    const total = revenue.totalRevenue ?? 0;

    const distribution = [
      { name: "Cash", value: cash, color: "#0D47A1" },
      { name: "UPI", value: upi, color: "#009688" },
      { name: "Card", value: card, color: "#66BB6A" },
    ];

    const other = total - cash - upi - card;
    if (other > 0.01) {
      distribution.push({ name: "Other", value: other, color: "#F59E0B" });
    }

    return distribution;
  },

  async getDepartmentSummary(): Promise<HospitalAdminDeptSummary[]> {
    const [deptRes, workloadRes] = await Promise.all([
      apiClient.get<DashboardApiResponse<AdminDepartments>>(
        "/api/v1/admin/dashboard/departments",
      ),
      apiClient.get<DashboardApiResponse<AdminDeptWorkload>>(
        "/api/v1/admin/dashboard/departments/workload",
      ),
    ]);

    const departments = unwrap(deptRes).departments || [];
    const workloadMap = new Map(
      (unwrap(workloadRes).workload || []).map((w) => [w.departmentName, w]),
    );

    return departments.map((dept: AdminDepartmentSummaryItem) => {
      const workload = workloadMap.get(dept.departmentName);
      return {
        departmentId: dept.departmentId,
        departmentName: dept.departmentName,
        appointments: dept.appointments,
        completed: dept.completed,
        waiting: dept.waiting,
        doctorsAvailable: dept.doctorsAvailable,
        status: workload?.patientLoad || dept.status,
        avgWaitTimeMinutes: workload?.avgWaitTimeMinutes ?? 0,
      };
    });
  },
};
