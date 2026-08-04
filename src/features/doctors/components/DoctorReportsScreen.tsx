import { useState } from "react";
import { TrendingUp, TrendingDown, Download } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { WEEKLY_CONSULTATIONS } from "../constants/doctors.constants";
import { PP, RB } from "../constants/doctors.constants";
import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";

export function DoctorReportsScreen() {
  const [period, setPeriod] = useState<"week" | "month">("week");

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F1F5F9]">
      <SectionHeader
        title="My Reports"
        sub="Consultation and patient outcome statistics"
        action={
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-100 shadow-sm">
            {(["week", "month"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${period === p ? "bg-[#0D47A1] text-white" : "text-slate-500 hover:text-slate-700"}`}
                style={{ fontFamily: RB }}
              >
                This {p}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Consultations",
            value: "112",
            trend: "+8%",
            up: true,
            color: "#0D47A1",
          },
          {
            label: "Avg. Duration",
            value: "14m",
            trend: "-2m",
            up: true,
            color: "#009688",
          },
          {
            label: "Patients Seen",
            value: "98",
            trend: "+5%",
            up: true,
            color: "#66BB6A",
          },
          {
            label: "Follow-ups Due",
            value: "23",
            trend: "+3",
            up: false,
            color: "#F59E0B",
          },
        ].map((k) => (
          <Card key={k.label} className="p-5">
            <div
              className="text-xs font-medium text-slate-400 mb-1"
              style={{ fontFamily: RB }}
            >
              {k.label}
            </div>
            <div
              className="text-2xl font-bold text-[#111827] leading-none"
              style={{ fontFamily: PP, color: k.color }}
            >
              {k.value}
            </div>
            <div
              className={`flex items-center gap-1 text-xs mt-2 font-medium ${k.up ? "text-green-600" : "text-amber-600"}`}
              style={{ fontFamily: RB }}
            >
              {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{" "}
              {k.trend}
              <span className="text-slate-400 font-normal">
                vs last {period}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div
                className="text-sm font-semibold text-[#111827]"
                style={{ fontFamily: PP }}
              >
                Daily Consultations — This Week
              </div>
              <button
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 border border-gray-100 px-2.5 py-1.5 rounded-lg"
                style={{ fontFamily: RB }}
              >
                <Download size={11} /> Export
              </button>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={WEEKLY_CONSULTATIONS}
                  margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
                >
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: RB }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94A3B8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 11,
                      fontFamily: RB,
                      borderRadius: 10,
                      border: "1px solid #E5E7EB",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name="Consultations"
                    radius={[6, 6, 0, 0]}
                  >
                    {WEEKLY_CONSULTATIONS.map((_, i) => (
                      <Cell key={i} fill={i === 3 ? "#0D47A1" : "#DBEAFE"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <div
            className="text-sm font-semibold text-[#111827] mb-4"
            style={{ fontFamily: PP }}
          >
            Top Complaints
          </div>
          <div className="space-y-3">
            {[
              { name: "Hypertension F/U", pct: 34, color: "#0D47A1" },
              { name: "Diabetes Review", pct: 28, color: "#009688" },
              { name: "Chest Pain", pct: 18, color: "#EF4444" },
              { name: "Cardiology", pct: 12, color: "#9C27B0" },
              { name: "Other", pct: 8, color: "#94A3B8" },
            ].map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: c.color }}
                    />
                    <span
                      className="text-xs font-medium text-[#111827]"
                      style={{ fontFamily: RB }}
                    >
                      {c.name}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold text-slate-500"
                    style={{ fontFamily: PP }}
                  >
                    {c.pct}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.pct}%`, background: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
