import { useCallback, useEffect, useState } from "react";
import {
  createOpdHoliday,
  fetchOpdHolidays,
  fetchOpdWeeklySchedule,
  saveOpdWeeklySchedule,
  updateOpdBreaks,
  updateOpdHoliday,
  updateOpdHolidayStatus,
} from "../services/settings.service";
import type {
  OpdBreak,
  OpdHoliday,
  OpdHolidayPayload,
  OpdWeeklySchedule,
} from "../types/settings.types";

const EMPTY_SCHEDULE: OpdWeeklySchedule = { weeklySchedule: [] };

export function useOpdConfiguration(year = new Date().getFullYear()) {
  const [schedule, setSchedule] = useState<OpdWeeklySchedule>(EMPTY_SCHEDULE);
  const [holidays, setHolidays] = useState<OpdHoliday[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [scheduleResult, holidayResult] = await Promise.all([
        fetchOpdWeeklySchedule(),
        fetchOpdHolidays(year),
      ]);
      setSchedule(scheduleResult);
      setHolidays(holidayResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load OPD settings");
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    // The API load updates local settings state after the component mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);

  const saveSchedule = useCallback(async (next: OpdWeeklySchedule) => {
    setSaving(true);
    setError(null);
    try {
      const result = await saveOpdWeeklySchedule(next);
      setSchedule(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save OPD schedule");
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const saveBreaks = useCallback(async (dayOfWeek: string, breaks: OpdBreak[]) => {
    setSaving(true);
    setError(null);
    try {
      const result = await updateOpdBreaks({ dayOfWeek, breaks });
      setSchedule(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save OPD breaks");
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const addHoliday = useCallback(async (payload: OpdHolidayPayload) => {
    setSaving(true);
    setError(null);
    try {
      const result = await createOpdHoliday(payload);
      setHolidays((current) => [...current, result]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create holiday");
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const editHoliday = useCallback(async (id: number, payload: OpdHolidayPayload) => {
    setSaving(true);
    setError(null);
    try {
      const result = await updateOpdHoliday(id, payload);
      setHolidays((current) => current.map((item) => (item.id === id ? result : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update holiday");
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const toggleHoliday = useCallback(async (holiday: OpdHoliday) => {
    setSaving(true);
    setError(null);
    try {
      const result = await updateOpdHolidayStatus(
        holiday.id,
        holiday.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      );
      setHolidays((current) => current.map((item) => (item.id === holiday.id ? result : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update holiday status");
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    schedule,
    holidays,
    loading,
    saving,
    error,
    reload,
    saveSchedule,
    saveBreaks,
    addHoliday,
    editHoliday,
    toggleHoliday,
  };
}
