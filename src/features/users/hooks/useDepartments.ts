import { useState, useEffect, useCallback } from "react";
import { departmentsService } from "../services/departments.service";
import type {
  ApiDepartmentSpecialtiesItem,
  ApiDepartmentLookupItem,
} from "../types/departments.types";

export const useDepartments = (autoFetch = true) => {
  const [departments, setDepartments] = useState<
    ApiDepartmentSpecialtiesItem[]
  >([]);
  const [lookupList, setLookupList] = useState<ApiDepartmentLookupItem[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentsService.getDepartments({ search });
      setDepartments(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load departments",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLookup = useCallback(async (activeOnly = true) => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentsService.getDepartmentLookup(activeOnly);
      setLookupList(data);
      return data;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load department lookup",
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createDepartment = async (
    payload: Partial<ApiDepartmentSpecialtiesItem>,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const newDept = await departmentsService.createDepartment(payload);
      await fetchDepartments();
      await fetchLookup();
      return newDept;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create department";
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (
    id: number | string,
    payload: Partial<ApiDepartmentSpecialtiesItem>,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedDept = await departmentsService.updateDepartment(
        id,
        payload,
      );
      await fetchDepartments();
      await fetchLookup();
      return updatedDept;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update department";
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: number | string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await departmentsService.deleteDepartment(id);
      await fetchDepartments();
      await fetchLookup();
      return result;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete department";
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  const [prevAutoFetch, setPrevAutoFetch] = useState(autoFetch);
  if (autoFetch !== prevAutoFetch) {
    setPrevAutoFetch(autoFetch);
    setLoading(autoFetch);
  }

  useEffect(() => {
    if (!autoFetch) return;
    let cancelled = false;
    Promise.all([
      departmentsService.getDepartments(),
      departmentsService.getDepartmentLookup(true),
    ])
      .then(([depts, lookup]) => {
        if (!cancelled) {
          setDepartments(depts);
          setLookupList(lookup);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load departments",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [autoFetch]);

  return {
    departments,
    lookupList,
    loading,
    error,
    fetchDepartments,
    fetchLookup,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};
