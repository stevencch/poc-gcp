/* istanbul ignore file */
import { v4 as uuidv4 } from 'uuid';
import { MiddlewareResponse } from '@commercetools/ts-client';

type LoggerMiddlewareOptions = {
  maskSensitiveHeaderData?: boolean;
  includeOriginalRequest?: boolean;
  includeResponseHeaders?: boolean;
  includeRequestInErrorResponse?: boolean;
  loggerFn?: (options: MiddlewareResponse) => void;
};

export const ctLoggerMiddlewareOptions: LoggerMiddlewareOptions = {
  includeOriginalRequest: false,
  loggerFn: (response: MiddlewareResponse) => {
    // Configurable - logs
    
  },
};
