import React from "react";
import { Activity, Thermometer, ArrowUpRight, Scale } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface VitalsValues {
  height?: string;
  weight?: string;
  bmi?: string;
  bp: string;
  pulse: string;
  temp: string;
  spo2: string;
  respiratoryRate?: string;
  bloodSugar?: string;
}

interface VitalsCardProps {
  values: VitalsValues;
  isEditable?: boolean;
  onChange?: (field: keyof VitalsValues, val: string) => void;
  errors?: string[];
}

export const VitalsCard: React.FC<VitalsCardProps> = ({
  values,
  isEditable = false,
  onChange,
}) => {
  // Auto-calculated BMI
  const computedBmi = React.useMemo(() => {
    if (values.bmi) return values.bmi;
    const h = parseFloat(values.height || "0") / 100;
    const w = parseFloat(values.weight || "0");
    if (h > 0 && w > 0) return (w / (h * h)).toFixed(1);
    return "--";
  }, [values.height, values.weight, values.bmi]);

  const cards = [
    {
      label: "Height (cm)",
      field: "height" as const,
      value: values.height || "--",
      icon: Scale,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Weight (kg)",
      field: "weight" as const,
      value: values.weight || "--",
      icon: Scale,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "BMI (kg/m²)",
      field: "bmi" as const,
      value: computedBmi,
      icon: ArrowUpRight,
      color: "text-purple-600",
      bg: "bg-purple-50",
      readOnlyOnly: true,
    },
    {
      label: "Temperature (°C)",
      field: "temp" as const,
      value: values.temp || "--",
      icon: Thermometer,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Blood Pressure (mmHg)",
      field: "bp" as const,
      value: values.bp || "--",
      icon: Activity,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Heart Rate (bpm)",
      field: "pulse" as const,
      value: values.pulse || "--",
      icon: Activity,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "Respiratory Rate (/min)",
      field: "respiratoryRate" as const,
      value: values.respiratoryRate || "--",
      icon: Activity,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "SpO₂ (%)",
      field: "spo2" as const,
      value: values.spo2 || "--",
      icon: Activity,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      label: "Blood Sugar (mg/dL)",
      field: "bloodSugar" as const,
      value: values.bloodSugar || "--",
      icon: Activity,
      color: "text-fuchsia-600",
      bg: "bg-fuchsia-50",
    },
  ];

  if (isEditable && onChange) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3
            className="text-sm font-bold text-[#111827] flex items-center gap-2"
            style={{ fontFamily: PP }}
          >
            <Activity size={16} className="text-[#0D47A1]" />
            Patient Vitals Intake
          </h3>
          <span className="text-[10px] bg-blue-50 text-[#0D47A1] px-2 py-0.5 rounded font-bold">
            Record Vitals
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cards.map((c) => {
            const isBmi = c.field === "bmi";
            return (
              <div key={c.field} className="space-y-1">
                <span
                  className="block text-[11px] font-semibold text-[#64748B]"
                  style={{ fontFamily: PP }}
                >
                  {c.label}
                </span>
                {isBmi ? (
                  <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-slate-100 text-slate-500 font-semibold select-none">
                    {computedBmi}
                  </div>
                ) : (
                  <input
                    aria-label="Input field"
                    type="text"
                    value={values[c.field] || ""}
                    onChange={(e) => onChange(c.field, e.target.value)}
                    placeholder="Enter value"
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-xl bg-slate-50 outline-none focus:border-[#0D47A1] focus:bg-white transition-colors"
                    style={{ fontFamily: RB }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Read-only grid layout
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white border border-[#E5E7EB] rounded-xl p-3 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-semibold text-slate-400"
              style={{ fontFamily: PP }}
            >
              {c.label.split(" ")[0]}
            </span>
            <div
              className={`w-6 h-6 rounded-lg ${c.bg} ${c.color} flex items-center justify-center`}
            >
              <c.icon size={12} />
            </div>
          </div>
          <div className="mt-2">
            <div
              className="text-sm font-bold text-slate-800"
              style={{ fontFamily: PP }}
            >
              {c.field === "bmi" ? computedBmi : values[c.field] || "--"}
            </div>
            <div
              className="text-[9px] text-slate-400"
              style={{ fontFamily: RB }}
            >
              {c.label.includes("(")
                ? c.label.substring(
                    c.label.indexOf("(") + 1,
                    c.label.indexOf(")"),
                  )
                : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VitalsCard;
