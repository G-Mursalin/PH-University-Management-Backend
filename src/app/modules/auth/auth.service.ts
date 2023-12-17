import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config';

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

    // Assess Granted: Send Access Token, Refresh Token
    const jwtPayload = { userId: user.id, role: user.role };
    const accessToken = jwt.sign(
        jwtPayload,
        config.jwt_access_secret as string,
        {
            expiresIn: '10d',
        },
    );

    return { accessToken, needPasswordChange: user.needsPasswordChange };
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

export const authServices = {
    loginUser,
    changeUserPassword,
};
