import { useState } from "react";
import { useNavigate } from "react-router";
import { usersApi } from "../api/users.api";
import type {
  AdminCreateStaffData,
  AdminCreateDoctorStaffData,
} from "../types/users.types";

export const SPECIALTY_NAME_TO_ID: Record<string, number> = {
  "General Cardiology": 1,
  "Interventional Cardiology": 2,
  Electrophysiology: 3,
  "Pediatric Cardiology": 4,
  "Cardiovascular Surgery": 5,
  "Internal Medicine": 6,
  "Family Medicine": 7,
  "Geriatric Medicine": 8,
  "Preventive Care": 9,
  "General Practice": 10,
  "Clinical Neurology": 11,
  Neurosurgery: 12,
  "Neuro-Oncology": 13,
  "Neuro-Immunology": 14,
  "Stroke Medicine": 15,
  "Hospital Management": 16,
  "Clinical Administration": 17,
  "Operations Support": 18,
  "Patient Coordination": 19,
  "Outpatient Registrations": 20,
  "Customer Relations": 21,
  "Patient Billing": 22,
  "Medical Insurance Auditing": 23,
  "Financial Accounting": 24,
  "Critical Care Nursing": 25,
  "Emergency Care Nursing": 26,
  "Pediatric Nursing": 27,
  "General Ward Nursing": 28,
  "System Administration": 29,
  "Healthcare Informatics": 30,
  "Network Security": 31,
};

export interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  role: "DOCTOR" | "RECEPTIONIST" | "NURSE" | "ACCOUNTANT" | "";
  professionalIdentity: string;
  registrationNumber: string;
  qualification: string;
  yearsOfExperience: string;
  doctorCode: string;
  primaryDepartment: string;
  secondaryDepartment: string;
  primarySpecialty: string;
  secondarySpecialty: string;
  consultationFee: string;
  followUpFee: string;
  slotDurationMinutes: string;
  residentialAddress: string;
  professionalBio: string;
  photoUrl: string;
  availability: Record<
    string,
    {
      isAvailable: boolean;
      startTime: string;
      endTime: string;
    }
  >;
  sendCredentials: boolean;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  professionalIdentity?: string;
  registrationNumber?: string;
  primaryDepartment?: string;
  secondaryDepartment?: string;
  primarySpecialty?: string;
  secondarySpecialty?: string;
  consultationFee?: string;
  availabilityGeneral?: string;
  availabilityDays?: Record<string, { startTime?: string; endTime?: string }>;
}

const INITIAL_AVAILABILITY = {
  Monday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
  Tuesday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
  Wednesday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
  Thursday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
  Friday: { isAvailable: true, startTime: "09:00", endTime: "17:00" },
  Saturday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
  Sunday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
};

const getRolePrefix = (role: string) => {
  switch (role) {
    case "DOCTOR":
      return "DOC";
    case "NURSE":
      return "NUR";
    case "RECEPTIONIST":
      return "REC";
    case "ACCOUNTANT":
      return "ACC";
    default:
      return "STAFF";
  }
};

