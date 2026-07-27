import {
  Server, HardDrive, Database, Wifi, UserPlus, Calendar, Receipt,
  CheckSquare, Stethoscope, Users, Clock, BarChart2, Check, Download, CreditCard
} from 'lucide-react';

export const HOSPITALS = [
  { name: 'City General Hospital', city: 'New York', units: 450, staff: 312, status: 'active', plan: 'Enterprise' },
  { name: 'St. Mary Medical Center', city: 'Los Angeles', units: 280, staff: 198, status: 'active', plan: 'Professional' },
  { name: 'Green Valley Clinic', city: 'Chicago', units: 120, staff: 87, status: 'active', plan: 'Standard' },
  { name: 'Sunrise Healthcare', city: 'Houston', units: 340, staff: 241, status: 'active', plan: 'Enterprise' },
  { name: 'Metro Health Institute', city: 'Phoenix', units: 210, staff: 163, status: 'inactive', plan: 'Standard' },
  { name: 'Harbor Point Hospital', city: 'Philadelphia', units: 380, staff: 279, status: 'active', plan: 'Professional' },
]

export const SA_AUDIT = [
  { user: 'Admin Kumar', action: 'Modified hospital settings for City General', time: '2m ago', type: 'settings' },
  { user: 'System', action: 'Automated backup completed successfully', time: '18m ago', type: 'system' },
  { user: 'Admin Sharma', action: 'Created new user account — Dr. R. Kapoor', time: '32m ago', type: 'user' },
  { user: 'Admin Kumar', action: 'Assigned Admin role to J. Williams', time: '1h ago', type: 'role' },
  { user: 'System', action: 'License renewed for Harbor Point Hospital', time: '2h ago', type: 'license' },
]

export const ROLE_DIST = [
  { label: 'Patients', count: 550, color: '#4DB6AC' },
  { label: 'Nurses', count: 689, color: '#009688' },
  { label: 'Doctors', count: 342, color: '#0D47A1' },
  { label: 'Receptionists', count: 156, color: '#66BB6A' },
  { label: 'Accountants', count: 87, color: '#F59E0B' },
  { label: 'Admins', count: 23, color: '#EF4444' },
]

export const SYS_METRICS = [
  { label: 'CPU Usage', value: 42, color: '#009688', icon: Server },
  { label: 'Memory', value: 67, color: '#0D47A1', icon: HardDrive },
  { label: 'Disk Space', value: 38, color: '#66BB6A', icon: Database },
  { label: 'Network I/O', value: 24, color: '#F59E0B', icon: Wifi },
]



export const DOCTORS_AVAIL = [
  { name: 'Dr. Arjun Mehta', dept: 'Cardiology', status: 'in-consultation', patients: 8 },
  { name: 'Dr. Priya Sharma', dept: 'General', status: 'available', patients: 6 },
  { name: 'Dr. Sarah Patel', dept: 'Obstetrics', status: 'available', patients: 5 },
  { name: 'Dr. Raj Kapoor', dept: 'Neurology', status: 'available', patients: 4 },
  { name: 'Dr. Linda Walsh', dept: 'Pediatrics', status: 'on-leave', patients: 0 },
  { name: 'Dr. Chen Wei', dept: 'Orthopedics', status: 'in-consultation', patients: 7 },
]

export const HA_REGS = [
  { name: 'Anika Petrov', mrn: 'MRN-011', age: 29, gender: 'F', time: '09:41' },
  { name: 'Tom Harrison', mrn: 'MRN-012', age: 55, gender: 'M', time: '09:53' },
  { name: 'Mei Lin', mrn: 'MRN-013', age: 38, gender: 'F', time: '10:12' },
  { name: 'Oscar Ruiz', mrn: 'MRN-014', age: 67, gender: 'M', time: '10:31' },
  { name: 'Fatima Al-Rashid', mrn: 'MRN-015', age: 42, gender: 'F', time: '10:48' },
]

