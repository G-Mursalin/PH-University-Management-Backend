import mongoose from 'mongoose';
import { TErrorResponse, TErrorSources } from '../interfaces/error';

const handleValidationError = (
  error: mongoose.Error.ValidationError,
): TErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorSources = Object.values(error.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val.path,
        message: val.message,
      };
    },
  );
  return { statusCode, message: 'Validation error', errorSources };
};

export default handleValidationError;