export const useCreateStaffForm = (
  triggerToast: (msg: string, type?: "success" | "error") => void,
  onSuccess?: () => void,
  onBack?: () => void,
) => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormValues>({
    fullName: "",
    email: "",
    phone: "",
    gender: "Prefer not to say",
    dob: "",
    role: "DOCTOR",
    professionalIdentity: "",
    registrationNumber: "",
    qualification: "",
    yearsOfExperience: "",
    doctorCode: "",
    primaryDepartment: "Cardiology",
    secondaryDepartment: "",
    primarySpecialty: "",
    secondarySpecialty: "",
    consultationFee: "",
    followUpFee: "",
    slotDurationMinutes: "15",
    residentialAddress: "",
    professionalBio: "",
    photoUrl: "",
    availability: { ...INITIAL_AVAILABILITY },
    sendCredentials: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempPassword] = useState(
    () => "TempPass#" + Math.floor(1000 + Math.random() * 9000),
  );
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = form.role === "DOCTOR" ? 4 : 3;
  const empIdPreview = `EMP-${getRolePrefix(form.role)}-XXXX`;

  const validateStep = (stepNumber: number): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    if (stepNumber === 1) {
      if (!form.role) {
        tempErrors.role = "Role selection is required.";
        isValid = false;
      }
    } else if (stepNumber === 2) {
      if (!form.fullName.trim()) {
        tempErrors.fullName = "Full name is required.";
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!form.email) {
        tempErrors.email = "Email address is required.";
        isValid = false;
      } else if (!emailRegex.test(form.email)) {
        tempErrors.email = "Invalid email format.";
        isValid = false;
      }

      if (!form.phone) {
        tempErrors.phone = "Phone number is required.";
        isValid = false;
      } else if (form.phone.replace(/\D/g, "").length < 10) {
        tempErrors.phone = "Phone number must be at least 10 digits.";
        isValid = false;
      }

      if (form.role === "DOCTOR" && !form.registrationNumber.trim()) {
        tempErrors.registrationNumber =
          "Medical registration number is required.";
        isValid = false;
      }
    } else if (form.role === "DOCTOR" && stepNumber === 3) {
      if (!form.primaryDepartment) {
        tempErrors.primaryDepartment = "Primary department is required.";
        isValid = false;
      }

      if (!form.primarySpecialty) {
        tempErrors.primarySpecialty = "Primary specialty is required.";
        isValid = false;
      }

      const fee = Number(form.consultationFee);
      if (!form.consultationFee) {
        tempErrors.consultationFee = "Consultation fee is required.";
        isValid = false;
      } else if (isNaN(fee) || fee <= 0) {
        tempErrors.consultationFee = "Fee must be greater than 0.";
        isValid = false;
      }

      const availabilityDaysErrors: Record<
        string,
        { startTime?: string; endTime?: string }
      > = {};
      let hasAvail = false;
      let timeError = false;

      Object.entries(form.availability).forEach(([day, sched]) => {
        if (sched.isAvailable) {
          hasAvail = true;
          const dayError: { startTime?: string; endTime?: string } = {};

          if (!sched.startTime) {
            dayError.startTime = "Start time required.";
            timeError = true;
          }
          if (!sched.endTime) {
            dayError.endTime = "End time required.";
            timeError = true;
          }

          if (
            sched.startTime &&
            sched.endTime &&
            sched.startTime >= sched.endTime
          ) {
            dayError.endTime = "End time must be after Start time.";
            timeError = true;
          }

          if (Object.keys(dayError).length > 0) {
            availabilityDaysErrors[day] = dayError;
          }
        }
      });

      if (!hasAvail) {
        tempErrors.availabilityGeneral =
          "Select at least one day in the schedule as available.";
        isValid = false;
      }

      if (timeError) {
        tempErrors.availabilityDays = availabilityDaysErrors;
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      triggerToast(
        "Please resolve the validation errors on the current slide.",
        "error",
      );
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      if (onBack) {
        onBack();
      } else if (navigate) {
        navigate("/dashboard/admin/users");
      }
    }
  };

  const setFieldValue = (name: string, value: unknown) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const setNestedFieldValue = (
    _section: "availability",
    key: string,
    value: { isAvailable: boolean; startTime: string; endTime: string },
  ) => {
    setForm((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [key]: value,
      },
    }));
  };

  const copyMondayHoursToWeekdays = () => {
    const monday = form.availability.Monday;
    setForm((prev) => {
      const updatedAvail = { ...prev.availability };
      ["Tuesday", "Wednesday", "Thursday", "Friday"].forEach((day) => {
        updatedAvail[day] = {
          ...updatedAvail[day],
          isAvailable: monday.isAvailable,
          startTime: monday.startTime,
          endTime: monday.endTime,
        };
      });
      return {
        ...prev,
        availability: updatedAvail,
      };
    });
    triggerToast("Copied Monday's hours to weekdays successfully!", "success");
  };

  const validateField = (fieldName: keyof FormValues, value: string) => {
    const fieldErrors: FormErrors = { ...errors };

    if (fieldName === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        fieldErrors.email = "Email address is required.";
      } else if (!emailRegex.test(value)) {
        fieldErrors.email = "Invalid email address format.";
      } else {
        fieldErrors.email = undefined;
      }
    }

    if (fieldName === "phone") {
      if (!value) {
        fieldErrors.phone = "Phone number is required.";
      } else if (value.replace(/\D/g, "").length < 10) {
        fieldErrors.phone = "Phone number must contain at least 10 digits.";
      } else {
        fieldErrors.phone = undefined;
      }
    }

    if (fieldName === "fullName") {
      if (!value) {
        fieldErrors.fullName = "Full Name is required.";
      } else {
        fieldErrors.fullName = undefined;
      }
    }

    setErrors(fieldErrors);
  };

  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    if (!form.fullName.trim()) {
      tempErrors.fullName = "Full name is required.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      tempErrors.email = "Email address is required.";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      tempErrors.email = "Invalid email format.";
      isValid = false;
    }

    if (!form.phone) {
      tempErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (form.phone.replace(/\D/g, "").length < 10) {
      tempErrors.phone = "Phone number must be at least 10 digits.";
      isValid = false;
    }

    if (!form.role) {
      tempErrors.role = "Staff system role is required.";
      isValid = false;
    }

    if (form.role === "DOCTOR") {
      if (!form.primaryDepartment) {
        tempErrors.primaryDepartment = "Primary department is required.";
        isValid = false;
      }

      if (!form.primarySpecialty) {
        tempErrors.primarySpecialty = "Primary specialty is required.";
        isValid = false;
      }

      if (!form.registrationNumber.trim()) {
        tempErrors.registrationNumber =
          "Medical registration number is required.";
        isValid = false;
      }

      const fee = Number(form.consultationFee);
      if (!form.consultationFee) {
        tempErrors.consultationFee = "Consultation fee is required.";
        isValid = false;
      } else if (isNaN(fee) || fee <= 0) {
        tempErrors.consultationFee = "Consultation fee must be greater than 0.";
        isValid = false;
      }

      const availabilityDaysErrors: Record<
        string,
        { startTime?: string; endTime?: string }
      > = {};
      let hasAvail = false;
      let timeError = false;

      Object.entries(form.availability).forEach(([day, sched]) => {
        if (sched.isAvailable) {
          hasAvail = true;
          const dayError: { startTime?: string; endTime?: string } = {};

          if (!sched.startTime) {
            dayError.startTime = "Start time required.";
            timeError = true;
          }
          if (!sched.endTime) {
            dayError.endTime = "End time required.";
            timeError = true;
          }

          if (
            sched.startTime &&
            sched.endTime &&
            sched.startTime >= sched.endTime
          ) {
            dayError.endTime = "End time must be after Start time.";
            timeError = true;
          }

          if (Object.keys(dayError).length > 0) {
            availabilityDaysErrors[day] = dayError;
          }
        }
      });

      if (!hasAvail) {
        tempErrors.availabilityGeneral =
          "Select at least one day in the schedule as available.";
        isValid = false;
      }

      if (timeError) {
        tempErrors.availabilityDays = availabilityDaysErrors;
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSaveStaff = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      triggerToast(
        "Please correct the validation errors in the form.",
        "error",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const departmentMapping: Record<string, number> = {
        Cardiology: 1,
        "General Medicine": 2,
        Neurology: 3,
        Administration: 4,
        "OPD Reception": 5,
        "Accounts & Billing": 6,
        "Nursing & Patient Care": 7,
        "IT & Systems": 8,
      };

      const finalDeptId = departmentMapping[form.primaryDepartment] || 2;
      const secondaryDeptIds = form.secondaryDepartment
        ? [departmentMapping[form.secondaryDepartment] || 2]
        : [];
      const apiRole = form.role;

      const cleanMobile = form.phone.replace(/\D/g, "");
      const finalMobile =
        cleanMobile.length > 10 ? cleanMobile.slice(-10) : cleanMobile;

      const basePayload: AdminCreateStaffData = {
        fullName: form.fullName,
        email: form.email,
        mobile: finalMobile,
        role: apiRole,
        departmentId: finalDeptId,
        primaryDepartmentId: finalDeptId,
        secondaryDepartmentIds: secondaryDeptIds,
        designation:
          form.role === "DOCTOR"
            ? form.primarySpecialty
            : `${form.role.charAt(0) + form.role.slice(1).toLowerCase()} Staff`,
      };

      let response;
      if (form.role === "DOCTOR") {
        const availabilityList = Object.entries(form.availability).map(
          ([day, sched]) => ({
            day: day.toUpperCase(),
            available: sched.isAvailable,
            slots: sched.isAvailable
              ? [
                  {
                    startTime:
                      sched.startTime.includes(":") &&
                      sched.startTime.split(":").length === 2
                        ? `${sched.startTime}:00`
                        : sched.startTime,
                    endTime:
                      sched.endTime.includes(":") &&
                      sched.endTime.split(":").length === 2
                        ? `${sched.endTime}:00`
                        : sched.endTime,
                  },
                ]
              : [],
          }),
        );

        const primaryId = SPECIALTY_NAME_TO_ID[form.primarySpecialty] || 1;
        const secondaryIds = form.secondarySpecialty
          ? [SPECIALTY_NAME_TO_ID[form.secondarySpecialty] || 2]
          : [];

        const doctorPayload: AdminCreateDoctorStaffData = {
          ...basePayload,
          primaryDepartmentId: finalDeptId,
          secondaryDepartmentIds: secondaryDeptIds,
          primarySpecialtyId: primaryId,
          secondarySpecialtyIds: secondaryIds,
          photoUrl: form.photoUrl || undefined,
          residentialAddress: form.residentialAddress || undefined,
          professionalBio: form.professionalBio || undefined,
          qualification: form.qualification || undefined,
          yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
          doctorCode: form.doctorCode || undefined,
          medicalRegistrationNumber: form.registrationNumber || undefined,
          consultationFee: Number(form.consultationFee) || 0,
          followUpFee: form.followUpFee ? Number(form.followUpFee) : undefined,
          slotDurationMinutes: Number(form.slotDurationMinutes) || 15,
          sendCredentials: form.sendCredentials,
          doctorProfile: {
            registrationNumber: form.registrationNumber,
            medicalRegistrationNumber: form.registrationNumber,
            qualification: form.qualification || undefined,
            yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
            doctorCode: form.doctorCode || undefined,
            primaryDepartmentId: finalDeptId,
            secondaryDepartmentIds: secondaryDeptIds,
            primarySpecialtyId: primaryId,
            secondarySpecialtyIds: secondaryIds,
            consultationFee: Number(form.consultationFee) || 0,
            followUpFee: form.followUpFee ? Number(form.followUpFee) : 0,
            slotDurationMinutes: Number(form.slotDurationMinutes) || 15,
            consultationTypes: ["IN_PERSON"],
            availability: availabilityList,
            residentialAddress: form.residentialAddress || undefined,
            professionalBio: form.professionalBio || undefined,
            photoUrl: form.photoUrl || undefined,
          },
        };

        response = await usersApi.adminCreateStaff(doctorPayload);
      } else {
        response = await usersApi.adminCreateStaff(basePayload);
      }

      if (response.success) {
        triggerToast(
          `Staff account for ${form.fullName} created successfully!`,
          "success",
        );
        if (onSuccess) {
          onSuccess();
        } else if (navigate) {
          navigate("/dashboard/admin/users");
        }
      } else {
        triggerToast(
          response.message || "Failed to create staff account.",
          "error",
        );
      }
    } catch (err: unknown) {
      let errMsg = "Error submitting form";
      if (err instanceof Error) {
        errMsg = err.message;
      }
      const axiosErr = err as { cause?: { response?: { status?: number } } };
      if (axiosErr?.cause?.response?.status === 403) {
        errMsg =
          "Access denied. Your account does not have ADMIN permissions to create staff. Please log in with an admin account.";
      }
      console.error("[CreateStaff] Error:", err);
      triggerToast(errMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    errors,
    isSubmitting,
    tempPassword,
    empIdPreview,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    validateStep,
    setFieldValue,
    setNestedFieldValue,
    validateField,
    copyMondayHoursToWeekdays,
    handleSaveStaff,
  };
};
