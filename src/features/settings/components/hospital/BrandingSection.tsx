import type { RefObject } from "react";
import { Building2, Upload } from "lucide-react";
import type { HospitalInformationForm } from "../../types/settings.types";

const PP = "'Poppins', system-ui, sans-serif";

const BROKEN_MEDIA_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='160' viewBox='0 0 400 160'%3E%3Crect width='400' height='160' fill='%23e3f2fd'/%3E%3Ctext x='200' y='84' text-anchor='middle' font-family='Arial' font-size='20' font-weight='700' fill='%230d47a1'%3ESafe Hands HMS%3C/text%3E%3C/svg%3E";

interface BrandingSectionProps {
  form: HospitalInformationForm;
  errors: Record<string, string>;
  onChange: (field: string, value: string | boolean | number) => void;
  uploading: boolean;
  logoUrl: string;
  bannerUrl: string;
  onUploadLogo: (file: File | undefined) => void;
  onUploadBanner: (file: File | undefined) => void;
  logoInputRef: RefObject<HTMLInputElement | null>;
  bannerInputRef: RefObject<HTMLInputElement | null>;
}

export function BrandingSection({
  form,
  errors,
  onChange,
  uploading,
  logoUrl,
  bannerUrl,
  onUploadLogo,
  onUploadBanner,
  logoInputRef,
  bannerInputRef,
}: BrandingSectionProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E5E7EB",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3
        style={{
          fontFamily: PP,
          fontSize: "15px",
          fontWeight: 700,
          color: "#111827",
          margin: "0 0 16px 0",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Building2 size={18} style={{ color: "#0D47A1" }} /> Section 01:
        Hospital Branding & Identity
      </h3>

      {/* Logo & Banner Upload Area */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: "20px",
          marginBottom: "20px",
          padding: "16px",
          background: "#F8FAFC",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
        }}
      >
        {/* Logo Preview Card */}
        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#475569",
              marginBottom: "6px",
            }}
          >
            Hospital Logo (PNG, SVG, JPEG)
          </span>
          <div role="button"
            onClick={() => logoInputRef.current?.click()}
            style={{
              width: "100%",
              height: "130px",
              borderRadius: "12px",
              border: "2px dashed #CBD5E1",
              background: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: "12px",
              boxSizing: "border-box",
              textAlign: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/svg+xml,image/jpeg"
              style={{ display: "none" }}
              onChange={(e) => {
                onUploadLogo(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Hospital Logo"
                onError={(event) => {
                  event.currentTarget.src = BROKEN_MEDIA_FALLBACK;
                }}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "#E3F2FD",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Building2 size={22} style={{ color: "#0D47A1" }} />
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#0D47A1",
                  }}
                >
                  {uploading ? "Uploading..." : "Click to Upload Logo"}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#94A3B8",
                    marginTop: "2px",
                  }}
                >
                  Max 2MB (Recommended 400x400)
                </span>
              </>
            )}
          </div>
        </div>

        {/* Banner Preview Card */}
        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#475569",
              marginBottom: "6px",
            }}
          >
            Hospital Header Banner (Optional)
          </span>
          <div role="button"
            onClick={() => bannerInputRef.current?.click()}
            style={{
              width: "100%",
              height: "130px",
              borderRadius: "12px",
              border: "2px dashed #CBD5E1",
              background: bannerUrl
                ? "#FFFFFF"
                : "linear-gradient(135deg, #0D47A1 0%, #009688 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: "12px",
              boxSizing: "border-box",
              color: "#FFFFFF",
              textAlign: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/png,image/jpeg"
              style={{ display: "none" }}
              onChange={(e) => {
                onUploadBanner(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            {bannerUrl ? (
              <img
                src={bannerUrl}
                alt="Hospital Header Banner"
                onError={(event) => {
                  event.currentTarget.src = BROKEN_MEDIA_FALLBACK;
                }}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <>
                <Upload
                  size={22}
                  style={{ color: "#FFFFFF", marginBottom: "6px" }}
                />
                <span style={{ fontSize: "12px", fontWeight: 600 }}>
                  {uploading ? "Uploading..." : "Upload Header Banner"}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    opacity: 0.8,
                    marginTop: "2px",
                  }}
                >
                  Used for Patient Portal & Print Cover Pages (PNG, JPEG)
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <div style={{ gridColumn: "span 2" }}>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
          <input aria-label="Input field"
            type="text"
            value={form.hospitalName}
            onChange={(e) => onChange("hospitalName", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: `1px solid ${errors.hospitalName ? "#EF4444" : "#D1D5DB"}`,
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          /></span>
          {errors.hospitalName && (
            <span
              style={{
                fontSize: "11px",
                color: "#EF4444",
                marginTop: "4px",
                display: "block",
              }}
            >
              {errors.hospitalName}
            </span>
          )}
        </div>

        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Hospital Short Name / Abbreviation
          
          <input aria-label="Input field"
            type="text"
            value={form.hospitalShortName}
            onChange={(e) => onChange("hospitalShortName", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          /></span>
        </div>

        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Hospital Tagline / Motto
          
          <input aria-label="Input field"
            type="text"
            value={form.hospitalTagline}
            onChange={(e) => onChange("hospitalTagline", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          /></span>
        </div>

        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Hospital Registration Number
          
          <input aria-label="Input field"
            type="text"
            value={form.registrationNumber}
            onChange={(e) => onChange("registrationNumber", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          /></span>
        </div>

        <div>
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Hospital License Number *
          
          <input aria-label="Input field"
            type="text"
            value={form.licenseNumber}
            onChange={(e) => onChange("licenseNumber", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: `1px solid ${errors.licenseNumber ? "#EF4444" : "#D1D5DB"}`,
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          /></span>
          {errors.licenseNumber && (
            <span
              style={{
                fontSize: "11px",
                color: "#EF4444",
                marginTop: "4px",
                display: "block",
              }}
            >
              {errors.licenseNumber}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
