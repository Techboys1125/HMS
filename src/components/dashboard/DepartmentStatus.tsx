import { DEPARTMENTS } from "../../constants/dashboard";

export function DepartmentStatus() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm shadow-slate-50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-[#111827]">
            Department Occupancy
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Real-time OPD active load
          </div>
        </div>
        <span className="text-xs font-semibold text-[#0D47A1] bg-blue-50 px-2.5 py-1 rounded-full">
          5 Active
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {DEPARTMENTS.map((d) => (
          <div key={d.name}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-slate-700">{d.name}</span>
              <span className="text-slate-500 font-mono">
                {d.active}/{d.total} ({d.capacity}%)
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${d.capacity}%`, background: d.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
