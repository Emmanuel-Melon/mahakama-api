import { Request, Response } from 'express';
import { logger } from '@/lib/logger';

export function logRoute(req: Request, res: Response, startTime: number) {
  const { method, originalUrl } = req;
  const duration = Date.now() - startTime;
  const route = originalUrl.split('?')[0];
  
  let logMessage = `${method} ${route}`;
  let logLevel: 'info' | 'warn' | 'error' = 'info';
  let status = 'completed';

  if (res.statusCode >= 500) {
    logLevel = 'error';
    status = 'server error';
  } else if (res.statusCode >= 400) {
    logLevel = 'warn';
    status = 'client error';
  } else if (duration > 1000) {
    logLevel = 'warn';
    status = 'slow request';
  }

  const logData = {
    reqId: req.requestId,
    method,
    url: originalUrl,
    status: res.statusCode,
    duration: `${duration}ms`,
    statusType: status,
  };
  logger[logLevel](logData, `${logMessage} ${status}`);
}