export const HA_DEPTS = [
  { name: 'OPD — General', capacity: 87, active: 22, total: 25, color: '#0D47A1' },
  { name: 'Cardiology', capacity: 68, active: 17, total: 25, color: '#EF4444' },
  { name: 'Pediatrics', capacity: 43, active: 9, total: 21, color: '#009688' },
  { name: 'Gynecology', capacity: 70, active: 14, total: 20, color: '#9C27B0' },
  { name: 'Neurology', capacity: 55, active: 11, total: 20, color: '#F59E0B' },
]

export const HA_TIMELINE = [
  { time: '08:00', patient: 'Helen Brooks', complaint: 'General Check-up', doctor: 'Dr. P. Sharma', status: 'completed', room: 'OPD-3' },
  { time: '08:30', patient: 'Alex Monroe', complaint: 'Post-op Follow-up', doctor: 'Dr. A. Mehta', status: 'completed', room: 'OPD-1' },
  { time: '09:00', patient: 'Sarah Mitchell', complaint: 'Chest Pain', doctor: 'Dr. A. Mehta', status: 'in-progress', room: 'OPD-1' },
  { time: '09:30', patient: 'James Thornton', complaint: 'Diabetes Follow-up', doctor: 'Dr. P. Sharma', status: 'waiting', room: null },
  { time: '10:00', patient: 'Emma Reyes', complaint: 'Prenatal Visit', doctor: 'Dr. S. Patel', status: 'checked-in', room: 'OPD-5' },
  { time: '10:30', patient: 'Robert Chen', complaint: 'Cardiology Review', doctor: 'Dr. A. Mehta', status: 'scheduled', room: null },
  { time: '11:00', patient: 'Aisha Kumar', complaint: 'Migraine', doctor: 'Dr. R. Kapoor', status: 'scheduled', room: null },
  { time: '11:30', patient: 'David Walsh', complaint: 'Back Pain', doctor: 'Dr. P. Sharma', status: 'scheduled', room: null },
  { time: '14:00', patient: 'Lily Anderson', complaint: 'Thyroid Review', doctor: 'Dr. S. Patel', status: 'scheduled', room: null },
  { time: '14:30', patient: 'Marcus Brown', complaint: 'Hypertension F/U', doctor: 'Dr. A. Mehta', status: 'scheduled', room: null },
]

export const HA_BILLS = [
  { inv: 'INV-2891', patient: 'Helen Brooks', amount: '$320', status: 'paid', type: 'OPD' },
  { inv: 'INV-2892', patient: 'Alex Monroe', amount: '$680', status: 'paid', type: 'Consultation' },
  { inv: 'INV-2893', patient: 'Sarah Mitchell', amount: '$480', status: 'pending', type: 'OPD' },
  { inv: 'INV-2894', patient: 'James Thornton', amount: '$260', status: 'pending', type: 'Consultation' },
  { inv: 'INV-2895', patient: 'Emma Reyes', amount: '$650', status: 'paid', type: 'OPD' },
]

export const HA_ACTIVITY = [
  { Icon: UserPlus, action: 'New patient registered', detail: 'Fatima Al-Rashid · MRN-015', time: '6m', color: '#0D47A1' },
  { Icon: Calendar, action: 'Appointment booked', detail: 'Marcus Brown → Dr. A. Mehta', time: '14m', color: '#009688' },
  { Icon: Receipt, action: 'Bill settled', detail: 'INV-2892 · $1,250', time: '21m', color: '#66BB6A' },
  { Icon: CheckSquare, action: 'Patient checked in', detail: 'James Thornton · OPD Wing B', time: '38m', color: '#F59E0B' },
  { Icon: Stethoscope, action: 'Consultation completed', detail: 'Helen Brooks · Dr. P. Sharma', time: '52m', color: '#009688' },
  { Icon: Stethoscope, action: 'Doctor checked in', detail: 'Dr. Raj Kapoor · Neurology', time: '1h', color: '#0D47A1' },
]

export const HA_ANNOUNCEMENTS = [
  { type: 'info', title: 'Staff Meeting — 3:00 PM Today', body: 'Monthly department heads review in Conference Room A.' },
  { type: 'warning', title: 'High Patient Volume — OPD', body: 'OPD General at 87% capacity. Consider adding a slot.' },
  { type: 'success', title: 'Joint Commission Audit Cleared', body: 'All departments met compliance standards. Report filed.' },
]

