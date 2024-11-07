import { Logger, LogLevel } from '@nestjs/common';

export function getLoggingLevels(level?: LogLevel): LogLevel[] {
  if (level === undefined)
    level = (process.env['LOGGING_LEVEL']?.toLowerCase() as LogLevel) || 'log';

  const levels: LogLevel[] = [
    'verbose',
    'debug',
    'log',
    'warn',
    'error',
    'fatal',
  ];

  if (!levels.includes(level)) {
    Logger.error(
      `Invalid LOGGING_LEVEL environment variable: "${level}". Defaulting to "log".`
    );
    return levels.slice(levels.indexOf('log'));
  }

  const index = levels.indexOf(level);
  return levels.slice(index);
}
