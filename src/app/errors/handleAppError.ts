import { TErrorResponse } from '../interfaces/error';
import AppError from './AppError';

const handleAppError = (error: AppError): TErrorResponse => {
    return {
        statusCode: error.statusCode,
        message: error.message,
        errorSources: [{ path: '', message: error.message }],
    };
};

export default handleAppError;