export const HA_WEEKLY_REV = [
  { day: 'Mon', opd: 18.2, billing: 6.4 },
  { day: 'Tue', opd: 22.5, billing: 8.1 },
  { day: 'Wed', opd: 19.8, billing: 7.2 },
  { day: 'Thu', opd: 26.1, billing: 9.5 },
  { day: 'Fri', opd: 24.8, billing: 8.8 },
  { day: 'Sat', opd: 14.3, billing: 4.9 },
  { day: 'Sun', opd: 11.6, billing: 3.8 },
]

export const HA_STATUS_COLOR: Record<string, string> = {
  'completed': '#66BB6A',
  'in-progress': '#009688',
  'waiting': '#F59E0B',
  'checked-in': '#0D47A1',
  'scheduled': '#CBD5E1',
}

export const HA_QUICK_ACTIONS = [
  { label: 'View Patients', Icon: Users, color: '#0D47A1', nav: 'patients' },
  { label: 'View Queue', Icon: Clock, color: '#009688', nav: 'appointments' },
  { label: 'Appointment Management', Icon: Calendar, color: '#0D47A1', nav: 'appointments' },
  { label: 'Operational Reports', Icon: BarChart2, color: '#64748B', nav: 'reports' },
]



export const NURSE_PATIENTS = [
  { name: 'Sarah Mitchell', room: 'OPD-1', bp: '145/92', hr: '88', temp: '37.2', spo2: '97', status: 'alert', nextCheck: '10:30' },
  { name: 'James Thornton', room: 'OPD-2', bp: '132/84', hr: '76', temp: '36.8', spo2: '98', status: 'stable', nextCheck: '11:00' },
  { name: 'Emma Reyes', room: 'OPD-5', bp: '118/76', hr: '82', temp: '37.0', spo2: '99', status: 'stable', nextCheck: '11:30' },
  { name: 'Robert Chen', room: 'OPD-3', bp: '152/98', hr: '94', temp: '37.8', spo2: '95', status: 'alert', nextCheck: '10:15' },
  { name: 'Aisha Kumar', room: 'OPD-4', bp: '120/78', hr: '70', temp: '36.6', spo2: '99', status: 'stable', nextCheck: '12:00' },
]

export const NURSE_TASKS = [
  { task: 'Morning vitals round — OPD Wing A', done: true },
  { task: 'Patient check-in support — Reception', done: true },
  { task: 'Vitals update — Sarah Mitchell', done: false },
  { task: 'Vitals update — Robert Chen (urgent)', done: false },
  { task: 'Handover notes — end of shift', done: false },
  { task: 'Afternoon vitals round — OPD Wing B', done: false },
]



export const TRANSACTIONS = [
  { invoice: 'INV-847', patient: 'Sarah Mitchell', service: 'OPD Consultation', amount: 488.00, status: 'paid', date: 'Today 09:20' },
  { invoice: 'INV-848', patient: 'James Thornton', service: 'Consultation + Follow-up', amount: 228.00, status: 'pending', date: 'Today 09:45' },
  { invoice: 'INV-849', patient: 'Emma Reyes', service: 'Prenatal Consultation', amount: 320.00, status: 'paid', date: 'Today 10:12' },
  { invoice: 'INV-850', patient: 'Robert Chen', service: 'Cardiology Consultation', amount: 395.00, status: 'pending', date: 'Today 10:30' },
  { invoice: 'INV-851', patient: 'Marcus Brown', service: 'BP Monitoring Consultation', amount: 175.00, status: 'paid', date: 'Today 11:00' },
  { invoice: 'INV-852', patient: 'Aisha Kumar', service: 'Neurology Consultation', amount: 290.00, status: 'paid', date: 'Today 11:15' },
]

export const MONTHLY_REV = [
  { month: 'Aug', v: 18200 },
  { month: 'Sep', v: 21500 },
  { month: 'Oct', v: 19800 },
  { month: 'Nov', v: 24100 },
  { month: 'Dec', v: 22400 },
  { month: 'Jan', v: 24850 },
]

