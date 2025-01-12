import { Params } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import { MiddlewareResponse } from '@commercetools/ts-client';
const healthCheckRoutes = ['/health'];

export const loggerOptions: Params = {
  pinoHttp: {
    level: process.env['NODE_ENV'] !== 'production' ? 'debug' : 'info',
    transport:
      process.env['NODE_ENV'] !== 'production'
        ? { target: 'pino-pretty' }
        : undefined,
    autoLogging: {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      ignore: (req: any) => {
        return healthCheckRoutes.includes(req.url);
      },
    },
    quietReqLogger: true,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    genReqId: (req: any) => {
      const id = uuidv4();
      req.id = id;
      return id;
    },
  },
};

/**
 * Commercetools logger options
 */
export const ctLogger = pino({
  name: 'ct-logger',
  level: 'info',
  transport:
    process.env['NODE_ENV'] !== 'production'
      ? { target: 'pino-pretty' }
      : undefined,
});

type LoggerMiddlewareOptions = {
  maskSensitiveHeaderData?: boolean;
  includeOriginalRequest?: boolean;
  includeResponseHeaders?: boolean;
  includeRequestInErrorResponse?: boolean;
  loggerFn?: (options: MiddlewareResponse) => void;
};


