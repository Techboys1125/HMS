import {
  Building2,
  Users,
  Globe,
  Server,
  Plus,
  Shield,
  Settings,
  Star,
} from "lucide-react";
import {
  DKpi,
  Chip,
  SH,
  ProgressBar,
  PP,
  RB,
} from "../components/DashboardShared";

const HOSPITALS: { name: string; city: string; units: number; staff: number; status: string; plan: string }[] = [];

const SA_AUDIT: { user: string; action: string; time: string; type: string }[] = [];

const ROLE_DIST: { label: string; count: number; color: string }[] = [];

const SYS_METRICS: { label: string; value: number; color: string; icon: React.ElementType }[] = [];

export function SuperAdminDashboard() {
  const totalUsers = ROLE_DIST.reduce((s, r) => s + r.count, 0);
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <DKpi
          title="Total Hospitals"
          value="0"
          sub="--"
          trend="--"
          up={true}
          data={[{ v: 0 }]}
          color="#0D47A1"
          gid="sa1"
          Icon={Building2}
        />
        <DKpi
          title="Total Users"
          value="0"
          sub="--"
          trend="--"
          up={true}
          data={[{ v: 0 }]}
          color="#009688"
          gid="sa2"
          Icon={Users}
        />
        <DKpi
          title="Active Sessions"
          value="0"
          sub="--"
          trend="--"
          up={true}
          data={[{ v: 0 }]}
          color="#0D47A1"
          gid="sa3"
          Icon={Globe}
        />
        <DKpi
          title="System Uptime"
          value="0"
          sub="--"
          trend="--"
          up={true}
          data={[{ v: 0 }]}
          color="#66BB6A"
          gid="sa4"
          Icon={Server}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Hospital Network */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div
                className="text-sm font-semibold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Hospital Network
              </div>
              <div
                className="text-xs text-[#64748B] mt-0.5"
                style={{ fontFamily: RB }}
              >
                All registered facilities
              </div>
            </div>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white text-xs font-medium hover:bg-[#0c3d8a] transition-colors"
              style={{ fontFamily: PP }}
            >
              <Plus size={12} /> Add Hospital
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {[
                  "Hospital",
                  "Location",
                  "Units",
                  "Staff",
                  "Plan",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {HOSPITALS.map((h) => (
                <tr
                  key={h.name}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Building2 size={13} className="text-[#0D47A1]" />
                      </div>
                      <span
                        className="text-sm font-medium text-[#111827] truncate max-w-45"
                        style={{ fontFamily: RB }}
                      >
                        {h.name}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3 text-xs text-[#64748B]"
                    style={{ fontFamily: RB }}
                  >
                    {h.city}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-[#111827]">
                    {h.units}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-[#111827]">
                    {h.staff}
                  </td>
                  <td className="px-5 py-3">
                    <Chip
                      label={h.plan}
                      variant={
                        h.plan === "Enterprise"
                          ? "info"
                          : h.plan === "Professional"
                            ? "teal"
                            : "default"
                      }
                    />
                  </td>
                  <td className="px-5 py-3">
                    <Chip
                      label={h.status === "active" ? "Active" : "Inactive"}
                      variant={h.status === "active" ? "success" : "error"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* System Health */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="System Health" sub="Real-time metrics" />
            <div className="space-y-4">
              {SYS_METRICS.map((m) => (
                <div key={m.label} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: m.color + "15" }}
                  >
                    <m.icon size={14} style={{ color: m.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-xs font-medium text-[#111827]"
                        style={{ fontFamily: RB }}
                      >
                        {m.label}
                      </span>
                      <span
                        className="font-mono text-xs font-semibold"
                        style={{ color: m.value > 80 ? "#EF4444" : m.color }}
                      >
                        {m.value}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${m.value}%`, background: m.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#66BB6A] animate-pulse" />
              <span
                className="text-xs text-[#64748B]"
                style={{ fontFamily: RB }}
              >
                All systems operational · DB: Healthy
              </span>
            </div>
          </div>

          {/* Security Alerts */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="Security Alerts" sub="Requires attention" />
            <div className="space-y-2">
              <div className="text-xs text-[#64748B] text-center py-4" style={{ fontFamily: RB }}>No alerts</div>
            </div>
          </div>

          {/* License */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <SH title="License Status" />
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs text-[#64748B]"
                  style={{ fontFamily: RB }}
                >
                  Seats Used
                </span>
                <span className="font-mono text-xs font-bold text-[#0D47A1]">
                  0 / 1,000
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#0D47A1]"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-xl p-3 border border-[#E5E7EB]">
                <div
                  className="text-[10px] text-[#64748B] mb-1"
                  style={{ fontFamily: RB }}
                >
                  Expires
                </div>
                <div
                  className="text-xs font-semibold text-[#111827]"
                  style={{ fontFamily: PP }}
                >
                  --
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <div
                  className="text-[10px] text-[#0D47A1] mb-1"
                  style={{ fontFamily: RB }}
                >
                  Plan
                </div>
                <div
                  className="text-xs font-semibold text-[#0D47A1]"
                  style={{ fontFamily: PP }}
                >
                  --
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: User Distribution + Audit Log */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* User Distribution */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH
            title="User Role Distribution"
            sub={`${totalUsers.toLocaleString()} total users`}
          />
          <div className="space-y-3">
            {ROLE_DIST.map((r) => (
              <ProgressBar
                key={r.label}
                label={r.label}
                value={r.count}
                total={totalUsers}
                color={r.color}
                sub={`${r.count.toLocaleString()} users`}
              />
            ))}
          </div>
        </div>
        {/* Audit Log */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
          <SH
            title="Recent Audit Events"
            sub="Platform activity log"
            action={
              <button
                className="text-xs text-[#0D47A1] font-medium hover:underline"
                style={{ fontFamily: RB }}
              >
                View All
              </button>
            }
          />
          <div>
            {SA_AUDIT.map((a, i) => (
              <div
                key={`${a.user}-${i}`}
                className="flex items-start gap-3 py-2.5 border-b border-[#E5E7EB] last:border-0"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    a.type === "system"
                      ? "bg-green-50"
                      : a.type === "role"
                        ? "bg-purple-50"
                        : "bg-blue-50"
                  }`}
                >
                  {a.type === "system" && (
                    <Server size={11} className="text-[#66BB6A]" />
                  )}
                  {a.type === "role" && (
                    <Shield size={11} className="text-violet-600" />
                  )}
                  {a.type === "user" && (
                    <Users size={11} className="text-[#0D47A1]" />
                  )}
                  {a.type === "settings" && (
                    <Settings size={11} className="text-[#009688]" />
                  )}
                  {a.type === "license" && (
                    <Star size={11} className="text-[#F59E0B]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-xs font-medium text-[#111827] leading-snug"
                    style={{ fontFamily: RB }}
                  >
                    <span className="font-semibold">{a.user}</span> — {a.action}
                  </div>
                </div>
                <span
                  className="text-[10px] text-slate-400 shrink-0"
                  style={{ fontFamily: RB }}
                >
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
