import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { authServices } from './auth.service';
import sendResponse from '../../utils/sendResponse';
import config from '../../config';
import AppError from '../../errors/AppError';

const loginUser = catchAsync(async (req, res) => {
    const result = await authServices.loginUser(req.body);

    const { refreshToken, accessToken, needPasswordChange } = result;

    // Set refresh token to cookie
    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User is login successfully',
        data: { accessToken, needPasswordChange },
    });
});

const changeUserPassword = catchAsync(async (req, res) => {
    const result = await authServices.changeUserPassword(req.user, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password changed successfully',
        data: result,
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;

    const result = await authServices.refreshToken(refreshToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Access token is retrieved successfully!',
        data: result,
    });
});

const forgetPassword = catchAsync(async (req, res) => {
    const { id } = req.body;
    const result = await authServices.forgetPassword(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password reset link send to our email successfully!',
        data: result,
    });
});

const resetPassword = catchAsync(async (req, res) => {
    const token = req.headers.authorization;

    // Check if the token send from client
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorize!');
    }
    const result = await authServices.resetPassword(req.body, token);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password reset successful!',
        data: result,
    });
});

export const authControllers = {
    loginUser,
    changeUserPassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
