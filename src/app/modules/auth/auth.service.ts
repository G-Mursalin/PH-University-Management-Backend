import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

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

    return payload;
};

export const authServices = {
    loginUser,
};
