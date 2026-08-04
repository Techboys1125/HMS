import { useState, useEffect } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import type { Patient, ApiPatientFamilyMember } from "../../types/patient.types";
import { PP } from "../../../doctors/constants/doctors.constants";
import { patientApi } from "../../api/patientApi";

export interface FamilyMembersTabProps {
  patient: Patient;
  canEdit: boolean;
}

export function FamilyMembersTab({ patient, canEdit }: FamilyMembersTabProps) {
  const [members, setMembers] = useState<ApiPatientFamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", relationship: "", mobileNumber: "", email: "" });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    patientApi.getFamilyMembers(patient.mrn)
      .then((data) => { if (!cancelled) setMembers(data || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [patient.mrn]);

  const handleAdd = async () => {
    if (!newMember.name || !newMember.relationship) return;
    const created = await patientApi.addFamilyMember(patient.mrn, newMember);
    if (created) {
      setMembers((prev) => [...prev, created]);
      setNewMember({ name: "", relationship: "", mobileNumber: "", email: "" });
      setShowAddForm(false);
    }
  };

  const handleDelete = async (memberId: string) => {
    const success = await patientApi.deleteFamilyMember(patient.mrn, memberId);
    if (success) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8 text-xs text-[#64748B]">Loading family members...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#111827]" style={{ fontFamily: PP }}>Family Members</h3>
        {canEdit && (
          <button type="button" onClick={() => setShowAddForm(!showAddForm)} className="px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white text-[11px] font-bold hover:bg-[#0c3d8a] transition-colors flex items-center gap-1">
            <Plus size={12} /> Add Member
          </button>
        )}
      </div>

      {showAddForm && canEdit && (
        <div className="bg-slate-50 border border-[#E5E7EB] rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] mb-1">Name</label>
              <input type="text" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg outline-none focus:border-[#0D47A1]" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] mb-1">Relationship</label>
              <input type="text" value={newMember.relationship} onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })} className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg outline-none focus:border-[#0D47A1]" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] mb-1">Mobile</label>
              <input type="text" value={newMember.mobileNumber} onChange={(e) => setNewMember({ ...newMember, mobileNumber: e.target.value })} className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg outline-none focus:border-[#0D47A1]" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] mb-1">Email</label>
              <input type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg outline-none focus:border-[#0D47A1]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleAdd} className="px-4 py-2 rounded-lg bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#0c3d8a] transition-colors">Add</button>
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {members.length === 0 ? (
        <div className="text-center py-8 text-xs text-[#64748B]">No family members on file.</div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl p-3">
              <div>
                <div className="text-xs font-bold text-[#111827]">{member.name}</div>
                <div className="text-[11px] text-[#64748B]">{member.relationship} · {member.mobileNumber || "—"}</div>
              </div>
              {canEdit && (
                <button type="button" onClick={() => handleDelete(String(member.id))} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}