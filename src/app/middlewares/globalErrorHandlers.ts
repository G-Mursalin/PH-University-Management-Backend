/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import errorPreprocessor from '../errors/errorPreprocessor';
import config from '../config';
import { TErrorResponse } from '../interfaces/error';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    // Default Error response object
    let errorResponse: TErrorResponse = {
        statusCode: error.statusCode || 500,
        message: error.message || 'Something went wrong',
        errorSources: [{ path: '', message: 'Something wend wrong' }],
    };

    // Handle al kinds of error
    errorResponse = errorPreprocessor(error);

    // Send Error Response
    res.status(errorResponse.statusCode).json({
        success: false,
        message: errorResponse.message,
        errorSources: errorResponse.errorSources,
        // error: error,
        stack: config.NODE_ENV === 'development' ? error.stack : undefined,
    });
};

export default globalErrorHandler;
