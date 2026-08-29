import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useBillingConfiguration } from "../hooks/useBilling";
import { BillingConfigurationForm } from "../components/BillingConfigurationForm";
import { RB } from "../constants/billing.constants";

export function BillingConfigurationPage({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  const { configuration, saveConfiguration } = useBillingConfiguration();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div style={{ padding: "20px", background: "#F1F5F9", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 mb-4 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all cursor-pointer"
          style={{ fontFamily: RB }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <BillingConfigurationForm
          initialConfig={configuration}
          onSave={saveConfiguration}
        />
      </div>
    </div>
  );
}

export default BillingConfigurationPage;
