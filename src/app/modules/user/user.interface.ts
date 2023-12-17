/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
    id: string;
    password: string;
    passwordChangedAt: Date;
    needsPasswordChange: boolean;
    isDeleted: boolean;
    status: 'in-progress' | 'blocked';
    role: 'admin' | 'student' | 'faculty';
}

export interface UserModel extends Model<TUser> {
    isUserExistsByCustomId(id: string): Promise<TUser>;
    isPasswordMatched(
        passwordFromReq: string,
        passwordInDB: string,
    ): Promise<boolean>;
    isJWTIssuedBeforePasswordChanged(
        passwordChangedTimeStamp: Date,
        jwtIssuedTimeStamp: number,
    ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
