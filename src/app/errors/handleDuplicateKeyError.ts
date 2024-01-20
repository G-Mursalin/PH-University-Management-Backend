/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorResponse, TErrorSources } from '../interfaces/error';

const handleDuplicateKeyError = (error: any): TErrorResponse => {
    const errorSources: TErrorSources = [
        {
            path: Object.keys(error.keyPattern)[0],
            message: `Duplicate field value ${error.message.match(
                /(["'])(?:(?=(\\?))\2.)*?\1/g,
            )}. Please use another value!`,
        },
    ];
    return { statusCode: 400, message: 'Validation error', errorSources };
};

export default handleDuplicateKeyError;
