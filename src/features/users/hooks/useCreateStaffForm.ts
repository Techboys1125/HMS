import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../app/routes/routes";
import { usersApi } from "../api/users.api";
import {
  departmentsApi,
  type ApiDepartmentLookupItem,
} from "../api/departments.api";
import type {
  AdminCreateStaffData,
  AdminCreateDoctorStaffData,
  OpdWeeklySchedule,
} from "../types/users.types";

export interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  dateOfBirth?: string;
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
  Monday: { isAvailable: false, startTime: "", endTime: "" },
  Tuesday: { isAvailable: false, startTime: "", endTime: "" },
  Wednesday: { isAvailable: false, startTime: "", endTime: "" },
  Thursday: { isAvailable: false, startTime: "", endTime: "" },
  Friday: { isAvailable: false, startTime: "", endTime: "" },
  Saturday: { isAvailable: false, startTime: "", endTime: "" },
  Sunday: { isAvailable: false, startTime: "", endTime: "" },
};

const DAY_UPPER_TO_TITLE: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

const mapHospitalScheduleToFormAvailability = (
  schedule: OpdWeeklySchedule,
): typeof INITIAL_AVAILABILITY => {
  const result = { ...INITIAL_AVAILABILITY };
  if (!schedule?.weeklySchedule) return result;
  for (const day of schedule.weeklySchedule) {
    const titleCase = DAY_UPPER_TO_TITLE[day.dayOfWeek.toUpperCase()];
    if (titleCase && result[titleCase] !== undefined) {
      const interval = day.workingIntervals?.[0];
      if (!interval) continue;
      let startTime = interval.startTime || "";
      let endTime = interval.endTime || "";
      if (day.breaks && day.breaks.length > 0) {
        for (const brk of day.breaks) {
          if (
            startTime &&
            endTime &&
            startTime < brk.endTime &&
            endTime > brk.startTime
          ) {
            if (startTime < brk.startTime) {
              endTime = brk.startTime;
            }
          }
        }
      }
      result[titleCase] = {
        isAvailable: day.isOpen,
        startTime,
        endTime,
      };
    }
  }
  return result;
};

