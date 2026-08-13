import { useRef, useState } from "react";
import { useHospitalConfiguration } from "../hooks/useHospitalConfiguration";
import { HospitalTopBar } from "../components/hospital/HospitalTopBar";
import { BrandingSection } from "../components/hospital/BrandingSection";
import { ContactSection } from "../components/hospital/ContactSection";
import { AddressSection } from "../components/hospital/AddressSection";
import { OperationalSection } from "../components/hospital/OperationalSection";
import { PrintHeaderPreviewSection } from "../components/hospital/PrintHeaderPreviewSection";
import { SocialSection } from "../components/hospital/SocialSection";
import { InternalNotesSection } from "../components/hospital/InternalNotesSection";
import { PrintHeaderPreviewModal } from "../components/hospital/PrintHeaderPreviewModal";
import { FeedbackToasts } from "../components/hospital/FeedbackToasts";

const RB = "'Roboto', system-ui, sans-serif";

export function HospitalInformationPage() {
  const {
    form: formData,
    loading,
    saving,
    uploading,
    error: apiError,
    success: saveStatus,
    printHeader,
    updateField,
    save: saveConfiguration,
    reset: resetConfiguration,
    uploadLogo,
    uploadBanner,
    loadPrintHeader,
    reload,
  } = useHospitalConfiguration();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    field: string,
    value: string | boolean | number,
  ) => {
    updateField(field, value);
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.hospitalName.trim())
      newErrors.hospitalName = "Hospital Name is required";
    if (!formData.officialEmail.trim()) {
      newErrors.officialEmail = "Official Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.officialEmail)) {
      newErrors.officialEmail = "Invalid email address";
    }
    if (!formData.primaryPhone.trim())
      newErrors.primaryPhone = "Primary Phone is required";
    if (!formData.licenseNumber.trim())
      newErrors.licenseNumber = "License Number is required";
    if (formData.website && !formData.website.startsWith("http")) {
      newErrors.website = "Website must start with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      await saveConfiguration();
    }
  };

  const handleReset = async () => {
    await resetConfiguration();
  };

  const handleOpenPreview = () => {
    setShowPreviewModal(true);
    loadPrintHeader();
  };

  const handleLogoUpload = (file: File | undefined) => {
    if (file) uploadLogo(file);
  };

  const handleBannerUpload = (file: File | undefined) => {
    if (file) uploadBanner(file);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          width: "100%",
          minHeight: "320px",
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "3px solid #E3F2FD",
            borderTopColor: "#0D47A1",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span
          style={{
            fontFamily: RB,
            fontSize: "13px",
            color: "#64748B",
          }}
        >
          Loading hospital configuration...
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "20px",
      }}
      >
        {apiError && (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{apiError}</span>
            <button
              type="button"
              className="shrink-0 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700"
              onClick={() => void reload().catch(() => undefined)}
            >
              Retry
            </button>
          </div>
        )}
        {/* MAIN CONTENT SECTIONS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
        }}
      >
        {/* TOP BAR / SUB-HEADER ACTION ROW */}
        <HospitalTopBar
          saving={saving}
          onSave={handleSave}
          onReset={handleReset}
          onPreview={handleOpenPreview}
        />

        {/* SECTION 01: HOSPITAL BRANDING */}
        <BrandingSection
          form={formData}
          errors={errors}
          onChange={handleInputChange}
          uploading={uploading}
          logoUrl={formData.logoUrl}
          bannerUrl={formData.bannerUrl}
          onUploadLogo={handleLogoUpload}
          onUploadBanner={handleBannerUpload}
          logoInputRef={logoInputRef}
          bannerInputRef={bannerInputRef}
        />

        {/* SECTION 02: HOSPITAL CONTACT INFORMATION */}
        <ContactSection
          form={formData}
          errors={errors}
          onChange={handleInputChange}
        />

        {/* SECTION 03: HOSPITAL ADDRESS */}
        <AddressSection
          form={formData}
          errors={errors}
          onChange={handleInputChange}
        />

        {/* SECTION 04: HOSPITAL OPERATIONAL DETAILS */}
        <OperationalSection
          form={formData}
          errors={errors}
          onChange={handleInputChange}
        />

        {/* SECTION 05: INVOICE & PRINT HEADER PREVIEW */}
        <PrintHeaderPreviewSection form={formData} />

        {/* SECTION 06: HOSPITAL SOCIAL & COMMUNICATION */}
        <SocialSection
          form={formData}
          errors={errors}
          onChange={handleInputChange}
        />

        {/* SECTION 07: INTERNAL NOTES */}
        <InternalNotesSection form={formData} onChange={handleInputChange} />
      </div>

      {/* PRINT HEADER PREVIEW MODAL */}
      <PrintHeaderPreviewModal
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        form={formData}
        printHeader={printHeader}
      />

      {/* SAVE + ERROR TOASTS */}
      <FeedbackToasts success={saveStatus} error={apiError} />
    </div>
  );
}
