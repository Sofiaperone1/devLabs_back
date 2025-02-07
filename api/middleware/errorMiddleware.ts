// Actualización del errorMiddleware.ts
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { UnauthorizedError } from 'express-oauth2-jwt-bearer';

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error = new Error(`La ruta ${req.originalUrl} no existe`);
  res.status(404);
  next(error);
}

export const globalErrorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = 
    err.name === 'UnauthorizedError' ? 401 :
    err.name === 'ValidationError' ? 400 :
    res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: 
      err.name === 'UnauthorizedError' ? 'Requires authorization' :
      err.name === 'ValidationError' ? 'Validation Error' :
      process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    // @ts-ignore
    ...(err.name === 'ValidationError' && { errors: err.errors }),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};