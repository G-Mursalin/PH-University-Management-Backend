/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export interface TUser {
    id: string;
    password: string;
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
}
