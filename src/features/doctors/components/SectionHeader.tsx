import React from "react";
import { PP, RB } from "../constants/doctors.constants";

export interface SectionHeaderProps {
  title: string;
  sub?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  sub,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 ${className}`}
    >
      <div>
        <h1
          className="text-xl font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          {title}
        </h1>
        {sub && (
          <p
            className="text-xs text-slate-500 mt-0.5"
            style={{ fontFamily: RB }}
          >
            {sub}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
};

export default SectionHeader;
