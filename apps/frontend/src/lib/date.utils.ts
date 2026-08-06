/**
 * Formats a Date object or ISO string into a local 'YYYY-MM-DDTHH:mm' string for <input type="datetime-local">
 */
export function formatToDatetimeLocal(dateInput?: string | Date | null): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const pad = (num: number) => num.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Converts a 'YYYY-MM-DDTHH:mm' string from <input type="datetime-local"> to an ISO string reflecting the exact local date & time selected
 */
export function datetimeLocalToIso(datetimeLocalStr?: string | null): string | null {
  if (!datetimeLocalStr) return null;
  const [datePart, timePart] = datetimeLocalStr.split("T");
  if (!datePart || !timePart) return null;

  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  if (!year || !month || !day) return null;

  const localDate = new Date(year, month - 1, day, hours || 0, minutes || 0);
  return isNaN(localDate.getTime()) ? null : localDate.toISOString();
}
