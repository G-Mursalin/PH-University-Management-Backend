/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorResponse, TErrorSources } from '../interfaces/error';

const handleJWTExpiredError = (error: any): TErrorResponse => {
    const errorSources: TErrorSources = [
        {
            path: '',
            message: error.message,
        },
    ];
    return {
        statusCode: 401,
        message: 'Your token is expired. Please login again',
        errorSources,
    };
};

export default handleJWTExpiredError;
