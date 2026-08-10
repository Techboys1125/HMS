import React from "react";

export const PrescriptionTimeline: React.FC<{ timeline: { title: string; time: string; desc: string }[] }> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return <div className="text-xs text-slate-400 p-2">No timeline events available.</div>;
  }
  return (
    <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 pl-8">
      {timeline.map((event, idx) => (
        <div key={idx} className="relative text-xs">
          <span className="absolute -left-6.75 top-1 w-2.5 h-2.5 rounded-full bg-[#0D47A1] border-2 border-white" />
          <div className="font-semibold text-slate-800">{event.title}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{event.time}</div>
          <p className="text-slate-500 mt-1">{event.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionTimeline;