export const ACC_PAYMENT_METHODS = [
  { method: 'Cash', amount: 8240, total: 27950, color: '#009688' },
  { method: 'Credit / Debit', amount: 11650, total: 27950, color: '#0D47A1' },
  { method: 'Corporate Pay', amount: 5840, total: 27950, color: '#4DB6AC' },
  { method: 'UPI / Online', amount: 2220, total: 27950, color: '#66BB6A' },
]

export const ACC_ACTIVITY = [
  { Icon: Check, msg: 'Payment collected', detail: 'INV-847 · Sarah Mitchell · $488', time: '09:20', color: '#66BB6A' },
  { Icon: Receipt, msg: 'Invoice generated', detail: 'INV-848 · James Thornton · $228', time: '09:45', color: '#0D47A1' },
  { Icon: Check, msg: 'Payment collected', detail: 'INV-849 · Emma Reyes · $320', time: '10:12', color: '#66BB6A' },
  { Icon: Clock, msg: 'Invoice pending', detail: 'INV-850 · Robert Chen · $395', time: '10:30', color: '#F59E0B' },
  { Icon: Download, msg: 'Refund processed', detail: 'INV-832 · Nina Patel · $45', time: '10:55', color: '#EF4444' },
  { Icon: Receipt, msg: 'Invoice generated', detail: 'INV-853 · Aisha Kumar · $290', time: '11:15', color: '#0D47A1' },
]

export const ACC_BILLING_SUMMARY = [
  { label: 'OPD Consultations', count: 28, amount: 12640, color: '#0D47A1' },
  { label: 'Follow-up Visits', count: 14, amount: 5320, color: '#009688' },
  { label: 'Specialist Visits', count: 9, amount: 4860, color: '#4DB6AC' },
  { label: 'Check-up Packages', count: 6, amount: 3240, color: '#66BB6A' },
  { label: 'Billing Adjustments', count: 3, amount: 890, color: '#F59E0B' },
]

export const ACC_QUICK_ACTIONS = [
  { label: 'Generate Invoice', Icon: Receipt, color: '#0D47A1' },
  { label: 'Collect Payment', Icon: CreditCard, color: '#009688' },
  { label: 'Process Refund', Icon: Download, color: '#EF4444' },
  { label: 'Financial Reports', Icon: BarChart2, color: '#64748B' },
]



export const PAT_PRESCRIPTIONS = [
  { drug: 'Metoprolol 25mg', freq: 'Once daily — Morning', remaining: 18, total: 30, doctor: 'Dr. A. Mehta' },
  { drug: 'Aspirin 75mg', freq: 'Once daily — Evening', remaining: 22, total: 30, doctor: 'Dr. A. Mehta' },
  { drug: 'Atorvastatin 10mg', freq: 'Once daily — Night', remaining: 7, total: 30, doctor: 'Dr. A. Mehta' },
]

export const PAT_BILLS = [
  { invoice: 'INV-847', service: 'Cardiology OPD Consultation', amount: 97.60, due: 'Due Today', status: 'unpaid' },
  { invoice: 'INV-831', service: 'General Medicine Consultation', amount: 45.00, due: 'Due Mar 20', status: 'unpaid' },
  { invoice: 'INV-810', service: 'Follow-up Checkup', amount: 28.00, due: 'Paid Mar 12', status: 'paid' },
]

export const PAT_HISTORY = [
  { date: 'Mar 12, 2025', complaint: 'Chest pain, shortness of breath', doctor: 'Dr. A. Mehta', diagnosis: 'Stable angina', status: 'completed' },
  { date: 'Feb 20, 2025', complaint: 'Routine cardiac checkup', doctor: 'Dr. A. Mehta', diagnosis: 'Normal cardiac rhythm', status: 'completed' },
  { date: 'Jan 08, 2025', complaint: 'High BP monitoring', doctor: 'Dr. P. Sharma', diagnosis: 'Hypertension stage I', status: 'completed' },
  { date: 'Dec 14, 2024', complaint: 'Annual health check', doctor: 'Dr. A. Mehta', diagnosis: 'All clear', status: 'completed' },
]

