import { useState, useMemo, useCallback } from "react";

export function useReportFilters<T extends Record<string, unknown>>(data: T[]) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    let result = data;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          (val) => val != null && String(val).toLowerCase().includes(q)
        )
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((row) => String(row[key] ?? "").toLowerCase() === value.toLowerCase());
      }
    });

    return result;
  }, [data, filters, search]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({});
    setSearch("");
  }, []);

  return {
    filters,
    search,
    setSearch,
    filteredData,
    handleFilterChange,
    handleResetFilters,
  };
}
