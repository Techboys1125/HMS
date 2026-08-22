import { RefreshCw, Check } from "lucide-react";
import { useHospitalAdminStatusDistribution } from "../../features/dashboard/hooks/useHospitalAdminDashboard";

export function PatientJourney() {
  const {
    data: statusDist,
    refetch,
    isFetching,
  } = useHospitalAdminStatusDistribution();

  const total =
    (statusDist || []).reduce((acc, curr) => acc + curr.value, 0) || 1;

  const journeySteps = (statusDist || []).map((s) => ({
    step: s.name,
    count: s.value,
    done: s.name === "Completed" || s.name === "Checked In",
    color: s.color,
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm shadow-slate-50">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-sm font-semibold text-[#111827]">
            Patient Journey
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Live workflow — today
          </div>
        </div>
        <RefreshCw
          size={13}
          onClick={() => refetch()}
          className={`text-slate-400 cursor-pointer hover:text-slate-600 transition-colors ${
            isFetching ? "animate-spin" : ""
          }`}
        />
      </div>
      <div className="flex flex-col gap-0">
        {journeySteps.map((s, i) => {
          const isLast = i === journeySteps.length - 1;
          const isCompleted = s.done;
          const pct = Math.round((s.count / total) * 100);
          return (
            <div key={s.step} className="flex items-stretch gap-3">
              <div
                className="flex flex-col items-center"
                style={{ width: 20 }}
              >
                <div
                  className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${
                    isCompleted ? "bg-[#009688]" : "bg-[#0D47A1]"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={8} className="text-white" strokeWidth={3} />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                {!isLast && <div className="w-px flex-1 bg-gray-100 my-0.5" />}
              </div>
              <div className="flex-1 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[#111827]">
                    {s.step}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-600">
                    {s.count}
                  </span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-[width]"
                    style={{
                      width: `${pct}%`,
                      background: isCompleted ? "#009688" : "#0D47A1",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
