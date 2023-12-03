import mongoose from 'mongoose';
import { TErrorResponse, TErrorSources } from '../interfaces/error';

const handleCastError = (error: mongoose.Error.CastError): TErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorSources = [
    { path: error.path, message: `Invalid ${error.path}: ${error.value}` },
  ];
  return { statusCode, message: 'Invalid ID', errorSources };
};

export default handleCastError;
