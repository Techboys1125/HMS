export function formatTime(time?: string | null): string {
  if (!time) return "";
  const trimmed = String(time).trim();
  if (!trimmed) return "";

  if (/AM|PM/i.test(trimmed)) return trimmed;

  const timeMatch = trimmed.match(/(\d{1,2}:\d{2})(?!.*\d)/);
  if (!timeMatch) return trimmed;

  const timePart = timeMatch[1];
  const parts = timePart.split(":");
  if (parts.length < 2) return trimmed;

  let hour = parseInt(parts[0], 10);
  const minute = parts[1];
  if (isNaN(hour)) return trimmed;

  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  const converted = `${String(hour).padStart(2, "0")}:${minute} ${suffix}`;

  return trimmed.replace(timePart, converted);
}

export function to24Hour(time?: string | null): string {
  if (!time) return "";
  let trimmed = String(time).trim();
  if (!trimmed) return "";
  if (!/AM|PM/i.test(trimmed)) {
    if (/^\d{1}:\d{2}$/.test(trimmed)) {
      return "0" + trimmed;
    }
    return trimmed;
  }
  const match = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return trimmed;
  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const suffix = match[3].toUpperCase();
  if (suffix === "AM" && hour === 12) hour = 0;
  if (suffix === "PM" && hour !== 12) hour += 12;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

export function getTodayDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeDateString(dateStr?: string | null): string {
  if (!dateStr) return "";
  const trimmed = String(dateStr).trim();
  if (!trimmed) return "";
  return trimmed.split("T")[0].split(" ")[0];
}

