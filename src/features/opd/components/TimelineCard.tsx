import React from "react";
import { Clock } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface TimelineEvent {
  title: string;
  date: string;
  time: string;
  status: string;
  badgeColor: string;
  description?: string;
}

interface TimelineCardProps {
  events: TimelineEvent[];
  title?: string;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  events = [],
  title = "Clinical Timeline",
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Clock size={16} className="text-[#0D47A1]" />
        <h3
          className="text-sm font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          {title}
        </h3>
      </div>

      <div className="space-y-0 pl-1">
        {events.map((e, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0D47A1] mt-1.5" />
              {idx < events.length - 1 && (
                <div className="w-0.5 flex-1 bg-slate-100 my-0.5" />
              )}
            </div>
            <div className="pb-4 text-xs">
              <div
                className="flex flex-wrap items-center gap-1.5 font-bold text-slate-800"
                style={{ fontFamily: PP }}
              >
                <span>{e.title}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${e.badgeColor}`}
                >
                  {e.status}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {e.date} · {e.time}
              </div>
              {e.description && (
                <div
                  className="text-slate-600 mt-1 leading-snug"
                  style={{ fontFamily: RB }}
                >
                  {e.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineCard;
