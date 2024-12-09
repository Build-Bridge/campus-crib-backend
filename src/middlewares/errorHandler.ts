import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  res.status(statusCode).json({
    status: false,
    message: err.message || 'An Error Occured',
  });
};
