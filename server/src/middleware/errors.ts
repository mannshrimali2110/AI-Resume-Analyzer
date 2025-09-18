import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const code = err.status || 500;
  res.status(code).json({
    success: false,
    code,
    message: err.message || 'Internal Server Error',
    details: err.details || undefined,
  });
}
