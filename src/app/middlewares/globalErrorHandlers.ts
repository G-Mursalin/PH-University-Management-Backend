/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorSources } from '../interfaces/error';
import config from '../config';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateKeyError from '../errors/handleDuplicateKeyError';
import AppError from '../errors/AppError';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    // Default error values
    let message = error.message || 'Something wend wrong';
    let statusCode = error.statusCode || 500;
    let errorSources: TErrorSources = [
        { path: '', message: 'Something wend wrong' },
    ];

    // Handle Zod Error
    if (error instanceof ZodError) {
        const simplifyError = handleZodError(error);
        message = simplifyError.message;
        statusCode = simplifyError.statusCode;
        errorSources = simplifyError.errorSources;
    }
    //Handle Mongoose validation Error
    else if (error.name === 'ValidationError') {
        const simplifyError = handleValidationError(error);
        message = simplifyError.message;
        statusCode = simplifyError.statusCode;
        errorSources = simplifyError.errorSources;
    }
    // Handle Mongoose CastError
    else if (error.name === 'CastError') {
        const simplifyError = handleCastError(error);
        message = simplifyError.message;
        statusCode = simplifyError.statusCode;
        errorSources = simplifyError.errorSources;
    }
    // Handle Mongoose Duplicate Key Error
    else if (error.code === 11000) {
        const simplifyError = handleDuplicateKeyError(error);
        message = simplifyError.message;
        statusCode = simplifyError.statusCode;
        errorSources = simplifyError.errorSources;
    }
    // Handle throw App Errors
    else if (error instanceof AppError) {
        message = error.message;
        statusCode = error.statusCode;
        errorSources = [{ path: '', message: error.message }];
    }
    // Handle throw Error
    else if (error instanceof Error) {
        message = error.message;
        errorSources = [{ path: '', message: error.message }];
    }

    // Send Error Response
    if (config.NODE_ENV === 'development') {
        res.status(statusCode).json({
            success: false,
            message,
            errorSources,
            // error: error,
            stack: error.stack,
        });
    } else {
        res.status(statusCode).json({
            success: false,
            message,
            errorSources,
        });
    }
};

export default globalErrorHandler;
