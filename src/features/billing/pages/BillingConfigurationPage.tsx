import { useBillingConfiguration } from "../hooks/useBilling";
import { BillingConfigurationForm } from "../components/BillingConfigurationForm";

export function BillingConfigurationPage() {
  const { configuration, saveConfiguration } = useBillingConfiguration();

  return (
    <div style={{ padding: "20px", background: "#F1F5F9", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <BillingConfigurationForm
          initialConfig={configuration}
          onSave={saveConfiguration}
        />
      </div>
    </div>
  );
}

export default BillingConfigurationPage;