const isTimeWithinWindow = (
  time: string,
  windowStart: string,
  windowEnd: string,
): boolean => {
  if (!time || !windowStart || !windowEnd) return true;
  return time >= windowStart && time <= windowEnd;
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

const getApiGender = (genderStr: string): "MALE" | "FEMALE" | "OTHER" => {
  if (genderStr === "Male" || genderStr === "MALE") return "MALE";
  if (genderStr === "Female" || genderStr === "FEMALE") return "FEMALE";
  return "OTHER";
};

export const useCreateStaffForm = (
  triggerToast: (msg: string, type?: "success" | "error") => void,
  onSuccess?: () => void,
  onBack?: () => void,
) => {
  const navigate = useNavigate();
  const [departmentsList, setDepartmentsList] = useState<
    ApiDepartmentLookupItem[]
  >([]);
  const [hospitalSchedule, setHospitalSchedule] =
    useState<OpdWeeklySchedule | null>(null);

  useEffect(() => {
    departmentsApi
      .getDepartmentLookup(true)
      .then((list) => {
        setDepartmentsList(list);
      })
      .catch(() => {});
  }, []);

  const [form, setForm] = useState<FormValues>(() => ({
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
    slotDurationMinutes: "15",
    residentialAddress: "",
    professionalBio: "",
    photoUrl: "",
    availability: { ...INITIAL_AVAILABILITY },
    sendCredentials: true,
  }));

  // Fetch hospital OPD weekly schedule for doctor availability defaults
  useEffect(() => {
    usersApi
      .fetchOpdWeeklySchedule()
      .then((schedule) => {
        setHospitalSchedule(schedule);
        // Update availability defaults from hospital schedule
        setForm((prev) => ({
          ...prev,
          availability: mapHospitalScheduleToFormAvailability(schedule),
        }));
      })
      .catch(() => {});
  }, []);

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

      // Validate doctor availability against hospital schedule
      if (hospitalSchedule?.weeklySchedule) {
        for (const [day, sched] of Object.entries(form.availability)) {
          if (sched.isAvailable) {
            const hospitalDay = hospitalSchedule.weeklySchedule.find(
              (d) =>
                d.dayOfWeek.toUpperCase() === day.toUpperCase(),
            );
            // Rule 1: Hospital closed day — doctor cannot schedule
            if (hospitalDay && !hospitalDay.isOpen) {
              tempErrors.availabilityDays = {
                ...tempErrors.availabilityDays,
                [day]: {
                  ...tempErrors.availabilityDays?.[day],
                  startTime: `Hospital is closed on ${day}. Doctor cannot be available.`,
                },
              };
              isValid = false;
            } else if (hospitalDay && hospitalDay.isOpen) {
              const interval = hospitalDay.workingIntervals?.[0];
              if (interval) {
                // Rule 2: Doctor start time must be >= hospital start
                if (
                  sched.startTime &&
                  !isTimeWithinWindow(
                    sched.startTime,
                    interval.startTime,
                    interval.endTime,
                  )
                ) {
                  tempErrors.availabilityDays = {
                    ...tempErrors.availabilityDays,
                    [day]: {
                      ...tempErrors.availabilityDays?.[day],
                      startTime: `Start time is outside hospital schedule (${interval.startTime}–${interval.endTime}).`,
                    },
                  };
                  isValid = false;
                }
                // Rule 3: Doctor end time must be <= hospital end
                if (
                  sched.endTime &&
                  !isTimeWithinWindow(
                    sched.endTime,
                    interval.startTime,
                    interval.endTime,
                  )
                ) {
                  tempErrors.availabilityDays = {
                    ...tempErrors.availabilityDays,
                    [day]: {
                      ...tempErrors.availabilityDays?.[day],
                      endTime: `End time is outside hospital schedule (${interval.startTime}–${interval.endTime}).`,
                    },
                  };
                  isValid = false;
                }
              }
              // Rule 4: Doctor availability must not overlap hospital breaks
              if (hospitalDay.breaks && hospitalDay.breaks.length > 0) {
                for (const brk of hospitalDay.breaks) {
                  if (
                    sched.startTime &&
                    sched.endTime &&
                    sched.startTime < brk.endTime &&
                    sched.endTime > brk.startTime
                  ) {
                    tempErrors.availabilityDays = {
                      ...tempErrors.availabilityDays,
                      [day]: {
                        ...tempErrors.availabilityDays?.[day],
                        endTime: `Availability cannot overlap hospital break "${brk.breakName || "Break"}" (${brk.startTime}–${brk.endTime}). Adjust your hours to avoid the break period.`,
                      },
                    };
                    isValid = false;
                  }
                }
              }
            }
          }
        }
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
        navigate(ROUTES.USER_MANAGEMENT);
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

      // Validate doctor availability against hospital schedule
      if (hospitalSchedule?.weeklySchedule) {
        for (const [day, sched] of Object.entries(form.availability)) {
          if (sched.isAvailable) {
            const hospitalDay = hospitalSchedule.weeklySchedule.find(
              (d) =>
                d.dayOfWeek.toUpperCase() === day.toUpperCase(),
            );
            // Rule 1: Hospital closed day — doctor cannot schedule
            if (hospitalDay && !hospitalDay.isOpen) {
              tempErrors.availabilityDays = {
                ...tempErrors.availabilityDays,
                [day]: {
                  ...tempErrors.availabilityDays?.[day],
                  startTime: `Hospital is closed on ${day}. Doctor cannot be available.`,
                },
              };
              isValid = false;
            } else if (hospitalDay && hospitalDay.isOpen) {
              const interval = hospitalDay.workingIntervals?.[0];
              if (interval) {
                // Rule 2: Doctor start time must be >= hospital start
                if (
                  sched.startTime &&
                  !isTimeWithinWindow(
                    sched.startTime,
                    interval.startTime,
                    interval.endTime,
                  )
                ) {
                  tempErrors.availabilityDays = {
                    ...tempErrors.availabilityDays,
                    [day]: {
                      ...tempErrors.availabilityDays?.[day],
                      startTime: `Start time is outside hospital schedule (${interval.startTime}–${interval.endTime}).`,
                    },
                  };
                  isValid = false;
                }
                // Rule 3: Doctor end time must be <= hospital end
                if (
                  sched.endTime &&
                  !isTimeWithinWindow(
                    sched.endTime,
                    interval.startTime,
                    interval.endTime,
                  )
                ) {
                  tempErrors.availabilityDays = {
                    ...tempErrors.availabilityDays,
                    [day]: {
                      ...tempErrors.availabilityDays?.[day],
                      endTime: `End time is outside hospital schedule (${interval.startTime}–${interval.endTime}).`,
                    },
                  };
                  isValid = false;
                }
              }
              // Rule 4: Doctor availability must not overlap hospital breaks
              if (hospitalDay.breaks && hospitalDay.breaks.length > 0) {
                for (const brk of hospitalDay.breaks) {
                  if (
                    sched.startTime &&
                    sched.endTime &&
                    sched.startTime < brk.endTime &&
                    sched.endTime > brk.startTime
                  ) {
                    tempErrors.availabilityDays = {
                      ...tempErrors.availabilityDays,
                      [day]: {
                        ...tempErrors.availabilityDays?.[day],
                        endTime: `Availability cannot overlap hospital break "${brk.breakName || "Break"}" (${brk.startTime}–${brk.endTime}). Adjust your hours to avoid the break period.`,
                      },
                    };
                    isValid = false;
                  }
                }
              }
            }
          }
        }
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
      const matchedPrimaryDept = departmentsList.find(
        (d) => d.departmentName === form.primaryDepartment,
      );
      const finalDeptId = matchedPrimaryDept
        ? Number(matchedPrimaryDept.departmentId)
        : 2;

      const matchedSecondaryDept = form.secondaryDepartment
        ? departmentsList.find(
            (d) => d.departmentName === form.secondaryDepartment,
          )
        : null;
      const secondaryDeptIds = matchedSecondaryDept
        ? [Number(matchedSecondaryDept.departmentId)]
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
        gender: getApiGender(form.gender),
        dateOfBirth: form.dob || undefined,
        residentialAddress: form.residentialAddress || undefined,
        photoUrl: form.photoUrl || undefined,
        photo: form.photoUrl || undefined,
        sendCredentials: form.sendCredentials,
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
        const backendAvailabilityList = Object.entries(form.availability)
          .filter(([, sched]) => sched.isAvailable)
          .map(([day, sched]) => ({
            dayOfWeek: day.toUpperCase(),
            startTime: (sched.startTime || "").slice(0, 5),
            endTime: (sched.endTime || "").slice(0, 5),
          }));

        const legacyAvailabilityList = Object.entries(form.availability).map(
          ([day, sched]) => ({
            day: day.toUpperCase(),
            available: sched.isAvailable,
            slots: sched.isAvailable
              ? [
                  {
                    startTime: (sched.startTime || "").slice(0, 5),
                    endTime: (sched.endTime || "").slice(0, 5),
                  },
                ]
              : [],
          }),
        );

        let primaryId = 1;
        if (matchedPrimaryDept && matchedPrimaryDept.specialties) {
          const matchedSpec = matchedPrimaryDept.specialties.find(
            (s) => s.name === form.primarySpecialty,
          );
          if (matchedSpec) {
            primaryId = Number(matchedSpec.id);
          }
        }

        let secondaryIds: number[] = [];
        if (
          matchedSecondaryDept &&
          matchedSecondaryDept.specialties &&
          form.secondarySpecialty
        ) {
          const matchedSpec = matchedSecondaryDept.specialties.find(
            (s) => s.name === form.secondarySpecialty,
          );
          if (matchedSpec) {
            secondaryIds = [Number(matchedSpec.id)];
          }
        }

        const doctorPayload: AdminCreateDoctorStaffData = {
          fullName: form.fullName,
          email: form.email,
          mobile: finalMobile,
          gender: getApiGender(form.gender),
          dateOfBirth: form.dob || form.dateOfBirth || undefined,
          photo: form.photoUrl || undefined,
          photoUrl: form.photoUrl || undefined,
          residentialAddress: form.residentialAddress || undefined,
          professionalBio: form.professionalBio || undefined,
          role: apiRole,
          medicalRegistrationNumber: form.registrationNumber || undefined,
          qualification: form.qualification || undefined,
          yearsOfExperience: form.yearsOfExperience
            ? Number(form.yearsOfExperience)
            : undefined,
          doctorCode: form.doctorCode || undefined,
          primaryDepartmentId: finalDeptId,
          secondaryDepartmentIds: secondaryDeptIds,
          primarySpecialtyId: primaryId,
          secondarySpecialtyIds: secondaryIds,
          consultationFee: Number(form.consultationFee) || 0,
          slotDurationMinutes: Number(form.slotDurationMinutes) || 15,
          availability: backendAvailabilityList,
          sendCredentials: form.sendCredentials,
          // Legacy backward compatibility
          departmentId: finalDeptId,
          designation: form.primarySpecialty || "Doctor",
          doctorProfile: {
            registrationNumber: form.registrationNumber,
            medicalRegistrationNumber: form.registrationNumber,
            qualification: form.qualification || undefined,
            yearsOfExperience: form.yearsOfExperience
              ? Number(form.yearsOfExperience)
              : undefined,
            doctorCode: form.doctorCode || undefined,
            primaryDepartmentId: finalDeptId,
            secondaryDepartmentIds: secondaryDeptIds,
            primarySpecialtyId: primaryId,
            secondarySpecialtyIds: secondaryIds,
            consultationFee: Number(form.consultationFee) || 0,
            slotDurationMinutes: Number(form.slotDurationMinutes) || 15,
            consultationTypes: ["IN_PERSON"],
            availability: legacyAvailabilityList,
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
          navigate(ROUTES.USER_MANAGEMENT);
        }
      } else {
        triggerToast(
          response.message || "Failed to create staff account.",
          "error",
        );
      }
    } catch (err: unknown) {
      let errMsg = "Failed to create staff account.";
      if (err instanceof Error) {
        errMsg = err.message;
      }
      const apiErr = err as {
        response?: {
          status?: number;
          data?: { message?: string; errors?: unknown };
        };
      };
      const status = apiErr?.response?.status;
      const resData = apiErr?.response?.data;

      if (status === 403) {
        errMsg =
          "Access denied. Your account does not have ADMIN permissions to create staff. Please log in with an admin account.";
      } else if (status === 500) {
        errMsg =
          resData?.message ||
          "Internal server error occurred on the backend. Please check staff details and try again.";
      } else if (
        resData?.errors &&
        Array.isArray(resData.errors) &&
        resData.errors.length > 0
      ) {
        const details = (resData.errors as Record<string, unknown>[])
          .map((e) => {
            const msg = (e?.message || e?.defaultMessage) as string | undefined;
            return msg || JSON.stringify(e);
          })
          .join(", ");
        errMsg = `${resData.message}: ${details}`;
      } else if (resData?.message) {
        errMsg = resData.message;
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
    hospitalSchedule,
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
