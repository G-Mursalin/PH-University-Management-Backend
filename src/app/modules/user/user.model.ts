import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
    {
        id: {
            type: String,
            required: [true, 'Student ID is required'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: 0,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        passwordChangedAt: { type: Date },
        needsPasswordChange: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        status: {
            type: String,
            enum: { values: ['in-progress', 'blocked'] },
            default: 'in-progress',
        },
        role: {
            type: String,
            enum: { values: ['superAdmin', 'admin', 'student', 'faculty'] },
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    },
);

// Hash password while saving to database
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt),
    );
    next();
});

//  Set password "" while get user
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});

// Check if the user exist in database
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
    return await User.findOne({ id }).select('+password');
};

//  Check Password is correct
userSchema.statics.isPasswordMatched = async function (
    passwordFromReq: string,
    passwordInDB: string,
) {
    return await bcrypt.compare(passwordFromReq, passwordInDB);
};

// Check if JWT Token issued before before password changed
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
    passwordChangedTimeStamp: Date,
    jwtIssuedTimeStamp: number,
) {
    const passwordChangedTime =
        new Date(passwordChangedTimeStamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimeStamp;
};

// Create Model
export const User = model<TUser, UserModel>('User', userSchema);
