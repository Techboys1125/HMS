import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../app/routes/routes";
import { BrandingPanel } from "../components/BrandingPanel";
import { PatientRegisterForm } from "../components/PatientRegisterForm";
import { SuccessPage } from "./SuccessPage";
import type { PatientRegistrationResponse } from "../types/auth.types";

/**
 * PatientRegisterPage – Standalone online registration page for patients
 * (route /register). Reuses the same PatientRegisterForm used by the login
 * page, and shows a success screen after the backend account is created.
 */
export const PatientRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [registered, setRegistered] =
    useState<PatientRegistrationResponse | null>(null);

  const handleSuccess = (response: PatientRegistrationResponse) => {
    setRegistered(response);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] overflow-hidden font-body">
      <BrandingPanel />

      <main className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 bg-slate-50 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-120 h-120 bg-[#0D47A1]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-120 h-120 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-100/80 shadow-2xl shadow-slate-200/50 p-6 sm:p-8 md:p-10 relative z-10 transition-colors duration-300">
          {registered ? (
            <SuccessPage
              title="Registration Successful!"
              message={
                registered.message ||
                `Account created for ${
                  registered.data?.email || "your registered email"
                }. Please check your inbox for verification.`
              }
              onContinue={() => navigate(ROUTES.LOGIN)}
            />
          ) : (
            <PatientRegisterForm
              onSuccess={handleSuccess}
              onGoToLogin={() => navigate(ROUTES.LOGIN)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientRegisterPage;
