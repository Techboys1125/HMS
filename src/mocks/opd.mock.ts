export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export const INITIAL_MEDICINES: MedicineItem[] = [
  {
    id: "1",
    name: "Amlodipine",
    dosage: "5mg",
    frequency: "Once Daily",
    duration: "30 Days",
    instructions: "Take after breakfast",
  },
  {
    id: "2",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice Daily",
    duration: "30 Days",
    instructions: "Take with meals",
  },
];
