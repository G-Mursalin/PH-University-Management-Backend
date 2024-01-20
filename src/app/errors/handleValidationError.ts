import mongoose from 'mongoose';
import { TErrorResponse, TErrorSources } from '../interfaces/error';

const handleValidationError = (
    error: mongoose.Error.ValidationError,
): TErrorResponse => {
    // Get all cast errors
    const castErrors = Object.values(error.errors).filter(
        (val) => val.name === 'CastError',
    );

    // Get all validation errors
    const validatorError = Object.values(error.errors).filter(
        (val) => val.name === 'ValidatorError',
    );

    // Create cast error source
    const castErrorsSources: TErrorSources = castErrors.map((val) => {
        return {
            path: val.path,
            message: val.path,
        };
    });

    // Create validation error sources
    const validatorErrorSource: TErrorSources = validatorError.map((val) => {
        return {
            path: val.path,
            message: val.message,
        };
    });

    return {
        statusCode: 400,
        message: 'Validation error',
        errorSources: [...castErrorsSources, ...validatorErrorSource],
    };
};

export default handleValidationError;
