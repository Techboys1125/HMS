import React from "react";
import { ChevronRight } from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

interface BreadcrumbItem {
  label: string;
  active?: boolean;
}

interface ConsultationHeaderProps {
  roleLabel: string;
  moduleLabel?: string;
  pageTitle: string;
  subtitle?: string;
  statusBadge?: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const ConsultationHeader: React.FC<ConsultationHeaderProps> = ({
  roleLabel,
  moduleLabel = "OPD Consultation",
  pageTitle,
  subtitle,
  statusBadge,
  breadcrumbs,
  actions,
}) => {
  return (
    <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div
            className="flex items-center gap-2 text-xs text-[#64748B] mb-1"
            style={{ fontFamily: RB }}
          >
            <span>{roleLabel}</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span>{moduleLabel}</span>
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight size={12} className="text-slate-400" />
                <span
                  className={b.active ? "font-semibold text-[#0D47A1]" : ""}
                >
                  {b.label}
                </span>
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl font-bold text-[#111827]"
              style={{ fontFamily: PP }}
            >
              {pageTitle}
            </h1>
            {statusBadge}
          </div>
          {subtitle && (
            <p
              className="text-sm text-[#64748B] mt-0.5"
              style={{ fontFamily: RB }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default ConsultationHeader;
