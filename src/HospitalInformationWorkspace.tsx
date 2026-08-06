import { useState } from "react";
import {
  Building2,
  Upload,
  Phone,
  Globe,
  Clock,
  MapPin,
  FileText,
  Share2,
  Printer,
  RotateCcw,
  Save,
  Sparkles,
  Check,
} from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function HospitalInformationWorkspace() {
  const [formData, setFormData] = useState({
    // Section 1: Branding
    hospitalName: "St. Jude General Hospital & Medical Center",
    hospitalShortName: "St. Jude HMS",
    hospitalTagline: "Excellence in Healthcare & Patient Compassion",
    registrationNumber: "REG-2024-884920",
    licenseNumber: "HOSP-LIC-99382-A",
    logoUrl: "",
    bannerUrl: "",

    // Section 2: Contact
    primaryPhone: "+1 (555) 234-5678",
    secondaryPhone: "+1 (555) 234-5679",
    emergencyPhone: "+1 (555) 911-0000",
    officialEmail: "info@stjudehospital.org",
    website: "https://www.stjudehospital.org",
    supportEmail: "support@stjudehospital.org",
    workingHours: "Mon - Sun: 08:00 AM - 08:00 PM",
    is24x7: true,

    // Section 3: Address
    addressLine1: "777 Healthcare Boulevard, Medical District",
    addressLine2: "Building A, Suite 100-500",
    city: "Metropolis",
    district: "Central Metro",
    state: "California",
    country: "United States",
    postalCode: "90210",
    mapUrl: "https://maps.google.com/?q=St+Jude+Hospital",

    // Section 4: Operational
    hospitalType: "Multi Specialty",
    ownership: "Private",
    establishedYear: "1998",
    numDepartments: "24",
    numDoctors: "145",
    numConsultationRooms: "60",
    status: "Active",

    // Section 6: Social
    facebook: "https://facebook.com/stjudehms",
    linkedin: "https://linkedin.com/company/stjudehms",
    instagram: "https://instagram.com/stjudehms",
    youtube: "https://youtube.com/c/stjudehms",
    whatsapp: "+15552345678",

    // Section 7: Notes
    internalNotes:
      "Tier-1 Tertiary Multispecialty accredited by NABH and JCI. Annual license renewal due in November 2026.",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleInputChange = (
    field: string,
    value: string | boolean | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleSave = () => {
    if (validateForm()) {
      setSaveStatus("Hospital Information saved successfully!");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "20px",
      }}
    >
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
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: PP,
                fontSize: "18px",
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              Hospital Information Configuration
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#64748B",
                margin: "2px 0 0 0",
              }}
            >
              Manage master hospital profile, official address, communication
              channels, and print template headers.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setShowPreviewModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                color: "#0D47A1",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Printer size={14} /> Preview Print Header
            </button>
            <button
              onClick={() => {
                setFormData({
                  hospitalName: "St. Jude General Hospital & Medical Center",
                  hospitalShortName: "St. Jude HMS",
                  hospitalTagline:
                    "Excellence in Healthcare & Patient Compassion",
                  registrationNumber: "REG-2024-884920",
                  licenseNumber: "HOSP-LIC-99382-A",
                  logoUrl: "",
                  bannerUrl: "",
                  primaryPhone: "+1 (555) 234-5678",
                  secondaryPhone: "+1 (555) 234-5679",
                  emergencyPhone: "+1 (555) 911-0000",
                  officialEmail: "info@stjudehospital.org",
                  website: "https://www.stjudehospital.org",
                  supportEmail: "support@stjudehospital.org",
                  workingHours: "Mon - Sun: 08:00 AM - 08:00 PM",
                  is24x7: true,
                  addressLine1: "777 Healthcare Boulevard, Medical District",
                  addressLine2: "Building A, Suite 100-500",
                  city: "Metropolis",
                  district: "Central Metro",
                  state: "California",
                  country: "United States",
                  postalCode: "90210",
                  mapUrl: "https://maps.google.com/?q=St+Jude+Hospital",
                  hospitalType: "Multi Specialty",
                  ownership: "Private",
                  establishedYear: "1998",
                  numDepartments: "24",
                  numDoctors: "145",
                  numConsultationRooms: "60",
                  status: "Active",
                  facebook: "https://facebook.com/stjudehms",
                  linkedin: "https://linkedin.com/company/stjudehms",
                  instagram: "https://instagram.com/stjudehms",
                  youtube: "https://youtube.com/c/stjudehms",
                  whatsapp: "+15552345678",
                  internalNotes:
                    "Tier-1 Tertiary Multispecialty accredited by NABH and JCI. Annual license renewal due in November 2026.",
                });
                setErrors({});
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                color: "#64748B",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button
              onClick={handleSave}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                background: "#0D47A1",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(13,71,161,0.2)",
              }}
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>

        {/* SECTION 01: HOSPITAL BRANDING */}
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
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#475569",
                  marginBottom: "6px",
                }}
              >
                Hospital Logo (PNG, SVG, JPEG)
              </label>
              <div
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
                }}
              >
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
                  Click to Upload Logo
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
              </div>
            </div>

            {/* Banner Preview Card */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#475569",
                  marginBottom: "6px",
                }}
              >
                Hospital Header Banner (Optional)
              </label>
              <div
                style={{
                  width: "100%",
                  height: "130px",
                  borderRadius: "12px",
                  border: "2px dashed #CBD5E1",
                  background:
                    "linear-gradient(135deg, #0D47A1 0%, #009688 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: "12px",
                  boxSizing: "border-box",
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                <Upload
                  size={22}
                  style={{ color: "#FFFFFF", marginBottom: "6px" }}
                />
                <span style={{ fontSize: "12px", fontWeight: 600 }}>
                  Upload Header Banner
                </span>
                <span
                  style={{ fontSize: "10px", opacity: 0.8, marginTop: "2px" }}
                >
                  Used for Patient Portal & Print Cover Pages (PNG, JPEG)
                </span>
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
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Full Hospital Legal Name *
              </label>
              <input
                type="text"
                value={formData.hospitalName}
                onChange={(e) =>
                  handleInputChange("hospitalName", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.hospitalName ? "#EF4444" : "#D1D5DB"}`,
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
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
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Hospital Short Name / Abbreviation
              </label>
              <input
                type="text"
                value={formData.hospitalShortName}
                onChange={(e) =>
                  handleInputChange("hospitalShortName", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Hospital Tagline / Motto
              </label>
              <input
                type="text"
                value={formData.hospitalTagline}
                onChange={(e) =>
                  handleInputChange("hospitalTagline", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Hospital Registration Number
              </label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) =>
                  handleInputChange("registrationNumber", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Hospital License Number *
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) =>
                  handleInputChange("licenseNumber", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.licenseNumber ? "#EF4444" : "#D1D5DB"}`,
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
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

        {/* SECTION 02: HOSPITAL CONTACT INFORMATION */}
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
            <Phone size={18} style={{ color: "#009688" }} /> Section 02:
            Hospital Contact Information
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Primary Phone Number *
              </label>
              <input
                type="text"
                value={formData.primaryPhone}
                onChange={(e) =>
                  handleInputChange("primaryPhone", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.primaryPhone ? "#EF4444" : "#D1D5DB"}`,
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
              {errors.primaryPhone && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "#EF4444",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {errors.primaryPhone}
                </span>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Secondary Phone Number
              </label>
              <input
                type="text"
                value={formData.secondaryPhone}
                onChange={(e) =>
                  handleInputChange("secondaryPhone", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Emergency Contact Hotline (24/7)
              </label>
              <input
                type="text"
                value={formData.emergencyPhone}
                onChange={(e) =>
                  handleInputChange("emergencyPhone", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  color: "#EF4444",
                  fontWeight: 600,
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Official Email Address *
              </label>
              <input
                type="email"
                value={formData.officialEmail}
                onChange={(e) =>
                  handleInputChange("officialEmail", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.officialEmail ? "#EF4444" : "#D1D5DB"}`,
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
              {errors.officialEmail && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "#EF4444",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {errors.officialEmail}
                </span>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Official Website URL
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.website ? "#EF4444" : "#D1D5DB"}`,
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
              {errors.website && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "#EF4444",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {errors.website}
                </span>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Support / Helpdesk Email
              </label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) =>
                  handleInputChange("supportEmail", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: "1px solid #F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "60%",
              }}
            >
              <Clock size={16} style={{ color: "#64748B" }} />
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "4px",
                  }}
                >
                  OPD & General Working Hours
                </label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) =>
                    handleInputChange("workingHours", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #D1D5DB",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#F8FAFC",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #E2E8F0",
              }}
            >
              <input
                type="checkbox"
                id="is24x7"
                checked={formData.is24x7}
                onChange={(e) => handleInputChange("is24x7", e.target.checked)}
                style={{
                  accentColor: "#009688",
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                }}
              />
              <div>
                <label
                  htmlFor="is24x7"
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#111827",
                    cursor: "pointer",
                    display: "block",
                  }}
                >
                  24x7 Emergency & Trauma Care Unit
                </label>
                <span style={{ fontSize: "11px", color: "#64748B" }}>
                  Badge display on all print headers & portals
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 03: HOSPITAL ADDRESS */}
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
            <MapPin size={18} style={{ color: "#0D47A1" }} /> Section 03:
            Hospital Address & Location
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div style={{ gridColumn: "span 2" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Address Line 1 *
              </label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) =>
                  handleInputChange("addressLine1", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Address Line 2 (Building / Suite / Landmark)
              </label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) =>
                  handleInputChange("addressLine2", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                State / Province
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Postal / Zip Code
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) =>
                  handleInputChange("postalCode", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Google Map Embed URL
              </label>
              <input
                type="text"
                value={formData.mapUrl}
                onChange={(e) => handleInputChange("mapUrl", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Location Map Preview Placeholder */}
          <div
            style={{
              marginTop: "16px",
              background: "#F1F5F9",
              borderRadius: "12px",
              padding: "16px",
              border: "1px dashed #CBD5E1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            <Globe size={16} /> GPS Location Verified:{" "}
            <strong>34.0522° N, 118.2437° W</strong> (Metropolis Central
            District)
          </div>
        </div>

        {/* SECTION 04: HOSPITAL OPERATIONAL DETAILS */}
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
            <FileText size={18} style={{ color: "#009688" }} /> Section 04:
            Hospital Operational Details
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Hospital Type
              </label>
              <select
                value={formData.hospitalType}
                onChange={(e) =>
                  handleInputChange("hospitalType", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              >
                <option>Multi Specialty</option>
                <option>General Hospital</option>
                <option>Specialty Hospital</option>
                <option>Clinic / Outpatient Facility</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Ownership Structure
              </label>
              <select
                value={formData.ownership}
                onChange={(e) => handleInputChange("ownership", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              >
                <option>Private</option>
                <option>Government / Public</option>
                <option>Trust / Charitable</option>
                <option>Corporate Healthcare Chain</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Established Year
              </label>
              <input
                type="text"
                value={formData.establishedYear}
                onChange={(e) =>
                  handleInputChange("establishedYear", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Active Departments
              </label>
              <input
                type="number"
                value={formData.numDepartments}
                onChange={(e) =>
                  handleInputChange("numDepartments", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Registered Doctors
              </label>
              <input
                type="number"
                value={formData.numDoctors}
                onChange={(e) =>
                  handleInputChange("numDoctors", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Consultation Rooms / OPD Units
              </label>
              <input
                type="number"
                value={formData.numConsultationRooms}
                onChange={(e) =>
                  handleInputChange("numConsultationRooms", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 05: INVOICE & PRINT HEADER PREVIEW */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "14px",
            }}
          >
            <h3
              style={{
                fontFamily: PP,
                fontSize: "15px",
                fontWeight: 700,
                color: "#111827",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Printer size={18} style={{ color: "#0D47A1" }} /> Section 05:
              Live Invoice & Print Header Preview
            </h3>
            <span
              style={{
                fontSize: "11px",
                color: "#64748B",
                background: "#F1F5F9",
                padding: "3px 8px",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              Standard Header Output
            </span>
          </div>

          <p
            style={{ fontSize: "12px", color: "#64748B", margin: "0 0 16px 0" }}
          >
            This official header will automatically populate across all
            Invoices, Prescriptions, Lab Reports, Receipts, and Official Medical
            Certificates.
          </p>

          {/* Live Document Header Box */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "12px",
              border: "2px solid #0D47A1",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "2px solid #E5E7EB",
                paddingBottom: "14px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "10px",
                    background: "#0D47A1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontFamily: PP,
                    fontSize: "20px",
                  }}
                >
                  STJ
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: PP,
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#0D47A1",
                      margin: 0,
                    }}
                  >
                    {formData.hospitalName}
                  </h4>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#009688",
                      marginTop: "2px",
                    }}
                  >
                    {formData.hospitalTagline}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#64748B",
                      marginTop: "2px",
                    }}
                  >
                    Reg No: {formData.registrationNumber} | License:{" "}
                    {formData.licenseNumber}
                  </div>
                </div>
              </div>

              <div
                style={{
                  textAlign: "right",
                  fontSize: "11px",
                  color: "#475569",
                  lineHeight: "1.4",
                }}
              >
                <div>
                  <strong>{formData.addressLine1}</strong>
                </div>
                <div>
                  {formData.city}, {formData.state} - {formData.postalCode}
                </div>
                <div>Phone: {formData.primaryPhone}</div>
                <div>Email: {formData.officialEmail}</div>
                <div>Website: {formData.website}</div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "10px",
                fontSize: "10px",
                color: "#94A3B8",
                fontWeight: 500,
              }}
            >
              <span>NABH & JCI Accredited Hospital</span>
              <span>24/7 Emergency Helpline: {formData.emergencyPhone}</span>
            </div>
          </div>
        </div>

        {/* SECTION 06: HOSPITAL SOCIAL & COMMUNICATION */}
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
            <Share2 size={18} style={{ color: "#009688" }} /> Section 06:
            Hospital Social & Communication Channels
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Official WhatsApp Business Number
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Facebook Page URL
              </label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => handleInputChange("facebook", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                LinkedIn Organization Page
              </label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => handleInputChange("linkedin", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Instagram Profile
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 07: INTERNAL NOTES */}
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
              margin: "0 0 12px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sparkles size={18} style={{ color: "#0D47A1" }} /> Section 07:
            Internal Administrative Notes
          </h3>
          <p
            style={{ fontSize: "12px", color: "#64748B", margin: "0 0 10px 0" }}
          >
            Internal notes regarding accreditation, licensing renewals, and
            master facility guidelines. Visible only to Super Admins and
            Hospital Admins.
          </p>
          <textarea
            rows={4}
            value={formData.internalNotes}
            onChange={(e) => handleInputChange("internalNotes", e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "13px",
              boxSizing: "border-box",
              fontFamily: RB,
            }}
          />
        </div>
      </div>

      {/* PRINT HEADER PREVIEW MODAL */}
      {showPreviewModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "700px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
                borderBottom: "1px solid #E5E7EB",
                paddingBottom: "12px",
              }}
            >
              <h3
                style={{
                  fontFamily: PP,
                  fontSize: "16px",
                  fontWeight: 700,
                  margin: 0,
                  color: "#111827",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Printer size={18} style={{ color: "#0D47A1" }} /> Official
                Print Header Template Preview
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#64748B",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                background: "#F8FAFC",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "2px solid #0D47A1",
                  paddingBottom: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: PP,
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#0D47A1",
                    }}
                  >
                    {formData.hospitalName}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#009688",
                      fontWeight: 600,
                    }}
                  >
                    {formData.hospitalTagline}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#64748B",
                      marginTop: "4px",
                    }}
                  >
                    Reg: {formData.registrationNumber} | License:{" "}
                    {formData.licenseNumber}
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "11px",
                    color: "#475569",
                  }}
                >
                  <div>{formData.addressLine1}</div>
                  <div>
                    {formData.city}, {formData.state} {formData.postalCode}
                  </div>
                  <div>
                    {formData.primaryPhone} | {formData.officialEmail}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "40px 0",
                  textAlign: "center",
                  color: "#94A3B8",
                  fontSize: "13px",
                  fontStyle: "italic",
                }}
              >
                [ Sample Medical Document / Invoice Content Area ]
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifySelf: "flex-end",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowPreviewModal(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  background: "#FFFFFF",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#0D47A1",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Printer size={14} /> Print Sample
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE TOAST NOTIFICATION */}
      {saveStatus && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "24px",
            background: "#2E7D32",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "13px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 90,
          }}
        >
          <Check size={16} /> {saveStatus}
        </div>
      )}
    </div>
  );
}
