/**
 * PatientSearchBar – Debounced search with dropdown results
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { Search, Loader2, X } from "lucide-react";
import { usePatientSearch } from "../hooks/usePatients";
import { PatientSummaryCard } from "./PatientSummaryCard";
import type { Patient } from "../types/patient.types";
import { RB } from "../../doctors/constants/doctors.constants";

interface PatientSearchBarProps {
  onSelectPatient: (patient: Patient) => void;
  placeholder?: string;
}

export function PatientSearchBar({
  onSelectPatient,
  placeholder = "Search by MRN, name, or phone...",
}: PatientSearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(value);
      if (value.trim().length >= 2) setIsOpen(true);
    }, 300);
  }, []);

  const { data: searchResults, isLoading } = usePatientSearch(debouncedQuery);
  const results = searchResults?.items || [];

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => {
            if (debouncedQuery.trim().length >= 2) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2.5 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/10 transition-colors"
          style={{ fontFamily: RB }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setDebouncedQuery("");
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-slate-100 transition-colors"
          >
            <X size={13} className="text-slate-400" />
          </button>
        )}
      </div>

      {isOpen && debouncedQuery.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white rounded-xl border border-[#E5E7EB] shadow-lg max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 gap-2">
              <Loader2 size={14} className="animate-spin text-[#0D47A1]" />
              <span className="text-xs text-[#64748B]">Searching...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#64748B]">
              No patients found.
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {results.map((p: Patient) => (
                <PatientSummaryCard
                  key={p.mrn}
                  patient={p}
                  onClick={() => {
                    onSelectPatient(p);
                    setIsOpen(false);
                    setQuery("");
                    setDebouncedQuery("");
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
