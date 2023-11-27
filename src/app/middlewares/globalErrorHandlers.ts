/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errorMessage = 'Something wend wrong';
  const statusCode = 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || errorMessage,
    error: error,
  });
};

export default globalErrorHandler;
