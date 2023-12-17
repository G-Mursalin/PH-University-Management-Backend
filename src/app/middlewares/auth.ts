import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers.authorization;

            // Check if the token send from client
            if (!token) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorize!',
                );
            }

            // Check if the token is verified
            const decoded = jwt.verify(
                token,
                config.jwt_access_secret as string,
            ) as JwtPayload;

            const { role, userId, iat } = decoded;

            const user = await User.isUserExistsByCustomId(userId);

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

            // Check if the password changed recently and token is older then token is invalid
            if (
                user.passwordChangedAt &&
                User.isJWTIssuedBeforePasswordChanged(
                    user.passwordChangedAt,
                    iat as number,
                )
            ) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorize!',
                );
            }
            if (requiredRoles && !requiredRoles.includes(role)) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorize!',
                );
            }
            req.user = decoded as JwtPayload;
            next();
        },
    );
};

export default auth;
