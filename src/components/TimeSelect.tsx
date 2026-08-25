import { formatTime, to24Hour } from "../lib/time-utils";

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  placeholder?: string;
}

const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    TIME_OPTIONS.push(`${hh}:${mm}`);
  }
}

export function TimeSelect({
  value,
  onChange,
  disabled = false,
  className = "",
  error = false,
  placeholder = "Select time",
}: TimeSelectProps) {
  const displayValue = formatTime(value);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = e.target.value;
    if (!raw) {
      onChange("");
      return;
    }
    const h24 = to24Hour(raw);
    onChange(h24 || raw);
  };

  return (
    <select aria-label="Select option"
      disabled={disabled}
      value={displayValue}
      onChange={handleChange}
      className={`bg-white border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0D47A1] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed font-medium ${
        error ? "border-red-500 bg-red-50/50" : "border-[#E5E7EB]"
      } ${className}`}
    >
      <option value="">{placeholder}</option>
      {TIME_OPTIONS.map((t) => (
        <option key={t} value={formatTime(t)}>
          {formatTime(t)}
        </option>
      ))}
    </select>
  );
}
