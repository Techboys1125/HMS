import { Clock, Loader2, MapPin, Ticket, User, Users } from "lucide-react";
import { usePatientQueue } from "../hooks/usePatientQueue";

export function PatientQueueCard({
  onViewQueue,
}: {
  onViewQueue?: () => void;
}) {
  const { queue, loading, error } = usePatientQueue();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex items-center gap-3">
        <Loader2 size={18} className="animate-spin text-[#0D47A1]" />
        <span className="text-xs font-semibold text-[#64748B]">
          Checking your queue status...
        </span>
      </div>
    );
  }

  if (error || !queue) {
    return null;
  }

  const normalizedStatus = String(queue.status || "").toUpperCase();
  if (
    normalizedStatus === "COMPLETED" ||
    normalizedStatus === "CLOSED" ||
    normalizedStatus === "CANCELLED" ||
    normalizedStatus === "NONE" ||
    !queue.token
  ) {
    return null;
  }

  const statusLabel =
    queue.status === "CALLED"
      ? "Called — please proceed to the doctor"
      : queue.status === "IN_CONSULTATION"
        ? "In consultation"
        : queue.status === "COMPLETED"
          ? "Completed"
          : "Waiting";

  return (
    <div className="bg-white rounded-2xl border border-[#0D47A1]/20 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket size={16} className="text-[#0D47A1]" />
          <h3 className="text-sm font-bold text-[#111827]">My Queue Status</h3>
        </div>
        {onViewQueue && (
          <button
            onClick={onViewQueue}
            className="text-[11px] font-semibold text-[#0D47A1] hover:underline"
          >
            View details
          </button>
        )}
      </div>

      <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">
            Token
          </span>
          <span className="text-xl font-bold text-[#0D47A1] font-mono">
            {queue.token || "—"}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">
            Position
          </span>
          <span className="text-xl font-bold text-[#111827]">
            #{queue.position ?? "—"}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">
            Patients Ahead
          </span>
          <span className="text-xl font-bold text-[#111827] flex items-center gap-1">
            <Users size={15} className="text-slate-400" />
            {queue.patientsAhead ?? 0}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">
            Estimated Wait
          </span>
          <span className="text-xl font-bold text-[#009688] flex items-center gap-1">
            <Clock size={15} />
            {queue.estimatedWaitMinutes ?? 0} min
          </span>
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-semibold text-[#111827]">
            <User size={13} className="text-slate-400" />
            {queue.doctorName || "Doctor"}
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <MapPin size={13} className="text-slate-400" />
            {queue.departmentName || "Department"}
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#0D47A1] text-white text-[10px] font-bold">
          {statusLabel}
        </span>
      </div>
    </div>
  );
}
