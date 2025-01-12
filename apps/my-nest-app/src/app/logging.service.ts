import { Injectable, Scope } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService {
  constructor(
    @InjectPinoLogger('DefaultContext') private readonly logger: PinoLogger
  ) {}
  setContext(context: string): void {
    this.logger.setContext(context);
  }

  verbose(
    message: string,
    details?: string | Record<string, any>,
    context?: string
  ): void {
    this.logMessage('trace', message, details, context);
  }

  debug(
    message: string,
    details?: string | Record<string, any>,
    context?: string
  ): void {
    this.logMessage('debug', message, details, context);
  }

  log(
    message: string,
    details?: string | Record<string, any>,
    context?: string
  ): void {
    this.logMessage('info', message, details, context);
  }

  warn(
    message: string,
    details?: string | Record<string, any>,
    context?: string
  ): void {
    this.logMessage('warn', message, details, context);
  }

  error(
    message: string,
    details?: string | Record<string, any>,
    context?: string
  ): void {
    this.logMessage('error', message, details, context);
  }

  private logMessage(
    level: 'trace' | 'debug' | 'info' | 'warn' | 'error',
    message: string,
    details?: string | Record<string, any>,
    context?: string
  ): void {
    const formattedDetails =
      typeof details === 'object' ? JSON.stringify(details) : details;

    if (context) {
      this.logger.setContext(context);
    }

    this.logger[level]({ details: formattedDetails }, message);
  }
}
