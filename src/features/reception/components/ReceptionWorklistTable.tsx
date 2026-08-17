import React from "react";
import { useNavigate } from "react-router";
import type {
  ReceptionQueueItem,
  ReceptionPermissions,
  QueueStatus,
} from "../types/reception.types";
import { QueueTokenBadge } from "./QueueTokenBadge";
import { BillingStatusIndicator } from "./BillingStatusIndicator";
import { UserCheck, Printer, XCircle, Clock } from "lucide-react";
import { formatTime } from "../../../lib/time-utils";

interface ReceptionWorklistTableProps {
  queue: ReceptionQueueItem[];
  permissions: ReceptionPermissions;
  onCheckIn: (item: ReceptionQueueItem) => void;
  onPrintVisitSlip: (item: ReceptionQueueItem) => void;
  onUpdateStatus: (itemId: string | number, status: QueueStatus) => void;
  onViewPatientDetails: (patientId: string | number) => void;
}

export const ReceptionWorklistTable: React.FC<ReceptionWorklistTableProps> = ({
  queue,
  permissions,
  onCheckIn,
  onPrintVisitSlip,
  onUpdateStatus,
  onViewPatientDetails,
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col flex-1">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3.5">Token / Status</th>
              <th className="px-4 py-3.5">Patient Info</th>
              <th className="px-4 py-3.5">Department & Doctor</th>
              <th className="px-4 py-3.5">Time & Arrival</th>
              <th className="px-4 py-3.5">Billing</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-xs font-medium text-slate-700">
            {queue.length > 0 ? (
              queue.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onViewPatientDetails(item.patientId)}
                >
                  {/* Token & Status */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono font-bold text-sm text-[#0D47A1]">
                        {item.tokenNumber}
                      </span>
                      <QueueTokenBadge status={item.queueStatus} size="sm" />
                    </div>
                  </td>

                  {/* Patient Info */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-[#0D47A1] transition-colors">
                        {item.patientName}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                        <span>{item.mrn}</span>
                        <span>•</span>
                        <span>
                          {item.gender} ({item.age || 30}y)
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {item.mobile}
                      </span>
                    </div>
                  </td>

                  {/* Department & Doctor */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">
                        {item.departmentName}
                      </span>
                      <span className="text-slate-500 text-[11px] mt-0.5">
                        {item.doctorName}
                      </span>
                    </div>
                  </td>

                  {/* Time & Arrival */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />{" "}
                        {formatTime(item.appointmentTime)}
                      </span>
                      {item.arrivalTime ? (
                        <span className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                          Arrived at {formatTime(item.arrivalTime)}
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-medium mt-0.5">
                          Not Checked In
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Billing */}
                  <td className="px-4 py-3.5">
                    <BillingStatusIndicator
                      status={item.billingStatus}
                      amount={item.consultationFee}
                    />
                  </td>

                  {/* Action Buttons */}
                  <td
                    className="px-4 py-3.5 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      {item.billingStatus?.toUpperCase() === "PENDING" && (
                        <button
                          onClick={() => {
                            navigate(
                              `/billing/create?appointmentId=${item.appointmentId || ""}&patientMrn=${item.mrn}&doctorId=${item.doctorId || ""}`
                            );
                          }}
                          className="px-3 py-1.5 bg-[#0D47A1] hover:bg-blue-900 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                          title="Generate Invoice"
                        >
                          Generate Invoice
                        </button>
                      )}

                      {permissions.canCheckInPatient &&
                        item.queueStatus === "WAITING" &&
                        !item.arrivalTime && (
                          <button
                            onClick={() => onCheckIn(item)}
                            className="px-3 py-1.5 bg-[#009688] hover:bg-[#00796B] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Arrival Check-In"
                          >
                            <UserCheck size={13} /> Check-In
                          </button>
                        )}

                      {permissions.canPrintVisitSlip && (
                        <button
                          onClick={() => onPrintVisitSlip(item)}
                          className="p-1.5 text-slate-600 hover:text-[#0D47A1] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Print Visit Slip"
                        >
                          <Printer size={15} />
                        </button>
                      )}

                      {permissions.canCancelQueueItem &&
                        item.queueStatus !== "CANCELLED" &&
                        item.queueStatus !== "COMPLETED" && (
                          <button
                            onClick={() => onUpdateStatus(item.id, "CANCELLED")}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Cancel Queue Item"
                          >
                            <XCircle size={15} />
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-400 font-medium"
                >
                  No reception queue items found matching the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
