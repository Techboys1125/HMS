import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import type {
  DoctorRecord,
  ApiScheduleExceptionItem,
  ExceptionType,
  ExceptionAction,
} from "../../types/doctors.types";
import { PP } from "../../constants/doctors.constants";
import { doctorsService } from "../../services/doctors.service";

import { resolveDoctorId } from "../../services/doctorProfile.service";

export interface ScheduleExceptionsTabProps {
  doctor: DoctorRecord;
  canEdit: boolean;
  onClose?: () => void;
}

export function ScheduleExceptionsTab({
  doctor,
  canEdit,
}: ScheduleExceptionsTabProps) {
  const [exceptions, setExceptions] = useState<ApiScheduleExceptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newException, setNewException] = useState({
    exceptionType: "VACATION" as ExceptionType,
    startDate: "",
    endDate: "",
    isFullDay: true,
    reason: "",
    action: "BLOCK_APPOINTMENTS" as ExceptionAction,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadExceptions() {
      setLoading(true);
      try {
        const targetId = resolveDoctorId(doctor);
        const data = await doctorsService.getScheduleExceptions(targetId);
        if (cancelled) return;
        setExceptions(data || []);
      } catch (err) {
        if (!cancelled) {
          console.log(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadExceptions();

    return () => {
      cancelled = true;
    };
  }, [doctor]);

  const handleAdd = async () => {
    if (!newException.startDate || !newException.endDate) return;
    setSaving(true);
    try {
      const targetId = resolveDoctorId(doctor);
      const created = await doctorsService.createScheduleException(
        targetId,
        newException,
      );
      if (created) {
        setExceptions((prev) => [...prev, created]);
        setNewException({
          exceptionType: "VACATION",
          startDate: "",
          endDate: "",
          isFullDay: true,
          reason: "",
          action: "BLOCK_APPOINTMENTS",
        });
        setShowAddForm(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (exceptionId: number | string) => {
    try {
      const targetId = resolveDoctorId(doctor);
      await doctorsService.deleteScheduleException(targetId, exceptionId);
      setExceptions((prev) => prev.filter((e) => e.id !== exceptionId));
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">
        Loading exceptions...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3
          className="text-sm font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          Schedule Exceptions
        </h3>
        {canEdit && (
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1"
          >
            <Plus size={12} /> Add Exception
          </button>
        )}
      </div>

      {showAddForm && canEdit && (
        <div className="bg-slate-50 border border-[#E5E7EB] rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="block text-[11px] font-bold text-[#64748B] mb-1">
                Type
                <select
                  aria-label="Select option"
                  value={newException.exceptionType}
                  onChange={(e) =>
                    setNewException({
                      ...newException,
                      exceptionType: e.target.value as ExceptionType,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg outline-none focus:border-[#0D47A1]"
                >
                  <option value="VACATION">Vacation</option>
                  <option value="TRAINING">Training</option>
                  <option value="CONFERENCE">Conference</option>
                  <option value="SURGERY">Surgery</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="OTHER">Other</option>
                </select>
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold text-[#64748B] mb-1">
                Start Date
                <input
                  aria-label="Input field"
                  type="date"
                  value={newException.startDate}
                  onChange={(e) =>
                    setNewException({
                      ...newException,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg outline-none focus:border-[#0D47A1]"
                />
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold text-[#64748B] mb-1">
                End Date
                <input
                  aria-label="Input field"
                  type="date"
                  value={newException.endDate}
                  onChange={(e) =>
                    setNewException({
                      ...newException,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg outline-none focus:border-[#0D47A1]"
                />
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold text-[#64748B] mb-1">
                Action
                <select
                  aria-label="Select option"
                  value={newException.action}
                  onChange={(e) =>
                    setNewException({
                      ...newException,
                      action: e.target.value as ExceptionAction,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg outline-none focus:border-[#0D47A1]"
                >
                  <option value="BLOCK_APPOINTMENTS">Block Appointments</option>
                </select>
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="block text-[11px] font-bold text-[#64748B] mb-1">
                Reason
                <input
                  aria-label="Input field"
                  type="text"
                  value={newException.reason}
                  onChange={(e) =>
                    setNewException({ ...newException, reason: e.target.value })
                  }
                  placeholder="Reason for exception"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg outline-none focus:border-[#0D47A1]"
                />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors disabled:opacity-60"
            >
              {saving ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {exceptions.length === 0 ? (
        <div className="text-center py-8 text-xs text-[#64748B]">
          No schedule exceptions configured.
        </div>
      ) : (
        <div className="space-y-2">
          {exceptions.map((exc) => (
            <div
              key={exc.id}
              className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#111827]">
                    {exc.reason ||
                      (
                        {
                          VACATION: "Vacation",
                          TRAINING: "Training",
                          CONFERENCE: "Conference",
                          SURGERY: "Surgery",
                          EMERGENCY: "Emergency",
                          OTHER: "Other",
                        } as Record<string, string>
                      )[String(exc.exceptionType || "")] ||
                      exc.exceptionType}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      exc.exceptionType === "SURGERY"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : exc.exceptionType === "EMERGENCY"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : exc.exceptionType === "CONFERENCE"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {(
                      {
                        VACATION: "Vacation",
                        TRAINING: "Training",
                        CONFERENCE: "Conference",
                        SURGERY: "Surgery",
                        EMERGENCY: "Emergency",
                        OTHER: "Other",
                      } as Record<string, string>
                    )[String(exc.exceptionType || "")] || exc.exceptionType}
                  </span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">
                  {exc.startDate} → {exc.endDate}{" "}
                  {exc.isFullDay
                    ? "(Full Day)"
                    : `${exc.startTime} - ${exc.endTime}`}
                </div>
              </div>
              {canEdit && (
                <button
                  aria-label="Delete"
                  type="button"
                  onClick={() => handleDelete(exc.id!)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
