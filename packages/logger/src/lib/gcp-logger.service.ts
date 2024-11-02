import { ConsoleLogger, LogLevel } from '@nestjs/common';

export const gcpLogLevelMap: Record<string, string> = {
  verbose: 'DEFAULT',
  debug: 'DEBUG',
  log: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'EMERGENCY',
};

export class GcpLogger extends ConsoleLogger {
  private getGcpLogLevel(logLevel: LogLevel) {
    return gcpLogLevelMap[logLevel];
  }

  override formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string
  ): string {
    const baseFormattedMessage = super.formatMessage(
      logLevel,
      message,
      pidMessage,
      formattedLogLevel,
      contextMessage,
      timestampDiff
    );

    return `${JSON.stringify({
      severity: this.getGcpLogLevel(logLevel),
      message: baseFormattedMessage,
    })}\n`;
  }
}
