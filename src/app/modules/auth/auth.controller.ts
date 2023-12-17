import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { authServices } from './auth.service';
import sendResponse from '../../utils/sendResponse';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
    const result = await authServices.loginUser(req.body);

    const { refreshToken, accessToken, needPasswordChange } = result;

    // Set refresh token to cookie
    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
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

export const authControllers = { loginUser, changeUserPassword, refreshToken };
