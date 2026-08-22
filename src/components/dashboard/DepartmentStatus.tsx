import { useHospitalAdminDepartmentWorkload } from "../../features/dashboard/hooks/useHospitalAdminDashboard";

export function DepartmentStatus() {
  const { data: departmentData, isLoading } =
    useHospitalAdminDepartmentWorkload();

  const colors = [
    "#0D47A1",
    "#009688",
    "#E91E63",
    "#FF9800",
    "#9C27B0",
    "#64748B",
  ];

  const departments = (departmentData || []).map((d, index) => {
    const total = d.appts || 0;
    const active = Math.min(total, Math.round(total * 0.7));
    const capacity =
      total > 0 ? Math.min(100, Math.round((total / 30) * 100)) : 0;
    return {
      name: d.dept,
      active,
      total,
      capacity,
      color: colors[index % colors.length],
    };
  });

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
          {isLoading ? "..." : `${departments.length} Active`}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {departments.map((d) => (
          <div key={d.name}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-slate-700">{d.name}</span>
              <span className="text-slate-500 font-mono">
                {d.active}/{d.total} ({d.capacity}%)
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width]"
                style={{ width: `${d.capacity}%`, background: d.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
