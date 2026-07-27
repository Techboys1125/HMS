export interface RecordedVitalsData {
  bpSystolic: string
  bpDiastolic: string
  pulseRate: string
  respRate: string
  temperature: string
  tempUnit: 'F' | 'C'
  spo2: string
  height: string
  weight: string
  bmi: string
  bmiCategory: string
  bloodSugar: string
  painScale: string
  allergies: string
  notes: string
}

export const DEFAULT_RECORDED_VITALS: RecordedVitalsData = {
  bpSystolic: '120',
  bpDiastolic: '80',
  pulseRate: '72',
  respRate: '16',
  temperature: '98.6',
  tempUnit: 'F',
  spo2: '98',
  height: '175',
  weight: '70',
  bmi: '22.9',
  bmiCategory: 'Normal',
  bloodSugar: '95',
  painScale: '0',
  allergies: 'None',
  notes: 'Patient vitals within normal parameters.'
}
