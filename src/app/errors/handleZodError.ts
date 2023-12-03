import { ZodError, ZodIssue } from 'zod';
import { TErrorResponse, TErrorSources } from '../interfaces/error';

const handleZodError = (error: ZodError): TErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorSources = error.issues.map((issue: ZodIssue) => ({
    path: issue?.path.at(-1) || '',
    message: issue.message,
  }));
  return { statusCode, message: 'Validation error', errorSources };
};

export default handleZodError;
