import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchHospitalConfiguration,
  fetchPrintHeaderPreview,
  mapConfigurationToForm,
  mapFormToConfiguration,
  resetHospitalConfiguration,
  saveHospitalConfiguration,
  uploadHospitalHeaderBanner,
  uploadHospitalLogo,
  getUploadedFileUrl,
  isUsableMediaUrl,
} from "../services/settings.service";
import { publishHospitalBranding } from "../services/hospital-branding";
import type {
  HospitalInformationForm,
  PrintHeaderPreview,
} from "../types/settings.types";
import { EMPTY_HOSPITAL_INFORMATION_FORM } from "../types/settings.types";

interface UseHospitalConfigurationResult {
  form: HospitalInformationForm;
  loading: boolean;
  saving: boolean;
  uploading: boolean;
  error: string | null;
  success: string | null;
  printHeader: PrintHeaderPreview | null;
  updateField: (field: string, value: string | boolean | number) => void;
  setForm: React.Dispatch<React.SetStateAction<HospitalInformationForm>>;
  save: () => Promise<boolean>;
  reset: () => Promise<void>;
  uploadLogo: (file: File) => Promise<void>;
  uploadBanner: (file: File) => Promise<void>;
  loadPrintHeader: () => Promise<void>;
  reload: () => Promise<void>;
  clearFeedback: () => void;
}

export function useHospitalConfiguration(): UseHospitalConfigurationResult {
  const [form, setForm] = useState<HospitalInformationForm>(
    EMPTY_HOSPITAL_INFORMATION_FORM,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [printHeader, setPrintHeader] = useState<PrintHeaderPreview | null>(
    null,
  );
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const showSuccess = useCallback((message: string) => {
    setSuccess(message);
    window.setTimeout(() => {
      if (mounted.current) setSuccess(null);
    }, 3000);
  }, []);

  const showError = useCallback((message: string) => {
    setError(message);
    window.setTimeout(() => {
      if (mounted.current) setError(null);
    }, 4000);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const config = await fetchHospitalConfiguration();
        if (active && mounted.current) {
          const nextForm = mapConfigurationToForm(config);
          setForm(nextForm);
          publishHospitalBranding({
            logoUrl: nextForm.logoUrl || undefined,
          });
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load hospital configuration";
        if (active && mounted.current) showError(message);
      } finally {
        if (active && mounted.current) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [showError]);

  const updateField = useCallback(
    (field: string, value: string | boolean | number) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const save = useCallback(async (): Promise<boolean> => {
    setSaving(true);
    setError(null);
    try {
      await saveHospitalConfiguration(mapFormToConfiguration(form));
      if (mounted.current) {
        showSuccess("Hospital Information saved successfully!");
        const config = await fetchHospitalConfiguration();
        const nextForm = mapConfigurationToForm(config);
        setForm(nextForm);
        publishHospitalBranding({
          logoUrl: nextForm.logoUrl || undefined,
        });
      }
      return true;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to save hospital configuration";
      if (mounted.current) showError(message);
      return false;
    } finally {
      if (mounted.current) setSaving(false);
    }
  }, [form, showSuccess, showError]);

  const reset = useCallback(async () => {
    setError(null);
    try {
      await resetHospitalConfiguration();
      if (mounted.current) {
        showSuccess("Hospital configuration reset successfully!");
        const config = await fetchHospitalConfiguration();
        const nextForm = mapConfigurationToForm(config);
        setForm(nextForm);
        publishHospitalBranding({
          logoUrl: nextForm.logoUrl || undefined,
        });
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to reset hospital configuration";
      if (mounted.current) showError(message);
    }
  }, [showSuccess, showError]);

  const uploadLogo = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      try {
        const result = await uploadHospitalLogo(file);
        if (mounted.current) {
          const url = getUploadedFileUrl(result);
          if (isUsableMediaUrl(url)) {
            setForm((prev) => ({ ...prev, logoUrl: url }));
            publishHospitalBranding({ logoUrl: url });
          }
          showSuccess("Hospital logo uploaded successfully!");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to upload hospital logo";
        if (mounted.current) showError(message);
      } finally {
        if (mounted.current) setUploading(false);
      }
    },
    [showSuccess, showError],
  );

  const uploadBanner = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      try {
        const result = await uploadHospitalHeaderBanner(file);
        if (mounted.current) {
          const url = getUploadedFileUrl(result);
          if (isUsableMediaUrl(url)) {
            setForm((prev) => ({
              ...prev,
              bannerUrl: url,
            }));
          }
          showSuccess("Hospital header banner uploaded successfully!");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to upload header banner";
        if (mounted.current) showError(message);
      } finally {
        if (mounted.current) setUploading(false);
      }
    },
    [showSuccess, showError],
  );

  const loadPrintHeader = useCallback(async () => {
    setError(null);
    try {
      const preview = await fetchPrintHeaderPreview();
      if (mounted.current) setPrintHeader(preview);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load print header preview";
      if (mounted.current) showError(message);
    }
  }, [showError]);

  const clearFeedback = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    form,
    loading,
    saving,
    uploading,
    error,
    success,
    printHeader,
    updateField,
    setForm,
    save,
    reset,
    uploadLogo,
    uploadBanner,
    loadPrintHeader,
    reload: async () => {
      const config = await fetchHospitalConfiguration();
      setForm(mapConfigurationToForm(config));
    },
    clearFeedback,
  };
}
