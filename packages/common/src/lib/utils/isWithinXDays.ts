export function isWithinDays(days: number, timestamp: number) {
  const currentTimestamp = Date.now();
  const lookbackMilliseconds = days * 24 * 60 * 60 * 1000;
  const difference = currentTimestamp - timestamp;

  return difference < lookbackMilliseconds;
}
