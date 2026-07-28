import { useState, useEffect } from 'react'
import {
  Calendar, Download, FileText, Pill, Receipt, User, Bell, Stethoscope, ChevronRight, Building2
} from 'lucide-react'
import {
  PP, RB
} from '../components/DashboardShared'
import { appointmentsApi } from '../../appointments/api/appointments.api'

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

export function PatientDashboard() {
  const [upcomingApt, setUpcomingApt] = useState<{
    id?: string | number;
    doctor: string;
    department: string;
    date: string;
    time: string;
    status: string;
  }>({
    id: "APT-8492",
    doctor: "Dr. Arjun Mehta",
    department: "Cardiology (OPD A)",
    date: "Sat, Mar 15, 2025",
    time: "10:30 AM",
    status: "Confirmed",
  });

  useEffect(() => {
    let isMounted = true;
    appointmentsApi.getPatientAppointments("PAT-101")
      .then((res) => {
        if (isMounted && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const first = res.data[0];
          setUpcomingApt({
            id: first.id || "APT-8492",
            doctor: first.doctorName || "Dr. Arjun Mehta",
            department: first.department || "Cardiology (OPD A)",
            date: first.appointmentDate || "Sat, Mar 15, 2025",
            time: first.startTime || "10:30 AM",
            status: first.status === "BOOKED" ? "Confirmed" : first.status || "Confirmed",
          });
        }
      })
      .catch((err) => console.warn("Patient API notice:", err));

    return () => { isMounted = false; };
  }, []);

  const handleCancel = () => {
    if (upcomingApt.id) {
      appointmentsApi.cancelAppointment(upcomingApt.id, { reason: "Patient requested cancellation" }).catch(() => { });
    }
    setUpcomingApt(prev => ({ ...prev, status: "Cancelled" }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F1F5F9]">

      {/* ── Header & Breadcrumbs ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827]" style={{ fontFamily: PP }}>Welcome back, Sarah Mitchell</h1>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1" style={{ fontFamily: RB }}>
            <span>Patient Portal</span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-medium text-[#111827]">Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:bg-slate-50 transition-colors shadow-sm" style={{ fontFamily: PP }}>
            <Download size={14} className="text-[#0D47A1]" /> Download Medical Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors shadow-sm" style={{ fontFamily: PP }}>
            <Calendar size={14} /> Book Appointment
          </button>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mr-1" style={{ fontFamily: PP }}>Quick Actions</span>
        {[
          { label: 'Book Appointment', Icon: Calendar, color: '#009688' },
          { label: 'View Medical History', Icon: FileText, color: '#0D47A1' },
          { label: 'View Prescriptions', Icon: Pill, color: '#009688' },
          { label: 'View Bills', Icon: Receipt, color: '#F59E0B' },
          { label: 'Update Profile', Icon: User, color: '#0D47A1' },
        ].map(({ label, Icon, color }) => (
          <button key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:border-[#0D47A1]/40 hover:text-[#0D47A1] hover:bg-blue-50 transition-all shadow-sm"
            style={{ fontFamily: RB }}>
            <Icon size={13} style={{ color }} />
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-[#E5E7EB] text-[#64748B] hover:bg-slate-50 transition-colors shadow-sm">
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Upcoming Appointment', value: 'Mar 15, 10:30 AM', sub: 'Dr. A. Mehta (Cardiology)', Icon: Calendar, color: '#0D47A1', bg: 'bg-blue-50' },
          { label: 'Outstanding Bills', value: '$142.60', sub: '2 invoices pending', Icon: Receipt, color: '#F59E0B', bg: 'bg-amber-50' },
          { label: 'Active Prescriptions', value: '3 Active', sub: 'Metoprolol, Aspirin...', Icon: Pill, color: '#009688', bg: 'bg-teal-50' },
          { label: 'Recent Visit', value: 'Mar 12, 2025', sub: 'Stable Angina Review', Icon: Stethoscope, color: '#4DB6AC', bg: 'bg-teal-50' },
          { label: 'Notifications', value: '3 New', sub: '1 Reminder, 1 Bill, 1 Rx', Icon: Bell, color: '#EF4444', bg: 'bg-red-50' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.Icon size={18} style={{ color: card.color }} />
              </div>
            </div>
            <div>
              <div className="text-xs text-[#64748B] font-medium" style={{ fontFamily: RB }}>{card.label}</div>
              <div className="text-base font-bold text-[#111827] mt-0.5" style={{ fontFamily: PP }}>{card.value}</div>
              <div className="text-[11px] text-slate-400 mt-1 truncate" style={{ fontFamily: RB }}>{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Upcoming Appointment & Recent Notifications ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Upcoming Appointment Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-[#009688]/30 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#009688]" />
                <span className="text-xs font-bold text-[#009688] uppercase tracking-wider" style={{ fontFamily: PP }}>Upcoming Appointment</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-[#66BB6A] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#66BB6A]" /> Confirmed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-gray-100 mb-4">
              <div>
                <span className="block text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>Doctor</span>
                <span className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Dr. Arjun Mehta</span>
              </div>
              <div>
                <span className="block text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>Department</span>
                <span className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Cardiology (OPD A)</span>
              </div>
              <div>
                <span className="block text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>Appointment Date</span>
                <span className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Sat, Mar 15, 2025</span>
              </div>
              <div>
                <span className="block text-[11px] text-[#64748B]" style={{ fontFamily: RB }}>Appointment Time</span>
                <span className="text-sm font-bold text-[#0D47A1]" style={{ fontFamily: PP }}>10:30 AM</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-[#0D47A1]" style={{ fontFamily: RB }}>
                <Building2 size={16} className="text-[#0D47A1]" />
                <span><strong>OPD Location:</strong> Cardiology Wing A · Room 204 (Check-in 10 mins prior)</span>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg bg-[#0D47A1] text-white text-xs font-semibold hover:bg-[#0c3d8a] transition-colors shrink-0" style={{ fontFamily: PP }}>
                View OPD Directions
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <button className="px-4 py-2 rounded-xl bg-[#009688] text-white text-xs font-bold hover:bg-teal-700 transition-colors" style={{ fontFamily: PP }}>
              Confirm Attendance
            </button>
            <button className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#64748B] font-medium hover:bg-slate-50 transition-colors" style={{ fontFamily: RB }}>
              Reschedule Slot
            </button>
            <button onClick={handleCancel} className="px-4 py-2 rounded-xl border border-[#EF4444]/30 text-xs text-[#EF4444] font-medium hover:bg-red-50 transition-colors ml-auto" style={{ fontFamily: RB }}>
              Cancel Appointment
            </button>
          </div>
        </div>

        {/* Recent Notifications Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-50">
              <span className="text-xs font-bold text-[#111827] uppercase tracking-wider" style={{ fontFamily: PP }}>Recent Notifications</span>
              <span className="text-[10px] font-bold text-white bg-[#EF4444] px-2 py-0.5 rounded-full">3 New</span>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Appointment Reminder', msg: 'Cardiology follow-up with Dr. Mehta tomorrow at 10:30 AM', time: '2 hours ago', icon: Calendar, color: '#009688', bg: 'bg-teal-50' },
                { title: 'Prescription Ready', msg: 'Atorvastatin & Metoprolol refilled at Main Pharmacy', time: '5 hours ago', icon: Pill, color: '#4DB6AC', bg: 'bg-teal-50' },
                { title: 'Bill Generated', msg: 'Invoice #INV-847 for $97.60 is ready for payment', time: '1 day ago', icon: Receipt, color: '#F59E0B', bg: 'bg-amber-50' },
              ].map((notif, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-slate-50 hover:bg-white transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notif.bg}`}>
                    <notif.icon size={15} style={{ color: notif.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#111827]" style={{ fontFamily: PP }}>{notif.title}</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5 leading-snug" style={{ fontFamily: RB }}>{notif.msg}</div>
                    <div className="text-[10px] text-slate-400 mt-1" style={{ fontFamily: RB }}>{notif.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-3 w-full py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#0D47A1] font-semibold hover:bg-blue-50 transition-colors" style={{ fontFamily: PP }}>
            View All Notifications
          </button>
        </div>
      </div>

      {/* ── Prescriptions & Outstanding Bills ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Prescriptions */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Recent Prescriptions</h3>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Active medication orders</p>
              </div>
              <button className="text-xs text-[#0D47A1] font-semibold hover:underline flex items-center gap-1" style={{ fontFamily: RB }}>
                <Download size={12} /> Download All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]">
                    <th className="px-4 py-3">Medicine</th>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Issue Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[#111827]">
                  {[
                    { drug: 'Metoprolol 25mg', freq: '1 Tab OD (Morning)', doctor: 'Dr. A. Mehta', date: 'Mar 10, 2025', status: 'Active' },
                    { drug: 'Aspirin 75mg', freq: '1 Tab OD (Evening)', doctor: 'Dr. A. Mehta', date: 'Mar 10, 2025', status: 'Active' },
                    { drug: 'Atorvastatin 10mg', freq: '1 Tab HS (Night)', doctor: 'Dr. A. Mehta', date: 'Feb 20, 2025', status: 'Refill Ready' },
                    { drug: 'Amoxicillin 500mg', freq: '1 Cap TDS (5 days)', doctor: 'Dr. P. Sharma', date: 'Jan 15, 2025', status: 'Completed' },
                  ].map((rx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-[#111827]">
                        {rx.drug}
                        <span className="block text-[10px] text-slate-400 font-normal">{rx.freq}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{rx.doctor}</td>
                      <td className="px-4 py-3 text-slate-500">{rx.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${rx.status === 'Active' ? 'bg-teal-50 text-[#009688]' :
                          rx.status === 'Refill Ready' ? 'bg-amber-50 text-[#F59E0B]' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                          {rx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-3 bg-slate-50 border-t border-gray-100 text-center">
            <button className="text-xs text-[#0D47A1] font-bold hover:underline" style={{ fontFamily: PP }}>View All Prescriptions →</button>
          </div>
        </div>

        {/* Outstanding Bills */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Outstanding Bills</h3>
                <p className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>Pending invoices & payment history</p>
              </div>
              <span className="text-xs font-bold text-[#F59E0B] bg-amber-50 px-2.5 py-1 rounded-full" style={{ fontFamily: PP }}>$142.60 Total Due</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" style={{ fontFamily: RB }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-[#64748B] uppercase tracking-wider text-[10px]">
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[#111827]">
                  {[
                    { invoice: 'INV-847', desc: 'Cardiology OPD Consultation', amount: '$97.60', due: 'Due Today', status: 'Unpaid' },
                    { invoice: 'INV-831', desc: 'General Medicine Consultation', amount: '$45.00', due: 'Mar 20, 2025', status: 'Pending' },
                    { invoice: 'INV-810', desc: 'Follow-up Checkup', amount: '$28.00', due: 'Paid Mar 12', status: 'Paid' },
                  ].map((bill, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[#0D47A1]">
                        {bill.invoice}
                        <span className="block text-[10px] font-sans font-normal text-slate-400">{bill.desc}</span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-[#111827]">{bill.amount}</td>
                      <td className="px-4 py-3 text-slate-500">{bill.due}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${bill.status === 'Unpaid' ? 'bg-red-50 text-[#EF4444]' :
                          bill.status === 'Pending' ? 'bg-amber-50 text-[#F59E0B]' :
                            'bg-green-50 text-[#66BB6A]'
                          }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {bill.status !== 'Paid' ? (
                          <button className="px-3 py-1 rounded-lg bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a] transition-colors" style={{ fontFamily: PP }}>
                            Pay Now
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#66BB6A] font-semibold">✓ Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-[#64748B]" style={{ fontFamily: RB }}>2 pending invoices requiring action</span>
            <button className="px-4 py-2 rounded-xl bg-[#F59E0B] text-white text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm" style={{ fontFamily: PP }}>
              Pay All Pending ($142.60)
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
