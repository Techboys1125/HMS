import { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  Save,
  RotateCcw,
  Sliders,
  BarChart2,
  PieChart as PieChartIcon,
  Trash2,
  Check,
  X,
} from "lucide-react";

const PP = "'Poppins', system-ui, sans-serif";
const RB = "'Roboto', system-ui, sans-serif";

export function AppointmentConfigurationWorkspace() {
  void RB;
  // Section 01: General Settings
  const [generalConfig, setGeneralConfig] = useState({
    enableOnlineBooking: true,
    approvalRequired: true,
    allowWalkIn: true,
    allowSameDay: true,
    allowFutureBooking: true,
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 2,
  });

  // Section 02: Slot Config
  const [slotConfig, setSlotConfig] = useState({
    defaultDuration: "15 Minutes",
    bufferTime: "5 Minutes",
    maxPatientsPerSlot: 1,
    enableDoubleBooking: false,
  });

  // Section 03: Working Hours
  const [workingHours, setWorkingHours] = useState([
    {
      day: "Monday",
      open: "08:00 AM",
      close: "08:00 PM",
      breakStart: "01:00 PM",
      breakEnd: "02:00 PM",
      enabled: true,
    },
    {
      day: "Tuesday",
      open: "08:00 AM",
      close: "08:00 PM",
      breakStart: "01:00 PM",
      breakEnd: "02:00 PM",
      enabled: true,
    },
    {
      day: "Wednesday",
      open: "08:00 AM",
      close: "08:00 PM",
      breakStart: "01:00 PM",
      breakEnd: "02:00 PM",
      enabled: true,
    },
    {
      day: "Thursday",
      open: "08:00 AM",
      close: "08:00 PM",
      breakStart: "01:00 PM",
      breakEnd: "02:00 PM",
      enabled: true,
    },
    {
      day: "Friday",
      open: "08:00 AM",
      close: "08:00 PM",
      breakStart: "01:00 PM",
      breakEnd: "02:00 PM",
      enabled: true,
    },
    {
      day: "Saturday",
      open: "08:00 AM",
      close: "05:00 PM",
      breakStart: "01:00 PM",
      breakEnd: "02:00 PM",
      enabled: true,
    },
    {
      day: "Sunday",
      open: "09:00 AM",
      close: "02:00 PM",
      breakStart: "None",
      breakEnd: "None",
      enabled: false,
    },
  ]);

  // Section 04: Queue & Token Config
  const [queueConfig, setQueueConfig] = useState({
    enableTokenSystem: true,
    autoTokenGen: true,
    queueDisplayEnabled: true,
    tokenPrefix: "OPD-",
    startTokenNo: 101,
    maxQueueSize: 200,
    queueResetTime: "00:00 AM",
  });

  // Section 05: Holiday Calendar
  const [holidays, setHolidays] = useState([
    {
      id: "1",
      name: "New Year Day",
      date: "2026-01-01",
      type: "Hospital Closed",
    },
    {
      id: "2",
      name: "National Independence Day",
      date: "2026-07-04",
      type: "Hospital Closed",
    },
    {
      id: "3",
      name: "Labor Day",
      date: "2026-09-07",
      type: "Special Working Hours",
    },
    {
      id: "4",
      name: "Christmas Day",
      date: "2026-12-25",
      type: "Emergency OPD Only",
    },
  ]);

  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayDate, setNewHolidayDate] = useState("");

  // Section 06: Status Configuration
  const [statuses, setStatuses] = useState([
    { id: "s1", label: "Scheduled", color: "#0D47A1", visible: true },
    { id: "s2", label: "Checked In", color: "#009688", visible: true },
    { id: "s3", label: "Waiting", color: "#F59E0B", visible: true },
    { id: "s4", label: "In Consultation", color: "#9C27B0", visible: true },
    { id: "s5", label: "Completed", color: "#66BB6A", visible: true },
    { id: "s6", label: "Cancelled", color: "#EF4444", visible: true },
    { id: "s7", label: "No Show", color: "#64748B", visible: true },
  ]);

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDayToggle = (index: number) => {
    setWorkingHours((prev) => {
      const updated = [...prev];
      updated[index].enabled = !updated[index].enabled;
      return updated;
    });
  };

  const handleAddHoliday = () => {
    if (!newHolidayName.trim() || !newHolidayDate) return;
    setHolidays((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newHolidayName,
        date: newHolidayDate,
        type: "Hospital Closed",
      },
    ]);
    setNewHolidayName("");
    setNewHolidayDate("");
  };

  const handleRemoveHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  const handleSave = () => {
    setToastMessage("Appointment Configuration saved successfully!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "20px",
      }}
    >
      {/* MAIN CONTENT SECTIONS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
        }}
      >
        {/* SUB-HEADER ACTION BAR */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: PP,
                fontSize: "18px",
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              Appointment & Queue Configuration
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#64748B",
                margin: "2px 0 0 0",
              }}
            >
              Configure hospital-wide appointment booking rules, consultation
              schedules, queue management and operational preferences.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setShowPreviewModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                color: "#0D47A1",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Eye size={14} /> Preview Schedule
            </button>
            <button
              onClick={() => {}}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                color: "#64748B",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button
              onClick={handleSave}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 18px",
                borderRadius: "8px",
                border: "none",
                background: "#0D47A1",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(13,71,161,0.2)",
              }}
            >
              <Save size={14} /> Save Configuration
            </button>
          </div>
        </div>

        {/* TOP KPI CARDS (4 CARDS) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              padding: "18px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
              >
                Appointment Slots
              </span>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#E3F2FD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Clock size={18} style={{ color: "#0D47A1" }} />
              </div>
            </div>
            <div
              style={{
                fontFamily: PP,
                fontSize: "24px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              15 Mins
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "6px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                Default Duration
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#2E7D32",
                  background: "#E8F5E9",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                Configured
              </span>
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              padding: "18px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
              >
                Working Shifts
              </span>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#E0F2F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Calendar size={18} style={{ color: "#009688" }} />
              </div>
            </div>
            <div
              style={{
                fontFamily: PP,
                fontSize: "24px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              6 Days/Wk
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "6px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                OPD Schedule
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#009688",
                  background: "#E0F2F1",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                Active
              </span>
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              padding: "18px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
              >
                Queue Rules
              </span>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#E8F5E9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sliders size={18} style={{ color: "#2E7D32" }} />
              </div>
            </div>
            <div
              style={{
                fontFamily: PP,
                fontSize: "24px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              Auto Token
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "6px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                Prefix OPD-
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#2E7D32",
                  background: "#E8F5E9",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                Enabled
              </span>
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              padding: "18px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{ fontSize: "12px", fontWeight: 600, color: "#64748B" }}
              >
                Holiday Calendar
              </span>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AlertCircle size={18} style={{ color: "#B45309" }} />
              </div>
            </div>
            <div
              style={{
                fontFamily: PP,
                fontSize: "24px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              {holidays.length} Dates
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "6px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                Official Exclusions
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#B45309",
                  background: "#FEF3C7",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                Updated
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 01: GENERAL APPOINTMENT SETTINGS */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontFamily: PP,
              fontSize: "15px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Calendar size={18} style={{ color: "#0D47A1" }} /> Section 01:
            General Appointment Rules
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            {[
              {
                label: "Enable Online Appointment Booking",
                sub: "Allow patients to book via Patient Portal & Mobile App",
                key: "enableOnlineBooking",
              },
              {
                label: "Appointment Approval Required",
                sub: "Staff must confirm pending online booking requests",
                key: "approvalRequired",
              },
              {
                label: "Allow Walk-in Registration",
                sub: "Enable reception desk counter walk-in tokens",
                key: "allowWalkIn",
              },
              {
                label: "Allow Same-Day Appointment",
                sub: "Permit same-day slot bookings up to minimum hours",
                key: "allowSameDay",
              },
              {
                label: "Allow Future Advance Booking",
                sub: "Patients can schedule appointments in advance",
                key: "allowFutureBooking",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "#F8FAFC",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748B" }}>
                    {item.sub}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={
                    (generalConfig as unknown as Record<string, boolean>)[
                      item.key
                    ]
                  }
                  onChange={(e) =>
                    setGeneralConfig((prev) => ({
                      ...prev,
                      [item.key]: e.target.checked,
                    }))
                  }
                  style={{
                    accentColor: "#0D47A1",
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                  }}
                />
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Maximum Advance Booking Limit (Days)
              </label>
              <input
                type="number"
                value={generalConfig.maxAdvanceBookingDays}
                onChange={(e) =>
                  setGeneralConfig((prev) => ({
                    ...prev,
                    maxAdvanceBookingDays: parseInt(e.target.value) || 0,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Minimum Advance Booking Lead Time (Hours)
              </label>
              <input
                type="number"
                value={generalConfig.minAdvanceBookingHours}
                onChange={(e) =>
                  setGeneralConfig((prev) => ({
                    ...prev,
                    minAdvanceBookingHours: parseInt(e.target.value) || 0,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 02: CONSULTATION SLOT CONFIGURATION */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontFamily: PP,
              fontSize: "15px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Clock size={18} style={{ color: "#009688" }} /> Section 02:
            Consultation Slot & Duration Parameters
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Default Consultation Duration
              </label>
              <select
                value={slotConfig.defaultDuration}
                onChange={(e) =>
                  setSlotConfig((prev) => ({
                    ...prev,
                    defaultDuration: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              >
                <option>10 Minutes</option>
                <option>15 Minutes</option>
                <option>20 Minutes</option>
                <option>30 Minutes</option>
                <option>45 Minutes</option>
                <option>60 Minutes</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Buffer Time Between Patients
              </label>
              <select
                value={slotConfig.bufferTime}
                onChange={(e) =>
                  setSlotConfig((prev) => ({
                    ...prev,
                    bufferTime: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              >
                <option>0 Minutes</option>
                <option>5 Minutes</option>
                <option>10 Minutes</option>
                <option>15 Minutes</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Maximum Patients Allowed Per Slot
              </label>
              <input
                type="number"
                value={slotConfig.maxPatientsPerSlot}
                onChange={(e) =>
                  setSlotConfig((prev) => ({
                    ...prev,
                    maxPatientsPerSlot: parseInt(e.target.value) || 1,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div
            style={{
              background: "#F8FAFC",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}
              >
                Enable Double Booking Override
              </div>
              <div style={{ fontSize: "11px", color: "#64748B" }}>
                Allows senior doctors to accept urgent emergency patients in
                filled slots
              </div>
            </div>
            <input
              type="checkbox"
              checked={slotConfig.enableDoubleBooking}
              onChange={(e) =>
                setSlotConfig((prev) => ({
                  ...prev,
                  enableDoubleBooking: e.target.checked,
                }))
              }
              style={{
                accentColor: "#0D47A1",
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
            />
          </div>
        </div>

        {/* SECTION 03: WORKING HOURS CONFIGURATION TABLE */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontFamily: PP,
              fontSize: "15px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Calendar size={18} style={{ color: "#0D47A1" }} /> Section 03: OPD
            Weekly Working Hours Schedule
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#F8FAFC",
                    borderBottom: "1px solid #E5E7EB",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  <th style={{ padding: "10px 14px" }}>Day of Week</th>
                  <th style={{ padding: "10px 14px" }}>Opening Time</th>
                  <th style={{ padding: "10px 14px" }}>Closing Time</th>
                  <th style={{ padding: "10px 14px" }}>Break Start</th>
                  <th style={{ padding: "10px 14px" }}>Break End</th>
                  <th style={{ padding: "10px 14px" }}>Operating Status</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>
                    Toggle Day
                  </th>
                </tr>
              </thead>
              <tbody>
                {workingHours.map((row, idx) => (
                  <tr
                    key={row.day}
                    style={{
                      borderBottom: "1px solid #F1F5F9",
                      opacity: row.enabled ? 1 : 0.5,
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 14px",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {row.day}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <input
                        type="text"
                        defaultValue={row.open}
                        disabled={!row.enabled}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "12px",
                          width: "90px",
                        }}
                      />
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <input
                        type="text"
                        defaultValue={row.close}
                        disabled={!row.enabled}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "12px",
                          width: "90px",
                        }}
                      />
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <input
                        type="text"
                        defaultValue={row.breakStart}
                        disabled={!row.enabled}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "12px",
                          width: "90px",
                        }}
                      />
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <input
                        type="text"
                        defaultValue={row.breakEnd}
                        disabled={!row.enabled}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "12px",
                          width: "90px",
                        }}
                      />
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: "12px",
                          background: row.enabled ? "#E8F5E9" : "#F1F5F9",
                          color: row.enabled ? "#2E7D32" : "#64748B",
                        }}
                      >
                        {row.enabled ? "Operational" : "Closed / Off"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <input
                        type="checkbox"
                        checked={row.enabled}
                        onChange={() => handleDayToggle(idx)}
                        style={{
                          accentColor: "#0D47A1",
                          cursor: "pointer",
                          width: "16px",
                          height: "16px",
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 04: QUEUE & TOKEN CONFIGURATION */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontFamily: PP,
              fontSize: "15px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sliders size={18} style={{ color: "#009688" }} /> Section 04: Queue
            & OPD Token Sequence Settings
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            {[
              {
                label: "Enable Token System",
                sub: "Generate sequential OPD tokens",
                key: "enableTokenSystem",
              },
              {
                label: "Auto Token Generation",
                sub: "Auto assign upon check-in",
                key: "autoTokenGen",
              },
              {
                label: "Queue Display Enabled",
                sub: "Stream to waiting room TVs",
                key: "queueDisplayEnabled",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "#F8FAFC",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: "10px", color: "#64748B" }}>
                    {item.sub}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={
                    (queueConfig as unknown as Record<string, boolean>)[
                      item.key
                    ]
                  }
                  onChange={(e) =>
                    setQueueConfig((prev) => ({
                      ...prev,
                      [item.key]: e.target.checked,
                    }))
                  }
                  style={{
                    accentColor: "#009688",
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                  }}
                />
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Token Prefix
              </label>
              <input
                type="text"
                value={queueConfig.tokenPrefix}
                onChange={(e) =>
                  setQueueConfig((prev) => ({
                    ...prev,
                    tokenPrefix: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Starting Token No.
              </label>
              <input
                type="number"
                value={queueConfig.startTokenNo}
                onChange={(e) =>
                  setQueueConfig((prev) => ({
                    ...prev,
                    startTokenNo: parseInt(e.target.value) || 101,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Max Daily Queue Cap
              </label>
              <input
                type="number"
                value={queueConfig.maxQueueSize}
                onChange={(e) =>
                  setQueueConfig((prev) => ({
                    ...prev,
                    maxQueueSize: parseInt(e.target.value) || 200,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Daily Queue Reset Time
              </label>
              <input
                type="text"
                value={queueConfig.queueResetTime}
                onChange={(e) =>
                  setQueueConfig((prev) => ({
                    ...prev,
                    queueResetTime: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 05: HOLIDAY & LEAVE CALENDAR */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontFamily: PP,
              fontSize: "15px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Calendar size={18} style={{ color: "#0D47A1" }} /> Section 05:
            Official Holiday & Closure Calendar
          </h3>

          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="Holiday Description (e.g. Founder Day)"
              value={newHolidayName}
              onChange={(e) => setNewHolidayName(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                fontSize: "13px",
              }}
            />
            <input
              type="date"
              value={newHolidayDate}
              onChange={(e) => setNewHolidayDate(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                fontSize: "13px",
              }}
            />
            <button
              onClick={handleAddHoliday}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#0D47A1",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Plus size={14} /> Add Holiday
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
            }}
          >
            {holidays.map((h) => (
              <div
                key={h.id}
                style={{
                  background: "#F8FAFC",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {h.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748B" }}>
                    {h.date} • {h.type}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveHoliday(h.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#EF4444",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 06: APPOINTMENT STATUS CONFIGURATION */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontFamily: PP,
              fontSize: "15px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2 size={18} style={{ color: "#009688" }} /> Section 06:
            Appointment Status Lifecycle Rules
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
            }}
          >
            {statuses.map((st, i) => (
              <div
                key={st.id}
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  padding: "12px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: st.color,
                    }}
                  />
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStatuses((prev) => {
                        const copy = [...prev];
                        copy[i].label = val;
                        return copy;
                      });
                    }}
                    style={{
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#111827",
                      width: "120px",
                    }}
                  />
                </div>
                <input
                  type="checkbox"
                  checked={st.visible}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setStatuses((prev) => {
                      const copy = [...prev];
                      copy[i].visible = checked;
                      return copy;
                    });
                  }}
                  style={{ accentColor: "#009688", cursor: "pointer" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 07: APPOINTMENT ANALYTICS CHARTS */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontFamily: PP,
              fontSize: "16px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BarChart2 size={18} style={{ color: "#0D47A1" }} /> Appointment
            Volume Analytics
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {/* Bar Chart Mock */}
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "12px",
                padding: "16px",
                border: "1px solid #E2E8F0",
              }}
            >
              <h4
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: "0 0 12px 0",
                }}
              >
                Appointments by Day of Week
              </h4>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {[
                  { day: "Monday", count: 142, color: "#0D47A1" },
                  { day: "Tuesday", count: 128, color: "#009688" },
                  { day: "Wednesday", count: 135, color: "#0D47A1" },
                  { day: "Thursday", count: 119, color: "#009688" },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "11px",
                        marginBottom: "2px",
                      }}
                    >
                      <span>{item.day}</span>
                      <span style={{ fontWeight: 600 }}>
                        {item.count} Bookings
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        background: "#E2E8F0",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(item.count / 160) * 100}%`,
                          height: "100%",
                          background: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut Chart Mock */}
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "12px",
                padding: "16px",
                border: "1px solid #E2E8F0",
              }}
            >
              <h4
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: "0 0 12px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <PieChartIcon size={14} style={{ color: "#009688" }} /> Status
                Distribution Breakdown
              </h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  height: "120px",
                }}
              >
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    background:
                      "conic-gradient(#66BB6A 0% 60%, #0D47A1 60% 80%, #F59E0B 80% 92%, #EF4444 92% 100%)",
                  }}
                />
                <div
                  style={{
                    fontSize: "11px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <span style={{ color: "#66BB6A", fontWeight: 600 }}>
                    ■ Completed (60%)
                  </span>
                  <span style={{ color: "#0D47A1", fontWeight: 600 }}>
                    ■ Scheduled (20%)
                  </span>
                  <span style={{ color: "#F59E0B", fontWeight: 600 }}>
                    ■ Waiting (12%)
                  </span>
                  <span style={{ color: "#EF4444", fontWeight: 600 }}>
                    ■ Cancelled (8%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 08: CONFIGURATION PREVIEW DIAGRAM */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontFamily: PP,
              fontSize: "15px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Eye size={18} style={{ color: "#0D47A1" }} /> Section 08:
            Configured Appointment Lifecycle Flow
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#F8FAFC",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {[
              { step: "1. Patient Booking", sub: "Online / Walk-in" },
              { step: "2. Staff Approval", sub: "Auto / Manual" },
              { step: "3. Token Generated", sub: "Prefix OPD-" },
              { step: "4. Check-In Vitals", sub: "Triage Room" },
              { step: "5. Consultation", sub: "15 Mins Slot" },
              { step: "6. Complete / Bill", sub: "Discharge" },
            ].map((st, i) => (
              <div
                key={i}
                style={{ textAlign: "center", flex: 1, minWidth: "110px" }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#0D47A1",
                    background: "#E3F2FD",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    marginBottom: "4px",
                  }}
                >
                  {st.step}
                </div>
                <div style={{ fontSize: "10px", color: "#64748B" }}>
                  {st.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SCHEDULE PREVIEW MODAL */}
      {showPreviewModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "650px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
                borderBottom: "1px solid #E5E7EB",
                paddingBottom: "12px",
              }}
            >
              <h3
                style={{
                  fontFamily: PP,
                  fontSize: "16px",
                  fontWeight: 700,
                  margin: 0,
                  color: "#111827",
                }}
              >
                Operational OPD Slot Preview (15-Min Intervals)
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#64748B",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
                maxHeight: "300px",
                overflowY: "auto",
                padding: "8px",
              }}
            >
              {[
                "08:00 AM",
                "08:15 AM",
                "08:30 AM",
                "08:45 AM",
                "09:00 AM",
                "09:15 AM",
                "09:30 AM",
                "09:45 AM",
                "10:00 AM",
                "10:15 AM",
                "10:30 AM",
                "10:45 AM",
                "11:00 AM",
                "11:15 AM",
                "11:30 AM",
                "11:45 AM",
              ].map((time, idx) => (
                <div
                  key={idx}
                  style={{
                    background: idx % 3 === 0 ? "#E3F2FD" : "#FFFFFF",
                    border: "1px solid #CBD5E1",
                    padding: "8px",
                    borderRadius: "6px",
                    textTransform: "uppercase",
                    textAlign: "center",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: idx % 3 === 0 ? "#0D47A1" : "#475569",
                  }}
                >
                  {time} <br />
                  <span style={{ fontSize: "9px", fontWeight: 400 }}>
                    {idx % 3 === 0 ? "Booked" : "Available"}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <button
                onClick={() => setShowPreviewModal(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#0D47A1",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE TOAST */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "24px",
            background: "#2E7D32",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "13px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 90,
          }}
        >
          <Check size={16} /> {toastMessage}
        </div>
      )}
    </div>
  );
}
