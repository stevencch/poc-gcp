export function maxDate(dates: (Date | null | undefined)[]): Date {
  const validDates = dates.filter(
    (date): date is Date => date !== null && date !== undefined
  );

  return new Date(Math.max(...validDates.map((date) => date.getTime())));
}
