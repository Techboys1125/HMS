import { useState, useCallback, useMemo } from "react";
import {
  ChevronRight,
  User,
  MapPin,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  RotateCcw,
  Calendar,
  Upload,
} from "lucide-react";
import { PP, RB } from "../constants/patient.fonts";
import { useCreatePatient } from "../hooks/useCreatePatient";
import { patientsApi } from "../api/patient.api";
import type {
  CreatePatientRequest,
  RegistrationType,
} from "../types/patient.types";
import { ROLE_FIELD_PERMISSIONS } from "../types/patient.types";
import { useAuthStore } from "../../auth/store/auth.store";
import { usePatientPortal } from "../context/usePatientPortal";

/* ─────────────────── Design Tokens ─────────────────── */
const inputBase =
  "w-full px-3.5 py-2.5 text-[13px] bg-white border border-gray-200 rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/10 transition-colors duration-200 placeholder:text-slate-400";
const inputError =
  "w-full px-3.5 py-2.5 text-[13px] bg-white border border-red-300 rounded-xl text-[#111827] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/10 transition-colors duration-200 placeholder:text-slate-400";
const inputDisabled =
  "w-full px-3.5 py-2.5 text-[13px] bg-slate-50 border border-gray-200 rounded-xl text-slate-500 font-mono outline-none cursor-not-allowed";
const labelBase = "block text-xs font-semibold text-slate-600 mb-1.5";

/* ─────────────────── Option Data ─────────────────── */
const BLOOD_GROUPS = [
  { value: "", label: "Select Blood Group" },
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A−" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B−" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB−" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O−" },
  { value: "UNKNOWN", label: "Unknown" },
];

