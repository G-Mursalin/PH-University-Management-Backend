import { TErrorResponse, TErrorSources } from '../interfaces/error';

const handleDuplicateKeyError = (error): TErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorSources = [
    {
      path: Object.keys(error.keyPattern)[0],
      message: `Duplicate field value ${error.message.match(
        /(["'])(?:(?=(\\?))\2.)*?\1/g,
      )}. Please use another value!`,
    },
  ];
  return { statusCode, message: 'Validation error', errorSources };
};

export default handleDuplicateKeyError;
