/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errorMessage = error.message || 'Something wend wrong';
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: error,
  });
};

export default globalErrorHandler;
