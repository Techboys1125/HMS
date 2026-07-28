import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
} from "lucide-react";

import { PP, RB, TIMELINE_EVENTS } from "../constants/patient.mock";

import { TimelineStatusBadge } from "../components/StatusBadges";

export function PatientTimelineScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-6">
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
              Patient Timeline
            </h1>
          </div>
          <div
            className="flex items-center gap-1.5 text-sm text-slate-500 pl-8"
            style={{ fontFamily: RB }}
          >
            <span>Dashboard</span>
            <ChevronRight size={14} className="text-slate-300" />
            <button
              onClick={onBack}
              className="hover:text-[#0D47A1] transition-colors"
            >
              Patients
            </button>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Timeline</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors placeholder:text-slate-400"
              style={{ fontFamily: RB }}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="px-3 py-2 text-sm bg-slate-50 border border-gray-200 rounded-lg text-[#111827] outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
            />
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-100" />

            <div className="space-y-8">
              {TIMELINE_EVENTS.map((event) => (
                <div key={event.id} className="relative flex items-start gap-6">
                  {/* Timeline Dot */}
                  <div
                    className={`w-14 h-14 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 z-10 ${event.color}`}
                  >
                    <event.icon size={22} />
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <h3
                          className="text-base font-bold text-[#111827]"
                          style={{ fontFamily: PP }}
                        >
                          {event.event}
                        </h3>
                        <div
                          className="flex items-center gap-3 text-sm text-slate-500 mt-1"
                          style={{ fontFamily: RB }}
                        >
                          <span className="flex items-center gap-1">
                            <Calendar size={14} /> {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {event.time}
                          </span>
                        </div>
                      </div>
                      <TimelineStatusBadge status={event.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-50 mt-3">
                      <div>
                        <span className="block text-xs font-medium text-slate-400 mb-0.5 uppercase tracking-wide">
                          Doctor/Staff
                        </span>
                        <span className="text-sm font-medium text-[#111827]">
                          {event.doctor}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-medium text-slate-400 mb-0.5 uppercase tracking-wide">
                          Department
                        </span>
                        <span className="text-sm font-medium text-[#111827]">
                          {event.dept}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
