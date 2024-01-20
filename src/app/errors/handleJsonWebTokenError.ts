/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorResponse, TErrorSources } from '../interfaces/error';

const handleJsonWebTokenError = (error: any): TErrorResponse => {
    const errorSources: TErrorSources = [
        {
            path: '',
            message: error.message,
        },
    ];
    return {
        statusCode: 401,
        message: 'Invalid Token. Please login again',
        errorSources,
    };
};

export default handleJsonWebTokenError;
