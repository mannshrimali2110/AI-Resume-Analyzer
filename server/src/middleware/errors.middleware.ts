import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Map known error codes to HTTP statuses
  let statusCode = 500;
  if (err && typeof err === 'object') {
    if (err.status && typeof err.status === 'number') statusCode = err.status;
    // custom AI error mapping
    if (err.code === 'AI_ERROR') statusCode = 502;
  }

  // Log the error server-side for diagnostics
  console.error('Unhandled error:', {
    message: err?.message || err,
    code: err?.code,
    status: err?.status,
    details: err?.details,
  });

  res.status(statusCode).json({
    success: false,
    code: statusCode,
    message: err?.message || 'Internal Server Error',
    details: err?.details || undefined,
  });
}
