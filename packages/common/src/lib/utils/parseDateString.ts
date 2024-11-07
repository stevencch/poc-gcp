/**
 * @param {string} dateString - Supports date format DD/MM/YY HH:mm:ss.
 */
export function parseDateString(dateString: string) {
  const [day, month, year, hours, minutes, seconds] = dateString
    .split(/[\s/:]/)
    .map(Number);
  const date = new Date(year + 2000, month - 1, day, hours, minutes, seconds);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: "${dateString}"`);
  }
  return date;
}