const GENDERS = [
  { value: "", label: "Select Gender" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const MARITAL_STATUSES = [
  { value: "", label: "Select Status" },
  { value: "SINGLE", label: "Single" },
  { value: "MARRIED", label: "Married" },
  { value: "DIVORCED", label: "Divorced" },
  { value: "WIDOWED", label: "Widowed" },
  { value: "SEPARATED", label: "Separated" },
];

const RELATIONSHIPS = [
  { value: "", label: "Select Relationship" },
  { value: "Spouse", label: "Spouse" },
  { value: "Parent", label: "Parent" },
  { value: "Child", label: "Child" },
  { value: "Sibling", label: "Sibling" },
  { value: "Guardian", label: "Guardian" },
  { value: "Friend", label: "Friend" },
  { value: "Other", label: "Other" },
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
];

/* ─────────────────── Form State ─────────────────── */
interface RegistrationFormState {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  mobileNumber: string;
  email: string;
  bloodGroup: string;
  maritalStatus: string;
  nationalId: string;
  photoUrl: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  ecName: string;
  ecRelationship: string;
  ecMobile: string;
  ecAltMobile: string;
  patientCategory: string;
  knownAllergies: string;
  chronicDiseases: string;
  specialNotes: string;
  registrationDate: string;
  relationship: string;
}

const today = new Date();
const pad = (n: number) => n.toString().padStart(2, "0");
const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

const INITIAL_FORM: RegistrationFormState = {
  fullName: "",
  gender: "",
  dateOfBirth: "",
  mobileNumber: "",
  email: "",
  bloodGroup: "",
  maritalStatus: "",
  nationalId: "",
  photoUrl: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  ecName: "",
  ecRelationship: "",
  ecMobile: "",
  ecAltMobile: "",
  patientCategory: "GENERAL",
  knownAllergies: "",
  chronicDiseases: "",
  specialNotes: "",
  registrationDate: todayStr,
  relationship: "SELF",
};

/* ─────────────────── Toast ─────────────────── */
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium max-w-md animate-[slideIn_0.35s_ease-out] ${
        type === "success"
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
      ) : (
        <AlertCircle size={18} className="text-red-500 shrink-0" />
      )}
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-0.5 rounded-lg hover:bg-black/5 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

/* ─────────────────── Section Header ─────────────────── */
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
      <div className="w-9 h-9 rounded-xl bg-[#0D47A1]/[0.07] flex items-center justify-center">
        <Icon size={17} className="text-[#0D47A1]" />
      </div>
      <div>
        <h2
          className="text-[14px] font-bold text-[#111827]"
          style={{ fontFamily: PP }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="text-[11px] text-slate-400 mt-0.5"
            style={{ fontFamily: RB }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────── Success Dialog ─────────────────── */
function RegistrationSuccessDialog({
  mrn,
  patientName,
  isFamilyMode = false,
  onClose,
  onBookAppointment,
  onViewProfile,
  onSwitchToNewPatient,
}: {
  mrn: string;
  patientName: string;
  isFamilyMode?: boolean;
  onClose: () => void;
  onBookAppointment?: (mrn: string) => void;
  onViewProfile?: (mrn: string) => void;
  onSwitchToNewPatient?: (mrn: string, patientName: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 text-center animate-[scaleIn_0.25s_ease-out]">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h3
          className="text-xl font-bold text-[#111827] mb-2"
          style={{ fontFamily: PP }}
        >
          {isFamilyMode
            ? "Family Member Registered!"
            : "Registration Successful!"}
        </h3>
        <p className="text-sm text-slate-500 mb-1" style={{ fontFamily: RB }}>
          <span className="font-semibold text-[#111827]">{patientName}</span>{" "}
          {isFamilyMode
            ? "has been registered successfully as a family member."
            : "has been registered."}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 mt-2 mb-6">
          <span className="text-xs text-slate-500" style={{ fontFamily: RB }}>
            MRN
          </span>
          <span className="text-sm font-bold font-mono text-[#0D47A1]">
            {mrn}
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {isFamilyMode ? (
            <>
              {onViewProfile && (
                <button
                  onClick={() => onViewProfile(mrn)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-sm font-semibold hover:bg-[#0c3d8a] transition-colors shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <User size={16} />
                  View Patient Profile
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                style={{ fontFamily: PP }}
              >
                Return to Family Members
              </button>
            </>
          ) : (
            <>
              {onSwitchToNewPatient && (
                <button
                  onClick={() => onSwitchToNewPatient(mrn, patientName)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white text-sm font-semibold hover:bg-[#0c3d8a] transition-colors shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <User size={16} />
                  Switch to New Patient
                </button>
              )}
              {onBookAppointment && (
                <button
                  onClick={() => onBookAppointment(mrn)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#009688] text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
                  style={{ fontFamily: PP }}
                >
                  <Calendar size={16} />
                  Book Appointment
                </button>
              )}
              {onViewProfile && (
                <button
                  onClick={() => onViewProfile(mrn)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                  style={{ fontFamily: PP }}
                >
                  <User size={16} />
                  View Patient Profile
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                style={{ fontFamily: PP }}
              >
                Register Another Patient
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export type RegistrationMode =
  "ADMIN" | "RECEPTIONIST" | "PATIENT_SELF" | "PATIENT_FAMILY";

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export function RegisterPatientScreen({
  onBack,
  onBookAppointment,
  onViewProfile,
  onSwitchToNewPatient,
  onRegistered,
  registrationMode = "ADMIN",
  isFamilyMode = false,
  primaryPatientMrn,
}: {
  onBack?: () => void;
  onBookAppointment?: (mrn: string) => void;
  onViewProfile?: (mrn: string) => void;
  onSwitchToNewPatient?: (mrn: string, patientName: string) => void;
  onRegistered?: (member: {
    mrn: string;
    patientName: string;
    relationship?: string;
    gender?: string;
    mobileNumber?: string;
  }) => void;
  registrationMode?: RegistrationMode;
  isFamilyMode?: boolean;
  primaryPatientMrn?: string;
}) {
  const effectiveMode = isFamilyMode ? "PATIENT_FAMILY" : registrationMode;
  const showRelationship =
    effectiveMode === "PATIENT_SELF" || effectiveMode === "PATIENT_FAMILY";

  const initialRelationship =
    effectiveMode === "PATIENT_SELF"
      ? "SELF"
      : effectiveMode === "PATIENT_FAMILY"
        ? ""
        : "SELF";

  const user = useAuthStore((state) => state.user);
  const portal = usePatientPortal();

  // Role-based field gating (RBAC) for staff-facing (ADMIN) registrations.
  const roleKey = String(user?.role ?? "").toUpperCase();
  const rolePerms =
    effectiveMode === "ADMIN" || effectiveMode === "RECEPTIONIST"
      ? ROLE_FIELD_PERMISSIONS[roleKey]
      : undefined;
  const hideField = (field: string) =>
    rolePerms?.hiddenFields.includes(field) ?? false;
  const readOnlyField = (field: string) =>
    (rolePerms?.alwaysReadOnly.includes(field) ||
      rolePerms?.readOnlyFields.includes(field)) ??
    false;

  const isAddingFamilyMember = effectiveMode === "PATIENT_FAMILY";

  const [form, setForm] = useState<RegistrationFormState>(() => ({
    ...INITIAL_FORM,
    relationship: initialRelationship,
    ...(isAddingFamilyMember
      ? {}
      : {
          fullName: user?.fullName || "",
          email: user?.email || "",
          mobileNumber: user?.mobile || "",
        }),
  }));

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [successData, setSuccessData] = useState<{
    mrn: string;
    name: string;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const createPatient = useCreatePatient();

  const set = useCallback(
    (key: keyof RegistrationFormState, value: string) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const markTouched = useCallback(
    (field: string) => setTouched((prev) => ({ ...prev, [field]: true })),
    [],
  );

  const calculatedAge = useMemo(() => {
    if (!form.dateOfBirth) return null;
    const dob = new Date(form.dateOfBirth);
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
    return age >= 0 ? age : null;
  }, [form.dateOfBirth]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full Name is required";
    if (!form.gender) e.gender = "Gender is required";
    if (!form.dateOfBirth) e.dateOfBirth = "Date of birth is required";
    if (!form.mobileNumber.trim()) e.mobileNumber = "Mobile number is required";
    else if (!/^[\d+\s()-]{7,15}$/.test(form.mobileNumber.trim()))
      e.mobileNumber = "Enter a valid mobile number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (form.pincode && !/^\d{5,10}$/.test(form.pincode.trim()))
      e.pincode = "Enter a valid pincode";
    if (
      showRelationship &&
      effectiveMode === "PATIENT_FAMILY" &&
      !form.relationship
    )
      e.relationship = "Relationship is required";
    return e;
  }, [form, showRelationship, effectiveMode]);

  const fieldError = (field: string) =>
    touched[field] && errors[field] ? (
      <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
        <AlertCircle size={11} /> {errors[field]}
      </p>
    ) : null;

  const fClass = (field: string) =>
    touched[field] && errors[field] ? inputError : inputBase;

  const handleSubmit = useCallback(async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    setTouched({
      fullName: true,
      gender: true,
      dateOfBirth: true,
      mobileNumber: true,
      email: true,
      pincode: true,
      relationship: true,
    });

    const submitErrors: Record<string, string> = {};
    if (!form.fullName.trim()) submitErrors.fullName = "Full Name is required";
    if (!form.gender) submitErrors.gender = "Gender is required";
    if (!form.dateOfBirth)
      submitErrors.dateOfBirth = "Date of birth is required";
    if (!form.mobileNumber.trim())
      submitErrors.mobileNumber = "Mobile number is required";
    else if (!/^[\d+\s()-]{7,15}$/.test(form.mobileNumber.trim()))
      submitErrors.mobileNumber = "Enter a valid mobile number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      submitErrors.email = "Enter a valid email address";
    if (form.pincode && !/^\d{5,10}$/.test(form.pincode.trim()))
      submitErrors.pincode = "Enter a valid pincode";
    if (
      showRelationship &&
      effectiveMode === "PATIENT_FAMILY" &&
      !form.relationship
    )
      submitErrors.relationship = "Relationship is required";

    if (Object.keys(submitErrors).length > 0) {
      setToast({
        message: "Please fix the validation errors before submitting.",
        type: "error",
      });
      return;
    }

    const regType: RegistrationType =
      effectiveMode === "PATIENT_SELF" || effectiveMode === "PATIENT_FAMILY"
        ? "ONLINE"
        : "WALK_IN";

    const payload: CreatePatientRequest = {
      fullName: form.fullName.trim(),
      gender: form.gender,
      mobileNumber: form.mobileNumber.trim(),
      registrationType: regType,
      relationship: showRelationship
        ? form.relationship ||
          (effectiveMode === "PATIENT_SELF" ? "SELF" : "OTHER")
        : "SELF",
    };

    if (form.dateOfBirth) payload.dateOfBirth = form.dateOfBirth;
    if (form.email?.trim()) payload.email = form.email.trim();
    if (form.bloodGroup) payload.bloodGroup = form.bloodGroup;
    if (form.maritalStatus) payload.maritalStatus = form.maritalStatus;
    if (form.nationalId?.trim()) payload.nationalId = form.nationalId.trim();
    if (form.photoUrl?.trim()) payload.photoUrl = form.photoUrl.trim();
    if (form.patientCategory) payload.patientCategory = form.patientCategory;
    if (form.specialNotes?.trim())
      payload.specialNotes = form.specialNotes.trim();

    if (form.knownAllergies?.trim()) {
      payload.knownAllergies = form.knownAllergies
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (form.chronicDiseases?.trim()) {
      payload.chronicDiseases = form.chronicDiseases
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const hasAddress = [
      form.addressLine1,
      form.addressLine2,
      form.city,
      form.state,
      form.pincode,
      form.country,
    ].some((v) => v?.trim());

    if (hasAddress) {
      payload.address = {};
      if (form.addressLine1?.trim())
        payload.address.addressLine1 = form.addressLine1.trim();
      if (form.addressLine2?.trim())
        payload.address.addressLine2 = form.addressLine2.trim();
      if (form.city?.trim()) payload.address.city = form.city.trim();
      if (form.state?.trim()) payload.address.state = form.state.trim();
      if (form.pincode?.trim()) payload.address.pincode = form.pincode.trim();
      if (form.country?.trim()) payload.address.country = form.country.trim();
    }

    if (form.ecName?.trim() && form.ecMobile?.trim()) {
      const ecMobile = form.ecMobile.trim();
      const ecAltMobile = form.ecAltMobile?.trim();
      payload.emergencyContact = {
        name: form.ecName.trim(),
        relationship: form.ecRelationship?.trim() || "OTHER",
        mobileNumber: ecMobile,
        ...(ecAltMobile ? { alternativeMobileNumber: ecAltMobile } : {}),
      };
    }

    try {
      const rawPortal = portal as unknown as {
        patient?: { mrn?: string };
        primaryMrn?: string;
      };
      const rawUser = user as unknown as {
        mrn?: string;
        patientMrn?: string;
        id?: string | number;
      };
      const primaryMrn = String(
        primaryPatientMrn ||
          rawPortal?.patient?.mrn ||
          portal?.primaryMrn ||
          rawUser?.mrn ||
          rawUser?.patientMrn ||
          user?.patientId ||
          "",
      );
      let mrn = "";

      if (effectiveMode === "PATIENT_SELF" && primaryMrn) {
        try {
          const updated = await patientsApi.updatePatient(primaryMrn, {
            ...payload,
          });
          mrn = updated.mrn || primaryMrn;
        } catch {
          const created = (await createPatient.mutateAsync(payload)) as {
            mrn?: string;
            MRNId?: string;
          };
          mrn = created.mrn || created.MRNId || primaryMrn;
        }
      } else if (effectiveMode === "PATIENT_FAMILY" && primaryMrn) {
        const primaryUserId = user?.id;
        if (!primaryUserId) {
          throw new Error("Primary user ID not found. Please try again.");
        }

        const created = (await createPatient.mutateAsync(payload)) as Record<
          string,
          unknown
        >;
        const raw = (created.data as Record<string, unknown>) || created;
        const patientData = (raw.data as Record<string, unknown>) || raw;

        const familyMrn = String(
          patientData.mrn || patientData.MRNId || patientData.patientMrn || "",
        ).trim();

        const familyUserId =
          patientData.userId ||
          patientData.patientUserId ||
          patientData.id ||
          null;

        if (!familyMrn) {
          throw new Error(
            "Failed to create family member patient record. Please try again.",
          );
        }

        if (familyUserId) {
          const member = await patientsApi.linkFamilyMember(
            primaryUserId,
            Number(familyUserId),
            payload.relationship || "OTHER",
          );
          if (!member) {
            console.warn(
              "[RegisterPatient] linkFamilyMember returned null, but patient was created. Proceeding with success.",
            );
          }
        } else {
          console.warn(
            "[RegisterPatient] No familyUserId available to link. Patient was created.",
          );
        }

        mrn = familyMrn;
      } else {
        const created = (await createPatient.mutateAsync(payload)) as {
          mrn?: string;
          MRNId?: string;
        };
        mrn = created.mrn || created.MRNId || "";
      }

      setSuccessData({
        mrn,
        name: form.fullName.trim(),
      });
      onRegistered?.({
        mrn,
        patientName: form.fullName.trim(),
        relationship: showRelationship ? form.relationship : undefined,
        gender: form.gender,
        mobileNumber: form.mobileNumber.trim(),
      });
      portal?.refresh();
    } catch (err: unknown) {
      setToast({
        message:
          err instanceof Error
            ? err.message
            : "Failed to register patient. Please try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }, [
    form,
    createPatient,
    showRelationship,
    effectiveMode,
    onRegistered,
    primaryPatientMrn,
    portal,
    user,
    submitting,
  ]);

  const handleClear = useCallback(() => {
    setForm({
      ...INITIAL_FORM,
      relationship: initialRelationship,
      fullName: user?.fullName || "",
      email: user?.email || "",
      mobileNumber: user?.mobile || "",
    });
    setTouched({});
  }, [initialRelationship, user]);

  return (
    <div className="flex-1 min-h-screen bg-[#F4F6F9] overflow-y-auto">
      {successData && (
        <RegistrationSuccessDialog
          mrn={successData.mrn}
          patientName={successData.name}
          isFamilyMode={effectiveMode === "PATIENT_FAMILY"}
          onBookAppointment={onBookAppointment}
          onViewProfile={onViewProfile}
          onSwitchToNewPatient={onSwitchToNewPatient}
          onClose={() => {
            setSuccessData(null);
            onBack?.();
          }}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-350 mx-auto px-6 py-6">
        <div className="mb-7">
          <div
            className="flex items-center gap-1.5 text-[12px] text-slate-500 mb-2"
            style={{ fontFamily: RB }}
          >
            <button
              onClick={() => onBack?.()}
              className="hover:text-[#0D47A1] transition-colors"
            >
              {effectiveMode === "PATIENT_FAMILY"
                ? "Family Members"
                : "Reception Management"}
            </button>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">
              {effectiveMode === "PATIENT_FAMILY"
                ? "Add Family Member"
                : "Patient Registration"}
            </span>
          </div>

          <h1
            className="text-2xl font-bold text-[#111827] mb-1"
            style={{ fontFamily: PP }}
          >
            {effectiveMode === "PATIENT_FAMILY"
              ? "Add Family Member"
              : "Patient Registration"}
          </h1>
          <p className="text-sm text-slate-500" style={{ fontFamily: RB }}>
            {effectiveMode === "PATIENT_FAMILY"
              ? "Register a new family member under your patient account."
              : "Create a new patient record for hospital services."}
          </p>
        </div>

        <div className="max-w-full">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* 1. PERSONAL INFORMATION */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-7">
              <SectionHeader
                icon={User}
                title="Personal Information"
                subtitle="Enter the patient's personal and contact details"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {showRelationship && (
                  <div className="md:col-span-2">
                    <label className={labelBase}>
                      Relationship to Account Holder{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.relationship}
                      onChange={(e) => set("relationship", e.target.value)}
                      onBlur={() => markTouched("relationship")}
                      className={fClass("relationship")}
                    >
                      {effectiveMode === "PATIENT_FAMILY" && (
                        <option value="">Select Relationship</option>
                      )}
                      <option value="SELF">Self</option>
                      <option value="FATHER">Father</option>
                      <option value="MOTHER">Mother</option>
                      <option value="WIFE">Spouse</option>
                      <option value="SON">Son</option>
                      <option value="DAUGHTER">Daughter</option>
                      <option value="BROTHER">Brother</option>
                      <option value="SISTER">Sister</option>
                      <option value="GRANDFATHER">Grandfather</option>
                      <option value="GRANDMOTHER">Grandmother</option>
                      <option value="GUARDIAN">Guardian</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {fieldError("relationship")}
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className={labelBase}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    onBlur={() => markTouched("fullName")}
                    placeholder="e.g. Eleanor Vance"
                    className={fClass("fullName")}
                  />
                  {fieldError("fullName")}
                </div>

                <div>
                  <label className={labelBase}>
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => set("gender", e.target.value)}
                    onBlur={() => markTouched("gender")}
                    className={fClass("gender")}
                  >
                    {GENDERS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  {fieldError("gender")}
                </div>

                <div>
                  <label className={labelBase}>
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => set("dateOfBirth", e.target.value)}
                    onBlur={() => markTouched("dateOfBirth")}
                    max={todayStr}
                    className={fClass("dateOfBirth")}
                  />
                  {fieldError("dateOfBirth")}
                </div>

                <div>
                  <label className={labelBase}>
                    Age{" "}
                    <span className="text-slate-400 font-normal">
                      (Auto Calculated)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={
                      calculatedAge !== null
                        ? `${calculatedAge} year${calculatedAge !== 1 ? "s" : ""}`
                        : "—"
                    }
                    disabled
                    className={inputDisabled}
                  />
                </div>

                <div>
                  <label className={labelBase}>
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.mobileNumber}
                    onChange={(e) => set("mobileNumber", e.target.value)}
                    onBlur={() => markTouched("mobileNumber")}
                    placeholder="+91 98765 43210"
                    className={fClass("mobileNumber")}
                  />
                  {fieldError("mobileNumber")}
                </div>

                <div>
                  <label className={labelBase}>Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    onBlur={() => markTouched("email")}
                    placeholder="patient@example.com"
                    className={fClass("email")}
                  />
                  {fieldError("email")}
                </div>

                <div>
                  <label className={labelBase}>Blood Group</label>
                  <select
                    value={form.bloodGroup}
                    onChange={(e) => set("bloodGroup", e.target.value)}
                    disabled={readOnlyField("bloodGroup")}
                    className={
                      readOnlyField("bloodGroup") ? inputDisabled : inputBase
                    }
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg.value} value={bg.value}>
                        {bg.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelBase}>Marital Status</label>
                  <select
                    value={form.maritalStatus}
                    onChange={(e) => set("maritalStatus", e.target.value)}
                    disabled={readOnlyField("maritalStatus")}
                    className={
                      readOnlyField("maritalStatus") ? inputDisabled : inputBase
                    }
                  >
                    {MARITAL_STATUSES.map((ms) => (
                      <option key={ms.value} value={ms.value}>
                        {ms.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelBase}>Aadhar Number</label>
                  <input
                    type="text"
                    value={form.nationalId}
                    onChange={(e) => set("nationalId", e.target.value)}
                    placeholder="Aadhar Number"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={labelBase}>Patient Photograph</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={form.photoUrl}
                      onChange={(e) => set("photoUrl", e.target.value)}
                      placeholder="Image URL"
                      className={inputBase}
                    />
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors shrink-0"
                    >
                      <Upload size={14} /> Upload Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ADDRESS INFORMATION */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-7">
              <SectionHeader
                icon={MapPin}
                title="Address Information"
                subtitle="Patient's residential address details"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="md:col-span-2">
                  <label className={labelBase}>Address Line 1</label>
                  <input
                    type="text"
                    value={form.addressLine1}
                    onChange={(e) => set("addressLine1", e.target.value)}
                    placeholder="House / Flat No., Building, Street"
                    className={inputBase}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelBase}>Address Line 2</label>
                  <input
                    type="text"
                    value={form.addressLine2}
                    onChange={(e) => set("addressLine2", e.target.value)}
                    placeholder="Landmark, Cross Street"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={labelBase}>City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="City Name"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={labelBase}>State</label>
                  <select
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                    className={inputBase}
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelBase}>Pincode</label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => set("pincode", e.target.value)}
                    onBlur={() => markTouched("pincode")}
                    placeholder="6-digit Pincode"
                    maxLength={6}
                    className={fClass("pincode")}
                  />
                  {fieldError("pincode")}
                </div>

                <div>
                  <label className={labelBase}>Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* 3. EMERGENCY CONTACT */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-7">
              <SectionHeader
                icon={Shield}
                title="Emergency Contact"
                subtitle="Person to be contacted in case of an emergency"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className={labelBase}>Emergency Contact Name</label>
                  <input
                    type="text"
                    value={form.ecName}
                    onChange={(e) => set("ecName", e.target.value)}
                    placeholder="Full name of emergency contact"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={labelBase}>Relationship</label>
                  <select
                    value={form.ecRelationship}
                    onChange={(e) => set("ecRelationship", e.target.value)}
                    className={inputBase}
                  >
                    {RELATIONSHIPS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelBase}>Mobile Number</label>
                  <input
                    type="tel"
                    value={form.ecMobile}
                    onChange={(e) => set("ecMobile", e.target.value)}
                    placeholder="+91 98765 00000"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={labelBase}>
                    Alternative Contact Number
                  </label>
                  <input
                    type="tel"
                    value={form.ecAltMobile}
                    onChange={(e) => set("ecAltMobile", e.target.value)}
                    placeholder="Landline or Secondary Mobile"
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* 4. REGISTRATION DETAILS */}

            {/* 5. MEDICAL ALERTS & NOTES */}
            {!hideField("knownAllergies") && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-7">
                <SectionHeader
                  icon={AlertCircle}
                  title="Medical Alerts & Notes"
                  subtitle="Allergies, chronic conditions, and additional info"
                />

                <div className="grid grid-cols-1 gap-y-5">
                  <div>
                    <label className={labelBase}>Known Allergies</label>
                    <input
                      type="text"
                      value={form.knownAllergies}
                      onChange={(e) => set("knownAllergies", e.target.value)}
                      placeholder="e.g. Penicillin, Peanuts, Latex"
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label className={labelBase}>Chronic Diseases</label>
                    <input
                      type="text"
                      value={form.chronicDiseases}
                      onChange={(e) => set("chronicDiseases", e.target.value)}
                      placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma"
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label className={labelBase}>Special Notes</label>
                    <textarea
                      rows={3}
                      value={form.specialNotes}
                      onChange={(e) => set("specialNotes", e.target.value)}
                      placeholder="e.g. Requires wheelchair assistance, prefers afternoon slots"
                      className={inputBase + " resize-none"}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* BOTTOM ACTION BAR */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => onBack?.()}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                style={{ fontFamily: PP }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                style={{ fontFamily: PP }}
              >
                <RotateCcw size={14} />
                Clear Form
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || createPatient.isPending}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0D47A1] text-white text-sm font-semibold hover:bg-[#0c3d8a] transition-colors shadow-md shadow-[#0D47A1]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontFamily: PP }}
              >
                {submitting || createPatient.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Registering…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Register Patient & Generate MRN
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
