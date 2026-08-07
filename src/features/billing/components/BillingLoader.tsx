import { RB } from "../constants/billing.constants";

export function BillingLoader() {
  return (
    <div
      className="flex flex-col items-center justify-center p-12 text-slate-500 text-xs gap-2"
      style={{ fontFamily: RB }}
    >
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-[#0D47A1] animate-spin" />
      <span>Loading billing records...</span>
    </div>
  );
}

export default BillingLoader;
