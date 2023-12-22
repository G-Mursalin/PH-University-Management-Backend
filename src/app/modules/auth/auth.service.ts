import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import { createToken, resetPasswordEmailHTMLTemplate } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: TLoginUser) => {
    const { id, password } = payload;

    const user = await User.isUserExistsByCustomId(id);

    // Check if the user exist in database
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
    }

    // Check if the user is already deleted
    if (user.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
    }

    // Check if the user is blocked
    if (user.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
    }

    // Check Password is correct
    if (!(await User.isPasswordMatched(password, user.password))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Invalid password!');
    }

    // Access Granted: Send Access Token, Refresh Token
    const jwtPayload = { userId: user.id, role: user.role };
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expired_in as string,
    );
    // Refresh token
    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expired_in as string,
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needsPasswordChange,
    };
};

const changeUserPassword = async (
    user: JwtPayload,
    payload: { oldPassword: string; newPassword: string },
) => {
    // user = { userId: 'A-0001', role: 'admin', iat: 1702794466, exp: 1703658466 }
    // payload = { oldPassword: '123456', newPassword: '654321' }

    const userData = await User.isUserExistsByCustomId(user.userId);

    // Check if the user exist in database
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
    }

    // Check if the user is already deleted
    if (userData.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
    }

    // Check if the user is blocked
    if (userData.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
    }

    // Check the old Password is correct
    if (
        !(await User.isPasswordMatched(payload.oldPassword, userData.password))
    ) {
        throw new AppError(httpStatus.FORBIDDEN, 'Invalid  password!');
    }

    // Update the password
    const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt),
    );

    await User.findOneAndUpdate(
        {
            id: user.userId,
            role: user.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
    );

    return null;
};

const refreshToken = async (token: string) => {
    // Check if the given token is valid
    const decoded = jwt.verify(
        token,
        config.jwt_refresh_secret as string,
    ) as JwtPayload;

    const { userId, iat } = decoded;

    // Check if the user is exist
    const user = await User.isUserExistsByCustomId(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // Check if the user is already deleted
    if (user?.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!');
    }

    // Check if the user is blocked
    if (user?.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');
    }

    if (
        user.passwordChangedAt &&
        User.isJWTIssuedBeforePasswordChanged(
            user.passwordChangedAt,
            iat as number,
        )
    ) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expired_in as string,
    );

    return {
        accessToken,
    };
};

const forgetPassword = async (id: string) => {
    const user = await User.isUserExistsByCustomId(id);

    // Check if the user exist in database
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
    }

    // Check if the user is already deleted
    if (user.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
    }

    // Check if the user is blocked
    if (user.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
    }

    // Create token
    const jwtPayload = { userId: user.id, role: user.role };
    const passwordResetToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        '10m',
    );

    // Generate reset password URL, HTML Template and send it to user Email
    const resetLink = `${config.reset_password_ui_link}?id=${user.id}&token=${passwordResetToken}`;
    const htmlForResetPasswordEmail = resetPasswordEmailHTMLTemplate(resetLink);
    sendEmail(user.email, htmlForResetPasswordEmail);

    return null;
};

const resetPassword = async (
    payload: { id: string; newPassword: string },
    token: string,
) => {
    const { id, newPassword } = payload;

    const user = await User.isUserExistsByCustomId(id);

    // Check if the user exist in database
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
    }

    // Check if the user is already deleted
    if (user.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
    }

    // Check if the user is blocked
    if (user.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
    }

    // Check if the given token is valid and verified
    const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
    ) as JwtPayload;

    // Check if the decoded token ID a user id is same or not
    if (user.id !== decoded.userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden');
    }

    // Update the password
    const newHashedPassword = await bcrypt.hash(
        newPassword,
        Number(config.bcrypt_salt),
    );

    await User.findOneAndUpdate(
        {
            id: decoded.userId,
            role: decoded.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
    );

    return null;
};

export const authServices = {
    loginUser,
    changeUserPassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
